// get-form-pers.js
// Script qui gère l'enregistrement d'une visite (entrée) d'un visiteur dans l'application

import { ENDPOINTS, getAuthHeader } from './config-api.js';

// À la soumission du formulaire principal (entrée)
document.getElementById('visiteForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  const form = e.target;
  const formData = new FormData(form); // Récupère les données du formulaire

  // Extraction des champs requis
  const email = formData.get('email');
  const nom = formData.get('nom');
  const prenom = formData.get('prenom');
  const personnel = formData.get('personnel_id') || null;
  const formation = formData.get('formation_id') || null;

  // Le champ "motif-visite" prend soit l'ID du personnel, soit celui de la formation
  const motif = (personnel) ? personnel : formation;

  try {
    // 1. Vérifier si le visiteur existe déjà par son email
    const searchURL = `${ENDPOINTS.visiteurs_email}${encodeURIComponent(email)}`;
    const searchResponse = await fetch(searchURL);
    const existing = await searchResponse.json();
    let visiteurId;

    if (existing.length > 0) {
      // Si le visiteur existe déjà, on récupère son ID
      visiteurId = existing[0].id;
    } else {
      // 2. Sinon, on crée un nouveau visiteur avec un identifiant unique
      const newVisiteur = {
        title: `${prenom} ${nom}`,
        status: 'publish',
        fields: {
          "nom-visiteur": nom,
          "prenom-visiteur": prenom,
          "email-visiteur": email,
          "cle_unique": crypto.randomUUID() // Génère un identifiant unique
        }
      };

      // Envoie de la requête POST pour créer le visiteur
      const createResponse = await fetch(ENDPOINTS.visiteurs, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(newVisiteur)
      });

      const created = await createResponse.json();
      visiteurId = created.id; // Récupère l'ID du nouveau visiteur
    }

    // 3. Préparer l'objet visite à enregistrer
    const visite = {
      title: `Entrée ${new Date().toLocaleString()}`,
      status: 'publish',
      fields: {
        objet: formData.get('objet'),         // "personnel" ou "formation"
        visiteur: visiteurId,                 // ID du visiteur lié
        "motif-visite": motif,               // ID du membre personnel ou formation
        date_entree: new Date().toISOString() // Date d'enregistrement de l'entrée
      }
    };

    // 4. Enregistrer la visite via POST
    const response = await fetch(ENDPOINTS.visites, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(visite)
    });

    const result = await response.json();

    // Affiche un message de confirmation ou un message d'erreur si disponible
    document.getElementById('message').textContent = result.message || 'Entrée enregistrée.';

  } catch (error) {
    console.error(error);
    document.getElementById('message').textContent = 'Erreur lors de l\'enregistrement.';
  }
});