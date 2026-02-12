// AFFICHER LES PAGES
// Fonction générique pour charger le contenu d'une page et l'insérer dans un élément
function loadContent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error(`Erreur lors du chargement du contenu de ${url}:`, error));
}

// Charger le contenu pour chaque section
loadContent('home.html', 'main_content');
loadContent('about_me.html', 'about_content');
loadContent('projects.html', 'projects_content');
loadContent('skills.html', 'skills_content');
loadContent('certifications.html', 'certifications_content');
loadContent('experience.html', 'experience_content');
// Derniere page
loadContent('green.html', 'last_page_content');


// Charger le contenu pour chaque modal
loadContent('pages/taln.html', 'popup_taln');
loadContent('pages/genetique.html', 'popup_genetique');
loadContent('pages/eventum.html', 'popup_eventum');
loadContent('pages/azul.html', 'popup_azul');
loadContent('pages/multi_agents.html', 'popup_multi_agents');
loadContent('pages/exp_biomerieux.html', 'popup_exp_biomerieux');
loadContent('pages/exp_dps.html', 'popup_exp_dps');
loadContent('pages/exp_efor.html', 'popup_exp_efor');
loadContent('pages/exp_international.html', 'popup_exp_international');





// Extention de hr

// Observer les mutations du DOM
const observer = new MutationObserver((mutationsList, observer) => {
    const hrElement = document.getElementById('animated-hr');
    if (hrElement) {
        setTimeout(() => {
            hrElement.classList.add('expand');
        }, 500); // Ajoute un délai avant de déclencher l'animation (1s ici)
        observer.disconnect(); // Arrêter d'observer une fois que l'élément est trouvé
    }
});

// Démarrer l'observation sur le document entier
observer.observe(document.body, { childList: true, subtree: true });

// ANNIMATION TRIANGLES (FOND PAGE PRINCIPALE)
window.onload = () => {
    const triangles = document.querySelectorAll('.triangle');
    const container = document.getElementById('about_content');
    
    if (container) {
        let lastMouseX = 0;
        let lastMouseY = 0;
        let mouseSpeedX = 0;
        let mouseSpeedY = 0;
        let mouseMoving = false;
        let mouseMoveTimeout;
        let firstMove = false; // Flag pour éviter le premier calcul de mouvement

        // Initialiser les coordonnées de la souris
        window.addEventListener('mousemove', (event) => {
            if (!firstMove) {
                // Ne fait rien sur le premier mouvement pour éviter la téléportation
                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
                firstMove = true; // Active les mouvements suivants
                return;
            }

            const deltaX = event.clientX - lastMouseX;
            const deltaY = event.clientY - lastMouseY;

            mouseSpeedX = deltaX * 0.05;
            mouseSpeedY = deltaY * 0.05;

            lastMouseX = event.clientX;
            lastMouseY = event.clientY;

            mouseMoving = true;

            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                mouseMoving = false;
            }, 100);
        });

        triangles.forEach((triangle, index) => {
            const radius = 100 + index * 20;
            const baseSpeed = 0.01 + (index * 0.002);
            const direction = index % 2 === 0 ? 1 : -1; // Alterne entre +1 et -1 en fonction de l'index
            let angle = index * Math.PI / 4; // Définir un angle initial basé sur l'index, ici 45° entre chaque triangle

            // Enregistrer la position initiale du triangle
            const initialTop = parseFloat(getComputedStyle(triangle).top);
            const initialLeft = parseFloat(getComputedStyle(triangle).left);

            function animate() {
                if (mouseMoving) {
                    angle += (mouseSpeedX + mouseSpeedY) * 0.05 * direction;

                    // Calculer la nouvelle position en restant dans les limites du conteneur
                    const x = Math.max(0, Math.min(container.offsetWidth - 40, initialLeft + (radius * Math.cos(angle)) + mouseSpeedX));
                    const y = Math.max(0, Math.min(container.offsetHeight - 40, initialTop + (radius * Math.sin(angle)) + mouseSpeedY));

                    // Appliquer la transformation avec les limites du conteneur
                    triangle.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;

                    // Assurer que les triangles ne se superposent pas avec les autres éléments
                    triangle.style.zIndex = '1'; // Garde les triangles sous les autres éléments
                }

                requestAnimationFrame(animate);
            }

            animate();
        });
    } else {
        console.error("Le conteneur 'about_content' n'existe pas.");
    }
};


