// form-entrer.js
import { ENDPOINTS } from "./config-api.js";

// Chargement des personnels
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

// Chargement des formations
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

// Gestion dynamique du formulaire
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
    divPerso.classList.add("hidden");
    divForm.classList.add("hidden");

    personnelSelect.removeAttribute("required");
    formationSelect.removeAttribute("required");
    personnelSelect.value = "";
    formationSelect.value = "";
  }
});

// Initialisation
window.addEventListener("DOMContentLoaded", () => {
  chargerPersonnels();
  chargerFormations();
});
