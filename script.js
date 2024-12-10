document.addEventListener('DOMContentLoaded', function() {
    // Set the date for the eclipse
    const eclipseDate = new Date('April 8, 2024 13:27:00 CDT').getTime();

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
