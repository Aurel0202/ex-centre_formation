// Clé secrète pour accéder à certaines routes personnalisées de l'API (non utilisée dans ce fichier mais présente pour d'autres appels)
const mdp_api_admin = 'IBEX2gS1fffuvDhpFoKa2XAQ';
const email_admin = 'aurelie.anciaux@outlook.com';

// URL de base de l'API REST WordPress (référence au namespace WP standard)
export const API_BASE_URL = 'https://ingrwf12.cepegra-frontend.xyz/wp_aurelie/wp-json/wp/v2';

// URL de base de l'API personnalisée (custom endpoints créés via plugin ou functions.php)
export const API_CUSTOM = 'https://ingrwf12.cepegra-frontend.xyz/wp_aurelie/wp-json/custom/v1';

// Définition des points d'accès aux différentes ressources de l'application
export const ENDPOINTS = {
  formations: `${API_BASE_URL}/formation`,               // Liste des formations
  personnels: `${API_BASE_URL}/membre-du-personnel`,    // Liste des membres du personnel
  visites: `${API_BASE_URL}/visite`,                    // Liste et enregistrement des visites
  visiteurs: `${API_BASE_URL}/visiteur`,                // Liste et enregistrement des visiteurs
  visiteurs_email: `${API_CUSTOM}/person-par-email?email=`, // Recherche de visiteur par email
  users: `${API_BASE_URL}/users`                        // Accès aux données utilisateurs (authentification)
};

// Fonction utilitaire qui génère l'en-tête d'autorisation à partir du token stocké en localStorage
export function getAuthHeader() {
  const token = localStorage.getItem('auth');
  return token ? { 'Authorization': `Basic ${token}`, 'Content-Type': 'application/json' } : {};
}
