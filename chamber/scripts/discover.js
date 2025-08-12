document.addEventListener('DOMContentLoaded', () => {

    const visitMessageElement = document.getElementById('visit-message');
    const lastVisit = localStorage.getItem('lastVisitDate');
    const now = Date.now();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    if (!lastVisit) {
        visitMessageElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = now - lastVisit;
        const daysDifference = Math.floor(timeDifference / MS_PER_DAY);

        if (daysDifference < 1) {
            visitMessageElement.textContent = "Back so soon! Awesome!";
        } else {
            const dayText = daysDifference === 1 ? "day" : "days";
            visitMessageElement.textContent = `You last visited ${daysDifference} ${dayText} ago.`;
        }
    }
    localStorage.setItem('lastVisitDate', now);


    const gallery = document.querySelector('.discover-gallery');
    const placesURL = 'data/discover.json';


    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalAddress = document.getElementById('modal-address');
    const modalPrice = document.getElementById('modal-price');
    const modalTransportation = document.getElementById('modal-transportation');

    function openModal(place) {
        modalTitle.textContent = place.name;
        modalDescription.textContent = place.description;
        modalAddress.innerHTML = `<strong>Adresse :</strong> ${place.address}`;
        modalPrice.innerHTML = `<strong>Prix :</strong> ${place.price}`;
        modalTransportation.innerHTML = `<strong>Transport :</strong> ${place.transportation}`;
        modalOverlay.classList.remove('modal-hidden');
    }

    function closeModal() {
        modalOverlay.classList.add('modal-hidden');
    }

    modalCloseBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('modal-hidden')) {
            closeModal();
        }
    });

    function createPlaceCard(place) {
        const card = document.createElement('section');
        const title = document.createElement('h2');
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const address = document.createElement('address');
        const button = document.createElement('button');

        title.textContent = place.name;
        image.setAttribute('src', place.image);
        image.setAttribute('alt', `Image de ${place.name}`);
        image.setAttribute('loading', 'lazy');
        address.textContent = place.address;

        button.textContent = 'Learn More';
        button.className = 'learn-more-btn';

        button.addEventListener('click', () => {
            openModal(place);
        });

        figure.appendChild(image);
        card.appendChild(title);
        card.appendChild(figure);
        card.appendChild(address);
        card.appendChild(button);

        return card;
    }

    function displayPlaces(places) {
        gallery.innerHTML = '';
        places.forEach(place => {
            const card = createPlaceCard(place);
            gallery.appendChild(card);
        });
    }

    async function getPlaces() {
        try {
            const response = await fetch(placesURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayPlaces(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            gallery.innerHTML = '<p>Désolé, les attractions n\'ont pas pu être chargées pour le moment.</p>';
        }
    }

    getPlaces();
});