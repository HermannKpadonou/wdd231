document.addEventListener('DOMContentLoaded', () => {
    const DATA_URL = '../data/crops.json';
    const seasonalContainer = document.getElementById('seasonal-crops-container');
    const currentMonthSpan = document.getElementById('current-month');
    
    async function loadSeasonalCrops() {
        if (!seasonalContainer) return;
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error('Failed to fetch crops data');
            const data = await response.json();
            const allCrops = data.crops;

            const now = new Date();
            const currentMonth = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
            if (currentMonthSpan) {
                currentMonthSpan.textContent = now.toLocaleString('en-US', { month: 'long' });
            }

            const seasonalCrops = allCrops.filter(crop => 
                crop.growing_calendar.planting.includes(currentMonth) || 
                crop.growing_calendar.harvest.includes(currentMonth) ||
                crop.growing_calendar.harvest.includes('year_round')
            );
            
            seasonalContainer.innerHTML = seasonalCrops.length ? 
                seasonalCrops.map(createCropCard).join('') : 
                '<p>No specific planting or harvesting activities this month.</p>';
        } catch (error) {
            console.error(error);
            seasonalContainer.innerHTML = '<p class="error-message">Could not load seasonal crops.</p>';
        }
    }

    function createCropCard(crop) {
        return `
            <article class="crop-card" data-id="${crop.id}">
                <img src="${crop.image_url}" alt="${crop.name}" loading="lazy">
                <div class="card-content">
                    <h3>${crop.name}</h3>
                    <p class="scientific-name">${crop.scientific_name}</p>
                </div>
            </article>
        `;
    }

    function initializeWorkshopMap() {
        if (typeof L === 'undefined' || !document.getElementById('workshop-map-container')) return;
        
        const workshops = [
            { name: "Agboville", coords: [5.9329, -4.2163], specialty: "Cassava and plantain seedlings" },
            { name: "Yamoussoukro", coords: [6.8206, -5.2768], specialty: "Yam and tuber research" },
            { name: "Bouaké", coords: [7.6895, -5.0298], specialty: "Seeds and tools market" },
            { name: "Korhogo", coords: [9.4586, -5.6296], specialty: "Traditional crops" },
            { name: "San-Pédro", coords: [4.7485, -6.6363], specialty: "Cocoa export logistics" },
            { name: "Man", coords: [7.4125, -7.5538], specialty: "Mountain coffee and cocoa" },
            { name: "Abidjan", coords: [5.3600, -4.0083], specialty: "Urban farming hub" }
        ];

        const map = L.map('workshop-map-container').setView([7.539, -5.547], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        workshops.forEach(shop => {
            L.marker(shop.coords).addTo(map)
                .bindPopup(`<b>${shop.name} Workshop</b><br>${shop.specialty}`);
        });
    }

    loadSeasonalCrops();
    initializeWorkshopMap();
});