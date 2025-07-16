import { ENDPOINTS, getAuthHeader } from "./config-api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sortieForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const email = document.getElementById("email").value.trim();
    const qrCode = document.getElementById("qrCode").value.trim();

    if (!email && !qrCode) {
      message.textContent = "Veuillez entrer un email ou un QR code.";
      return;
    }

    try {
      // 1. Rechercher le visiteur
      const searchURL = qrCode
        ? `${
            ENDPOINTS.visiteurs
          }?meta_key=cle_unique&meta_value=${encodeURIComponent(qrCode)}`
        : `${
            ENDPOINTS.visiteurs
          }?meta_key=email-visiteur&meta_value=${encodeURIComponent(email)}`;

      console.log("🔍 Requête visiteur :", searchURL);
      const searchRes = await fetch(searchURL);
      if (!searchRes.ok)
        throw new Error(
          `Erreur lors de la requête visiteur (code ${searchRes.status})`
        );
      const visiteurs = await searchRes.json();

      if (!Array.isArray(visiteurs) || visiteurs.length === 0) {
        message.textContent = "Visiteur introuvable.";
        return;
      }

      const visiteur = visiteurs[0];
      const visiteurId = visiteur.id;
      console.log(
        `✅ Visiteur trouvé : ${visiteur.title.rendered} (ID : ${visiteurId})`
      );

      // 2. Récupérer ses visites
      const visitesURL = `${ENDPOINTS.visites}?acf.visiteur=${visiteurId}&orderby=date&order=desc`;
      console.log("🔍 Requête visites :", visitesURL);

      const visitesResponse = await fetch(visitesURL);
      if (!visitesResponse.ok)
        throw new Error(
          `Erreur lors de la requête visites (code ${visitesResponse.status})`
        );

      const visites = await visitesResponse.json();
      console.log("📋 Visites récupérées :", visites);

      // 3. Chercher la dernière entrée sans sortie
      const entreeActive = visites.find((v) => {
        const sortie = v.acf?.date_sortie || v.fields?.date_sortie;
        console.log(`🧪 Visite ${v.id} - sortie: ${sortie}`);

        return !sortie || sortie === "" || sortie === null;
      });

      if (!entreeActive) {
        message.textContent =
          "Aucune entrée active à clôturer pour ce visiteur.";
        return;
      }

      console.log("✅ Entrée active trouvée :", entreeActive.id);

      // 4. Mise à jour de la visite (sortie)
      const updateSortie = {
        fields: {
          date_sortie: new Date().toISOString(),
        },
      };

      const updateURL = `${ENDPOINTS.visites}/${entreeActive.id}`;
      console.log("🔄 Requête PUT :", updateURL, updateSortie);

      const updateResponse = await fetch(updateURL, {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify(updateSortie),
      });

      const updateResult = await updateResponse.json();
      console.log("✅ Réponse mise à jour :", updateResult);

      if (updateResponse.ok) {
        message.textContent = `✅ Sortie enregistrée `;
      } else {
        message.textContent = `❌ Erreur lors de la mise à jour : ${
          updateResult.message || "inconnue"
        }`;
      }
    } catch (error) {
      console.error("❌ Erreur générale :", error);
      message.textContent = "Une erreur est survenue lors de la sortie.";
    }
  });
});
