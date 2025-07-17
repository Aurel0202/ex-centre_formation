// Importation des constantes ENDPOINTS depuis le fichier config-api.js
import { ENDPOINTS } from '../config-api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments nécessaires dans le DOM
  const tbody = document.querySelector('#tableVisites tbody'); // Table body pour afficher les visites
  const form = document.getElementById('filtreForm'); // Formulaire de filtre
  const dateInput = document.getElementById('date'); // Champ de saisie pour la date
  const resetBtn = document.getElementById('resetBtn'); // Bouton de réinitialisation

  let toutesLesVisites = []; // Tableau pour stocker toutes les visites

  // 🔄 Fonction utilitaire pour récupérer le motif (formation ou personnel) basé sur l'ID
  async function getMotifData(id) {
    if (!id || isNaN(id)) {
      console.warn("⚠️ ID du motif invalide :", id);
      return { type: 'Inconnu', local: '—' }; // Si l'ID est invalide, retourner une valeur par défaut
    }

    // 1. Essayer de récupérer la formation correspondant à l'ID
    try {
      const res = await fetch(`${ENDPOINTS.formations}/${id}`);
      if (res.ok) {
        const data = await res.json();
        return {
          type: 'Formation',
          local: data.acf['local'] || data.title?.rendered || '—' // Extraire les informations du local de la formation
        };
      }
    } catch (err) {}

    // 2. Si la formation échoue, essayer de récupérer les informations du personnel
    try {
      const res = await fetch(`${ENDPOINTS.personnels}/${id}`);
      if (res.ok) {
        const data = await res.json();
        return {
          type: 'Personnel',
          local: data.acf['local-personnel'] || data.title?.rendered || '—' // Extraire les informations du local du personnel
        };
      }
    } catch (err) {}

    return { type: 'Inconnu', local: '—' }; // Si aucune des deux tentatives n'a réussi, retourner des valeurs par défaut
  }

  // 🔄 Fonction pour charger un visiteur par son ID
  async function getVisiteurData(id) {
    try {
      const res = await fetch(`${ENDPOINTS.visiteurs}/${id}`);
      const data = await res.json();
      return {
        nom: data.acf?.['nom-visiteur'] || '—', // Nom du visiteur, ou '—' si non défini
        prenom: data.acf?.['prenom-visiteur'] || '—' // Prénom du visiteur, ou '—' si non défini
      };
    } catch (err) {
      return { nom: '—', prenom: '—' }; // En cas d'erreur, retourner des valeurs par défaut
    }
  }

  // 🔁 Fonction pour charger toutes les visites depuis l'API
  async function chargerVisites() {
    try {
      const res = await fetch(`${ENDPOINTS.visites}`);
      const data = await res.json();
      toutesLesVisites = data; // Stocker toutes les visites récupérées
      afficherVisites(toutesLesVisites); // Afficher les visites dans le tableau
    } catch (err) {
      console.error('Erreur chargement :', err); // Afficher l'erreur dans la console
      tbody.innerHTML = `<tr><td colspan="6">Erreur de chargement.</td></tr>`; // Message d'erreur si l'API échoue
    }
  }

  // 📋 Fonction pour afficher les visites dans le tableau
  async function afficherVisites(visites) {
    const visitesCompletes = visites.filter(v => v.acf?.date_entree && v.acf?.date_sortie); // Filtrer les visites complètes (avec entrée et sortie)

    if (visitesCompletes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">Aucune visite complète trouvée.</td></tr>`; // Si aucune visite complète n'est trouvée
      return;
    }

    tbody.innerHTML = ''; // Réinitialiser le contenu du tableau

    for (const v of visitesCompletes) {
      const acf = v.acf;
      const visiteurId = parseInt(acf?.visiteur?.[0]); // ID du visiteur
      const motifId = parseInt(acf?.['motif-visite']?.[0]); // ID du motif (formation ou personnel)

      // Récupérer les données du visiteur et du motif
      const visiteur = await getVisiteurData(visiteurId);
      const motif = await getMotifData(motifId);

      // Formatage des dates d'entrée et de sortie
      const entree = new Date(acf.date_entree).toLocaleString();
      const sortie = new Date(acf.date_sortie).toLocaleString();

      // Création d'une ligne pour chaque visite dans le tableau
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${visiteur.nom}</td>
        <td>${visiteur.prenom}</td>
        <td>${motif.type}</td>
        <td>${entree}</td>
        <td>${sortie}</td>
        <td>${motif.local}</td>
      `;
      tbody.appendChild(tr); // Ajouter la ligne au tableau
    }
  }

  // 🔍 Événement de filtrage par date
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêcher l'envoi du formulaire
    const dateChoisie = dateInput.value; // Récupérer la date choisie
    if (!dateChoisie) return;

    // Filtrer les visites par la date d'entrée
    const filtrées = toutesLesVisites.filter(v => v.acf?.date_entree?.startsWith(dateChoisie));
    afficherVisites(filtrées); // Afficher les visites filtrées
  });

  // 🔁 Événement de réinitialisation du filtre
  resetBtn.addEventListener('click', () => {
    dateInput.value = ''; // Réinitialiser le champ de date
    afficherVisites(toutesLesVisites); // Afficher toutes les visites sans filtre
  });

  // 📥 Fonction d'exportation en CSV
  document.getElementById('exportBtn').addEventListener('click', () => {
    const rows = document.querySelectorAll('#tableVisites tr'); // Sélectionner toutes les lignes du tableau
    if (rows.length <= 1) {
      alert("Aucune donnée à exporter."); // Si aucune donnée, afficher un message
      return;
    }

    let csv = "";
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th'); // Sélectionner toutes les cellules de la ligne
      const values = Array.from(cells).map(cell =>
        `"${cell.textContent.replace(/"/g, '""')}"` // Échapper les guillemets doubles dans le texte
      );
      csv += values.join(',') + "\n"; // Ajouter les valeurs à la chaîne CSV
    });

    // Créer un fichier Blob de type CSV et générer un lien pour le téléchargement
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historique_visites_${new Date().toISOString().slice(0,10)}.csv`; // Nom du fichier CSV
    document.body.appendChild(a);
    a.click(); // Simuler un clic pour télécharger le fichier
    document.body.removeChild(a); // Supprimer le lien une fois le téléchargement terminé
  });

  // 🚀 Initialisation : charger les visites au démarrage
  chargerVisites();
});
