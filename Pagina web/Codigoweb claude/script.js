// script.js

// Product data
const products = [
    {
        id: 1,
        name: "Windows 10 Home License",
        description: "Perfect for home users with all essential features for everyday computing needs.",
        price: 139.99,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230078d7'/%3E%3Cpath d='M20 20 L45 25 L45 45 L20 45 Z M50 25 L80 30 L80 45 L50 45 Z M20 50 L45 50 L45 70 L20 75 Z M50 50 L80 50 L80 65 L50 70 Z' fill='white'/%3E%3C/svg%3E"
    },
    {
        id: 2,
        name: "Windows 10 Pro License",
        description: "For professionals needing advanced features like BitLocker, Remote Desktop, and business management tools.",
        price: 199.99,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23005a9e'/%3E%3Cpath d='M20 20 L45 25 L45 45 L20 45 Z M50 25 L80 30 L80 45 L50 45 Z M20 50 L45 50 L45 70 L20 75 Z M50 50 L80 50 L80 65 L50 70 Z' fill='white'/%3E%3C/svg%3E"
    },
    {
        id: 3,
        name: "Windows 11 Home License",
        description: "The latest Windows experience with a fresh design and enhanced productivity features for home users.",
        price: 169.99,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230078d7'/%3E%3Cpath d='M20 20 L45 25 L45 45 L20 45 Z M50 25 L80 30 L80 45 L50 45 Z M20 50 L45 50 L45 70 L20 75 Z M50 50 L80 50 L80 65 L50 70 Z' fill='white'/%3E%3C/svg%3E"
    },
    {
        id: 4,
        name: "Windows 11 Pro License",
        description: "Premium Windows 11 experience with advanced security, management, and productivity features for professionals.",
        price: 249.99,
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23005a9e'/%3E%3Cpath d='M20 20 L45 25 L45 45 L20 45 Z M50 25 L80 30 L80 45 L50 45 Z M20 50 L45 50 L45 70 L20 75 Z M50 50 L80 50 L80 65 L50 70 Z' fill='white'/%3E%3C/svg%3E"
    }
];

// DOM elements
const productsContainer = document.getElementById('productsContainer');
const cartModal = document.getElementById('cartModal');
const cartButton = document.getElementById('cartButton');
const closeModal = document.getElementById('closeModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');
const toast = document.getElementById('toast');

// Shopping cart array
let cart = [];

// Display products
function displayProducts() {
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });

    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add product to cart
function addToCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Update cart count and show toast notification
    updateCartCount();
    showToast('Item added to cart!');

    // If modal is open, update cart display
    if (window.getComputedStyle(cartModal).display === 'block') {
        displayCart();
    }
}

// Remove item from cart
function removeFromCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);

    updateCartCount();
    displayCart();
}

// Update cart item count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Display cart items in modal
function displayCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-thumbnail">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                </div>
            </div>
            <div class="cart-item-actions">
                <span>$${itemTotal.toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event listeners
cartButton.addEventListener('click', () => {
    displayCart();
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Add items to your cart first');
        return;
    }

    alert('This is a demo website. In a real e-commerce site, you would be redirected to a secure checkout page.');
    cart = [];
    updateCartCount();
    cartModal.style.display = 'none';
});

// Initialize the page
displayProducts();