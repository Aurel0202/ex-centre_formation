// config-api.js
const mdp_api_visite = 'IBEX 2gS1 fffu vDhp FoKa 2XAQ';

export const API_BASE_URL = 'https://ingrwf12.cepegra-frontend.xyz/wp_aurelie/wp-json/wp/v2';
export const API_CUSTOM = 'https://ingrwf12.cepegra-frontend.xyz/wp_aurelie/wp-json/custom/v1';

export const ENDPOINTS = {
  formations: `${API_BASE_URL}/formation`,
  personnels: `${API_BASE_URL}/membre-du-personnel`,
  visites: `${API_BASE_URL}/visite`,
  visiteurs: `${API_BASE_URL}/visiteur`,
  visiteurs_email: `${API_CUSTOM}/person-par-email?email=`,
  users: `${API_BASE_URL}/users`
};

// 🔐 Fonction unique pour header après login
export function getAuthHeader() {
  const token = localStorage.getItem('auth');
  return token ? { 'Authorization': `Basic ${token}`, 'Content-Type': 'application/json' } : {};
}
