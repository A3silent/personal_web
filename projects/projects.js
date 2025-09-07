document.addEventListener('DOMContentLoaded', function() {
    const projectsData = {
        'silic2': [
            'silic2/silic2_1.png',
            'silic2/silic2_2.png'
        ],
        'vulkan-engine': [
            'vulkan-engine/ve_1.png',
            'vulkan-engine/ve_2.png',
            'vulkan-engine/ve_3.png'
        ],
        'astronomical': []
    };

    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card) => {
        const projectKey = card.dataset.project;
        const images = projectsData[projectKey];
        
        if (images && images.length > 0) {
            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'image-carousel';
            
            const carouselTrack = document.createElement('div');
            carouselTrack.className = 'carousel-track';
            
            images.forEach(imageSrc => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = 'Project screenshot';
                carouselTrack.appendChild(img);
            });
            
            images.forEach(imageSrc => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = 'Project screenshot';
                carouselTrack.appendChild(img);
            });
            
            carouselContainer.appendChild(carouselTrack);
            
            const projectTitle = card.querySelector('.project-title');
            projectTitle.insertAdjacentElement('afterend', carouselContainer);
            
            let isHovering = false;
            let animationId = null;
            let currentPosition = 0;
            
            function startAnimation() {
                if (!isHovering) return;
                
                currentPosition -= 1;
                const trackWidth = carouselTrack.scrollWidth / 2;
                
                if (Math.abs(currentPosition) >= trackWidth) {
                    currentPosition = 0;
                }
                
                carouselTrack.style.transform = `translateX(${currentPosition}px)`;
                animationId = requestAnimationFrame(startAnimation);
            }
            
            card.addEventListener('mouseenter', function() {
                carouselContainer.style.maxHeight = '200px';
                carouselContainer.style.opacity = '1';
                isHovering = true;
                startAnimation();
            });
            
            card.addEventListener('mouseleave', function() {
                carouselContainer.style.maxHeight = '0';
                carouselContainer.style.opacity = '0';
                isHovering = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                currentPosition = 0;
                carouselTrack.style.transform = 'translateX(0)';
            });
        }
    });
});