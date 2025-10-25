// Fichier : scripts/boutique.js (Version évolutive avec chargement JSON)

document.addEventListener('DOMContentLoaded', () => {
    let products = []; // La liste sera remplie depuis le fichier JSON
    let cart = JSON.parse(localStorage.getItem('sap_cart')) || [];

    // --- SÉLECTION DES ÉLÉMENTS DU DOM ---
    const productsGrid = document.getElementById('products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const detailModal = document.getElementById('product-modal');
    const orderModal = document.getElementById('order-modal');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const orderForm = document.getElementById('order-form');
    const orderSuccessDiv = document.getElementById('order-success');

    // --- FONCTION DE CHARGEMENT DES PRODUITS ---
    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            products = await response.json();
            // Une fois les produits chargés, on affiche tout
            renderProducts();
            updateCart();
        } catch (error) {
            console.error("Impossible de charger les produits:", error);
            if(productsGrid) productsGrid.innerHTML = "<p class='text-center w-100'>Erreur lors du chargement des produits. Veuillez réessayer plus tard.</p>";
        }
    }

    // --- FONCTIONS PRINCIPALES ---
    // ... (Collez ici TOUTES les fonctions de 'renderProducts' à 'showNotification' de la réponse précédente, elles n'ont pas changé) ...

    function renderProducts(filter = 'all') {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        const filteredProducts = products.filter(p => filter === 'all' || p.category === filter);
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="text-center w-100">Aucun produit dans cette catégorie.</p>';
            return;
        }
        filteredProducts.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='images/placeholder.jpg'"></div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3><p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <div>
                            ${product.originalPrice ? `<span class="original-price">${product.originalPrice.toLocaleString('fr-FR')} FCFA</span>` : ''}
                            <span class="price">${typeof product.price === 'number' ? `${product.price.toLocaleString('fr-FR')} FCFA` : product.price}<small>${product.unit || ''}</small></span>
                        </div>
                        <div class="product-actions">
                            ${typeof product.price === 'number' ? `<button class="product-btn btn-cart" data-id="${product.id}" aria-label="Ajouter ${product.name} au panier"><i class="fas fa-shopping-cart"></i></button>` : ''}
                            <button class="product-btn btn-view" data-id="${product.id}" aria-label="Voir les détails de ${product.name}"><i class="fas fa-eye"></i></button>
                        </div>
                    </div>
                </div>`;
            productsGrid.appendChild(card);
        });
    }
    
    function openDetailModal(productId) {
        const product = products.find(p => p.id == productId);
        if (!product || !detailModal) return;
        const modalBody = document.getElementById('modal-body-content');
        modalBody.innerHTML = `
            <div class="modal-image"><img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'"></div>
            <div class="modal-details">
                <h2 class="modal-title">${product.name}</h2>
                <div class="modal-price">${typeof product.price === 'number' ? `${product.price.toLocaleString('fr-FR')} FCFA <small>${product.unit || ''}</small>` : product.price}</div>
                <p>${product.description}</p>
                <div class="modal-specs">${Object.entries(product.details).map(([key, value]) => `<div class="spec-item"><span>${key}</span><strong>${value}</strong></div>`).join('')}</div>
                ${typeof product.price === 'number' ? `<button class="btn btn-primary btn-cart-modal" data-id="${product.id}">Ajouter au panier</button>` : `<a href="contact.html" class="btn btn-primary">Demander un devis</a>`}
            </div>`;
        detailModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function addToCart(productId) {
        const product = products.find(p => p.id == productId);
        if (!product || typeof product.price !== 'number') return;
        const existingItem = cart.find(item => item.id == productId);
        if (existingItem) { 
            existingItem.quantity++; 
        } else { 
            cart.push({ id: Number(productId), quantity: 1 }); 
        }
        showNotification(`${product.name} a été ajouté au panier !`, "success");
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('sap_cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCounter();
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id != productId);
        showNotification("Produit retiré du panier.", "info");
        updateCart();
    }

    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalPriceEl = document.getElementById('cart-total-price');
        const processOrderBtn = document.getElementById('process-order-btn');
        if (!cartItemsContainer || !cartTotalPriceEl) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Votre panier est vide.</p>';
            cartTotalPriceEl.textContent = '0 FCFA';
            if(processOrderBtn) processOrderBtn.disabled = true;
            return;
        }
        
        let total = 0;
        cartItemsContainer.innerHTML = cart.map(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            if (!product) return '';
            total += product.price * cartItem.quantity;
            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="cart-item-info"><h4>${product.name}</h4><p>${cartItem.quantity} x ${product.price.toLocaleString('fr-FR')} FCFA</p></div>
                    <button class="cart-item-remove" data-id="${cartItem.id}" aria-label="Supprimer ${product.name}">&times;</button>
                </div>`;
        }).join('');
        cartTotalPriceEl.textContent = `${total.toLocaleString('fr-FR')} FCFA`;
        if(processOrderBtn) processOrderBtn.disabled = false;
    }

    // MISE À JOUR ICI POUR L'ANIMATION
    function updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        if (!counter) return;
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            counter.textContent = totalItems;
            counter.style.display = 'flex';
            
            // Animation
            counter.classList.add('updated');
            setTimeout(() => counter.classList.remove('updated'), 200);
            
        } else {
            counter.style.display = 'none';
        }
    }

    function openCart() { 
        if(!cartSidebar || !cartOverlay) return;
        cartSidebar.classList.add('active'); 
        cartOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }
    
    function closeCart() { 
        if(!cartSidebar || !cartOverlay) return;
        cartSidebar.classList.remove('active'); 
        cartOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    function closeModal() {
        if (detailModal) detailModal.classList.remove('active');
        if (orderModal) {
            orderModal.classList.remove('active');
            setTimeout(() => {
                if (orderForm) orderForm.style.display = 'block';
                if (orderSuccessDiv) orderSuccessDiv.style.display = 'none';
                if (orderForm) orderForm.reset();
            }, 300);
        }
        document.body.classList.remove('no-scroll');
    }

    function processOrder() {
        if (cart.length === 0) {
            showNotification("Votre panier est vide !", "error");
            return;
        }
        
        const orderSummaryContainer = document.getElementById('order-summary');
        const commandeDetailsInput = document.getElementById('commande_details');
        const commandeTotalInput = document.getElementById('commande_total');
        if(!orderSummaryContainer || !commandeDetailsInput || !commandeTotalInput) return;

        const totalPrice = cart.reduce((total, cartItem) => {
            const product = products.find(p => p.id == cartItem.id);
            return total + (product.price * cartItem.quantity);
        }, 0);

        let summaryHTML = '';
        let detailsText = '';

        cart.forEach(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            const itemTotal = product.price * cartItem.quantity;
            summaryHTML += `<div class="order-summary-item"><span>${cartItem.quantity}x ${product.name}</span><span>${itemTotal.toLocaleString('fr-FR')} FCFA</span></div>`;
            detailsText += `${cartItem.quantity}x ${product.name} = ${itemTotal.toLocaleString('fr-FR')} FCFA\n`;
        });

        summaryHTML += `<div class="order-summary-total">Total : ${totalPrice.toLocaleString('fr-FR')} FCFA</div>`;
        
        orderSummaryContainer.innerHTML = summaryHTML;
        commandeDetailsInput.value = detailsText;
        commandeTotalInput.value = `${totalPrice.toLocaleString('fr-FR')} FCFA`;
        
        closeCart();
        orderModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function handleOrderSuccess() {
        if(!orderForm || !orderSuccessDiv) return;
        orderForm.style.display = 'none';
        orderSuccessDiv.style.display = 'block';
        cart = [];
        updateCart();
        showNotification("Demande de commande envoyée avec succès !", "success");
    }

    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---
    // ... (Le bloc des écouteurs est identique à la réponse précédente, vous pouvez le copier/coller ici) ...
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderProducts(button.dataset.filter);
            });
        });
    }
    productsGrid?.addEventListener('click', e => {
        const viewBtn = e.target.closest('.btn-view');
        const cartBtn = e.target.closest('.btn-cart');
        if (viewBtn) openDetailModal(viewBtn.dataset.id);
        if (cartBtn) addToCart(cartBtn.dataset.id);
    });
    detailModal?.addEventListener('click', e => {
        if (e.target.matches('.close-modal') || e.target.matches('.product-modal')) closeModal();
        const cartModalBtn = e.target.closest('.btn-cart-modal');
        if (cartModalBtn) {
            addToCart(cartModalBtn.dataset.id);
            closeModal();
        }
    });
    document.getElementById('cart-icon')?.addEventListener('click', e => {
        e.preventDefault();
        openCart();
    });
    document.getElementById('close-cart-btn')?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);
    document.getElementById('cart-items-container')?.addEventListener('click', e => {
        const removeBtn = e.target.closest('.cart-item-remove');
        if (removeBtn) {
            removeFromCart(removeBtn.dataset.id);
        }
    });
    document.getElementById('process-order-btn')?.addEventListener('click', processOrder);
    document.getElementById('close-order-modal')?.addEventListener('click', closeModal);
    orderForm?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-order-btn');
        if(!submitBtn) return;
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        const formData = new FormData(this);
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                handleOrderSuccess();
            } else {
                showNotification("Erreur lors de l'envoi du formulaire.", "error");
            }
        } catch (error) {
            showNotification("Une erreur réseau est survenue.", "error");
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // --- INITIALISATION ---
    loadProducts();
});