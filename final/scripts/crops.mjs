import { getCropsData } from './module.mjs';
import { displayCrops, showModal, closeModal } from './output.mjs';

function filterCropsForCurrentMonth(allCrops) {
    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    
    return {
        monthName: now.toLocaleString('en-US', { month: 'long' }), 
        filteredCrops: allCrops.filter(crop => {
            const canBePlanted = crop.growing_calendar.planting.includes(currentMonth);
            const canBeHarvested = crop.growing_calendar.harvest.includes(currentMonth);
            return canBePlanted || canBeHarvested;
        })
    };
}

async function initializeApp() {
    const allCrops = await getCropsData();
    const cropsContainer = document.getElementById('crops-container');

    if (!cropsContainer || allCrops.length === 0) {
        if (cropsContainer) {
            cropsContainer.innerHTML = '<p>Failed to load crop information. Please try again later.</p>';
        }
        return;
    }

    const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
    
    let cropsToDisplay;

    if (isHomePage) {
        const { monthName, filteredCrops } = filterCropsForCurrentMonth(allCrops);
        
       
        const titleElement = document.getElementById('featured-title');
        if (titleElement) {
            titleElement.textContent = `Crops of ${monthName}`;
        }

        cropsToDisplay = filteredCrops;

        if (cropsToDisplay.length === 0) {
            cropsContainer.innerHTML = `<p>No featured crops for ${monthName}. Check back later!</p>`;
            return;
        }
    } else {
        cropsToDisplay = allCrops;
    }
    
    displayCrops(cropsToDisplay, cropsContainer);
    setupEventListeners(allCrops, cropsContainer);
    displayLastViewedCrop();
}

function setupEventListeners(allCrops, container) {
    container.addEventListener('click', (event) => {
        const card = event.target.closest('.crop-card');
        if (card) {
            const cropId = card.dataset.id;
            const selectedCrop = allCrops.find(crop => crop.id === cropId);
            if (selectedCrop) {
                showModal(selectedCrop);
                localStorage.setItem('lastViewedCropId', cropId);
            }
        }
    });

    const modal = document.getElementById('crop-modal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target.classList.contains('close-button') || event.target === modal) {
                closeModal();
            }
        });
    }
}

function displayLastViewedCrop() {
    const lastViewedId = localStorage.getItem('lastViewedCropId');
    const lastViewedContainer = document.getElementById('last-viewed-crop'); 
    
    if (lastViewedId && lastViewedContainer) {
        getCropsData().then(crops => {
            const lastViewedCrop = crops.find(crop => crop.id === lastViewedId);
            if (lastViewedCrop) {
                lastViewedContainer.innerHTML = `
                    <h3>Last Viewed</h3>
                    <p>You recently viewed: <strong>${lastViewedCrop.name}</strong></p>
                `;
            }
        });
    }
}

initializeApp();