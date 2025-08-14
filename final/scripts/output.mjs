export function displayCrops(crops, container) {
    container.innerHTML = '';
    
    crops.forEach(crop => {
        const cardHTML = `
            <div class="crop-card" data-id="${crop.id}">
                <img src="${crop.image_url}" alt="${crop.name}" loading="lazy">
                <div class="card-content">
                    <h3>${crop.name}</h3>
                    <p>${crop.description.general}</p>
                    <p><strong>Optimal Season:</strong> ${crop.growing_calendar.optimal_season}</p>
                    <p><strong>Uses:</strong> ${crop.uses}</p>
                </div>
            </div>
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
    modal.style.display = 'block';
}

export function closeModal() {
    const modal = document.getElementById('crop-modal');
    modal.style.display = 'none';
}