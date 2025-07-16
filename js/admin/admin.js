import { ENDPOINTS } from '../config-api.js';
console.log("🛠 admin.js est en train d'être chargé...");

let intervalId = null; // timer global

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar a[data-section]");
  const sections = document.querySelectorAll(".section");

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.section;

      // Masquer toutes les sections
      sections.forEach(sec => sec.classList.remove("active"));

      // Afficher la section cible
      document.getElementById(target).classList.add("active");

      // Stopper tout intervalle précédent
      clearInterval(intervalId);

      // Si on clique sur "Présents", charger et lancer mise à jour
      if (target === "present") {
        chargerPresences(); // appel immédiat
        intervalId = setInterval(chargerPresences, 30000); // toutes les 30s
      }
    });
  });
});

async function chargerPresences() {
  const container = document.getElementById("presenceZone");
  if (!container) {
    console.warn("❌ #presenceZone introuvable.");
    return;
  }

  container.innerHTML = "Chargement...";

  try {
    const res = await fetch(`${ENDPOINTS.visites}?per_page=100&orderby=date&order=desc`);
    const visites = await res.json();

    const visiteursRes = await fetch(`${ENDPOINTS.visiteurs}`);
    const visiteurs = await visiteursRes.json();
    
    const visiteursMap = {};
    visiteurs.forEach(v => {
      visiteursMap[v.id] = {
        nom: v.acf?.["nom-visiteur"] || v.title?.rendered || '—',
        prenom: v.acf?.["prenom-visiteur"] || '—'
      };
    });

    const presences = visites.filter(v =>
      v.acf?.type_visite === "entrée" && !v.acf?.date_sortie 
    );

    if (presences.length === 0) {
      container.innerHTML = "<p>Aucune personne actuellement présente.</p>";
      return;
    }

    const ul = document.createElement("ul");
    presences.forEach(v => {
      const visiteurId = parseInt(v.acf?.visiteur?.[0]);
      const visiteur = visiteursMap[visiteurId] || {};
      const nom = visiteur.nom || '—';
      const prenom = visiteur.prenom || '—';
      const entree = new Date(v.acf.date_entree).toLocaleTimeString();

      const li = document.createElement("li");
      li.textContent = `${prenom} ${nom} (Entré à ${entree})`;
      ul.appendChild(li);
    });

    container.innerHTML = "";
    container.appendChild(ul);

  } catch (err) {
    console.error("Erreur chargement présences :", err);
    container.innerHTML = "<p>Erreur lors du chargement.</p>";
  }
}
// Afficher automatiquement la section Présents au chargement
document.querySelector('[data-section="present"]')?.click();