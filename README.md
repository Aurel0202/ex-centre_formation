# Qui est là ? 🏫

Application web pour la gestion des entrées/sorties dans un centre de formation.  
Permet de savoir **qui est présent en temps réel dans le bâtiment** (visiteurs, personnel, formations), avec **dashboard admin sécurisé**.

---

## ✨ Fonctionnalités principales

### 📱 Côté visiteur (accueil / tablette)
- Formulaire d’entrée :
  - Saisie nom, prénom, email
  - Choix du motif : personnel ou formation
  - Génération automatique d’un ID (et QR code à venir)
- Connexion rapide (déjà inscrit)
  - Recherche par email
- Enregistrement de la **sortie** :
  - Via ID ou QR code (version 2)
- Gestion du **retour** (revenir après une sortie)

### 🛠 Côté admin (dashboard)
- Connexion sécurisée (avec rôle `administrator`)
- Affichage **live des présences**
- Consultation de l’**historique** des visites :
  - Filtres par date
  - Affichage des données visiteur, entrée/sortie, local
- Rôles utilisateurs :
  - `administrator` (accès complet WordPress)

---

## 🧰 Stack technique

| Partie | Technologie |
|--------|-------------|
| Backend | WordPress (Custom Post Types + ACF + REST API) |
| Frontend | HTML / CSS / JavaScript natif |
| Authentification | [Application Passwords](https://wordpress.org/plugins/application-passwords/) |
| Déploiement | [Netlify](https://www.netlify.com/) + GitHub |
| Gestion des rôles | [Members – User Role Editor](https://fr.wordpress.org/plugins/members/) |

---

## 🔐 Accès Admin

> ⚠️ Les identifiants ne sont pas stockés dans le dépôt pour des raisons de sécurité.

Pour te connecter :

- Aller sur `index.html` > section "Connexion administrateur"
- Saisir :
  - **Identifiant** : `ton_username_admin`
  - **Mot de passe** : _mot de passe d'application WordPress_
- Tu seras redirigé vers `admin/dashboard.html` si ton rôle est `administrator`.

---

## 🚀 Installation locale

1. Cloner le repo :
   ```bash
   git clone https://github.com/aurel0202/qui-est-la.git
   cd qui-est-la
