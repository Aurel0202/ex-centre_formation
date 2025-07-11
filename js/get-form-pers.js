document.getElementById('visiteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('./php/entrer.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    document.getElementById('message').textContent = result.message;
  } catch (error) {
    document.getElementById('message').textContent = 'Erreur de traitement.';
    console.error(error);
  }
});
