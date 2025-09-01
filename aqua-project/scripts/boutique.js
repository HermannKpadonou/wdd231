document.addEventListener('DOMContentLoaded', () => {
    // Liste complète des produits pour la grille dynamique
    const products = [
        { id: 1, name: "Alevins de Tilapia", category: "poissons", price: 350, originalPrice: 500, image: "images/ALEVIN.jpg", description: "Alevins de tilapia robustes, parfaits pour le démarrage de votre élevage.", details: { Taille: "2-3 cm", Âge: "21 jours", "Taux de survie": "≥ 85%" } },
        { id: 2, name: "Jeunes Silures", category: "poissons", price: 450, image: "images/silure.jpg", description: "Jeunes silures de qualité supérieure pour l'élevage intensif.", details: { Taille: "5-7 cm", Âge: "30 jours", "Taux de survie": "≥ 90%" } },
        { id: 3, name: "Tilapia Rouge", category: "poissons", price: 2500, unit: "/kg", image: "images/tilapia-rouge2.webp", description: "Tilapia rouge de première qualité, idéal pour la consommation.", details: { "Poids moyen": "400-600 g", Format: "Entier éviscéré", Disponibilité: "Toute l'année" } },
        { id: 4, name: "Filets de Poisson", category: "transformes", price: 3500, unit: "/kg", image: "images/produits-transformes.jpg", description: "Filets de poisson frais, prêts à cuisiner, sans arêtes.", details: { Espèce: "Tilapia ou Silure", Conservation: "Congelé", Présentation: "Sous vide" } },
        { id: 5, name: "Conseil en Aquaculture", category: "services", price: "Sur devis", image: "images/poisson-iuy.jpg", description: "Services experts pour optimiser votre production aquacole.", details: { Expertise: "Pisciculture, aquaponie", Durée: "Missions ponctuelles", Tarification: "Personnalisée" } },
        { id: 6, name: "Formation Aquacole", category: "services", price: 75000, image: "images/ALEVIN.jpg", description: "Programmes de formation complets pour aquaculteurs.", details: { Durée: "5 jours intensifs", Niveau: "Débutant à avancé", Inclus: "Support de cours, attestation" } }
    ];
    let cart = JSON.parse(localStorage.getItem('sap_cart')) || [];
    
    // Sélection des éléments du DOM
    const productsGrid = document.getElementById('products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const detailModal = document.getElementById('product-modal');
    const orderModal = document.getElementById('order-modal');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');

    // --- AFFICHAGE DES PRODUITS ---
    function renderProducts(filter = 'all') {
        if (!productsGrid) return;
        productsGrid.innerHTML = ''; 
        const filteredProducts = products.filter(p => filter === 'all' || p.category === filter);
        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `<div class="product-image"><img src="${product.image}" alt="${product.name}"></div><div class="product-info"><h3 class="product-title">${product.name}</h3><p class="product-description">${product.description}</p><div class="product-price"><div>${product.originalPrice ? `<span class="original-price">${product.originalPrice.toLocaleString('fr-FR')} FCFA</span>` : ''}<span class="price">${typeof product.price === 'number' ? `${product.price.toLocaleString('fr-FR')} FCFA` : product.price}${product.unit || ''}</span></div><div class="product-actions">${typeof product.price === 'number' ? `<button class="product-btn btn-cart" data-id="${product.id}" aria-label="Ajouter au panier"><i class="fas fa-shopping-cart"></i></button>` : ''}<button class="product-btn btn-view" data-id="${product.id}" aria-label="Voir les détails"><i class="fas fa-eye"></i></button></div></div></div>`;
            productsGrid.appendChild(card);
        });
    }

    // --- GESTION DES MODALS ---
    function openDetailModal(productId) {
        const product = products.find(p => p.id == productId);
        if (!product || !detailModal) return;
        const modalBody = document.getElementById('modal-body-content');
        modalBody.innerHTML = `<div class="modal-image"><img src="${product.image}" alt="${product.name}"></div><div class="modal-details"><h2 class="modal-title">${product.name}</h2><div class="modal-price">${typeof product.price === 'number' ? `${product.price.toLocaleString('fr-FR')} FCFA` : product.price}${product.unit || ''}</div><p>${product.description}</p><div class="modal-specs">${Object.entries(product.details).map(([key, value]) => `<div class="spec-item"><span>${key}</span><strong>${value}</strong></div>`).join('')}</div>${typeof product.price === 'number' ? `<button class="btn btn-primary btn-cart-modal" data-id="${product.id}">Ajouter au panier</button>` : `<a href="contact.html" class="btn btn-primary">Demander un devis</a>`}</div>`;
        detailModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }
    function closeModal() {
        if (detailModal) detailModal.classList.remove('active');
        if (orderModal) orderModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // --- GESTION DU PANIER ---
    function addToCart(productId) {
        const product = products.find(p => p.id == productId);
        if (typeof product.price !== 'number') return;
        const existingItem = cart.find(item => item.id == productId);
        if (existingItem) { existingItem.quantity++; } else { cart.push({ id: productId, quantity: 1 }); }
        showNotification("Produit ajouté au panier !", "success");
        updateCart();
    }
    function updateCart() { localStorage.setItem('sap_cart', JSON.stringify(cart)); renderCartItems(); updateCartCounter(); }
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalPriceEl = document.getElementById('cart-total-price');
        if (!cartItemsContainer || !cartTotalPriceEl) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Votre panier est vide.</p>';
            cartTotalPriceEl.textContent = '0 FCFA';
            return;
        }
        let total = 0;
        cartItemsContainer.innerHTML = cart.map(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            if (!product) return '';
            total += product.price * cartItem.quantity;
            return `<div class="cart-item"><img src="${product.image}" alt="${product.name}"><div class="cart-item-info"><h4>${product.name}</h4><p>${cartItem.quantity} x ${product.price.toLocaleString('fr-FR')} FCFA</p></div><button class="cart-item-remove" data-id="${cartItem.id}" aria-label="Supprimer">&times;</button></div>`;
        }).join('');
        cartTotalPriceEl.textContent = `${total.toLocaleString('fr-FR')} FCFA`;
    }
    function updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    function openCart() { cartSidebar.classList.add('active'); cartOverlay.classList.add('active'); }
    function closeCart() { cartSidebar.classList.remove('active'); cartOverlay.classList.remove('active'); }

    // --- GESTION DE LA COMMANDE (LOGIQUE AUTOMATISÉE) ---
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
            return `<div class="order-summary-item"><span>${cartItem.quantity}x ${product.name}</span><span>${(product.price * cartItem.quantity).toLocaleString('fr-FR')} FCFA</span></div>`;
        }).join('') + `<div class="order-summary-total">Total : ${totalPrice.toLocaleString('fr-FR')} FCFA</div>`;
        closeCart();
        orderModal.classList.add('active');
    }

    async function submitOrder(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-order-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const customerInfo = {
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value
        };

        const cartItemsWithDetails = cart.map(item => ({...products.find(p => p.id == item.id), quantity: item.quantity }));
        const totalPrice = cartItemsWithDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderNumber = `SAP-${Date.now()}`;

        const pdfBase64 = generateOrderPDF(cartItemsWithDetails, totalPrice, customerInfo, orderNumber);
        
        try {
            // *** CORRECTION APPLIQUÉE ICI ***
            // On envoie la requête à l'adresse du serveur Node.js sur le port 3000
            const response = await fetch('http://localhost:3000/api/send-order-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: customerInfo.name,
                    customerEmail: customerInfo.email,
                    orderNumber: orderNumber,
                    pdf: pdfBase64,
                })
            });

            if (!response.ok) {
                 // Si le serveur répond avec une erreur (ex: 500), on la capture ici
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Erreur serveur.');
            }
            
            sendWhatsAppNotification(cartItemsWithDetails, totalPrice, customerInfo, orderNumber);
            showNotification("Commande passée ! Un email de confirmation vous a été envoyé.", "success");
            cart = [];
            updateCart();
            closeModal();
            document.getElementById('order-form').reset();
        } catch (error) {
            console.error("Erreur lors de la soumission de la commande:", error);
            showNotification("Une erreur est survenue. Veuillez réessayer.", "error");
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    function generateOrderPDF(cartItems, totalPrice, customerInfo, orderNumber) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(20).text('Récapitulatif de Commande', 105, 20, { align: 'center' });
        doc.setFontSize(12).text(`Commande #${orderNumber}`, 105, 30, { align: 'center' });
        doc.text(`Client: ${customerInfo.name}`, 15, 50);
        doc.text(`Téléphone: ${customerInfo.phone}`, 15, 57);
        doc.text(`Email: ${customerInfo.email}`, 15, 64);
        let y = 80;
        cartItems.forEach(item => {
            doc.text(`${item.quantity} x ${item.name}`, 15, y);
            doc.text(`${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA`, 195, y, { align: 'right' });
            y += 7;
        });
        doc.line(15, y + 5, 195, y + 5);
        doc.setFontSize(16).text('Total:', 15, y + 15);
        doc.text(`${totalPrice.toLocaleString('fr-FR')} FCFA`, 195, y + 15, { align: 'right' });
        return doc.output('datauristring');
    }

    function sendWhatsAppNotification(cartItems, totalPrice, customerInfo, orderNumber) {
        const itemsList = cartItems.map(item => `- ${item.quantity}x ${item.name}`).join('%0A');
        const message = `*Nouvelle Commande #${orderNumber}* %0A%0A*Client:* ${customerInfo.name}%0A*Tél:* ${customerInfo.phone}%0A*Email:* ${customerInfo.email}%0A%0A*Détails:*%0A${itemsList}%0A%0A*Total:* ${totalPrice.toLocaleString('fr-FR')} FCFA`;
        const adminPhoneNumber = "2250505253209"; // Remplacez par le numéro du service client
        window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, '_blank');
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderProducts(button.dataset.filter);
        }));
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
            if (e.target.closest('.btn-cart-modal')) {
                addToCart(e.target.closest('.btn-cart-modal').dataset.id);
                closeModal();
            }
        });
    }
    
    document.getElementById('cart-icon').addEventListener('click', e => { e.preventDefault(); openCart(); });
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    document.getElementById('cart-items-container').addEventListener('click', e => {
        if (e.target.closest('.cart-item-remove')) {
            cart = cart.filter(item => item.id != e.target.closest('.cart-item-remove').dataset.id);
            updateCart();
        }
    });

    document.getElementById('process-order-btn').addEventListener('click', processOrder);
    document.getElementById('order-form').addEventListener('submit', submitOrder);
    document.getElementById('close-order-modal').addEventListener('click', () => orderModal.classList.remove('active'));

    // Initialisation au chargement de la page
    renderProducts();
    updateCart();
});