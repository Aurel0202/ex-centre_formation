// Importation de l'objet ENDPOINTS depuis le fichier config-api.js
import { ENDPOINTS } from '../config-api.js';

// Ajout d'un écouteur d'événement à l'élément du formulaire d'authentification admin
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche l'envoi par défaut du formulaire, ce qui permet de gérer la soumission en JavaScript

  // Récupération des valeurs des champs email et mot de passe du formulaire
  const username = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  // Récupération de l'élément où afficher le message de statut de la connexion
  const status = document.getElementById('adminLoginMessage');

  // Création du token d'authentification de type Basic en encodant les informations d'identification (username:password) en base64
  const token = btoa(`${username}:${password}`);

  // Configuration des headers de la requête HTTP, notamment l'ajout du token d'authentification
  const headers = {
    'Authorization': `Basic ${token}`, // Ajout de l'autorisation avec le token encodé
    'Content-Type': 'application/json' // Spécifie que les données envoyées et attendues sont au format JSON
  };

  try {
    // Envoi de la requête HTTP pour récupérer les informations de l'utilisateur connecté
    const res = await fetch(`${ENDPOINTS.users}/me`, { headers });

    // Si la réponse n'est pas correcte (status code != 200), lancer une erreur
    if (!res.ok) throw new Error("Identifiants invalides ou non autorisés");

    // Si la requête réussit, convertir la réponse en JSON
    const user = await res.json();

    // ✅ Stockage du token d'authentification dans le localStorage pour une utilisation future
    localStorage.setItem('auth', token);

    // Affichage d'un message de bienvenue avec le nom de l'utilisateur récupéré
    status.textContent = `Bienvenue ${user.name} 👋`; // Affiche le nom de l'utilisateur avec un emoji
    status.style.color = 'green'; // Change la couleur du message de bienvenue en vert

    // 🔁 Redirige l'utilisateur vers la page du dashboard admin après une connexion réussie
    window.location.href = 'admin/dashboard.html';

  } catch (err) {
    // Si une erreur se produit lors de la requête, afficher un message d'erreur
    console.error(err); // Affiche l'erreur dans la console pour un éventuel débogage
    status.textContent = "Échec de la connexion."; // Affiche le message d'échec
    status.style.color = 'red'; // Change la couleur du message d'échec en rouge
  }
});
