
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

function setupEventListeners(allCrops) {
    const container = document.getElementById('crops-container');
    if (container) {
        container.addEventListener('click', (event) => {
            const button = event.target.closest('.more-info-btn');
            if (button) {
                const card = button.closest('.crop-card');
                const cropId = card.dataset.id;
                const selectedCrop = allCrops.find(crop => crop.id === cropId);
                if (selectedCrop) {
                    showModal(selectedCrop);
                }
            }
        });
    }

    const cropDetailModal = document.getElementById('crop-modal');
    if (cropDetailModal) {
        cropDetailModal.addEventListener('click', (event) => {
            if (event.target.classList.contains('close-button') || event.target === cropDetailModal) {
                closeModal();
            }
        });
    }
}

function setupInfoModal() {
    const modal = document.getElementById('info-modal');
    const triggerLink = document.getElementById('info-modal-trigger');
    const closeButton = modal.querySelector('.close-button');

    if (!modal || !triggerLink || !closeButton) return;

    triggerLink.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
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
    setupEventListeners(allCrops);
    setupInfoModal();
}

initializeApp();