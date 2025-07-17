// Importation de l'objet ENDPOINTS depuis le fichier config-api.js
import { ENDPOINTS } from '../config-api.js';

// Déclaration de la variable pour stocker l'ID de l'intervalle
let intervalId = null;

// Lorsque le DOM est complètement chargé, ajouter un événement pour gérer l'interaction avec les liens de la barre latérale
document.addEventListener("DOMContentLoaded", () => {
  // Sélectionner tous les liens de la barre latérale qui ont l'attribut 'data-section'
  const links = document.querySelectorAll(".sidebar a[data-section]");
  // Sélectionner toutes les sections
  const sections = document.querySelectorAll(".section");

  // Ajouter un événement "click" sur chaque lien
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Empêcher le comportement par défaut du lien (redirection)

      const target = link.dataset.section; // Récupérer la section cible du lien

      // Masquer toutes les sections en retirant la classe "active"
      sections.forEach(sec => sec.classList.remove("active"));
      // Afficher la section cible en lui ajoutant la classe "active"
      document.getElementById(target).classList.add("active");

      // Arrêter toute boucle en cours (par exemple, si une fonction de chargement est en cours)
      clearInterval(intervalId);

      // Si la section cible est "Présents", charger les présences
      if (target === "present") {
        chargerPresences(); // Appel de la fonction pour charger les présences
        intervalId = setInterval(chargerPresences, 30000); // Relancer la fonction toutes les 30 secondes
      }
    });
  });
});

// 🔁 Fonction pour charger et afficher les présences
async function chargerPresences() {
  const container = document.getElementById("presenceZone"); // Sélectionner le conteneur où afficher les présences
  if (!container) return; // Si le conteneur n'existe pas, quitter la fonction

  container.innerHTML = "Chargement..."; // Afficher un message pendant le chargement

  try {
    // Récupérer toutes les visites via l'API
    const resVisites = await fetch(`${ENDPOINTS.visites}`);
    const toutesLesVisites = await resVisites.json();

    // 🔎 Filtrer les visites qui n'ont pas de date de sortie (présences actuelles)
    const visitesSansSortie = toutesLesVisites.filter(v => !v.acf?.date_sortie);

    if (visitesSansSortie.length === 0) {
      container.innerHTML = "<p>Aucune personne actuellement présente.</p>";
      return; // Si aucune personne n'est présente, afficher un message et quitter
    }

    // 🔎 Charger les visiteurs via l'API
    const resVisiteurs = await fetch(`${ENDPOINTS.visiteurs}?per_page=100`);
    const dataVisiteurs = await resVisiteurs.json();
    const visiteursMap = {}; // Objet pour stocker les informations des visiteurs par ID
    dataVisiteurs.forEach(v => {
      visiteursMap[v.id] = {
        nom: v.acf?.['nom-visiteur'] || '—',
        prenom: v.acf?.['prenom-visiteur'] || '—'
      };
    });

    // 🖨️ Création et affichage de la liste des visiteurs présents
    const ul = document.createElement("ul"); // Créer une liste non ordonnée
    visitesSansSortie.forEach(v => {
      const visiteurId = parseInt(v.acf?.visiteur?.[0]); // Récupérer l'ID du visiteur
      const visiteur = visiteursMap[visiteurId] || { nom: "—", prenom: "—" }; // Récupérer les données du visiteur
      const heureEntree = new Date(v.acf.date_entree).toLocaleTimeString(); // Récupérer l'heure d'entrée formatée

      // Créer un élément de liste pour chaque visiteur
      const li = document.createElement("li");
      li.textContent = `${visiteur.prenom} ${visiteur.nom} (Entré à ${heureEntree})`; // Ajouter les infos du visiteur
      ul.appendChild(li); // Ajouter l'élément de liste à la liste
    });

    // Remplacer le contenu du conteneur par la nouvelle liste
    container.innerHTML = "";
    container.appendChild(ul);

  } catch (err) {
    // En cas d'erreur, afficher un message d'erreur
    console.error("Erreur chargement présences :", err); // Afficher l'erreur dans la console pour un éventuel débogage
    container.innerHTML = "<p>Erreur lors du chargement.</p>"; // Afficher un message d'erreur dans le conteneur
  }
}