// SCRAWL VERS LES SECTIONS

document.addEventListener('DOMContentLoaded', () => {
    const navbarLinks = document.querySelectorAll('.navbar a');

    const bindSmoothScroll = (links) => {
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    bindSmoothScroll(navbarLinks);
});

// Delegation for dynamically injected home links
document.addEventListener('click', (event) => {
    const link = event.target.closest('.home-links a');
    if (!link) return;
    event.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    }
});


// ANNIMATION CARTES

// Fonction pour vérifier si une carte est visible à l'écran
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}

// Ajouter la classe pour l'animation si dans la zone visible
function animateCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        if (isInViewport(card)) {
            card.style.transform = 'scale(1)';
        } else {
            card.style.transform = 'scale(0)';
        }
    });
}

// Exécuter l'animation lors du défilement
window.addEventListener('scroll', animateCards);

// Exécuter une fois au chargement de la page
window.addEventListener('load', animateCards);

// Fonction pour afficher le détail des projets 
function showModal(suffix) {
    const popupId = `popup_${suffix}`;
    const popup = document.getElementById(popupId);
    if (!popup) {
        console.error(`Element with id ${popupId} not found.`);
        return;
    }
    
    // Enlève la classe cachée
    popup.classList.remove('hidden'); 
    // Un léger délai pour permettre la transition
    setTimeout(() => {
        popup.classList.add('show'); // Affiche la modale
        document.body.classList.add('modal-open'); // Active l'effet de fondu
    }, 10); 

    const scrollY = window.scrollY; // Récupérer la position actuelle du défilement

    // Ajouter la classe pour désactiver le défilement
    document.documentElement.classList.add('no-scroll');

    // Fixer le défilement de la page
    document.body.style.position = 'fixed'; // Évite le reflow de la page
    document.body.style.top = `-${scrollY}px`; // Conserve la position actuelle
}

function closeModal(suffix) {
    const popupId = `popup_${suffix}`;
    const popup = document.getElementById(popupId);
    if (!popup) {
        console.error(`Element with id ${popupId} not found.`);
        return;
    }

    // Retirer la classe show pour déclencher la transition
    popup.classList.remove('show');

    // Après un délai pour laisser le temps à l'animation de se terminer, cacher l'élément
    setTimeout(() => {
        popup.classList.add('hidden');
        document.body.classList.remove('modal-open'); // Désactive l'effet de fondu

        // Retirer la classe pour réactiver le défilement
        document.documentElement.classList.remove('no-scroll');

        // Récupérer la position du scroll
        const scrollY = document.body.style.top; // Obtient la position

        // Réinitialiser le style du body
        document.body.style.position = '';
        document.body.style.top = '';

        // Remettre l'utilisateur à la position de défilement précédente
        window.scrollTo(0, parseInt(scrollY || '0') * -1); // Scroll back to the original position
    }, 300); // Correspond à la durée de la transition CSS
}


// Defilement des images pour les pop up

// Initialisation carrousel
function handleCarouselClick(direction) {
    const track = document.getElementById('track');
    const items = Array.from(track.querySelectorAll('.carousel-item'));
    const itemWidth = items[0].offsetWidth;

    if (typeof handleCarouselClick.index === 'undefined') {
        handleCarouselClick.index = 0;
    }

    if (direction === 'next') {
        handleCarouselClick.index = (handleCarouselClick.index + 1) % items.length;
    } else if (direction === 'prev') {
        handleCarouselClick.index = (handleCarouselClick.index - 1 + items.length) % items.length;
    }

    track.style.transform = `translateX(-${handleCarouselClick.index * itemWidth}px)`;
}
