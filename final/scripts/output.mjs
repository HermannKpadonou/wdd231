
export function displayCrops(crops, container) {
    container.innerHTML = '';

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();

    crops.forEach(crop => {
        let statusText = '';
        const isPlantingTime = crop.growing_calendar.planting.includes(currentMonth);
        const isHarvestTime = crop.growing_calendar.harvest.includes(currentMonth);

        if (isPlantingTime && isHarvestTime) {
            statusText = 'Planting & Harvest Season';
        } else if (isPlantingTime) {
            statusText = 'Planting Season';
        } else if (isHarvestTime) {
            statusText = 'Harvest Season';
        }

        const cardHTML = `
            <article class="crop-card" data-id="${crop.id}">
                <img src="${crop.image_url}" alt="${crop.name}" loading="lazy">
                <div class="card-content">
                    <h3>${crop.name}</h3>
                    <p class="crop-status">${statusText}</p>
                    <div class="price-info">
                        <p><strong>Wholesale:</strong> ${crop.pricing.wholesale.in_season}</p>
                        <p><strong>Retail:</strong> ${crop.pricing.retail.in_season}</p>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="more-info-btn">More</button>
                </div>
            </article>
        `;
        container.innerHTML += cardHTML;
    });
}

export function showModal(crop) {
    const modal = document.getElementById('crop-modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <span class="close-button">&times;</span>
        <h2>${crop.name} <em>(${crop.scientific_name})</em></h2>
        <img src="${crop.image_url}" alt="${crop.name}" class="modal-image">
        
        <h3>Cultivation Tips</h3>
        <ul>
            <li><strong>Soil:</strong> ${crop.cultivation_tips.soil_type}</li>
            <li><strong>Fertilization:</strong> ${crop.cultivation_tips.fertilization}</li>
            <li><strong>Maintenance:</strong> ${crop.cultivation_tips.maintenance}</li>
        </ul>

        <h3>Pricing (Wholesale, in season)</h3>
        <p>${crop.pricing.wholesale.in_season}</p>
    `;
    modal.style.display = 'flex';
}

export function closeModal() {
    const modal = document.getElementById('crop-modal');
    modal.style.display = 'none';
}