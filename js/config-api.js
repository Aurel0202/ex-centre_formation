// config.js
const mdp_api_visite = 'IBEX 2gS1 fffu vDhp FoKa 2XAQ'
export const API_BASE_URL = 'https://ingrwf12.cepegra-frontend.xyz/wp_aurelie/wp-json/wp/v2';
export const API_CUSTOM = 'https://ingrwf12.cepegra-frontend.xyz/wp_aurelie/wp-json/custom/v1'

// Endpoints
export const ENDPOINTS = {
  formations: `${API_BASE_URL}/formation?per_page=100`,
  personnels: `${API_BASE_URL}/membre-du-personnel?per_page=100`,
  visites: `${API_BASE_URL}/visite`,
  visiteurs: `${API_BASE_URL}/visiteur`,
  visiteurs_email: `${API_CUSTOM}/person-par-email?email=`
};

// Identifiants pour POST (si auth requise)
export const AUTH = {
  username: 'aurelie',
  password: `${mdp_api_visite}`
};

// Fonction utilitaire pour créer l'en-tête d'authentification
export function getAuthHeader() {
  const token = btoa(`${AUTH.username}:${AUTH.password}`);
  return {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json'
  };
}
