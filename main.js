let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Add to cart
function addToCart(productCard) {
    const name = productCard.querySelector(".product-title").textContent;
    const priceText = productCard.querySelector(".product-price").textContent;
    const price = parseFloat(priceText.replace("$", ""));
    const imgSrc = productCard.querySelector("img").src;

    const existingItem = cartItems.find((item) => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name,
            price,
            quantity: 1,
            image: imgSrc,
        });
    }
    updateLocalStorage();
    displayCartItems();
    UpdateCartCount();
    showToast(`✅ ${name} added to cart`);
}

// Display cart on cart.html
function displayCartItems() {
    const cartContainer = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let total = 0;

    cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cat-title-price">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button onclick="changeQuantity('${item.name}', -1)">
                        <i class="ri-subtract-line"></i>
                    </button>
                    <input type="text" class="cart-item-quantity" value="${item.quantity}" min="1" readonly />
                    <button onclick="changeQuantity('${item.name}', 1)">
                        <i class="ri-add-line"></i>
                    </button>
                </div>
                <div class="remove-from-cart" onclick="removeItem('${item.name}')">
                    <i class="ri-delete-bin-line"></i>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    if (totalElement) {
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}

function changeQuantity(name, delta) {
    const item = cartItems.find((item) => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeItem(name);
        } else {
            updateLocalStorage();
            UpdateCartCount();
            displayCartItems();
        }
    }
}

// Update cart count icon
function UpdateCartCount() {
    const countElement = document.getElementById("cart-count");
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    if (countElement) {
        countElement.textContent = itemCount;
    }
}

function removeItem(name) {
    cartItems = cartItems.filter((item) => item.name !== name);
    updateLocalStorage();
    displayCartItems();
    UpdateCartCount();
    showToast(`🗑️ ${name} removed from cart`);
}

// Save cart in local storage
function updateLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Create toast container
function createToastContainer() {
    if (document.querySelector(".toast-container")) return;

    const toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
}

// Show toast
function showToast(message) {
    const container = document.querySelector(".toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Load cart on page load
window.onload = function () {
    UpdateCartCount();
    if (document.getElementById("cartItems")) {
        displayCartItems();
    }
    createToastContainer();
};
