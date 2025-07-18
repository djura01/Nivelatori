document.addEventListener('DOMContentLoaded', () => {

    // --- ANIMACIJA LOGO TEKSTA U HEDERU (KOKAN NIVELATORI) ---
    const animatedLogoText = document.getElementById('animated-logo-text');

    if (animatedLogoText) {
        const letters = animatedLogoText.querySelectorAll('span');
        let currentLetterIndex = 0;
        let animationInterval;

        function animateLogoLetters() {
            letters.forEach(letter => letter.classList.remove('active-letter'));
            letters[currentLetterIndex].classList.add('active-letter');

            currentLetterIndex++;

            if (currentLetterIndex >= letters.length) {
                currentLetterIndex = 0;
            }
        }

        if (letters.length > 0) {
            animateLogoLetters(); 
            animationInterval = setInterval(animateLogoLetters, 200);
        }
    }

    // --- GENERALIZOVANA FUNKCIJA ZA TYPEWRITER EFEKAT ---
    function initializeTypewriter(elementId, textToType, speed = 70, loop = false, immediately = false) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let i = 0;
        let isDeleting = false;
        let currentTimeout;

        function type() {
            if (isDeleting) {
                if (i > 0) {
                    element.textContent = textToType.substring(0, i - 1);
                    i--;
                    currentTimeout = setTimeout(type, speed / 2);
                } else {
                    isDeleting = false;
                    element.classList.remove('typed');
                    element.textContent = ''; 
                    currentTimeout = setTimeout(type, 500);
                }
            } else {
                if (i < textToType.length) {
                    element.textContent += textToType.charAt(i);
                    i++;
                    currentTimeout = setTimeout(type, speed);
                } else {
                    element.classList.add('typed');
                    if (loop) {
                        isDeleting = true;
                        currentTimeout = setTimeout(type, 2000);
                    } else {
                        element.classList.add('typed-finished');
                    }
                }
            }
        }

        if (immediately) {
            element.classList.add('typed-started');
            type();
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !element.classList.contains('typed-started')) {
                        element.classList.add('typed-started');
                        type();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 }); // Vraćeno na 0.5, jer lokalno radi i ti to želiš
            observer.observe(element);
        }
    }

    // --- POZIVI ZA TYPEWRITER EFEKTE NA RAZLIČITIM STRANICAMA ---
    const currentPath = window.location.pathname;

    // Specijalni poziv za hero sekciju na index.html - UVEK SE POKREĆE ODMAH
    if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '') {
        initializeTypewriter('typewriter-text-hero', 'Kokan Nivelatori', 100, true, true);
    }

    // Ostali pozivi koriste Intersection Observer (immediately: false ili izostavljeno)
    if (document.getElementById('about-us-typewriter')) {
        initializeTypewriter('about-us-typewriter', 'Kokan Nivelatori je domaća firma posvećena razvoju i proizvodnji visokokvalitetnih sistema za nivelaciju pločica. Sa sedištem u srcu Srbije, ponosni smo što donosimo inovativna rešenja koja olakšavaju rad profesionalcima i majstorima, garantujući savršeno ravne površine svaki put. Naša priča počinje sa strašću prema preciznosti i željom da se tržištu ponudi domaći proizvod koji po kvalitetu parira svetskim standardima, a po ceni bude dostupan svima. Verujemo u snagu lokalne proizvodnje i podršku domaćoj ekonomiji, istovremeno težeći izvrsnosti u svakom detalju.', 30, false);
    }

    if (document.getElementById('work-system-description')) {
        initializeTypewriter('work-system-description', 'Pogledajte primere savršeno nivelisanih površina postignutih uz pomoć naših sistema.', 30, false);
    }

    if (currentPath.includes('pakovanja.html')) {
        initializeTypewriter('packaging-typewriter-text', 'Ovde možete videti naša pakovanja koja su prilagođena svim kupcima, kao i detaljnije informacije o komponentama našeg sistema za nivelisanje. Svako pakovanje je pažljivo osmišljeno da pruži maksimalnu efikasnost i jednostavnost upotrebe, bilo da ste profesionalac ili hobi majstor.', 50, false);
    }

    // --- ANIMACIJA PROGRESS BAROVA (NA INDEX.HTML) ---
    const animateProgressBarsLogic = () => {
        const progressBarItems = document.querySelectorAll('.skill-item');
        progressBarItems.forEach(item => {
            const fillElement = item.querySelector('.progress-bar-fill');
            const percentageElement = item.querySelector('.skill-percentage');

            if (fillElement && percentageElement) {
                const targetPercentage = parseInt(fillElement.getAttribute('data-percentage'));

                setTimeout(() => {
                    fillElement.style.width = `${targetPercentage}%`;
                }, 100);

                let currentPercentage = 0;
                const duration = 2000;
                const intervalTime = 10;
                const increment = targetPercentage / (duration / intervalTime);

                const counterInterval = setInterval(() => {
                    if (currentPercentage < targetPercentage) {
                        currentPercentage += increment;
                        if (currentPercentage > targetPercentage) {
                            currentPercentage = targetPercentage;
                        }
                        percentageElement.textContent = `${Math.round(currentPercentage)}%`;
                    } else {
                        clearInterval(counterInterval);
                    }
                }, intervalTime);
            }
        });
    };

    if (document.querySelector('.skills-section')) {
        const skillsSectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated-bars')) {
                    animateProgressBarsLogic();
                    entry.target.classList.add('animated-bars');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillsSectionObserver.observe(document.querySelector('.skills-section'));
    }

    // --- SLIDER ZA "RADOVI SA NAŠIM SISTEMOM" (NA SISTEM.HTML) ---
    const workImages = [
        'images/radovi1.jpg',
        'images/radovi2.jpg',
        'images/radovi3.jpg',
        'images/radovi4.jpg',
        'images/radovi5.jpg',
        'images/radovi6.jpg',
        'images/radovi7.jpg',
        'images/radovi8.jpg'
    ];

    let currentSlideIndex = 0; // Vraćeno na originalni naziv varijable

    const currentSlideImage = document.getElementById('currentSlideImage');
    const prevSlidePreview = document.getElementById('prevSlidePreview');
    const nextSlidePreview = document.getElementById('nextSlidePreview');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const workSliderBackground = document.getElementById('workSliderBackground');
    const sliderDotsContainer = document.getElementById('sliderDotsContainer');

    if (currentSlideImage && leftArrow && rightArrow && workSliderBackground && sliderDotsContainer) {
        function updateWorkSlider() {
            currentSlideImage.classList.remove('fade-in-active');
            currentSlideImage.classList.add('fade-out');

            setTimeout(() => {
                currentSlideImage.src = workImages[currentSlideIndex];
                currentSlideImage.classList.remove('fade-out');
                currentSlideImage.classList.add('fade-in-active');

                setTimeout(() => {
                    currentSlideImage.classList.remove('fade-in-active');
                }, 400);
            }, 300);

            workSliderBackground.style.backgroundImage = `url('${workImages[currentSlideIndex]}')`;

            const prevIndex = (currentSlideIndex - 1 + workImages.length) % workImages.length;
            prevSlidePreview.innerHTML = `<img src="${workImages[prevIndex]}" alt="Prethodni rad">`;

            const nextIndex = (currentSlideIndex + 1) % workImages.length;
            nextSlidePreview.innerHTML = `<img src="${workImages[nextIndex]}" alt="Sledeći rad">`;

            updateWorkDots();
        }

        function updateWorkDots() {
            sliderDotsContainer.innerHTML = '';
            workImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === currentSlideIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    currentSlideIndex = index;
                    updateWorkSlider();
                });
                sliderDotsContainer.appendChild(dot);
            });
        }

        leftArrow.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + workImages.length) % workImages.length;
            updateWorkSlider();
        });

        rightArrow.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % workImages.length;
            updateWorkSlider();
        });

        prevSlidePreview.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + workImages.length) % workImages.length;
            updateWorkSlider();
        });

        nextSlidePreview.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % workImages.length;
            updateWorkSlider();
        });

        if (currentPath.includes('sistem.html')) {
            updateWorkSlider();
        }
    }


    // --- SLIDER ZA PAKOVANJA (NA PAKOVANJA.HTML) ---
    const packagingImages = [
        { src: 'images/paket1.jpg', alt: 'Pakovanje 1', title: 'Osnovno pakovanje' },
        { src: 'images/paket2.jpg', alt: 'Pakovanje 2', title: 'Prošireno pakovanje' },
        { src: 'images/paket3.jpg', alt: 'Pakovanje 3', title: 'Profesionalno izdanje' },
        { src: 'images/paket4.jpg', alt: 'Pakovanje 4', title: 'Ekonomično pakovanje' },
        { src: 'images/paket5.jpg', alt: 'Pakovanje 5', title: 'Specijalno izdanje' },
        { src: 'images/paket6.jpg', alt: 'Pakovanje 6', title: 'Veliko pakovanje' } // <-- JEDINA DODATA LINIJA OVDE
    ];

    const packagingMainSlider = document.querySelector('.packaging-slider-main');
    const packagingLeftArrow = document.querySelector('.packaging-left-arrow');
    const packagingRightArrow = document.querySelector('.packaging-right-arrow');
    const packagingDotsContainer = document.querySelector('.packaging-dots-container');
    const packagingPreviewContainer = document.querySelector('.packaging-slider-previews');

    let currentPackagingIndex = 0;
    let packagingAutoSlideInterval;

    if (currentPath.includes('pakovanja.html')) {
        function initPackagingMainImages() {
            if (!packagingMainSlider) return;
            packagingImages.forEach((imgData, index) => {
                const img = document.createElement('img');
                img.src = imgData.src;
                img.alt = imgData.alt;
                img.classList.add('packaging-main-image');
                if (index === 0) {
                    img.classList.add('active');
                }
                packagingMainSlider.appendChild(img);
            });
        }

        function updatePackagingSlider() {
            const allMainImages = packagingMainSlider.querySelectorAll('.packaging-main-image');
            allMainImages.forEach(img => img.classList.remove('active'));
            allMainImages[currentPackagingIndex].classList.add('active');

            updatePackagingDots();
            updatePackagingPreviews();
        }

        function createPackagingDots() {
            if (!packagingDotsContainer) return;

            packagingDotsContainer.innerHTML = '';
            packagingImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === currentPackagingIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    currentPackagingIndex = index;
                    updatePackagingSlider();
                    resetPackagingAutoSlide();
                });
                packagingDotsContainer.appendChild(dot);
            });
        }

        function updatePackagingDots() {
            if (!packagingDotsContainer) return;
            const dots = packagingDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPackagingIndex);
            });
        }

        function updatePackagingPreviews() {
            if (!packagingPreviewContainer) return;

            packagingPreviewContainer.innerHTML = '';

            const totalImages = packagingImages.length;
            let previewIndices = [];

            const previewPositions = [
                'packaging-left-far',
                'packaging-left-near',
                'packaging-right-near',
                'packaging-right-far'
            ];

            const getIndex = (offset) => (currentPackagingIndex + offset + totalImages * 2) % totalImages;

            previewIndices.push(getIndex(-2));
            previewIndices.push(getIndex(-1));
            previewIndices.push(getIndex(1));
            previewIndices.push(getIndex(2));

            previewIndices.forEach((index, i) => {
                const imgData = packagingImages[index];
                const div = document.createElement('div');
                div.className = `packaging-preview-image ${previewPositions[i]}`;
                div.setAttribute('data-index', index);
                div.innerHTML = `<img src="${imgData.src}" alt="${imgData.alt}" title="${imgData.title}">`;
                div.addEventListener('click', () => {
                    currentPackagingIndex = index;
                    updatePackagingSlider();
                    resetPackagingAutoSlide();
                });
                packagingPreviewContainer.appendChild(div);
            });
        }

        if (packagingLeftArrow) {
            packagingLeftArrow.addEventListener('click', () => {
                currentPackagingIndex = (currentPackagingIndex - 1 + packagingImages.length) % packagingImages.length;
                updatePackagingSlider();
                resetPackagingAutoSlide();
            });
        }

        if (packagingRightArrow) {
            packagingRightArrow.addEventListener('click', () => {
                currentPackagingIndex = (currentPackagingIndex + 1) % packagingImages.length;
                updatePackagingSlider();
                resetPackagingAutoSlide();
            });
        }

        function startPackagingAutoSlide() {
            packagingAutoSlideInterval = setInterval(() => {
                currentPackagingIndex = (currentPackagingIndex + 1) % packagingImages.length;
                updatePackagingSlider();
            }, 4000);
        }

        function resetPackagingAutoSlide() {
            clearInterval(packagingAutoSlideInterval);
            startPackagingAutoSlide();
        }

        if (packagingPreviewContainer) {
            packagingPreviewContainer.addEventListener('mouseenter', () => clearInterval(packagingAutoSlideInterval));
            packagingPreviewContainer.addEventListener('mouseleave', resetPackagingAutoSlide);
        }
        if (packagingMainSlider) {
            packagingMainSlider.addEventListener('mouseenter', () => clearInterval(packagingAutoSlideInterval));
            packagingMainSlider.addEventListener('mouseleave', resetPackagingAutoSlide);
        }

        initPackagingMainImages();
        createPackagingDots();
        updatePackagingSlider();
        startPackagingAutoSlide();
    }


    // --- OPŠTE FUNKCIONALNOSTI ---

    // Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Intersection Observer za scroll animacije (fade-in efekti)
    const fadeInElements = document.querySelectorAll('.fade-in, .fade-in-up, .card-move-up');

    const generalObserverOptions = {
        root: null,
        rootMargin: '0px', // Vraćeno na 0px, bez dodatne margine
        threshold: 0 // <-- JEDINA PROMENA OVDE! Postavljeno na 0
    };

    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, generalObserverOptions);

    // Filter elements da isključi 'typewriter-text-hero' ako postoji, jer se on pokreće bez observera
    fadeInElements.forEach(el => {
        if (el.id !== 'typewriter-text-hero') {
            generalObserver.observe(el);
        }
    });

    // Header background change on scroll
    const header = document.querySelector('.main-header');
    const headerOverlay = document.querySelector('.header-overlay');

    if (header && headerOverlay) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                headerOverlay.style.backdropFilter = 'blur(10px) brightness(0.5)';
            } else {
                header.style.backgroundColor = 'transparent';
                headerOverlay.style.backdropFilter = 'blur(5px) brightness(1)';
            }
        });
    }

    // --- FUNKCIONALNOST KONTAKT FORME (ZA KONTAKT.HTML) ---
    const contactForm = document.getElementById('contactForm');
    const formStatusMessage = document.getElementById('formStatusMessage');

    if (contactForm && formStatusMessage) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            formStatusMessage.textContent = '';
            formStatusMessage.className = 'form-status-message';

            formStatusMessage.textContent = 'Šaljem poruku...';
            formStatusMessage.classList.add('loading');

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatusMessage.textContent = 'Vaša poruka je uspešno poslata! Hvala Vam.';
                    formStatusMessage.classList.remove('loading');
                    formStatusMessage.classList.add('success');
                    contactForm.reset();

                    setTimeout(() => {
                        formStatusMessage.classList.remove('success');
                        formStatusMessage.textContent = '';
                    }, 5000);
                } else {
                    const data = await response.json();
                    let errorMessage = 'Došlo je do greške prilikom slanja poruke. Molimo pokušajte ponovo.';

                    if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                        errorMessage = data.errors.map(error => error.message).join(', ');
                    } else if (data && data.error) {
                        errorMessage = data.error;
                    }

                    formStatusMessage.textContent = errorMessage;
                    formStatusMessage.classList.remove('loading');
                    formStatusMessage.classList.add('error');

                    setTimeout(() => {
                        formStatusMessage.classList.remove('error');
                        formStatusMessage.textContent = '';
                    }, 5000);
                }
            } catch (error) {
                formStatusMessage.textContent = 'Greška pri povezivanju. Proverite internet konekciju i pokušajte ponovo.';
                formStatusMessage.classList.remove('loading');
                formStatusMessage.classList.add('error');
                setTimeout(() => {
                    formStatusMessage.classList.remove('error');
                    formStatusMessage.textContent = '';
                }, 5000);
                console.error('Fetch error:', error);
            }
        });
    }

    // --- Nova funkcionalnost: Animacija slova u naslovu i telefonska ikona ---
    const contactTitleElement = document.getElementById('contactTitle');
    if (contactTitleElement) {
        // Logika za animaciju slova je sada samo CSS na hover, tako da JS ne treba ovde.
        // Ali ako želiš neke složenije JS animacije (npr. da se pokrene pri skrolovanju),
        // to bi išlo ovde. Za sada je CSS dovoljan.
    }

    const phoneIcon = document.getElementById('phoneIcon');
    const phoneNumbersContainer = document.getElementById('phoneNumbers');
    let phoneNumbersTimeout;

    if (phoneIcon && phoneNumbersContainer) {
        phoneIcon.addEventListener('click', () => {
            phoneIcon.classList.remove('ringing');
            clearTimeout(phoneNumbersTimeout);

            if (phoneNumbersContainer.classList.contains('active')) {
                phoneNumbersContainer.classList.remove('active');
            } else {
                phoneNumbersContainer.classList.add('active');
                phoneIcon.classList.add('ringing');
                setTimeout(() => {
                    phoneIcon.classList.remove('ringing');
                }, 1200);

                phoneNumbersTimeout = setTimeout(() => {
                    phoneNumbersContainer.classList.remove('active');
                }, 8000);
            }
        });

        document.addEventListener('click', (event) => {
            if (!phoneNumbersContainer.contains(event.target) && !phoneIcon.contains(event.target)) {
                phoneNumbersContainer.classList.remove('active');
                phoneIcon.classList.remove('ringing');
                clearTimeout(phoneNumbersTimeout);
            }
        });

        phoneNumbersContainer.addEventListener('mouseenter', () => {
            clearTimeout(phoneNumbersTimeout);
        });

        phoneNumbersContainer.addEventListener('mouseleave', () => {
            phoneNumbersTimeout = setTimeout(() => {
                phoneNumbersContainer.classList.remove('active');
            }, 5000);
        });
    }

}); // Kraj document.addEventListener('DOMContentLoaded', ...)