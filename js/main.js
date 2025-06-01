document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica para Animaciones de Scroll Reveal ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(element => {
        scrollObserver.observe(element);
    });

    // --- Lógica para la Cabecera Adhesiva (Sticky Header) ---
    const headerContainer = document.getElementById('header-container');
    const mainHeader = document.querySelector('.main-header');
    
    if (mainHeader) {
        const stickyPoint = mainHeader.offsetTop;
        window.onscroll = function() {
            if (window.pageYOffset > stickyPoint) {
                headerContainer.classList.add('sticky-header');
            } else {
                headerContainer.classList.remove('sticky-header');
            }
        };
    }

    // --- Lógica para el Slider con JavaScript ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        const slidesContainer = sliderWrapper.querySelector('.slides');
        const slides = Array.from(slidesContainer.children);
        const nextButton = sliderWrapper.querySelector('.next-btn');
        const prevButton = sliderWrapper.querySelector('.prev-btn');
        const dotsContainer = sliderWrapper.querySelector('.slider-dots');

        let currentSlideIndex = 0;
        let slideInterval;
        const slideDuration = 5000;
        const animationDuration = 800; // Debe coincidir con la duración de la transición en CSS

        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.setAttribute('data-slide', index);
                if (index === 0) {
                    dot.classList.add('active-dot');
                }
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(dot => {
                dot.classList.remove('active-dot');
                if (parseInt(dot.getAttribute('data-slide')) === currentSlideIndex) {
                    dot.classList.add('active-dot');
                }
            });
        }
        
        function showSlide(newIndex, direction = 'next') {
            if (newIndex === currentSlideIndex && slides[newIndex]?.classList.contains('active-slide')) {
                 // Evitar re-animar si ya es el slide activo y no hay otra animación pendiente
                const isAnimating = Array.from(slides).some(s => 
                    s.classList.contains('slide-out-left') || 
                    s.classList.contains('slide-out-right') ||
                    s.classList.contains('slide-in-from-left') ||
                    s.classList.contains('slide-in-from-right')
                );
                if (!isAnimating) return;
            }

            const oldSlideIndex = currentSlideIndex;
            const oldSlide = slides[oldSlideIndex];
            const newSlide = slides[newIndex];

            if (!newSlide) return;

            slides.forEach(s => s.classList.remove('active-slide', 'slide-out-left', 'slide-out-right', 'slide-in-from-left', 'slide-in-from-right'));

            if (oldSlide && oldSlideIndex !== newIndex) {
                if (direction === 'next') {
                    oldSlide.classList.add('slide-out-left');
                } else { 
                    oldSlide.classList.add('slide-out-right');
                }
            }
            
            if (direction === 'next') {
                newSlide.classList.add('slide-in-from-right');
            } else { 
                newSlide.classList.add('slide-in-from-left');
            }

            void newSlide.offsetWidth;

            newSlide.classList.add('active-slide');
            
            currentSlideIndex = newIndex;
            updateDots();

            if (oldSlide && oldSlideIndex !== newIndex) {
                setTimeout(() => {
                    oldSlide.classList.remove('slide-out-left', 'slide-out-right');
                }, animationDuration);
            }
            setTimeout(() => {
                newSlide.classList.remove('slide-in-from-left', 'slide-in-from-right');
            }, animationDuration);
        }


        function next() {
            let nextIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(nextIndex, 'next');
        }

        function prev() {
            let prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            showSlide(prevIndex, 'prev');
        }

        function startSlideshow() {
            clearInterval(slideInterval);
            slideInterval = setInterval(next, slideDuration);
        }

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', () => {
                next();
                startSlideshow();
            });

            prevButton.addEventListener('click', () => {
                prev();
                startSlideshow();
            });
        }

        if (dotsContainer) {
            dotsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('dot')) {
                    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                    const direction = slideIndex > currentSlideIndex ? 'next' : 'prev';
                    showSlide(slideIndex, slideIndex === currentSlideIndex ? 'next' : direction);
                    startSlideshow();
                }
            });
        }
        
        sliderWrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderWrapper.addEventListener('mouseleave', startSlideshow);

        if (slides.length > 0) {
            createDots();
            // Inicializar el primer slide
            slides[0].classList.add('slide-in-from-right'); // Prepara para entrar
            void slides[0].offsetWidth; // Reflow
            slides[0].classList.add('active-slide'); // Activa y anima
            setTimeout(() => {
                 slides[0].classList.remove('slide-in-from-right');
            }, animationDuration);

            updateDots();
            startSlideshow();
        }
    }
});