document.addEventListener('DOMContentLoaded', () => {
    const DATA_URL = '../data/crops.json';
    const OWM_API_KEY = 'b1b15e88fa797225412429c1c50c122a1';

    const cropsContainer = document.getElementById('all-crops-container');
    const modal = document.getElementById('crop-modal');
    const modalContent = document.getElementById('modal-content');
    
    let allCrops = [];
    let currentDate = new Date();

    function getCategory(cropId) {
        const prefix = cropId.substring(0, 3).toLowerCase();
        const categories = {
            'man': 'tubers', 'ign': 'tubers', 'swe': 'tubers',
            'ric': 'cereals', 'mai': 'cereals', 'sor': 'cereals', 'mil': 'cereals',
            'gro': 'legumes',
            'gom': 'vegetables', 'pim': 'vegetables', 'tom': 'vegetables', 'egg': 'vegetables', 'squ': 'vegetables', 'gre': 'vegetables',
            'pla': 'fruits'
        };
        return categories[prefix] || 'other';
    }

    function createCropCard(crop) {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
        const isHarvest = crop.growing_calendar.harvest.includes('year_round') || crop.growing_calendar.harvest.includes(currentMonth);
        const isPlanting = crop.growing_calendar.planting.includes(currentMonth);
        
        let status = '';
        if (isPlanting && isHarvest) status = 'Planting & Harvest';
        else if (isPlanting) status = 'Planting Season';
        else if (isHarvest) status = 'Harvest Season';

        const category = getCategory(crop.id);

        return `
            <article class="crop-card" data-id="${crop.id}">
                <img src="${crop.image_url}" alt="${crop.name}" loading="lazy">
                <div class="card-content">
                    <h3>${crop.name}</h3>
                    <p class="scientific-name">${crop.scientific_name}</p>
                    ${status ? `<p class="crop-status ${status.toLowerCase().replace(' & ', '-')}">${status}</p>` : ''}
                    <div class="price-info">
                        <p><strong>Wholesale:</strong> ${crop.pricing.wholesale.in_season}</p>
                        <p><strong>Retail:</strong> ${crop.pricing.retail.in_season}</p>
                    </div>
                    <span class="category-badge">${category}</span>
                </div>
            </article>
        `;
    }

    function displayCrops(crops) {
        cropsContainer.innerHTML = crops.length ? crops.map(createCropCard).join('') : '<p>No crops found matching your criteria.</p>';
    }

    function filterAndSearch() {
        const searchTerm = document.getElementById('crop-search').value.toLowerCase();
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        const filteredCrops = allCrops.filter(crop => {
            const cropCategory = getCategory(crop.id);
            const matchesCategory = activeCategory === 'all' || cropCategory === activeCategory;
            const matchesSearch = crop.name.toLowerCase().includes(searchTerm) || crop.scientific_name.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        document.querySelectorAll('.crop-card').forEach(card => {
            card.style.display = filteredCrops.some(c => c.id === card.dataset.id) ? 'flex' : 'none';
        });
    }

    function openModal(crop) {
        modalContent.innerHTML = `
            <span class="close-modal">&times;</span>
            <img src="${crop.image_url}" alt="${crop.name}">
            <h2>${crop.name} <em>(${crop.scientific_name})</em></h2>
            <div class="modal-section"><h3>Description</h3><p>${crop.description.general}</p></div>
            <div class="modal-section"><h3>Health Benefits</h3><ul><li><strong>Human:</strong> ${crop.description.human_health}</li><li><strong>Animal:</strong> ${crop.description.animal_health}</li></ul></div>
            <div class="modal-section"><h3>Cultivation Tips</h3><ul><li><strong>Soil:</strong> ${crop.cultivation_tips.soil_type}</li><li><strong>Fertilization:</strong> ${crop.cultivation_tips.fertilization}</li><li><strong>Maintenance:</strong> ${crop.cultivation_tips.maintenance}</li></ul></div>
            <div class="modal-section"><h3>Calendar</h3><p><strong>Planting:</strong> ${crop.growing_calendar.planting.join(', ')}</p><p><strong>Harvest:</strong> ${crop.growing_calendar.harvest.join(', ')}</p></div>
            <div class="modal-section"><h3>Common Uses</h3><p>${crop.uses}</p></div>
        `;
        modal.style.display = 'block';
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
    }

    function closeModal() { modal.style.display = 'none'; }

    function renderMonthlySummary() {
        const monthYearDisplay = document.getElementById('calendar-month-year');
        const plantingList = document.getElementById('planting-summary');
        const harvestList = document.getElementById('harvest-summary');
        const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
        const year = currentDate.getFullYear();
        monthYearDisplay.textContent = `${monthName} ${year}`;
        const monthStr = monthName.toLowerCase();
        const cropsToPlant = allCrops.filter(crop => crop.growing_calendar.planting.includes(monthStr));
        const cropsToHarvest = allCrops.filter(crop => crop.growing_calendar.harvest.includes(monthStr) || crop.growing_calendar.harvest.includes('year_round'));
        plantingList.innerHTML = cropsToPlant.length ? cropsToPlant.map(c => `<li>${c.name}</li>`).join('') : '<li class="no-activity-message">No specific planting activity.</li>';
        harvestList.innerHTML = cropsToHarvest.length ? cropsToHarvest.map(c => `<li>${c.name}</li>`).join('') : '<li class="no-activity-message">No specific harvesting activity.</li>';
    }

    async function setupMap() {
        if (typeof L === 'undefined') return;

        if (!OWM_API_KEY || OWM_API_KEY === 'VOTRE_CLÉ_API_OPENWEATHERMAP_ICI') {
            document.getElementById('crops-map').innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Erreur : Veuillez fournir une clé API OpenWeatherMap valide dans le fichier crops.js.</p>';
            return;
        }

        const departmentCapitals = [
            { name: "Agboville", coords: [5.9329, -4.2163], shopInfo: { specialty: "Improved cassava and plantain seedlings", address: "Rue des Planteurs, Agboville", phone: "+225 07 11 22 33 44", hours: "08:00 AM - 06:00 PM" } },
            { name: "Yamoussoukro", coords: [6.8206, -5.2768], shopInfo: { specialty: "Research center for yams and tubers", address: "Quartier des Lacs, Yamoussoukro", phone: "+225 07 55 66 77 88", hours: "08:00 AM - 05:00 PM" } },
            { name: "Bouaké", coords: [7.6895, -5.0298], shopInfo: { specialty: "Large market for seeds and tools", address: "Industrial Zone, Bouaké", phone: "+225 07 23 45 67 89", hours: "08:00 AM - 07:00 PM" } },
            { name: "Korhogo", coords: [9.4586, -5.6296], shopInfo: { specialty: "Senufo crafts and traditional crops", address: "Artisans' Village, Korhogo", phone: "+225 07 99 01 23 45", hours: "09:00 AM - 06:00 PM" } },
            { name: "San-Pédro", coords: [4.7485, -6.6363], shopInfo: { specialty: "Logistics for rubber and cocoa export", address: "Port Area, San-Pédro", phone: "+225 07 00 12 34 56", hours: "08:00 AM - 06:00 PM" } },
            { name: "Man", coords: [7.4125, -7.5538], shopInfo: { specialty: "Mountain coffee, cocoa, and food crops", address: "Route des 18 Montagnes, Man", phone: "+225 07 34 45 67 89", hours: "08:00 AM - 06:00 PM" } },
            { name: "Abidjan", coords: [5.3600, -4.0083], shopInfo: { specialty: "Main store and urban farming", address: "Plateau, Avenue Franchet d'Esperey", phone: "+225 07 56 67 89 01", hours: "09:00 AM - 07:00 PM" } },
            { name: "Daloa", coords: [6.9000, -5.2500], shopInfo: { specialty: "Cocoa and cashew nuts", address: "Rue des Agriculteurs, Daloa", phone: "+225 07 12 34 56 78", hours: "08:00 AM - 05:00 PM" } },
            { name: "Divo", coords: [5.9000, -5.7000], shopInfo: { specialty: "Rice and maize production", address: "Avenue des Cultures, Divo", phone: "+225 07 23 45 67 89", hours: "08:00 AM - 06:00 PM" } },
            { name: "Sassandra", coords: [4.9500, -6.5000], shopInfo: { specialty: "Coastal crops and fishing", address: "Rue des Pêcheurs, Sassandra", phone: "+225 07 34 56 78 90", hours: "08:00 AM - 05:00 PM" } },
            { name: "Odienné", coords: [9.5000, -7.0000], shopInfo: { specialty: "Forest crops and traditional medicine", address: "Quartier des Forêts, Odienné", phone: "+225 07 45 67 89 01", hours: "08:00 AM - 06:00 PM" } },
            { name: "Séguéla", coords: [7.5000, -6.0000], shopInfo: { specialty: "Cotton and cashew nuts", address: "Avenue des Cotonniers, Séguéla", phone: "+225 07 56 78 90 12", hours: "08:00 AM - 05:00 PM" } },
            { name: "Ferkessédougou", coords: [9.5000, -5.0000], shopInfo: { specialty: "Cereals and livestock", address: "Rue des Éleveurs, Ferkessédougou", phone: "+225 07 67 89 01 23", hours: "08:00 AM - 06:00 PM" } },
            { name: "Bondoukou", coords: [8.0000, -2.5000], shopInfo: { specialty: "Traditional crops and crafts", address: "Quartier des Artisans, Bondoukou", phone: "+225 07 78 90 12 34", hours: "08:00 AM - 05:00 PM" } },
            { name: "Bingerville", coords: [5.4000, -3.9000], shopInfo: { specialty: "Urban agriculture and horticulture", address: "Avenue des Jardins, Bingerville", phone: "+225 07 89 01 23 45", hours: "08:00 AM - 06:00 PM" } },
            { name: "Aboisso", coords: [5.0000, -3.0000], shopInfo: { specialty: "Coconut and palm oil", address: "Rue des Palmiers, Abidjan", phone: "+225 07 90 12 34 56", hours: "08:00 AM - 05:00 PM" } }
        ];

        const map = L.map('crops-map').setView([7.539, -5.547], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        departmentCapitals.forEach(async (capital) => {
            const [lat, lon] = capital.coords;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&units=metric`;

            let weatherData = null;
            try {
                const response = await fetch(weatherUrl);
                if (!response.ok) throw new Error('Weather data not available');
                weatherData = await response.json();
            } catch (error) {
                console.error(`Could not fetch weather for ${capital.name}:`, error);
            }
            
            const temp = weatherData ? Math.round(weatherData.main.temp) : '?';
            const weatherIcon = weatherData ? weatherData.weather[0].icon : null;
            const weatherDesc = weatherData ? weatherData.weather[0].description : 'N/A';

            const weatherMarkerIcon = L.divIcon({
                className: 'weather-marker',
                html: `<span>${temp}°C</span>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            const marker = L.marker(capital.coords, { icon: weatherMarkerIcon }).addTo(map);

            const popupContent = `
                <div class="map-popup">
                    <h3>Agri-Terroir - ${capital.name}</h3>
                    <div class="weather-info">
                        ${weatherIcon ? `<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDesc}">` : ''}
                        <span>${temp}°C, ${weatherDesc}</span>
                    </div>
                    <hr>
                    <ul>
                        <li><strong>Spécialité:</strong> ${capital.shopInfo.specialty}</li>
                        <li><strong>Adresse:</strong> ${capital.shopInfo.address}</li>
                    </ul>
                </div>
            `;
            marker.bindPopup(popupContent);
        });
    }

    function setupEventListeners() {
        document.querySelector('.category-filters').addEventListener('click', e => {
            if (e.target.classList.contains('category-btn')) {
                document.querySelector('.category-btn.active').classList.remove('active');
                e.target.classList.add('active');
                filterAndSearch();
            }
        });
        document.getElementById('crop-search').addEventListener('input', filterAndSearch);
        cropsContainer.addEventListener('click', e => {
            const card = e.target.closest('.crop-card');
            if (card) {
                const selectedCrop = allCrops.find(crop => crop.id === card.dataset.id);
                if (selectedCrop) openModal(selectedCrop);
            }
        });
        window.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.getElementById('prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderMonthlySummary();
        });
        document.getElementById('next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderMonthlySummary();
        });
    }

    async function init() {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            allCrops = data.crops;
            if (!allCrops) throw new Error("JSON structure is incorrect.");

            displayCrops(allCrops);
            setupEventListeners();
            renderMonthlySummary(); 
            await setupMap(); 
        } catch (error) {
            console.error("Failed to load or process crop data:", error);
            cropsContainer.innerHTML = '<p class="error-message">Sorry, we could not load the crop data. Please try again later.</p>';
        }
    }

    init();
});