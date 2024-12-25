// Format number as currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format number as percentage
function formatPercentage(number) {
    return new Intl.NumberFormat('fr-CA', {
        style: 'percent',
        minimumFractionDigits: 2
    }).format(number / 100);
}

// Simple navigation function
function openPage(pageId) {
    // Hide all content sections
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected content
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('onclick')?.includes(pageId)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close mobile navbar if open
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
    }
}

// Initialize default page on load
document.addEventListener('DOMContentLoaded', function() {
    openPage('Home');
});

// Add this function to utils.js
function addResetButton(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'btn btn-outline-secondary btn-lg';
    resetButton.textContent = 'Réinitialiser';
    resetButton.onclick = callback;
    
    // Find the calculate button and add reset button next to it
    const calculateButton = form.querySelector('button[type="button"]');
    if (calculateButton) {
        const buttonContainer = calculateButton.parentElement;
        buttonContainer.appendChild(resetButton);
        // Add margin between buttons
        calculateButton.classList.add('me-2');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des liens de documentation
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const helpModal = document.getElementById('helpModal');
            const modal = new bootstrap.Modal(helpModal);
            
            // Nettoyer les événements précédents
            helpModal.removeEventListener('shown.bs.modal', scrollToSection);
            
            // Créer la fonction de défilement
            function scrollToSection() {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Ajouter l'événement pour cette ouverture
            helpModal.addEventListener('shown.bs.modal', scrollToSection, { once: true });
            
            // S'assurer que le backdrop est bien nettoyé à la fermeture
            helpModal.addEventListener('hidden.bs.modal', function() {
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }, { once: true });
            
            // Ouvrir le modal
            modal.show();
        });
    });
});

function exportToPDF(calculatorId) {
    // Cacher temporairement les éléments non nécessaires
    const elementsToHide = document.querySelectorAll('.navbar-custom, .btn-calculate, .btn-reset, .btn-print, .btn-share');
    elementsToHide.forEach(el => el.style.display = 'none');

    // Imprimer la page (qui sera sauvegardée en PDF)
    window.print();

    // Restaurer les éléments cachés
    elementsToHide.forEach(el => el.style.display = '');
}

function printCalculator(calculatorId) {
    // Retirer la classe print-active de tous les contenus
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('print-active');
    });
    
    // Ajouter la classe print-active au calculateur actuel
    const currentCalculator = document.getElementById(calculatorId);
    if (currentCalculator) {
        currentCalculator.classList.add('print-active');
    }
    
    // Imprimer
    window.print();
    
    // Nettoyer après l'impression
    if (currentCalculator) {
        currentCalculator.classList.remove('print-active');
    }
} 