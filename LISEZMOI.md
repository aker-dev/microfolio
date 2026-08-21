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
- **🔒 Aucun cookie, aucun bandeau** — rien n'est pisté, donc il n'y a rien à faire accepter. Mentions légales et politique de confidentialité fournies en gabarits à remplir. Une adresse YouTube ou Vimeo seule sur sa ligne devient un lecteur, qui passe par les modes sans cookies des plateformes
- **📄 Pagination et tri** — Lignes par page personnalisable, tri par date, titre, type ou localisation

## 🔒 La vie privée par construction

Un portfolio n'a pas à surveiller ses lecteurs, et celui-ci en est incapable.

- **Aucun cookie.** `document.cookie` n'apparaît nulle part dans le code
- **Aucune mesure d'audience**, aucun script de suivi, aucun formulaire. La démo
  embarque une vidéo YouTube, en mode sans cookies — et le dit dans sa page
  de confidentialité
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

- **[Premiers pas](doc/fr/00-premiers-pas.md)** - Guide du débutant, aucune expérience du terminal requise
- **[Guide d'installation](doc/fr/01-installation.md)** - Installation et prérequis
- **[Configuration](doc/fr/02-configuration.md)** - Personnalisation du site
- **[Préparation des images](doc/fr/03-preparation-images.md)** - Tailles, formats et métadonnées
- **[Ajout de projets](doc/fr/04-ajout-projets.md)** - Créer et organiser vos projets
- **[Publication](doc/fr/05-publication.md)** - Déployer votre portfolio

## 🚀 Déploiement

📖 **Guide de déploiement complet** : [doc/fr/05-publication.md](doc/fr/05-publication.md)

### Déploiement rapide sur GitHub Pages

```bash
# Construire le site
microfolio build  # ou pnpm build

# Activer GitHub Pages dans les paramètres du dépôt (Source : GitHub Actions)
# Pousser vers la branche preview — déploiement automatique
```

## 🤝 Contribution

microfolio se construit au grand jour, et toutes les aides comptent :

- 🐛 **Un bug ?** [Ouvrez une issue](https://github.com/aker-dev/microfolio/issues)
- 💡 **Une idée ?** [Lancez une discussion](https://github.com/aker-dev/microfolio/discussions)
- 🌍 **Vous parlez une autre langue ?** Aidez à traduire microfolio — écrivez à **hello@aker.pro**
- 🔧 **Envie de coder ?** Forkez le projet, créez une branche de fonctionnalité et soumettez une Pull Request

Consultez **[CONTRIBUER.md](CONTRIBUER.md)** pour les détails, et le **[changelog](CHANGELOG.md)** pour les nouveautés.

## 📞 Support

- 🐛 **Problèmes** : [GitHub Issues](https://github.com/aker-dev/microfolio/issues)
- 💬 **Questions** : [GitHub Discussions](https://github.com/aker-dev/microfolio/discussions)
- 📧 **Email** : hello@aker.pro

## 🙏 Filiation

microfolio doit son idée fondatrice à **[Subfolio](https://github.com/area17/subfolio)** d'[Area 17](https://area17.com) : un portfolio qui n'est rien d'autre qu'un dossier de fichiers, bien montré. Subfolio l'a prouvé il y a des années ; microfolio porte l'idée vers un générateur statique et respectueux de la vie privée pour le web d'aujourd'hui. Merci, Area 17.

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
