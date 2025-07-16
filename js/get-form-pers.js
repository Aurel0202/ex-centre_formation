import { ENDPOINTS, getAuthHeader } from './config-api.js';

document.getElementById('visiteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const email = formData.get('email');
  const nom = formData.get('nom');
  const prenom = formData.get('prenom');
  const personnel = formData.get('personnel_id') || null
  const formation = formData.get('formation_id') || null
console.log(personnel, formation)
const motif = (personnel) ? personnel : formation
  try {
    // 1. Chercher un visiteur par email
    const searchURL = `${ENDPOINTS.visiteurs_email}${encodeURIComponent(email)}`;
    console.log(searchURL)
    const searchResponse = await fetch(searchURL);
    console.log(searchResponse.status)
    const existing = await searchResponse.json();
    console.log(existing)
    let visiteurId;

    if (existing.length > 0) {
      // Visiteur trouvé
      visiteurId = existing[0].id;
      alert(visiteurId)
    } else {
      // 2. Créer un nouveau visiteur
      const newVisiteur = {
        title: `${prenom} ${nom}`,
        status: 'publish',
        fields: {
          "nom-visiteur": nom,
          "prenom-visiteur": prenom,
          "email-visiteur": email,
          "cle_unique": crypto.randomUUID()
        }
      }
console.log(newVisiteur)

      const createResponse = await fetch(ENDPOINTS.visiteurs, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(newVisiteur)
      });

      const created = await createResponse.json();
      visiteurId = created.id;
      console.log(visiteurId)
    }

    // 3. Préparer la visite
    const visite = {
      title: `Entrée ${new Date().toLocaleString()}`,
      status: 'publish',
      fields: {
        objet: formData.get('objet'),
        visiteur: visiteurId,
        "motif-visite": motif,
        date_entree: new Date().toISOString()
      }
    };

    // 4. Enregistrer la visite
    const response = await fetch(ENDPOINTS.visites, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(visite)
    });

    const result = await response.json();
    document.getElementById('message').textContent = result.message || 'Entrée enregistrée.';

  } catch (error) {
    console.error(error);
    document.getElementById('message').textContent = 'Erreur lors de l\'enregistrement.';
  }
});