// Importation des constantes ENDPOINTS et de la fonction getAuthHeader depuis config-api.js
import { ENDPOINTS, getAuthHeader } from '../config-api.js';

// Exécution du code une fois que le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  // Envoi d'une requête pour récupérer les informations de l'utilisateur connecté via l'API
  fetch(`${ENDPOINTS.users}/me`, {
    headers: {
      'Authorization': getAuthHeader() // Utilisation du header d'authentification pour sécuriser la requête
    }
  })
    .then(res => res.json()) // Conversion de la réponse en format JSON
    .then(user => {
      const role = user.role; // Récupération du rôle de l'utilisateur

      // Vérification du rôle de l'utilisateur pour gérer l'accès
      if (role === 'administrator') {
        // Si l'utilisateur est un administrateur, aucune action ici (possibilité d'ajouter des logs ou actions spécifiques)
        //console.log("👑 Super Admin connecté");
      } else if (role === 'admin_project') {
        // Si l'utilisateur est un admin de projet, aucune action ici (possibilité d'ajouter des logs ou actions spécifiques)
        //console.log("🔧 Admin Projet connecté");
      } else if (role === 'visiteur') {
        // Si l'utilisateur est un visiteur, redirection vers la page d'entrée (index.html)
        //console.log("🚶 Visiteur connecté");
        window.location.href = 'index.html'; // Redirection vers la page d'accueil des visiteurs
      } else {
        // Si l'utilisateur a un rôle non autorisé, alerte et redirection vers index.html
        //console.warn("❌ Rôle non autorisé !");
        alert("Vous n'avez pas accès à cette section."); // Affichage d'un message d'erreur
        window.location.href = 'index.html'; // Redirection vers la page d'accueil
      }
    })
    .catch(err => {
      // En cas d'erreur lors de la récupération des données de l'utilisateur, affichage d'un message d'erreur
      console.error("Erreur API users/me :", err); // Affichage de l'erreur dans la console pour le débogage
      alert("Erreur d'authentification !"); // Affichage d'un message d'erreur à l'utilisateur
      window.location.href = 'index.html'; // Redirection vers la page d'accueil
    });
});
