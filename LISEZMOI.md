# microfolio

_[🇺🇸 Read in English](README.md)_

Un générateur de portfolio statique moderne développé avec **SvelteKit 2** et **Tailwind CSS 4** par AKER. Il intègre un système de gestion de contenu basé sur des fichiers utilisant des dossiers et des fichiers Markdown. Idéal pour les designers, artistes, architectes et créatifs qui souhaitent présenter leurs projets avec élégance et professionnalisme.

**Démo en ligne** : [https://aker-dev.github.io/microfolio/](https://aker-dev.github.io/microfolio/)

## ✅ Fonctionnalités

- **📁 CMS basé sur des fichiers** - Fonctionnement sans base de données
- **🎨 Vues multiples** - Modes Projets, Liste et Carte
- **📱 Design responsive** - Conçu avec une approche mobile-first
- **🏷️ Étiquetage intelligent** - Système de filtrage avancé
- **🗺️ Carte interactive** - Intégration Leaflet
- **🚀 Génération statique** - Performances optimisées
- **🖼️ Lightbox d'images** - Galerie améliorée avec navigation et affichage des métadonnées
- **📊 Métadonnées EXIF/IPTC** - Extraction et affichage automatique des informations techniques d'images
- **🌙 Mode sombre** - Support de thème intégré pour une meilleure expérience de visualisation
- **⚡ Optimisation des images** - Génération de thumbnails WebP avec commande `pnpm optimize-images`

## 🧪 Programme de beta tests

**Nous recherchons des testeurs !** Vous êtes créatif et souhaitez tester microfolio ?

👉 **[Guide Beta-testeur](doc/fr/guide-beta-testeurs.md)** - Guide complet pour débuter

📧 Contactez **hello@aker.pro** pour rejoindre le programme de test.

## 🚀 Démarrage rapide

### Option 1 : Installation via Homebrew (macOS - Recommandée)

```bash
# Installer microfolio via Homebrew
brew install aker-dev/tap/microfolio

# Créer un nouveau portfolio
microfolio new mon-portfolio
cd mon-portfolio

# Lancer le serveur de développement
microfolio dev
```

### Option 2 : Installation manuelle

#### Prérequis

- Node.js LTS 20+ (testé avec la version 20.x)
- Gestionnaire de paquets pnpm
- Git pour le contrôle de version

```bash
# Cloner le modèle
git clone https://github.com/aker-dev/microfolio.git mon-portfolio
cd mon-portfolio

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

📖 **Guide d'installation détaillé** : [doc/fr/01-installation.md](doc/fr/01-installation.md)

## 🖥️ Captures d'écran

### Vues de la page d'accueil

![microfolio Page d'accueil 1](doc/screenshots/microfolio_home_01.png)
![microfolio Page d'accueil 2](doc/screenshots/microfolio_home_02.png)

### Vues des projets

![microfolio Galerie des projets](doc/screenshots/microfolio_projects.png)
![microfolio Détail de projet 1](doc/screenshots/microfolio_project_01.png)
![microfolio Détail de projet 2](doc/screenshots/microfolio_project_02.png)

### Vue liste

![microfolio Vue liste](doc/screenshots/microfolio_list.png)

### Vue carte

![microfolio Carte interactive](doc/screenshots/microfolio_map.png)

## 📚 Documentation

- **[Guide d'installation](doc/fr/01-installation.md)** - Installation et prérequis
- **[Configuration](doc/fr/02-configuration.md)** - Personnalisation du site
- **[Ajout de projets](doc/fr/03-ajout-projets.md)** - Créer et organiser vos projets
- **[Publication](doc/fr/04-publication.md)** - Déployer votre portfolio
- **[Guide Bêta-testeur](doc/fr/guide-beta-testeurs.md)** - Guide destiné aux bêta-testeurs

## 🚀 Déploiement

📖 **Guide de déploiement complet** : [doc/fr/04-publication.md](doc/fr/04-publication.md)

### Déploiement rapide sur GitHub Pages

```bash
# Construire le site
microfolio build  # ou pnpm build

# Activer GitHub Pages dans les paramètres du dépôt
# Pousser vers la branche main pour un déploiement automatique
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à forker le projet, créer une branche de fonctionnalité et soumettre une Pull Request.

### Fonctionnalités récentes

- Carte interactive avec Leaflet
- Vue Liste avancée avec filtrage
- Design entièrement responsive
- Déploiement automatisé via GitHub Actions
- Support des domaines personnalisés

## 📞 Support

- 🐛 **Problèmes** : [GitHub Issues](https://github.com/aker-dev/microfolio/issues)
- 📧 **Email** : hello@aker.pro
- 💬 **Discussions** : GitHub Discussions pour vos questions

## 📄 Licence

Licence MIT - Consultez le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Développé avec ❤️ par AKER**
