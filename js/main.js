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

// Contact form handling
async function submitForm(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to: 'contact@wynagency.com.br'
    };

    try {
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = '...';

        const response = await fetch('https://api.wynagency.com.br/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showNotification('success', {
                pt: 'Mensagem enviada com sucesso!',
                en: 'Message sent successfully!',
                es: '¡Mensaje enviado con éxito!'
            });
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        showNotification('error', {
            pt: 'Erro ao enviar mensagem. Tente novamente.',
            en: 'Error sending message. Please try again.',
            es: 'Error al enviar el mensaje. Inténtalo de nuevo.'
        });
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

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

document.querySelector('.hero-stats')?.forEach(stat => observer.observe(stat));

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        transform: translateY(100px);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateY(0);
    }

    .notification.success {
        background-color: #00ff00;
    }

    .notification.error {
        background-color: #ff0000;
    }
`;
document.head.appendChild(style);

// Mobile Menu Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    
    console.log('Mobile Menu Button:', mobileMenuBtn);
    console.log('Nav Links:', navLinks);
    console.log('Close Menu Button:', closeMenuBtn);
    
    // Create overlay element if it doesn't exist
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        console.log('Created overlay element');
    }

    // Open menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            console.log('Mobile menu button clicked');
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close menu functions
    function closeMenu() {
        console.log('Closing menu');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close menu on close button click
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function(e) {
            console.log('Close button clicked');
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    // Close menu on overlay click
    overlay.addEventListener('click', function(e) {
        console.log('Overlay clicked');
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
    });

    // Handle menu link clicks
    const menuLinks = document.querySelectorAll('.nav-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Menu link clicked:', this.getAttribute('href'));
            e.preventDefault();
            closeMenu();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate the target position
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Smooth scroll to the target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            console.log('Escape key pressed');
            closeMenu();
        }
    });
}); 
