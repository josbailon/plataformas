// Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cart = [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const totalAmount = document.querySelector('.total-amount');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartIcon = document.querySelector('.cart-icon');
    const closeCartBtn = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Toggle Cart Sidebar
    cartIcon.addEventListener('click', () => {
        cartSidebar.style.transform = 'translateX(0)';
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.style.transform = 'translateX(100%)';
    });
    
    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productName = this.closest('.product-info').querySelector('h3').textContent;
            const productImage = this.closest('.product-card').querySelector('img').src;
            
            addToCart(productId, productName, productPrice, productImage);
            updateCartUI();
            cartSidebar.style.transform = 'translateX(0)';
        });
    });
    
    function addToCart(id, name, price, image) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
    }
    
    function updateCartUI() {
        // Update cart items
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">S/ ${item.price.toFixed(2)}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update totals
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        subtotalAmount.textContent = `S/ ${subtotal.toFixed(2)}`;
        totalAmount.textContent = `S/ ${subtotal.toFixed(2)}`;
        
        // Add event listeners to new buttons
        addCartItemEventListeners();
    }
    
    function addCartItemEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const item = cart.find(item => item.id === productId);
                
                if (this.classList.contains('plus')) {
                    item.quantity += 1;
                } else if (this.classList.contains('minus') && item.quantity > 1) {
                    item.quantity -= 1;
                }
                
                updateCartUI();
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const itemIndex = cart.findIndex(item => item.id === productId);
                
                if (itemIndex !== -1) {
                    cart.splice(itemIndex, 1);
                    updateCartUI();
                }
            });
        });
    }
    
    // Checkout Button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        openPaymentModal();
    });
    
    function openPaymentModal() {
        const paymentModal = document.getElementById('paymentModal');
        paymentModal.style.display = 'block';
        
        // Populate order summary
        const summaryItems = document.querySelector('.summary-items');
        summaryItems.innerHTML = '';
        
        cart.forEach(item => {
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>S/ ${(item.price * item.quantity).toFixed(2)}</span>
            `;
            summaryItems.appendChild(summaryItem);
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelector('.final-amount').textContent = `S/ ${total.toFixed(2)}`;
    }
});