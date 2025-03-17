        // AOS initialization
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
});
// Language handling
function changeLanguage(lang) {
    // Update active button
    document.querySelectorAll('.language-selector button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === lang) {
            btn.classList.add('active');
        }
    });

    // Update all translatable elements
    document.querySelectorAll('[data-' + lang + ']').forEach(element => {
        element.textContent = element.getAttribute('data-' + lang);
    });

    // Store language preference
    localStorage.setItem('preferred-language', lang);
}

// Load preferred language
document.addEventListener('DOMContentLoaded', () => {
    const preferredLanguage = localStorage.getItem('preferred-language') || 'pt';
    changeLanguage(preferredLanguage);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});



// Notification system
function showNotification(type, messages) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Get current language
    const currentLang = localStorage.getItem('preferred-language') || 'pt';
    notification.textContent = messages[currentLang];

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Number animation for statistics
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50; // Adjust for animation speed
        
        const updateNumber = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        updateNumber();
    });
}

// Trigger number animation when stats are in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
