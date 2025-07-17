import { ENDPOINTS } from '../config-api.js';

let intervalId = null;

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar a[data-section]");
  const sections = document.querySelectorAll(".section");

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.section;

      // Masquer toutes les sections
      sections.forEach(sec => sec.classList.remove("active"));
      document.getElementById(target).classList.add("active");

      // Arrêter toute boucle en cours
      clearInterval(intervalId);

      // Si on clique sur "Présents"
      if (target === "present") {
        chargerPresences();
        intervalId = setInterval(chargerPresences, 30000); // toutes les 30s
      }
    });
  });
});

// 🔁 Charger et afficher les présences
async function chargerPresences() {
  const container = document.getElementById("presenceZone");
  if (!container) return;
  container.innerHTML = "Chargement...";

  try {
    const resVisites = await fetch(`${ENDPOINTS.visites}`);
    const toutesLesVisites = await resVisites.json();

    // 🔎 Visites sans sortie
    const visitesSansSortie = toutesLesVisites.filter(v => !v.acf?.date_sortie);

    if (visitesSansSortie.length === 0) {
      container.innerHTML = "<p>Aucune personne actuellement présente.</p>";
      return;
    }

    // 🔎 Charger visiteurs
    const resVisiteurs = await fetch(`${ENDPOINTS.visiteurs}?per_page=100`);
    const dataVisiteurs = await resVisiteurs.json();
    const visiteursMap = {};
    dataVisiteurs.forEach(v => {
      visiteursMap[v.id] = {
        nom: v.acf?.['nom-visiteur'] || '—',
        prenom: v.acf?.['prenom-visiteur'] || '—'
      };
    });

    // 🖨️ Affichage
    const ul = document.createElement("ul");
    visitesSansSortie.forEach(v => {
      const visiteurId = parseInt(v.acf?.visiteur?.[0]);
      const visiteur = visiteursMap[visiteurId] || { nom: "—", prenom: "—" };
      const heureEntree = new Date(v.acf.date_entree).toLocaleTimeString();

      const li = document.createElement("li");
      li.textContent = `${visiteur.prenom} ${visiteur.nom} (Entré à ${heureEntree})`;
      ul.appendChild(li);
    });

    container.innerHTML = "";
    container.appendChild(ul);

  } catch (err) {
    console.error("Erreur chargement présences :", err);
    container.innerHTML = "<p>Erreur lors du chargement.</p>";
  }
}
