# microfolio

_[🇺🇸 Read in English](README.md)_

Un générateur de portfolio statique moderne développé avec **SvelteKit 2** et **Tailwind CSS 4** par AKER. Il intègre un système de gestion de contenu basé sur des fichiers utilisant des dossiers et des fichiers Markdown. Idéal pour les designers, artistes, architectes et créatifs qui souhaitent présenter leurs projets avec élégance et professionnalisme.

**Démo en ligne** : [https://aker-dev.github.io/microfolio/](https://aker-dev.github.io/microfolio/)

> **Nous recherchons des traducteurs !** Aidez-nous à rendre microfolio accessible dans plus de langues. Contactez-nous à **hello@aker.pro** si vous souhaitez contribuer une traduction.

## ✅ Fonctionnalités

- **📁 CMS basé sur des fichiers** — Pas de base de données, juste des dossiers et des fichiers Markdown
- **🎨 Vues multiples** — Grille de projets, Liste et Carte
- **📱 Design responsive** — Conçu avec une approche mobile-first
- **🏷️ Étiquetage intelligent** — Compteurs de filtres et liste de tags repliable
- **🗺️ Carte interactive** — MapLibre GL et projets géolocalisés, en clair et en sombre, sur un fond OpenStreetMap
- **🚀 Génération statique** — Performances optimales avec SvelteKit adapter-static
- **🖼️ Lightbox d'images** — Galerie améliorée avec flèches de navigation et affichage des métadonnées
- **📊 Métadonnées EXIF/IPTC** — Extraction et affichage automatique des informations techniques d'images
- **🌙 Mode sombre** — Toggle dans le footer avec préférence persistante (système / manuel / localStorage)
- **⚡ Optimisation des images** — Vignettes WebP et images de partage, générées pendant le build
- **🔗 URLs partageables** — Filtres, recherche, tri et pagination synchronisés dans les paramètres d'URL
- **🌐 Internationalisation** — Anglais/Français via svelte-i18n, support RTL
- **🏷️ Partageable et indexable** — Balises Open Graph et Twitter en URL absolues, liens canoniques, et un `sitemap.xml` et `robots.txt` générés depuis vos projets
- **🔒 Aucun cookie, aucun bandeau** — rien n'est pisté, donc il n'y a rien à faire accepter. Mentions légales et politique de confidentialité fournies en gabarits à remplir
- **📄 Pagination et tri** — Lignes par page personnalisable, tri par date, titre, type ou localisation

## 🔒 La vie privée par construction

Un portfolio n'a pas à surveiller ses lecteurs, et celui-ci en est incapable.

- **Aucun cookie.** `document.cookie` n'apparaît nulle part dans le code
- **Aucune mesure d'audience**, aucun script de suivi, aucun embed social, aucun
  formulaire
- **Aucun bandeau de consentement, parce qu'aucun n'est requis.** La seule chose
  conservée sur l'appareil du visiteur est le choix clair/sombre qu'il a fait
  lui-même, dans `localStorage` sous la clé `theme`. Une préférence d'interface
  de cette nature est exemptée de consentement : elle ne fait que ce qu'on lui a
  demandé
- **Pas de Google Fonts.** La police vient de Bunny.net, un CDN tiers, qui reçoit
  donc les adresses IP des visiteurs comme tout serveur de fichiers. C'est
  déclaré dans le gabarit de confidentialité plutôt que passé sous silence
- **Une carte sans clé d'API ni compte** — OpenFreeMap, sur données
  OpenStreetMap. Ses tuiles ne sont demandées que sur la page carte

Le site généré fournit `content/legal.md` et `content/privacy.md` en gabarits.
**Remplissez-les** : publier les mentions légales d'autrui est pire que de n'en
publier aucune.

## ⚡ Rapide, et trouvable

Chaque page est prérendue : le contenu est dans le HTML, donc lisible sans
JavaScript et visible des moteurs de recherche sans qu'ils exécutent quoi que ce
soit.

Mesuré sur la démo publiée, sur un écran de téléphone bridé en 4G lente avec un
processeur quatre fois plus lent — les conditions de PageSpeed, médiane de trois
passages :

| Page    | Premier rendu | Plus grand rendu | Blocage |
| ------- | ------------- | ---------------- | ------- |
| Accueil | 780 ms        | 780 ms           | 0 ms    |
| Projets | 808 ms        | 808 ms           | 26 ms   |
| Liste   | 808 ms        | 808 ms           | 45 ms   |
| Carte   | 884 ms        | 884 ms           | 589 ms  |

**La carte fait exception, et il faut le dire** : un moteur cartographique pèse
environ 380 ko compressés, et aucun réglage ne rend cela gratuit. Toutes les
autres pages ne transportent presque rien.

Ce qui y contribue : vignettes et images de partage 1200×630 générées au build,
police chargée en parallèle plutôt qu'à la suite de la feuille de style, vidéo
téléchargée seulement à la lecture, et images qui réservent leur place pour que
rien ne saute.

Pour les moteurs et les liens partagés : titre, description, lien canonique et
balises Open Graph et Twitter sur chaque page, ainsi qu'un `sitemap.xml` et un
`robots.txt` engendrés depuis vos propres projets.

## 🧪 Programme de beta tests

**Nous recherchons des testeurs !** Vous êtes créatif et souhaitez tester microfolio ?

👉 **[Guide Beta-testeur](doc/fr/guide-beta-testeurs.md)** - Guide complet pour débuter

📧 Contactez **hello@aker.pro** pour rejoindre le programme de test.

## 🚀 Démarrage rapide

### Option 1 : Installation via Homebrew (macOS - Recommandée)

```bash
# Installer microfolio via Homebrew
brew trust aker-dev/tap
brew install aker-dev/tap/microfolio

# Créer un nouveau portfolio
microfolio new mon-portfolio
cd mon-portfolio

# Lancer le serveur de développement
microfolio dev
```

### Option 2 : Installation manuelle

#### Prérequis

- Node.js 22.13 ou supérieur (requis par pnpm 11 ; testé avec 22.x et 24.x)
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

### Fonctionnalités récentes (v0.11.0)

- **`pnpm test:smoke` parcourt le site construit**, et non le serveur de développement — les suites précédentes se terminent avant même que le build commence, si bien que rien ne chargeait l'artefact réellement publié. Une carte blanche a atteint la production par ce chemin
- **Mentions légales et politique de confidentialité**, fournies en gabarits à remplir — un site publié en France en a l'obligation, et la plupart des modèles en ligne citent encore un article de la LCEN abrogé en mai 2024
- **Aucun bandeau de consentement, et l'explication de ce choix** : rien ici n'exige de consentement, le demander relèverait du théâtre

> Node.js 22.13 ou supérieur est requis (dépendance de pnpm 11).

## 📞 Support

- 🐛 **Problèmes** : [GitHub Issues](https://github.com/aker-dev/microfolio/issues)
- 📧 **Email** : hello@aker.pro
- 💬 **Discussions** : GitHub Discussions pour vos questions

## 📄 Licence

Licence MIT - Consultez le fichier [LICENSE](LICENSE) pour plus de détails.

## 🖥️ Captures d'écran

### Page d'accueil

![microfolio Page d'accueil](doc/screenshots/microfolio_home.png)

### Vues des projets

![microfolio Galerie des projets](doc/screenshots/microfolio_projects.png)
![microfolio Détail de projet 1](doc/screenshots/microfolio_project_01.png)
![microfolio Détail de projet 2](doc/screenshots/microfolio_project_02.png)

La lightbox affiche l'image en pleine hauteur, avec son titre, sa légende, son crédit et ses métadonnées EXIF dans un panneau qu'on ouvre à la demande :

![microfolio Lightbox avec les métadonnées de l'image](doc/screenshots/microfolio_lightbox.png)

### Vue liste

![microfolio Vue liste](doc/screenshots/microfolio_list.png)

### Vue carte

![microfolio Carte interactive](doc/screenshots/microfolio_map.png)

### Mode sombre

Suit la préférence du système, avec un bouton dans le pied de page qui mémorise votre choix.

![microfolio Page d'accueil en mode sombre](doc/screenshots/microfolio_home_dark.png)
![microfolio Détail de projet en mode sombre](doc/screenshots/microfolio_project_dark.png)
![microfolio Vue liste en mode sombre](doc/screenshots/microfolio_list_dark.png)
![microfolio Carte en mode sombre](doc/screenshots/microfolio_map_dark.png)
![microfolio Lightbox en mode sombre](doc/screenshots/microfolio_lightbox_dark.png)

---

**Développé avec ❤️ par AKER**
