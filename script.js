document.addEventListener('DOMContentLoaded', function() {
    // Set the date for the eclipse
    const eclipseDate = new Date('April 8, 2024 13:27:00 CDT').getTime();

    // Initialize the map
    const map = L.map('eclipse-map').setView([39.8283, -98.5795], 4);

    // Add the tile layer (map style)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    // Eclipse path coordinates (approximate path of totality)
    const eclipsePath = [
        [27.8, -99.8], // Texas Entry
        [29.9, -98.5],
        [31.5, -97.2],
        [33.1, -95.9],
        [34.7, -94.6],
        [36.3, -93.3],
        [37.9, -92.0],
        [39.5, -90.7],
        [41.1, -89.4],
        [42.7, -88.1],
        [44.3, -86.8],
        [45.9, -85.5],
        [47.5, -84.2] // Exit through Maine
    ];

    // Draw the path of totality
    const pathLine = L.polyline(eclipsePath, {
        color: '#ff6f00',
        weight: 5,
        opacity: 0.8
    }).addTo(map);

    // Add a wider, semi-transparent line for partial eclipse
    const partialPath = L.polyline(eclipsePath, {
        color: '#ff6f00',
        weight: 50,
        opacity: 0.2
    }).addTo(map);

    // Add markers for major cities in the path
    const cities = [
        { name: "Austin, TX", coords: [30.2672, -97.7431] },
        { name: "Dallas, TX", coords: [32.7767, -96.7970] },
        { name: "Little Rock, AR", coords: [34.7465, -92.2896] },
        { name: "St. Louis, MO", coords: [38.6270, -90.1994] },
        { name: "Indianapolis, IN", coords: [39.7684, -86.1581] },
        { name: "Cleveland, OH", coords: [41.4993, -81.6944] },
        { name: "Buffalo, NY", coords: [42.8864, -78.8784] }
    ];

    cities.forEach(city => {
        L.marker(city.coords)
            .bindPopup(`<b>${city.name}</b><br>In path of totality`)
            .addTo(map);
    });

    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>Eclipse Path</strong></div>
            <div><span style="background: #ff6f00; display: inline-block; width: 20px; height: 3px; margin-right: 5px;"></span>Path of Totality</div>
            <div><span style="background: rgba(255,111,0,0.2); display: inline-block; width: 20px; height: 10px; margin-right: 5px;"></span>Partial Eclipse</div>
        `;
        return div;
    };
    legend.addTo(map);

    // Update countdown every second
    const countdown = document.getElementById('countdown');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eclipseDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown.innerHTML = `Time until eclipse: ${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            countdown.innerHTML = "The eclipse has begun!";
        }
    }

    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll-based animations
    const sections = document.querySelectorAll('section');
    
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    // Initial styles for sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Check scroll position on load and scroll
    window.addEventListener('scroll', checkScroll);
    checkScroll();
});
