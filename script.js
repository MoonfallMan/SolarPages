document.addEventListener('DOMContentLoaded', function() {
    // Create star field
    const starField = document.getElementById('star-field');
    const numberOfStars = 200;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random star properties
        const size = Math.random() * 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.setProperty('--twinkle-duration', (Math.random() * 3 + 1) + 's');
        
        starField.appendChild(star);
    }

    // Parallax effect for stars
    let lastX = 0;
    let lastY = 0;
    const parallaxStrength = 0.05;

    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * parallaxStrength;
        const moveY = (e.clientY - window.innerHeight / 2) * parallaxStrength;

        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const speed = parseFloat(star.style.width) * 0.5;
            star.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });

        lastX = moveX;
        lastY = moveY;
    });

    // Set the date for the eclipse
    const eclipseDate = new Date('April 8, 2024 13:27:00 CDT').getTime();

    // Add magnetic effect to timing cards
    const cards = document.querySelectorAll('.timing-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const tiltX = deltaY * 10;
            const tiltY = -deltaX * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
            card.style.boxShadow = `
                ${-deltaX * 20}px ${-deltaY * 20}px 30px rgba(255, 111, 0, 0.2),
                0 0 20px rgba(255, 111, 0, 0.3)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

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

    // Location checker functionality
    const checkLocationBtn = document.getElementById('check-location');
    const locationResult = document.getElementById('location-result');

    // Define the path of totality coordinates (simplified for demo)
    const pathCoordinates = [
        { lat: 27.8, lng: -99.8 },
        { lat: 29.9, lng: -98.5 },
        { lat: 31.5, lng: -97.2 },
        { lat: 33.1, lng: -95.9 },
        { lat: 34.7, lng: -94.6 },
        { lat: 36.3, lng: -93.3 },
        { lat: 37.9, lng: -92.0 },
        { lat: 39.5, lng: -90.7 },
        { lat: 41.1, lng: -89.4 },
        { lat: 42.7, lng: -88.1 },
        { lat: 44.3, lng: -86.8 },
        { lat: 45.9, lng: -85.5 },
        { lat: 47.5, lng: -84.2 }
    ];

    function isInPathOfTotality(lat, lng) {
        // Simplified check: if within 50km of the path
        return pathCoordinates.some(point => {
            const distance = getDistanceFromLatLonInKm(lat, lng, point.lat, point.lng);
            return distance < 50;
        });
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    checkLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            // Add loading animation
            locationResult.textContent = "Checking location...";
            locationResult.className = "location-result show";
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const inPath = isInPathOfTotality(latitude, longitude);
                    
                    // Add marker to map
                    L.marker([latitude, longitude])
                        .addTo(map)
                        .bindPopup('Your Location')
                        .openPopup();
                    
                    // Pan map to location
                    map.setView([latitude, longitude], 8);
                    
                    // Show result with animation
                    setTimeout(() => {
                        locationResult.className = `location-result show ${inPath ? 'in-path' : 'not-in-path'}`;
                        locationResult.innerHTML = inPath 
                            ? "🎉 Congratulations! You're in the path of totality! Get ready for an amazing show!"
                            : "You're not in the path of totality. Consider planning a trip to see this rare event!";
                    }, 500);
                },
                (error) => {
                    locationResult.className = "location-result show not-in-path";
                    locationResult.textContent = "Unable to get your location. Please check your browser settings.";
                }
            );
        } else {
            locationResult.className = "location-result show not-in-path";
            locationResult.textContent = "Geolocation is not supported by your browser.";
        }
    });

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

    // Add cursor trail effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    document.body.appendChild(cursor);

    const trail = document.createElement('div');
    trail.className = 'cursor-trail-glow';
    document.body.appendChild(trail);

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animate() {
        // Ease trailing effect
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();

    // Eclipse Simulator
    const progressSlider = document.getElementById('eclipse-progress');
    const playButton = document.getElementById('play-eclipse');
    const phaseText = document.getElementById('phase-text');
    const simMoon = document.querySelector('.sim-moon');
    const corona = document.querySelector('.corona');
    const simSun = document.querySelector('.sim-sun');
    let animationInterval;

    function updateEclipse(progress) {
        // Calculate moon position
        const startX = 150;
        const endX = -150;
        const x = startX + ((endX - startX) * (progress / 100));
        simMoon.style.transform = `translate(calc(-50% + ${x}px), -50%)`;

        // Update phase text and effects
        if (progress < 20) {
            phaseText.textContent = "First Contact - Partial Eclipse Begins";
            corona.classList.remove('visible');
        } else if (progress < 45) {
            phaseText.textContent = "Partial Eclipse Deepening";
            corona.classList.remove('visible');
        } else if (progress >= 45 && progress <= 55) {
            phaseText.textContent = "Total Eclipse - Diamond Ring Effect";
            corona.classList.add('visible');
        } else if (progress > 55 && progress < 80) {
            phaseText.textContent = "Partial Eclipse Ending";
            corona.classList.remove('visible');
        } else {
            phaseText.textContent = "Eclipse Complete";
            corona.classList.remove('visible');
        }

        // Update sun glow effect
        const coverage = Math.abs(50 - progress) / 50;
        const baseGlow = 20;
        const maxGlow = 60;
        const currentGlow = baseGlow + (coverage * (maxGlow - baseGlow));
        const glowColor = progress >= 45 && progress <= 55 ? '#ff4500' : '#ff6f00';
        simSun.style.boxShadow = `0 0 ${currentGlow}px ${glowColor}, 0 0 ${currentGlow * 1.5}px #ff9100`;
    }

    // Manual control with slider
    progressSlider.addEventListener('input', function() {
        const value = this.value;
        updateEclipse(parseFloat(value));
    });

    // Play/Pause animation
    playButton.addEventListener('click', function() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
            this.querySelector('.play-icon').textContent = '▶️';
            this.querySelector('span:last-child').textContent = 'Play Animation';
        } else {
            progressSlider.value = 0;
            updateEclipse(0);
            this.querySelector('.play-icon').textContent = '⏸️';
            this.querySelector('span:last-child').textContent = 'Pause Animation';

            let progress = 0;
            animationInterval = setInterval(() => {
                progress += 0.5;
                if (progress > 100) {
                    progress = 100;
                    clearInterval(animationInterval);
                    animationInterval = null;
                    this.querySelector('.play-icon').textContent = '▶️';
                    this.querySelector('span:last-child').textContent = 'Play Animation';
                }
                progressSlider.value = progress;
                updateEclipse(progress);
            }, 50);
        }
    });

    // Initialize eclipse position
    updateEclipse(0);
});
