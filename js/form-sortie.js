document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sortieForm');
  const message = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    if (!email) {
      message.textContent = 'Veuillez entrer un email.';
      return;
    }

    try {
      const response = await fetch('php/sortie.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${encodeURIComponent(email)}`
      });

      const result = await response.json();
      message.textContent = result.message;
    } catch (error) {
      message.textContent = 'Une erreur est survenue.';
    }
  });
});
