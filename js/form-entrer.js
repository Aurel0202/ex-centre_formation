// Chargement des personnels
async function chargerPersonnels() {
  const response = await fetch('./php/get-personnels.php');
  const data = await response.json();
  const select = document.getElementById('personnel');
  data.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.prenom} ${p.nom}`;
    select.appendChild(option);
  });
}

// Chargement des formations
async function chargerFormations() {
  const response = await fetch('./php/get-formations.php');
  const data = await response.json();
  const select = document.getElementById('formation');
  data.forEach(f => {
    const option = document.createElement('option');
    option.value = f.id;
    option.textContent = f.intitule;
    select.appendChild(option);
  });
}

// Gestion dynamique du formulaire
document.getElementById('objet').addEventListener('change', (e) => {
  const valeur = e.target.value;
  const divPerso = document.getElementById('select-personnel');
  const divForm = document.getElementById('select-formation');

  const personnelSelect = document.getElementById('personnel');
  const formationSelect = document.getElementById('formation');

  if (valeur === 'personnel') {
    divPerso.classList.remove('hidden');
    personnelSelect.setAttribute('required', true);

    divForm.classList.add('hidden');
    formationSelect.removeAttribute('required');
    formationSelect.value = ""; // reset
  } else if (valeur === 'formation') {
    divForm.classList.remove('hidden');
    formationSelect.setAttribute('required', true);

    divPerso.classList.add('hidden');
    personnelSelect.removeAttribute('required');
    personnelSelect.value = ""; // reset
  } else {
    divPerso.classList.add('hidden');
    divForm.classList.add('hidden');

    personnelSelect.removeAttribute('required');
    formationSelect.removeAttribute('required');

    personnelSelect.value = "";
    formationSelect.value = "";
  }
});

// Appel au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  chargerPersonnels();
  chargerFormations();
});
