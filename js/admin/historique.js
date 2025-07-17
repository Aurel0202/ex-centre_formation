import { ENDPOINTS } from '../config-api.js';

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#tableVisites tbody');
  const form = document.getElementById('filtreForm');
  const dateInput = document.getElementById('date');
  const resetBtn = document.getElementById('resetBtn');

  let toutesLesVisites = [];

  // 🔄 Fonction utilitaire : tenter de récupérer le motif (formation ou personnel)
  async function getMotifData(id) {
    if (!id || isNaN(id)) {
      console.warn("⚠️ ID du motif invalide :", id);
      return { type: 'Inconnu', local: '—' };
    }

    // 1. Tenter formation
    try {
      const res = await fetch(`${ENDPOINTS.formations}/${id}`);
      if (res.ok) {
        const data = await res.json();
        return {
          type: 'Formation',
          local: data.acf['local'] || data.title?.rendered || '—'
        };
      }
    } catch (err) {}

    // 2. Tenter personnel
    try {
      const res = await fetch(`${ENDPOINTS.personnels}/${id}`);
      if (res.ok) {
        const data = await res.json();
        return {
          type: 'Personnel',
          local: data.acf['local-personnel'] || data.title?.rendered || '—'
        };
      }
    } catch (err) {}

    return { type: 'Inconnu', local: '—' };
  }

  // 🔄 Charger un visiteur par ID
  async function getVisiteurData(id) {
    try {
      const res = await fetch(`${ENDPOINTS.visiteurs}/${id}`);
      const data = await res.json();
      return {
        nom: data.acf?.['nom-visiteur'] || '—',
        prenom: data.acf?.['prenom-visiteur'] || '—'
      };
    } catch (err) {
      return { nom: '—', prenom: '—' };
    }
  }

  // 🔁 Charger toutes les visites
  async function chargerVisites() {
    try {
      const res = await fetch(`${ENDPOINTS.visites}`);
      const data = await res.json();
      toutesLesVisites = data;
      afficherVisites(toutesLesVisites);
    } catch (err) {
      console.error('Erreur chargement :', err);
      tbody.innerHTML = `<tr><td colspan="6">Erreur de chargement.</td></tr>`;
    }
  }

  // 📋 Affichage tableau
  async function afficherVisites(visites) {
    const visitesCompletes = visites.filter(v => v.acf?.date_entree && v.acf?.date_sortie);

    if (visitesCompletes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">Aucune visite complète trouvée.</td></tr>`;
      return;
    }

    tbody.innerHTML = '';

    for (const v of visitesCompletes) {
      const acf = v.acf;
      const visiteurId = parseInt(acf?.visiteur?.[0]);
      const motifId = parseInt(acf?.['motif-visite']?.[0]);

      const visiteur = await getVisiteurData(visiteurId);
      const motif = await getMotifData(motifId);

      const entree = new Date(acf.date_entree).toLocaleString();
      const sortie = new Date(acf.date_sortie).toLocaleString();

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${visiteur.nom}</td>
        <td>${visiteur.prenom}</td>
        <td>${motif.type}</td>
        <td>${entree}</td>
        <td>${sortie}</td>
        <td>${motif.local}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  // 🔍 Filtrage par date
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateChoisie = dateInput.value;
    if (!dateChoisie) return;

    const filtrées = toutesLesVisites.filter(v => v.acf?.date_entree?.startsWith(dateChoisie));
    afficherVisites(filtrées);
  });

  // 🔁 Réinitialiser
  resetBtn.addEventListener('click', () => {
    dateInput.value = '';
    afficherVisites(toutesLesVisites);
  });
// 📥 Export CSV
document.getElementById('exportBtn').addEventListener('click', () => {
  const rows = document.querySelectorAll('#tableVisites tr');
  if (rows.length <= 1) {
    alert("Aucune donnée à exporter.");
    return;
  }

  let csv = "";
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    const values = Array.from(cells).map(cell =>
      `"${cell.textContent.replace(/"/g, '""')}"`
    );
    csv += values.join(',') + "\n";
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `historique_visites_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

  // 🚀 Init
  chargerVisites();
});
