// Fichier : scripts/boutique.js (Version simplifiée et corrigée)

document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: "Alevins de Tilapia", category: "poissons", price: 350, originalPrice: 500, image: "images/ALEVIN.jpg", description: "Alevins de tilapia robustes.", details: { Taille: "2-3 cm", Âge: "21 jours" } },
        { id: 2, name: "Jeunes Silures", category: "poissons", price: 450, image: "images/silure.jpg", description: "Jeunes silures de qualité supérieure.", details: { Taille: "5-7 cm", Âge: "30 jours" } },
        { id: 3, name: "Tilapia Rouge", category: "poissons", price: 2500, unit: "/kg", image: "images/tilapia-rouge2.webp", description: "Tilapia rouge de première qualité.", details: { Poids: "400-600 g" } },
        { id: 4, name: "Filets de Poisson", category: "transformes", price: 3500, unit: "/kg", image: "images/produits-transformes.jpg", description: "Filets de poisson frais, sans arêtes.", details: { Conservation: "Congelé" } },
        { id: 5, name: "Conseil en Aquaculture", category: "services", price: "Sur devis", image: "images/poisson-iuy.jpg", description: "Services experts pour optimiser votre production.", details: { Expertise: "Pisciculture" } },
        { id: 6, name: "Formation Aquacole", category: "services", price: 75000, image: "images/ALEVIN.jpg", description: "Programmes de formation complets.", details: { Durée: "5 jours" } }
    ];
    let cart = JSON.parse(localStorage.getItem('sap_cart')) || [];

    const productsGrid = document.getElementById('products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const detailModal = document.getElementById('product-modal');
    const orderModal = document.getElementById('order-modal');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const orderForm = document.getElementById('order-form');
    const orderSuccessDiv = document.getElementById('order-success');
    
    // --- Fonctions de base (affichage, panier, etc.) ---

    function renderProducts(filter = 'all') {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        const filteredProducts = products.filter(p => filter === 'all' || p.category === filter);
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="text-center">Aucun produit dans cette catégorie.</p>';
            return;
        }
        
        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <div>
                            ${product.originalPrice ? `<span class="original-price">${product.originalPrice.toLocaleString('fr-FR')} FCFA</span>` : ''}
                            <span class="price">
                                ${typeof product.price === 'number' ? `${product.price.toLocaleString('fr-FR')} FCFA` : product.price}${product.unit || ''}
                            </span>
                        </div>
                        <div class="product-actions">
                            ${typeof product.price === 'number' ? 
                                `<button class="product-btn btn-cart" data-id="${product.id}" aria-label="Ajouter au panier">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>` : ''}
                            <button class="product-btn btn-view" data-id="${product.id}" aria-label="Voir les détails">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    function openDetailModal(productId) {
        const product = products.find(p => p.id == productId);
        if (!product || !detailModal) return;
        const modalBody = document.getElementById('modal-body-content');
        modalBody.innerHTML = `
            <div class="modal-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="modal-details">
                <h2 class="modal-title">${product.name}</h2>
                <div class="modal-price">${typeof product.price === 'number' ? `${product.price.toLocaleString('fr-FR')} FCFA` : product.price}${product.unit || ''}</div>
                <p>${product.description}</p>
                <div class="modal-specs">
                    ${Object.entries(product.details).map(([key, value]) => 
                        `<div class="spec-item"><span>${key}</span><strong>${value}</strong></div>`
                    ).join('')}
                </div>
                ${typeof product.price === 'number' ? 
                    `<button class="btn btn-primary btn-cart-modal" data-id="${product.id}">Ajouter au panier</button>` : 
                    `<a href="contact.html" class="btn btn-primary">Demander un devis</a>`}
            </div>
        `;
        detailModal.classList.add('active');
    }

    function addToCart(productId) {
        const product = products.find(p => p.id == productId);
        if (typeof product.price !== 'number') return;
        const existingItem = cart.find(item => item.id == productId);
        if (existingItem) { 
            existingItem.quantity++; 
        } else { 
            cart.push({ id: productId, quantity: 1 }); 
        }
        showNotification("Produit ajouté au panier !", "success");
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('sap_cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCounter();
    }

    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalPriceEl = document.getElementById('cart-total-price');
        if (!cartItemsContainer || !cartTotalPriceEl) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Votre panier est vide.</p>';
            cartTotalPriceEl.textContent = '0 FCFA';
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
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <p>${cartItem.quantity} x ${product.price.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <button class="cart-item-remove" data-id="${cartItem.id}" aria-label="Supprimer">&times;</button>
                </div>
            `;
        }).join('');
        cartTotalPriceEl.textContent = `${total.toLocaleString('fr-FR')} FCFA`;
    }

    function updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        if (!counter) return;
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    function openCart() { 
        cartSidebar.classList.add('active'); 
        cartOverlay.classList.add('active'); 
    }
    
    function closeCart() { 
        cartSidebar.classList.remove('active'); 
        cartOverlay.classList.remove('active'); 
    }

    function processOrder() {
        if (cart.length === 0) {
            showNotification("Votre panier est vide !", "error");
            return;
        }
        
        const orderSummaryContainer = document.getElementById('order-summary');
        const totalPrice = cart.reduce((total, cartItem) => {
            const product = products.find(p => p.id == cartItem.id);
            return total + (product.price * cartItem.quantity);
        }, 0);
        
        orderSummaryContainer.innerHTML = cart.map(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            return `
                <div class="order-summary-item">
                    <span>${cartItem.quantity}x ${product.name}</span>
                    <span>${(product.price * cartItem.quantity).toLocaleString('fr-FR')} FCFA</span>
                </div>
            `;
        }).join('') + `
            <div class="order-summary-total">
                Total : ${totalPrice.toLocaleString('fr-FR')} FCFA
            </div>
        `;
        
        closeCart();
        orderModal.classList.add('active');
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    function closeModal() {
        if (detailModal) detailModal.classList.remove('active');
        if (orderModal) {
            orderModal.classList.remove('active');
            setTimeout(() => {
                orderForm.style.display = 'block';
                orderSuccessDiv.style.display = 'none';
                orderForm.reset();
            }, 500);
        }
    }

    // --- NOUVELLE FONCTIONNALITÉ : ENVOI SIMPLIFIÉ DE COMMANDE ---
    function prepareWhatsAppMessage(customerInfo, orderData) {
        const itemsList = orderData.items.map(item => {
            const product = products.find(p => p.id === item.id);
            return `- ${item.quantity}x ${product.name} : ${(item.quantity * product.price).toLocaleString('fr-FR')} FCFA`;
        }).join('%0A');
        
        const message = `*NOUVELLE COMMANDE SAP GK GROUPE*%0A%0A*Client:* ${customerInfo.name}%0A*Téléphone:* ${customerInfo.phone}%0A*Email:* ${customerInfo.email}%0A%0A*Détails de la commande:*%0A${itemsList}%0A%0A*Total: ${orderData.total.toLocaleString('fr-FR')} FCFA*%0A%0A*Date:* ${new Date().toLocaleDateString('fr-FR')}`;
        
        return message;
    }

    function prepareEmail(customerInfo, orderData) {
        const itemsList = orderData.items.map(item => {
            const product = products.find(p => p.id === item.id);
            return `${item.quantity}x ${product.name} - ${(item.quantity * product.price).toLocaleString('fr-FR')} FCFA`;
        }).join('%0D%0A');
        
        const subject = `Nouvelle commande de ${customerInfo.name}`;
        const body = `Une nouvelle commande a été passée:%0D%0A%0D%0AClient: ${customerInfo.name}%0D%0ATéléphone: ${customerInfo.phone}%0D%0AEmail: ${customerInfo.email}%0D%0A%0D%0ADétails:%0D%0A${itemsList}%0D%0A%0D%0ATotal: ${orderData.total.toLocaleString('fr-FR')} FCFA`;
        
        return { subject, body };
    }

    // --- LOGIQUE DE SOUMISSION DE COMMANDE SIMPLIFIÉE ---
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-order-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Récupérer les informations client
        const customerInfo = {
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value
        };
        
        // Préparer les données de la commande
        const orderData = {
            items: [...cart],
            total: cart.reduce((total, item) => {
                const product = products.find(p => p.id === item.id);
                return total + (product.price * item.quantity);
            }, 0)
        };

        try {
            // Préparer le message WhatsApp
            const whatsappMessage = prepareWhatsAppMessage(customerInfo, orderData);
            const adminPhoneNumber = "2250574152955";
            
            // Ouvrir WhatsApp avec le message pré-rempli
            window.open(`https://wa.me/${adminPhoneNumber}?text=${whatsappMessage}`, '_blank');
            
            // Préparer et ouvrir l'email
            const emailData = prepareEmail(customerInfo, orderData);
            window.location.href = `mailto:contact@sapgkgroupe.com?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
            
            // Afficher le message de succès
            handleOrderSuccess(customerInfo, orderData);
            
        } catch (error) {
            console.error("Erreur lors du traitement de la commande:", error);
            showNotification("Une erreur est survenue lors du traitement de votre commande.", "error");
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    function handleOrderSuccess(customerInfo, orderData) {
        // Affiche la vue de succès
        orderForm.style.display = 'none';
        orderSuccessDiv.style.display = 'block';

        // Mettre à jour le bouton WhatsApp
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (whatsappBtn) {
            const whatsappMessage = prepareWhatsAppMessage(customerInfo, orderData);
            const adminPhoneNumber = "2250574152955";
            whatsappBtn.href = `https://wa.me/${adminPhoneNumber}?text=${whatsappMessage}`;
        }

        // Vide le panier
        cart = [];
        updateCart();
        
        // Afficher un message de confirmation
        showNotification("Votre commande a été envoyée avec succès !", "success");
    }

    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderProducts(button.dataset.filter);
            });
        });
    }
    
    if (productsGrid) {
        productsGrid.addEventListener('click', e => {
            const viewBtn = e.target.closest('.btn-view');
            const cartBtn = e.target.closest('.btn-cart');
            if (viewBtn) openDetailModal(viewBtn.dataset.id);
            if (cartBtn) addToCart(cartBtn.dataset.id);
        });
    }
    
    if (detailModal) {
        detailModal.addEventListener('click', e => {
            if (e.target.matches('.close-modal, .product-modal')) closeModal();
            const cartModalBtn = e.target.closest('.btn-cart-modal');
            if (cartModalBtn) {
                addToCart(cartModalBtn.dataset.id);
                closeModal();
            }
        });
    }
    
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', e => {
            e.preventDefault();
            openCart();
        });
    }
    
    const closeCartBtn = document.getElementById('close-cart-btn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', e => {
            const removeBtn = e.target.closest('.cart-item-remove');
            if (removeBtn) {
                cart = cart.filter(item => item.id != removeBtn.dataset.id);
                updateCart();
            }
        });
    }
    
    const processOrderBtn = document.getElementById('process-order-btn');
    if (processOrderBtn) {
        processOrderBtn.addEventListener('click', processOrder);
    }
    
    const closeOrderModal = document.getElementById('close-order-modal');
    if (closeOrderModal) {
        closeOrderModal.addEventListener('click', closeModal);
    }

    // Initialisation
    renderProducts();
    updateCart();
});


// Ajoutez cette fonction à votre fichier boutique.js
async function saveOrderToDatabase(orderData) {
    try {
        const response = await fetch('api/save_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Erreur sauvegarde BD:', error);
        return false;
    }
}

// Modifiez la fonction processOrder pour inclure la sauvegarde
async function processOrder() {
    if (cart.length === 0) {
        showNotification("Votre panier est vide !", "error");
        return;
    }
    
    // ... code existant ...
    
    // Après la préparation des données
    const orderData = {
        customer: customerInfo,
        items: cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return {
                product_id: product.id,
                name: product.name,
                quantity: item.quantity,
                price: product.price
            };
        }),
        total: totalPrice,
        order_number: `CMD${Date.now()}`
    };
    
    // Sauvegarde dans la base de données
    const dbSuccess = await saveOrderToDatabase(orderData);
    if (dbSuccess) {
        console.log('Commande sauvegardée en base de données');
    }
}