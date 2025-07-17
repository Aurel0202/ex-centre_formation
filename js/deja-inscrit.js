// Ce script gère l'affichage du formulaire de connexion rapide pour les visiteurs déjà enregistrés, et le remplissage automatique du formulaire principal.

import { ENDPOINTS } from "./config-api.js";

console.log("Script deja-inscrit.js chargé");

// Exécuté une fois que le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
  // Références des éléments du DOM
  const toggle = document.getElementById("toggleConnexion");
  const zone = document.getElementById("connexionZone");
  const formulaire = document.getElementById("visiteForm");
  const titre = document.getElementById("titreFormulaire");
  const lien = document.getElementById("lienDejaInscrit");
  const boitePrincipale = document.getElementById("boitePrincipale");

  // Lorsqu'on clique sur le lien "Déjà inscrit ?"
  toggle.addEventListener("click", (e) => {
    e.preventDefault();

    // Masquer le formulaire principal et afficher la zone de connexion
    zone.classList.remove("hidden");
    formulaire.classList.add("hidden");
    titre.classList.add("hidden");
    lien.classList.add("hidden");
    boitePrincipale.classList.add("hidden");
  });

  const form = document.getElementById("connexionForm");
  const message = document.getElementById("connexionMessage");

  // Lors de la soumission du formulaire de connexion rapide
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const email = document.getElementById("emailCo").value.trim();
    const qr = document.getElementById("qrCo").value.trim();

    if (!email && !qr) {
      message.textContent = "Veuillez saisir un email ou un QR code.";
      return;
    }

    try {
      // Construire l'URL de recherche en fonction de l'email ou du QR code
      const url = qr
        ? `${ENDPOINTS.visiteurs}?meta_key=cle_unique&meta_value=${encodeURIComponent(qr)}`
        : `${ENDPOINTS.visiteurs_email}${encodeURIComponent(email)}`;

      const res = await fetch(url);
      const data = await res.json();

      // Aucun visiteur trouvé
      if (!Array.isArray(data) || data.length === 0) {
        message.textContent = "Visiteur introuvable.";
        return;
      }

      const visiteur = data[0];

      // Récupération des champs prénom, nom, email
      const nom = visiteur.fields?.["nom-visiteur"] ?? visiteur.nom;
      const prenom = visiteur.fields?.["prenom-visiteur"] ?? visiteur.prenom;

      // Préremplissage du formulaire principal et affichage
      setTimeout(() => {
        document.getElementById("prenom").value = prenom || "";
        document.getElementById("nom").value = nom || "";
        document.getElementById("email").value = visiteur.email || "";

        boitePrincipale.classList.remove("hidden");
        message.textContent = `Bonjour ${prenom} ${nom}, vos informations ont été chargées.`;

        zone.classList.add("hidden");
        formulaire.classList.remove("hidden");
        formulaire.scrollIntoView({ behavior: "smooth" });
      }, 250);

    } catch (err) {
      console.error("Erreur connexion visiteur :", err);
      message.textContent = "Une erreur est survenue.";
    }
  });
});