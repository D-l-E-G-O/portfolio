const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const closeBtn = document.getElementById('close-modal');
// Sélectionner toutes les images des cartes
const cardImages = document.querySelectorAll('.card-image');

// Ouvrir la modale au clic sur une image
cardImages.forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.showModal();
        // Bloque le défilement de la page en arrière-plan
        document.body.style.overflow = 'hidden';
    });
});

// 2. Fonction pour fermer la modale
const closeModal = () => {
    modal.close();
    document.body.style.overflow = 'auto'; // Réactive le défilement
};

// 3. Fermer au clic sur le bouton x
closeBtn.addEventListener('click', closeModal);

// 4. Fermer au clic dans le vide (sur le fond sombre)
modal.addEventListener('click', (e) => {
    // Si la cible du clic est la modale elle-même (le fond) et pas l'image
    if (e.target === modal) {
        closeModal();
    }
});