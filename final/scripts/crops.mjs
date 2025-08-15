import { getCropsData } from './module.mjs';
import { displayCrops, showModal, closeModal } from './output.mjs';

function filterCropsForCurrentMonth(allCrops) {
    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    
    return {
        monthName: now.toLocaleString('en-US', { month: 'long' }),
        filteredCrops: allCrops.filter(crop => {
            return crop.growing_calendar.planting.includes(currentMonth) || 
                   crop.growing_calendar.harvest.includes(currentMonth);
        })
    };
}

function setupEventListeners(allCrops) {
    const container = document.getElementById('seasonal-crops-container') || 
                     document.getElementById('crops-container');
    
    if (container) {
        container.addEventListener('click', (event) => {
            const button = event.target.closest('.more-info-btn');
            if (button) {
                const card = button.closest('.crop-card');
                const cropId = card.dataset.id;
                const selectedCrop = allCrops.find(crop => crop.id === cropId);
                if (selectedCrop) showModal(selectedCrop);
            }
        });
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-button') || 
            event.target.classList.contains('modal')) {
            closeModal();
        }
    });

    setupFilterButtons(allCrops);
}

function setupFilterButtons(allCrops) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
            const container = document.getElementById('seasonal-crops-container');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (filter === 'all') {
                displayCrops(allCrops, container);
                return;
            }

            const filteredCrops = allCrops.filter(crop => {
                if (filter === 'planting') {
                    return crop.growing_calendar.planting.includes(currentMonth);
                } else if (filter === 'harvest') {
                    return crop.growing_calendar.harvest.includes(currentMonth);
                }
                return false;
            });

            displayCrops(filteredCrops, container);
        });
    });
}

async function initializeApp() {
    try {
        const allCrops = await getCropsData();
        if (!allCrops || allCrops.length === 0) {
            throw new Error('No crops data available');
        }

        const isHomePage = window.location.pathname.endsWith('/') || 
                         window.location.pathname.endsWith('index.html');
        
        const container = isHomePage 
            ? document.getElementById('seasonal-crops-container')
            : document.getElementById('crops-container');

        if (!container) return;

        if (isHomePage) {
            const { monthName, filteredCrops } = filterCropsForCurrentMonth(allCrops);
            const titleElement = document.getElementById('seasonal-title');
            if (titleElement) {
                titleElement.textContent = `Seasonal Crops - ${monthName}`;
            }
            displayCrops(filteredCrops, container);
        } else {
            displayCrops(allCrops, container);
        }

        setupEventListeners(allCrops);
    } catch (error) {
        console.error('App initialization failed:', error);
        const container = document.getElementById('seasonal-crops-container') || 
                         document.getElementById('crops-container');
        if (container) {
            container.innerHTML = '<p class="error-message">Failed to load crop data. Please try again later.</p>';
        }
    }
}

initializeApp();