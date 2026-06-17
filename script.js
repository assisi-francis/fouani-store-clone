// script.js - Carousel Logic and UI Interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');

    function updateNavButtons() {
        if (prevBtn) {
            if (currentSlide === 0) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
        }
        
        if (nextBtn) {
            if (currentSlide === slides.length - 1) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }
    }

    function goToSlide(n) {
        if (n < 0 || n >= slides.length) return;
        
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        if (dots.length > 0) dots[currentSlide].classList.remove('active');
        
        // Update currentSlide
        currentSlide = n;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
        if (dots.length > 0) dots[currentSlide].classList.add('active');
        
        updateNavButtons();
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Initialize button states
    updateNavButtons();

    // Set up click handlers for buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!prevBtn.classList.contains('disabled')) {
                prevSlide();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!nextBtn.classList.contains('disabled')) {
                nextSlide();
            }
        });
    }

    // Set up click handlers for dots (if they exist)
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
    }


    // Add sticky class to header on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
        }
    });

    // Bottom Nav Tabs Scrolling
    const navLinksContainer = document.querySelector('.nav-links');
    const scrollLeftBtn = document.querySelector('.nav-scroll-btn.left-btn');
    const scrollRightBtn = document.querySelector('.nav-scroll-btn.right-btn');

    if (navLinksContainer && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            navLinksContainer.scrollBy({ left: -250, behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', () => {
            navLinksContainer.scrollBy({ left: 250, behavior: 'smooth' });
        });
    }

    // Sidebar Toggle Logic
    const allCategoriesBtn = document.querySelector('.all-categories');
    const sidebar = document.getElementById('categories-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (allCategoriesBtn && sidebar && sidebarOverlay && closeSidebarBtn) {
        allCategoriesBtn.addEventListener('click', openSidebar);
        closeSidebarBtn.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Sidebar Accordion Logic
    const sidebarDropdownHeaders = document.querySelectorAll('.sidebar-menu-header');
    sidebarDropdownHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const submenu = header.nextElementSibling;
            const icon = header.querySelector('.dropdown-icon');
            
            if (submenu) {
                submenu.classList.toggle('open');
            }
            if (icon) {
                icon.classList.toggle('open');
            }
        });
    });

    // Nav Dropdown Advanced Positioning Logic (Multiple Support)
    const navDropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
    
    navDropdownWrappers.forEach(wrapper => {
        const navDropdown = wrapper.querySelector('.nav-dropdown');
        if (!navDropdown) return;
        
        // Move dropdown to body so it escapes overflow: hidden
        document.body.appendChild(navDropdown);

        let hideTimeout;

        const positionDropdown = () => {
            const rect = wrapper.getBoundingClientRect();
            navDropdown.style.top = `${rect.bottom + window.scrollY + 10}px`; // 10px offset
            navDropdown.style.left = `${rect.left + window.scrollX}px`;
        };

        const showDropdown = () => {
            clearTimeout(hideTimeout);
            // Hide all other dropdowns first
            document.querySelectorAll('.nav-dropdown.active').forEach(dd => {
                if(dd !== navDropdown) dd.classList.remove('active');
            });
            positionDropdown();
            navDropdown.classList.add('active');
        };

        const hideDropdown = () => {
            hideTimeout = setTimeout(() => {
                if (!navDropdown.matches(':hover') && !wrapper.matches(':hover')) {
                    navDropdown.classList.remove('active');
                }
            }, 100);
        };

        // Hover events
        wrapper.addEventListener('mouseenter', showDropdown);
        wrapper.addEventListener('mouseleave', hideDropdown);
        navDropdown.addEventListener('mouseenter', showDropdown);
        navDropdown.addEventListener('mouseleave', hideDropdown);

        // Click events
        const navDropdownLink = wrapper.querySelector('a');
        if (navDropdownLink) {
            navDropdownLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (navDropdown.classList.contains('active')) {
                    navDropdown.classList.remove('active');
                } else {
                    showDropdown();
                }
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target) && !navDropdown.contains(e.target)) {
                navDropdown.classList.remove('active');
            }
        });

        // Hide on scroll to prevent floating dropdown
        window.addEventListener('scroll', () => navDropdown.classList.remove('active'));
        if (typeof navLinksContainer !== 'undefined' && navLinksContainer) {
            navLinksContainer.addEventListener('scroll', () => navDropdown.classList.remove('active'));
        }
    });

    // Featured Products Carousel
    const fpGrid     = document.getElementById('featuredGrid');
    const fpNavLeft  = document.getElementById('fpNavLeft');
    const fpNavRight = document.getElementById('fpNavRight');
    if (fpGrid && fpNavLeft && fpNavRight) {
        const scrollAmount = 167;
        fpNavLeft.addEventListener('click',  () => fpGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        fpNavRight.addEventListener('click', () => fpGrid.scrollBy({ left:  scrollAmount, behavior: 'smooth' }));
    }

    // Kitchen Small Appliances Carousel
    const kaGrid     = document.getElementById('kaGrid');
    const kaNavLeft  = document.getElementById('kaNavLeft');
    const kaNavRight = document.getElementById('kaNavRight');
    if (kaGrid && kaNavLeft && kaNavRight) {
        const scrollAmount = 167;
        kaNavLeft.addEventListener('click',  () => kaGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        kaNavRight.addEventListener('click', () => kaGrid.scrollBy({ left:  scrollAmount, behavior: 'smooth' }));
    }
});
