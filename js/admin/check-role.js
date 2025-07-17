import { ENDPOINTS, getAuthHeader } from '../config-api.js';

document.addEventListener('DOMContentLoaded', () => {
  fetch(`${ENDPOINTS.users}/me`, {
    headers: {
      'Authorization': getAuthHeader()
    }
  })
    .then(res => res.json())
    .then(user => {
      const role = user.role;

      if (role === 'administrator') {
        console.log("👑 Super Admin connecté");
      } else if (role === 'admin_project') {
        console.log("🔧 Admin Projet connecté");
      } else if (role === 'visiteur') {
        console.log("🚶 Visiteur connecté");
        // Exemple : rediriger vers la page d’entrée
        window.location.href = 'index.html';
      } else {
        console.warn("❌ Rôle non autorisé !");
        alert("Vous n'avez pas accès à cette section.");
        window.location.href = 'index.html';
      }
    })
    .catch(err => {
      console.error("Erreur API users/me :", err);
      alert("Erreur d'authentification !");
      window.location.href = 'index.html';
    });
});
