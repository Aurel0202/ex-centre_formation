import { ENDPOINTS } from '../config-api.js';

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#tableVisites tbody');
  const form = document.getElementById('filtreForm');
  const dateInput = document.getElementById('date');
  const resetBtn = document.getElementById('resetBtn');

  let toutesLesVisites = [];
  let formationsMap = {};
  let personnelsMap = {};
  let visiteursMap = {};

  // 🧠 Charger formations → id → local
  async function chargerFormations() {
    const res = await fetch(ENDPOINTS.formations);
    const data = await res.json();
    data.forEach(f => {
      formationsMap[f.id] = f.acf?.local || f.title?.rendered || '—';
    });
  }

  // 🧠 Charger personnels → id → local
  async function chargerPersonnels() {
    const res = await fetch(ENDPOINTS.personnels);
    const data = await res.json();
    data.forEach(p => {
      personnelsMap[p.id] = p.acf?.local_personnel || p.title?.rendered || '—';
      console.log(p)
    });
  }

  // 🧠 Charger visiteurs → id → nom/prenom
  async function chargerVisiteurs() {
    const res = await fetch(ENDPOINTS.visiteurs + '?per_page=100');
    const data = await res.json();
    data.forEach(v => {
      const id = v.id;
      const nom = v.acf?.['nom-visiteur'] || '—';
      const prenom = v.acf?.['prenom-visiteur'] || '—';
      visiteursMap[id] = { nom, prenom };
    });
  }

  // 🔁 Charger toutes les données
  async function chargerVisites() {
    try {
      await chargerFormations();
      await chargerPersonnels();
      await chargerVisiteurs();

      const res = await fetch(`${ENDPOINTS.visites}?per_page=100&orderby=date&order=desc`);
      const data = await res.json();
      toutesLesVisites = data;
      afficherVisites(toutesLesVisites);
    } catch (err) {
      console.error('Erreur chargement :', err);
      tbody.innerHTML = `<tr><td colspan="6">Erreur de chargement.</td></tr>`;
    }
  }

  // 📋 Affichage tableau
  function afficherVisites(visites) {
    const visitesCompletes = visites.filter(v =>
      v.acf?.date_entree && v.acf?.date_sortie
    );

    if (visitesCompletes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">Aucune visite complète trouvée.</td></tr>`;
      return;
    }

    tbody.innerHTML = '';
    visitesCompletes.forEach(v => {
      const acf = v.acf || {};
      const visiteurId = parseInt(acf.visiteur);
      const visiteur = visiteursMap[visiteurId] || {};
        console.log(v);
        
      const nom = visiteur.nom || '—';
      const prenom = visiteur.prenom || '—';
      const objet = acf.objet || '';

      
      const type = objet.motif === "formation" ? "Formation" :
                   objet === "personnel" ? "Personnel" : "—";

      const entree = new Date(acf.date_entree).toLocaleString();
      const sortie = new Date(acf.date_sortie).toLocaleString();

      const idMotif = parseInt(acf['motif-visite']);
      let local = '—';

      if (objet === "formation") {
        local = formationsMap[idMotif] || '—';
      } else if (objet === "personnel") {
        local = personnelsMap[idMotif] || '—';
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${nom}</td>
        <td>${prenom}</td>
        <td>${type}</td>
        <td>${entree}</td>
        <td>${sortie}</td>
        <td>${local}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 🔍 Filtrage par date
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateChoisie = dateInput.value;
    if (!dateChoisie) return;

    const filtrées = toutesLesVisites.filter(v =>
      v.acf?.date_entree?.startsWith(dateChoisie)
    );
    afficherVisites(filtrées);
  });

  // 🔁 Réinitialiser
  resetBtn.addEventListener('click', () => {
    dateInput.value = '';
    afficherVisites(toutesLesVisites);
  });

  // 🚀 Init
  chargerVisites();
});
