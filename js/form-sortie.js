// Ce script gère l'enregistrement de la sortie d'un visiteur en fonction de son email ou de son QR code.
import { ENDPOINTS, getAuthHeader } from "./config-api.js";

document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments du DOM
  const form = document.getElementById("sortieForm"); // Formulaire de sortie
  const message = document.getElementById("message"); // Élément pour afficher les messages

  // Événement de soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêcher l'envoi classique du formulaire
    message.textContent = ""; // Réinitialiser le message d'erreur ou de succès

    // Récupérer les valeurs saisies dans le formulaire
    const email = document.getElementById("email").value.trim(); // Email du visiteur
    const qrCode = document.getElementById("qrCode").value.trim(); // QR Code du visiteur

    // Vérification que l'utilisateur a saisi au moins un des deux champs (email ou QR code)
    if (!email && !qrCode) {
      message.textContent = "Veuillez entrer un email ou un QR code."; // Message d'erreur
      return; // Arrêter l'exécution si aucun des champs n'est rempli
    }

    try {
      // 1. Rechercher le visiteur en fonction de l'email ou du QR code
      const searchURL = qrCode
        ? `${ENDPOINTS.visiteurs}?meta_key=cle_unique&meta_value=${encodeURIComponent(qrCode)}`
        : `${ENDPOINTS.visiteurs}?meta_key=email-visiteur&meta_value=${encodeURIComponent(email)}`;

      // Envoi de la requête pour rechercher le visiteur
      const searchRes = await fetch(searchURL);
      if (!searchRes.ok)
        throw new Error(`Erreur lors de la requête visiteur (code ${searchRes.status})`);

      // Conversion de la réponse en JSON
      const visiteurs = await searchRes.json();

      // Vérification si le visiteur a été trouvé
      if (!Array.isArray(visiteurs) || visiteurs.length === 0) {
        message.textContent = "Visiteur introuvable."; // Message d'erreur si aucun visiteur trouvé
        return;
      }

      const visiteur = visiteurs[0]; // Récupérer le premier visiteur trouvé
      const visiteurId = visiteur.id; // ID du visiteur

      // 2. Récupérer les visites de ce visiteur triées par date descendante
      const visitesURL = `${ENDPOINTS.visites}?acf.visiteur=${visiteurId}&orderby=date&order=desc`;
      const visitesResponse = await fetch(visitesURL);

      if (!visitesResponse.ok)
        throw new Error(`Erreur lors de la requête visites (code ${visitesResponse.status})`);

      const visites = await visitesResponse.json();
      //console.log("Visites récupérées :", visites); // Affichage des visites pour le débogage

      // 3. Trouver la dernière entrée sans date de sortie (visite en cours)
      const entreeActive = visites.find((v) => {
        const sortie = v.acf?.date_sortie || v.fields?.date_sortie;
        return !sortie || sortie === "" || sortie === null; // Vérifier que la sortie est absente ou nulle
      });

      if (!entreeActive) {
        message.textContent = "Aucune entrée active à clôturer pour ce visiteur."; // Si aucune entrée en cours
        return;
      }

      //console.log("Entrée active trouvée :", entreeActive.id); // Afficher l'ID de l'entrée active pour le débogage

      // 4. Mettre à jour la date de sortie de la visite
      const updateSortie = {
        fields: {
          date_sortie: new Date().toISOString(), // Utilisation de la date actuelle comme date de sortie
        },
      };

      // Envoi de la requête pour mettre à jour la sortie de la visite
      const updateURL = `${ENDPOINTS.visites}/${entreeActive.id}`;
      const updateResponse = await fetch(updateURL, {
        method: "PUT",
        headers: getAuthHeader(), // En-têtes d'authentification
        body: JSON.stringify(updateSortie), // Corps de la requête avec la nouvelle date de sortie
      });

      const updateResult = await updateResponse.json();

      if (updateResponse.ok) {
        message.textContent = `Sortie enregistrée`; // Message de succès
      } else {
        message.textContent = `Erreur lors de la mise à jour : ${updateResult.message || "inconnue"}`; // Message d'erreur si la mise à jour échoue
      }
    } catch (error) {
      console.error("Erreur générale :", error); // Afficher l'erreur dans la console pour le débogage
      message.textContent = "Une erreur est survenue lors de la sortie."; // Message d'erreur générique
    }
  });
});