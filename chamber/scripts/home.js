document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    fetchMembersForSpotlight();
});

const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=5.3600&lon=-4.0083&appid=b1b15e88fa797225412429c1c50c122a1&units=metric';
const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=5.3600&lon=-4.0083&appid=b1b15e88fa797225412429c1c50c122a1&units=metric';
const membersURL = 'data/members.json';

async function fetchWeather() {
    try {
        // Fetch current weather
        const currentResponse = await fetch(weatherURL);
        if (!currentResponse.ok) throw Error(await currentResponse.text());
        const currentData = await currentResponse.json();
        
        // Fetch forecast
        const forecastResponse = await fetch(forecastURL);
        if (!forecastResponse.ok) throw Error(await forecastResponse.text());
        const forecastData = await forecastResponse.json();
        
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error("Weather Fetch Error:", error);
        displayFallbackWeather();
    }
}

function displayCurrentWeather(data) {
    const container = document.getElementById('current-weather-content');
    const iconCode = data.weather[0].icon;
    const desc = data.weather[0].description;
    
    container.innerHTML = `
        <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="${desc}" width="75" height="75">
        <p class="current-temp">${Math.round(data.main.temp)}°C</p>
        <p>${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} km/h</p>
    `;
}

function displayFallbackWeather() {
    document.getElementById('current-weather-content').innerHTML = `
        <p>Weather data unavailable</p>
    `;
    document.getElementById('forecast-content').innerHTML = `
        <p>Forecast data unavailable</p>
    `;
}

function displayForecast(data) {
    const container = document.getElementById('forecast-content');
    container.innerHTML = '';

    // Get forecast for next 3 days at noon
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        container.innerHTML += `
            <div class="forecast-day">
                <p><strong>${dayName}:</strong></p>
                <img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                <p>${Math.round(day.main.temp)}°C</p>
            </div>
        `;
    });
}

async function fetchMembersForSpotlight() {
    try {
        const response = await fetch(membersURL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Convert membership levels to text
        const membersWithTextLevels = data.members.map(member => {
            return {
                ...member,
                membershipLevel: getMembershipLevelText(member.membershipLevel)
            };
        });
        
        displaySpotlights(membersWithTextLevels);
    } catch (error) {
        console.error("Members Fetch Error:", error);
        displayFallbackSpotlights();
    }
}

function getMembershipLevelText(level) {
    switch(level) {
        case 1: return "Bronze";
        case 2: return "Silver";
        case 3: return "Gold";
        default: return "Basic";
    }
}

function displaySpotlights(members) {
    const container = document.getElementById('spotlight-cards');
    
    // Filter Gold and Silver members
    const qualifiedMembers = members.filter(member => {
        return member.membershipLevel === "Gold" || member.membershipLevel === "Silver";
    });
    
    // Select random members (max 3)
    const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());
    const selectedMembers = shuffled.slice(0, 3);
    
    if (selectedMembers.length === 0) {
        displayFallbackSpotlights();
        return;
    }
    
    container.innerHTML = selectedMembers.map(member => `
        <div class="spotlight-card">
            <h3>${member.name}</h3>
            <p class="membership-level ${member.membershipLevel.toLowerCase()}">${member.membershipLevel} Member</p>
            ${member.image ? `<img src="images/${member.image}" alt="${member.name}" loading="lazy">` : ''}
            <p class="description">${member.description}</p>
            <div class="contact-info">
                ${member.phone ? `<p><strong>Phone:</strong> ${member.phone}</p>` : ''}
                ${member.website ? `<p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>` : ''}
            </div>
        </div>
    `).join('');
}

function displayFallbackSpotlights() {
    const container = document.getElementById('spotlight-cards');
    container.innerHTML = `
        <div class="spotlight-card">
            <h3>Orange Ivory Coast</h3>
            <p class="membership-level gold">Gold Member</p>
            <p class="description">Leading telecommunications operator in Ivory Coast</p>
            <div class="contact-info">
                <p><strong>Phone:</strong> +225 27 21 23 10 10</p>
                <p><strong>Website:</strong> <a href="https://www.orange.ci" target="_blank">orange.ci</a></p>
            </div>
        </div>
        <div class="spotlight-card">
            <h3>NSIA Bank Ivory Coast</h3>
            <p class="membership-level silver">Silver Member</p>
            <p class="description">Financial group offering banking and insurance services</p>
            <div class="contact-info">
                <p><strong>Phone:</strong> +225 27 20 20 04 00</p>
                <p><strong>Website:</strong> <a href="https://nsiabanque.ci" target="_blank">nsiabanque.ci</a></p>
            </div>
        </div>
    `;
}