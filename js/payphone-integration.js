// Payphone Integration
document.addEventListener('DOMContentLoaded', function() {
    const paymentModal = document.getElementById('paymentModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const paymentForm = document.getElementById('paymentForm');
    const btnNext = document.querySelector('.btn-next');
    const btnPrev = document.querySelector('.btn-prev');
    const btnPay = document.querySelector('.btn-pay');
    const btnFinish = document.querySelector('.btn-finish');
    const paymentMethods = document.querySelectorAll('.method');
    const steps = document.querySelectorAll('.step');
    
    // Modal Controls
    closeModalBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });
    
    // Payment Steps Navigation
    btnNext.addEventListener('click', () => {
        // Validate step 1 before proceeding
        if (!validateStep1()) return;
        
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        updateSteps(2);
    });
    
    btnPrev.addEventListener('click', () => {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step1').style.display = 'block';
        updateSteps(1);
    });
    
    btnFinish.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        // Here you would typically redirect to order confirmation page
    });
    
    function updateSteps(activeStep) {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 <= activeStep) {
                step.classList.add('active');
            }
        });
    }
    
    function validateStep1() {
        const name = document.getElementById('customerName').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name) {
            alert('Por favor ingresa tu nombre completo');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un correo electrónico válido');
            return false;
        }
        
        if (phone.length < 9) {
            alert('Por favor ingresa un número de teléfono válido');
            return false;
        }
        
        return true;
    }
    
    // Payment Method Selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
        });
    });
    
    // Pay with Payphone
    btnPay.addEventListener('click', () => {
        const selectedMethod = document.querySelector('.method.selected').getAttribute('data-method');
        
        if (selectedMethod === 'payphone') {
            processPayphonePayment();
        } else {
            // Handle other payment methods
            alert('Método de pago no implementado');
        }
    });
    
    function processPayphonePayment() {
        // Get customer data
        const name = document.getElementById('customerName').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const phoneCode = document.getElementById('phoneCode').value;
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        
        // Calculate total
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Configure Payphone
        const payphoneConfig = {
            commerceToken: 'TU_COMMERCE_TOKEN', // Reemplaza con tu token real
            publicKey: 'TU_PUBLIC_KEY', // Reemplaza con tu llave pública
            env: 'sandbox' // Cambiar a 'prod' en producción
        };
        
        const payment = {
            amount: total,
            currency: 'PEN',
            reference: `PEDIDO_${Date.now()}`,
            clientTransactionId: `CT_${Date.now()}`,
            userPhone: `${phoneCode}${phone}`,
            userEmail: email,
            userName: name,
            callbackUrl: window.location.href, // URL de retorno después del pago
            onSuccess: function(response) {
                // Mostrar paso 3 con los detalles
                document.getElementById('step2').style.display = 'none';
                document.getElementById('step3').style.display = 'block';
                updateSteps(3);
                
                document.getElementById('transactionId').textContent = response.transactionId;
                document.getElementById('transactionAmount').textContent = `S/ ${total.toFixed(2)}`;
                document.getElementById('transactionDate').textContent = new Date().toLocaleString();
                
                // Aquí puedes enviar los datos a tu backend para registrar la venta
                // saveOrderToDatabase(response.transactionId);
            },
            onError: function(error) {
                alert(`Error en el pago: ${error.message}`);
                console.error('Payphone Error:', error);
            },
            onCancel: function() {
                alert('Pago cancelado por el usuario');
            }
        };
        
        // Initialize Payphone payment
        Payphone.Payment(payphoneConfig, payment);
    }
    
    // Helper function to save order (would call your backend)
    function saveOrderToDatabase(transactionId) {
        const order = {
            transactionId,
            customer: {
                name: document.getElementById('customerName').value.trim(),
                email: document.getElementById('customerEmail').value.trim(),
                phone: document.getElementById('customerPhone').value.trim(),
                address: document.getElementById('customerAddress').value.trim()
            },
            items: JSON.parse(localStorage.getItem('cart') || '[]'),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString()
        };
        
        // Aquí harías una llamada a tu API para guardar el pedido
        console.log('Order to save:', order);
        // fetch('/api/orders', { method: 'POST', body: JSON.stringify(order) })
        // .then(response => response.json())
        // .then(data => console.log('Order saved:', data));
    }
});