import { ENDPOINTS } from '../config-api.js';

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  const status = document.getElementById('adminLoginMessage');

  const token = btoa(`${username}:${password}`);
  const headers = {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const res = await fetch(`${ENDPOINTS.users}/me`, { headers });

    if (!res.ok) throw new Error("Identifiants invalides ou non autorisés");

    const user = await res.json();
    console.log("✅ Connecté en tant que :", user.name, "rôle :", user.role);

    // ✅ Stocker le token
    localStorage.setItem('auth', token);
    status.textContent = `Bienvenue ${user.name} 👋`;
    status.style.color = 'green';

    // 🔁 Rediriger vers dashboard
    window.location.href = 'admin/dashboard.html';

  } catch (err) {
    console.error(err);
    status.textContent = "Échec de la connexion.";
    status.style.color = 'red';
  }
});
