// Ce fichier gère le chargement des listes de personnels et de formations, ainsi que l'affichage conditionnel des champs selon l'objet de la visite

import { ENDPOINTS } from "./config-api.js";

// Fonction pour charger la liste des membres du personnel depuis l'API
async function chargerPersonnels() {
  try {
    const response = await fetch(ENDPOINTS.personnels);
    const data = await response.json();
    const select = document.getElementById("personnel");

    data.forEach((p) => {
      const nom = p.fields?.["nom-visiteur"] ?? p.title?.rendered;
      const prenom = p.fields?.["prenom-visiteur"] ?? "";
      const id = p.id;

      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${prenom} ${nom}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des personnels :", error);
  }
}

// Fonction pour charger la liste des formations depuis l'API
async function chargerFormations() {
  try {
    const response = await fetch(ENDPOINTS.formations);
    const data = await response.json();
    const select = document.getElementById("formation");

    data.forEach((f) => {
      const intitule = f.acf?.intitule ?? f.title.rendered;
      const id = f.id;

      const option = document.createElement("option");
      option.value = id;
      option.textContent = intitule;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des formations :", error);
  }
}

// Évènement sur le champ "Objet de la visite" : affiche/masque les bons champs en fonction du choix
// Si l'utilisateur choisit "personnel" ou "formation"
document.getElementById("objet").addEventListener("change", (e) => {
  const valeur = e.target.value;
  const divPerso = document.getElementById("select-personnel");
  const divForm = document.getElementById("select-formation");

  const personnelSelect = document.getElementById("personnel");
  const formationSelect = document.getElementById("formation");

  if (valeur === "personnel") {
    divPerso.classList.remove("hidden");
    personnelSelect.setAttribute("required", true);

    divForm.classList.add("hidden");
    formationSelect.removeAttribute("required");
    formationSelect.value = "";
  } else if (valeur === "formation") {
    divForm.classList.remove("hidden");
    formationSelect.setAttribute("required", true);

    divPerso.classList.add("hidden");
    personnelSelect.removeAttribute("required");
    personnelSelect.value = "";
  } else {
    // Aucun objet choisi, tout masquer
    divPerso.classList.add("hidden");
    divForm.classList.add("hidden");

    personnelSelect.removeAttribute("required");
    formationSelect.removeAttribute("required");
    personnelSelect.value = "";
    formationSelect.value = "";
  }
});

// Une fois que la page est chargée, on lance les chargements de données
window.addEventListener("DOMContentLoaded", () => {
  chargerPersonnels();
  chargerFormations();
});