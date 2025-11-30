
        // Navigation scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.toggle('active');
        }

        // Smooth scroll to section
        function scrollToSection(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                document.getElementById('mobileMenu').classList.remove('active');
            }
        }

        // Scroll to top
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Form submission
        function handleSubmit(event) {
            emailjs.init("YOUR_PUBLIC_KEY");
        event.preventDefault();

        const params = {
            from_name: 
                document.getElementById('firstName').value + " " + 
                document.getElementById('lastName').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
            .then(() => {
                alert("Message sent successfully!");
                event.target.reset();
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                alert("Failed to send message. Try again later.");
            });
    }

    /* ========================
       9. Initialize on DOM load
       ========================= */
    document.addEventListener('DOMContentLoaded', function () {
        createParticles();
        initScrollAnimations();
    });

        // Set current year in footer
        document.getElementById('year').textContent = new Date().getFullYear();

        // Live Background Particle Effect
        function createParticles() {
            const liveBg = document.getElementById('liveBg');
            const particleCount = 15;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random size
                const size = Math.random() * 60 + 20;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random position
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Random animation duration and delay
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${delay}s`;
                
                liveBg.appendChild(particle);
            }
        }

        // Scrolling Animation Observer
        function initScrollAnimations() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            // Observe all elements with animation classes
            const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
            animatedElements.forEach(el => {
                observer.observe(el);
            });
        }

        // Initialize everything when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            initScrollAnimations();
        });
