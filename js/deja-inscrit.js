import { ENDPOINTS } from "./config-api.js";

console.log("✅ Script deja-inscrit.js chargé");

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleConnexion");
  const zone = document.getElementById("connexionZone");
  const formulaire = document.getElementById("visiteForm");
  const titre = document.getElementById("titreFormulaire");
  const lien = document.getElementById("lienDejaInscrit");
  const boitePrincipale = document.getElementById("boitePrincipale");


  toggle.addEventListener("click", (e) => {
    e.preventDefault();

    // ✅ Masquer tout sauf la zone de connexion
    zone.classList.remove("hidden");
    formulaire.classList.add("hidden");
    titre.classList.add("hidden");
    lien.classList.add("hidden");
    boitePrincipale.classList.add("hidden"); // ✅ masque tout le bloc du formulaire

  });

  const form = document.getElementById("connexionForm");
  const message = document.getElementById("connexionMessage");

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
      const url = qr
        ? `${ENDPOINTS.visiteurs}?meta_key=cle_unique&meta_value=${encodeURIComponent(qr)}`
        : `${ENDPOINTS.visiteurs_email}${encodeURIComponent(email)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        message.textContent = "Visiteur introuvable.";
        return;
      }

      const visiteur = data[0];
      console.log("🧾 Visiteur trouvé :", visiteur);

      const nom = visiteur.fields?.["nom-visiteur"] ?? visiteur.nom;
      const prenom = visiteur.fields?.["prenom-visiteur"] ?? visiteur.prenom;

      // ✅ Préremplir et gérer affichage
      setTimeout(() => {
        document.getElementById("prenom").value = prenom || "";
        document.getElementById("nom").value = nom || "";
        document.getElementById("email").value = visiteur.email || "";
        boitePrincipale.classList.remove("hidden"); // ✅ réaffiche la boîte principale


        console.log("✅ Champs préremplis :", {
          prenom,
          nom,
          email: visiteur.email,
        });

        message.textContent = `✅ Bonjour ${prenom} ${nom}, vos informations ont été chargées.`;

        // ✅ Masquer la zone de connexion
        zone.classList.add("hidden");

        // ✅ Réafficher le formulaire principal
        formulaire.classList.remove("hidden");

        // ✅ Scroll vers le formulaire
        formulaire.scrollIntoView({ behavior: "smooth" });
      }, 250);
    } catch (err) {
      console.error("❌ Erreur connexion visiteur :", err);
      message.textContent = "Une erreur est survenue.";
    }
  });
});
