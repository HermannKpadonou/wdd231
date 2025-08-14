function initializeMap() {
    
    const mapboxApiKey = 'pk.eyJ1Ijoia3BhZG9ub3VoIiwiYSI6ImNtZWJ6ZHM3bDByYWYyaXF2enljdzltcGkifQ.s1Vxwv_IBck-AMf_mSd4PA'; 

    if (!mapboxApiKey || !mapboxApiKey.startsWith('pk.')) {
        console.error("Map configuration error: Please provide a valid Mapbox Public Token starting with 'pk.'.");
        document.getElementById('workshop-map-container').innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Map configuration error. Please check the console.</p>';
        return;
    }

    
    const departmentCapitals = [
        { 
            name: "Agboville", region: "Agnéby-Tiassa", coords: [5.9329, -4.2163],
            shopInfo: { specialty: "Improved cassava and plantain seedlings", address: "Rue des Planteurs, Agboville", phone: "+225 07 11 22 33 44", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Tiassalé", region: "Agnéby-Tiassa", coords: [5.8978, -4.8239],
            shopInfo: { specialty: "Small agricultural equipment and irrigation", address: "Avenue du Bandama, Tiassalé", phone: "+225 07 22 33 44 55", hours: "08:00 AM - 05:30 PM" } 
        },
        { 
            name: "Touba", region: "Bafing", coords: [8.2833, -7.6833],
            shopInfo: { specialty: "Savannah crop consulting", address: "Route de Man, Touba", phone: "+225 07 33 44 55 66", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Boundiali", region: "Bagoué", coords: [9.5194, -6.4867],
            shopInfo: { specialty: "Cotton and cashew cooperative", address: "Place de l'Indépendance, Boundiali", phone: "+225 07 44 55 66 77", hours: "07:30 AM - 05:00 PM" } 
        },
        { 
            name: "Yamoussoukro", region: "Bélier", coords: [6.8206, -5.2768],
            shopInfo: { specialty: "Research center for yams and tubers", address: "Quartier des Lacs, Yamoussoukro", phone: "+225 07 55 66 77 88", hours: "08:00 AM - 05:00 PM" } 
        },
        { 
            name: "Didiévi", region: "Bélier", coords: [7.1436, -4.9128],
            shopInfo: { specialty: "Organic fertilizers and composting", address: "City Center, Didiévi", phone: "+225 07 66 77 88 99", hours: "08:30 AM - 06:00 PM" } 
        },
        { 
            name: "Mankono", region: "Béré", coords: [8.0614, -6.1903],
            shopInfo: { specialty: "Corn and sorghum cultivation", address: "Main Street, Mankono", phone: "+225 07 77 88 99 00", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Bouna", region: "Bounkani", coords: [9.2694, -2.9953],
            shopInfo: { specialty: "Livestock products and fodder crops", address: "Near Comoé National Park, Bouna", phone: "+225 07 88 99 00 11", hours: "07:30 AM - 04:30 PM" } 
        },
        { 
            name: "Guiglo", region: "Cavally", coords: [6.5417, -7.4914],
            shopInfo: { specialty: "Cocoa and rubber tree nursery", address: "West Exit, Guiglo", phone: "+225 07 99 00 11 22", hours: "08:00 AM - 05:00 PM" } 
        },
        { 
            name: "Taï", region: "Cavally", coords: [5.8725, -7.4611],
            shopInfo: { specialty: "Sustainable agriculture and agroforestry", address: "Near Taï Park, Taï", phone: "+225 07 00 11 22 33", hours: "09:00 AM - 04:00 PM" } 
        },
        { 
            name: "Minignan", region: "Folon", coords: [9.6167, -7.5167],
            shopInfo: { specialty: "Sahelian crops and water management", address: "Shopping Center, Minignan", phone: "+225 07 12 34 56 78", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Bouaké", region: "Gbêkê", coords: [7.6895, -5.0298],
            shopInfo: { specialty: "Large market for seeds and tools", address: "Industrial Zone, Bouaké", phone: "+225 07 23 45 67 89", hours: "08:00 AM - 07:00 PM" } 
        },
        { 
            name: "Sassandra", region: "Gbôklé", coords: [4.9525, -6.0853],
            shopInfo: { specialty: "Cash crops and fishery products", address: "Old Port, Sassandra", phone: "+225 07 34 56 78 90", hours: "08:00 AM - 05:30 PM" } 
        },
        { 
            name: "Gagnoa", region: "Gôh", coords: [6.1319, -5.9506],
            shopInfo: { specialty: "Cocoa and Coffee Cooperative", address: "Commerce District, Gagnoa", phone: "+225 07 45 67 89 01", hours: "07:30 AM - 06:00 PM" } 
        },
        { 
            name: "Bondoukou", region: "Gontougo", coords: [8.0397, -2.8000],
            shopInfo: { specialty: "Cashew nut processing", address: "Route de Soko, Bondoukou", phone: "+225 07 56 78 90 12", hours: "08:00 AM - 05:00 PM" } 
        },
        { 
            name: "Dabou", region: "Grands-Ponts", coords: [5.3261, -4.3792],
            shopInfo: { specialty: "Market gardening and oil palm", address: "Lagune Ebrié, Dabou", phone: "+225 07 67 89 01 23", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Duékoué", region: "Guémon", coords: [6.7456, -7.3517],
            shopInfo: { specialty: "Coffee-cocoa collection point", address: "Main Crossroads, Duékoué", phone: "+225 07 78 90 12 34", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Katiola", region: "Hambol", coords: [8.1386, -5.1011],
            shopInfo: { specialty: "Tamarind pottery and local food crops", address: "Artisanal Center, Katiola", phone: "+225 07 89 01 23 45", hours: "09:00 AM - 05:00 PM" } 
        },
        { 
            name: "Daloa", region: "Haut-Sassandra", coords: [6.8773, -6.4503],
            shopInfo: { specialty: "Training in good agricultural practices (cocoa)", address: "Route d'Issia, Daloa", phone: "+225 07 90 12 34 56", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Daoukro", region: "Iffou", coords: [7.0583, -3.9631],
            shopInfo: { specialty: "Rubber and yam cultivation", address: "Place Henri Konan Bédié, Daoukro", phone: "+225 07 01 23 45 67", hours: "08:30 AM - 05:30 PM" } 
        },
        { 
            name: "Abengourou", region: "Indénié-Djuablin", coords: [6.7297, -3.4964],
            shopInfo: { specialty: "Cocoa bean processing", address: "Quartier Agnikro, Abengourou", phone: "+225 07 11 23 45 67", hours: "08:00 AM - 05:00 PM" } 
        },
        { 
            name: "Odienné", region: "Kabadougou", coords: [9.5058, -7.5644],
            shopInfo: { specialty: "Locust control and millet seeds", address: "Near the Great Mosque, Odienné", phone: "+225 07 22 34 56 78", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Divo", region: "Lôh-Djiboua", coords: [5.8373, -5.3572],
            shopInfo: { specialty: "Agricultural machinery and maintenance", address: "Commercial Zone, Divo", phone: "+225 07 33 45 67 89", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Bouaflé", region: "Marahoué", coords: [6.9897, -5.7442],
            shopInfo: { specialty: "Fish farming and associated crops", address: "Kossou Lakeside, Bouaflé", phone: "+225 07 44 56 78 90", hours: "09:00 AM - 05:00 PM" } 
        },
        { 
            name: "Adzopé", region: "La Mé", coords: [6.1056, -3.8619],
            shopInfo: { specialty: "Sale of organic phytosanitary products", address: "Route d'Abidjan, Adzopé", phone: "+225 07 55 67 89 01", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Bongouanou", region: "Moronou", coords: [6.6525, -4.2042],
            shopInfo: { specialty: "Cassava processing workshop", address: "Residential District, Bongouanou", phone: "+225 07 66 78 90 12", hours: "08:30 AM - 05:30 PM" } 
        },
        { 
            name: "Dimbokro", region: "N'Zi", coords: [6.6475, -4.7058],
            shopInfo: { specialty: "Green manures and legumes", address: "Near the N'Zi bridge, Dimbokro", phone: "+225 07 77 89 01 23", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Soubré", region: "Nawa", coords: [5.7861, -6.6083],
            shopInfo: { specialty: "Cocoa-Forest training center", address: "Route du Barrage, Soubré", phone: "+225 07 88 90 12 34", hours: "08:00 AM - 05:00 PM" } 
        },
        { 
            name: "Korhogo", region: "Poro", coords: [9.4586, -5.6296],
            shopInfo: { specialty: "Senufo crafts and traditional crops", address: "Artisans' Village, Korhogo", phone: "+225 07 99 01 23 45", hours: "09:00 AM - 06:00 PM" } 
        },
        { 
            name: "San-Pédro", region: "San-Pédro", coords: [4.7485, -6.6363],
            shopInfo: { specialty: "Logistics for rubber and cocoa export", address: "Port Area, San-Pédro", phone: "+225 07 00 12 34 56", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Aboisso", region: "Sud-Comoé", coords: [5.4692, -3.2078],
            shopInfo: { specialty: "Pineapple and banana cultivation", address: "Route d'Ayamé, Aboisso", phone: "+225 07 12 23 45 67", hours: "08:00 AM - 05:30 PM" } 
        },
        { 
            name: "Ferkessédougou", region: "Tchologo", coords: [9.5969, -5.2047],
            shopInfo: { specialty: "Sugar and mango processing", address: "Sucaf, Ferkessédougou", phone: "+225 07 23 34 56 78", hours: "07:30 AM - 05:00 PM" } 
        },
        { 
            name: "Man", region: "Tonkpi", coords: [7.4125, -7.5538],
            shopInfo: { specialty: "Mountain coffee, cocoa, and food crops", address: "Route des 18 Montagnes, Man", phone: "+225 07 34 45 67 89", hours: "08:00 AM - 06:00 PM" } 
        },
        { 
            name: "Séguéla", region: "Worodougou", coords: [7.9619, -6.6719],
            shopInfo: { specialty: "Research on cashews and shea butter", address: "City Center, Séguéla", phone: "+225 07 45 56 78 90", hours: "08:00 AM - 05:00 PM" } 
        },
        { 
            name: "Abidjan", region: "Autonomous District", coords: [5.3600, -4.0083],
            shopInfo: { specialty: "Main store and urban farming", address: "Plateau, Avenue Franchet d'Esperey", phone: "+225 07 56 67 89 01", hours: "09:00 AM - 07:00 PM" } 
        }
    ];

    const initialCoords = [7.539989, -5.547081];
    const map = L.map('workshop-map-container').setView(initialCoords, 7);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OSM</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/outdoors-v12',
        accessToken: mapboxApiKey
    }).addTo(map);

    
    departmentCapitals.forEach(capital => {
        const marker = L.marker(capital.coords).addTo(map);
        marker.bindPopup(`
            <div class="map-popup">
                <h3>Agri-Terroir Shop - ${capital.name}</h3>
                <p><strong>Region:</strong> ${capital.region}</p>
                <hr>
                <ul>
                    <li><strong>Specialty:</strong> ${capital.shopInfo.specialty}</li>
                    <li><strong>Address:</strong> ${capital.shopInfo.address}</li>
                    <li><strong>Contact:</strong> ${capital.shopInfo.phone}</li>
                    <li><strong>Hours:</strong> ${capital.shopInfo.hours}</li>
                </ul>
            </div>
        `);
    });
}

document.addEventListener('DOMContentLoaded', initializeMap);