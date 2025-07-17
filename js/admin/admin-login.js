import { ENDPOINTS } from './config-api.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const status = document.getElementById('loginStatus');

  const token = btoa(`${username}:${password}`);
  const headers = {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const res = await fetch(`${ENDPOINTS.users}/me`, { headers });

    if (!res.ok) throw new Error("Identifiants invalides ou non autorisé");

    const user = await res.json();

    // ✅ Authentifié, on sauvegarde le token
    localStorage.setItem('auth', token);
    status.textContent = `Bienvenue ${user.name} 👋`;
    status.style.color = 'green';

    // 🔁 Rediriger vers dashboard
    window.location.href = 'dashboard.html';

  } catch (err) {
    console.error(err);
    status.textContent = "Échec de la connexion.";
    status.style.color = 'red';
  }
});
