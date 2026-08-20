# Documentation Microfolio

Bienvenue dans la documentation complète de **microfolio** ! 🎉

## À propos de Microfolio

microfolio est un générateur de portfolio statique moderne, conçu spécialement pour les créatifs : designers, architectes, photographes, artistes, graphistes, collectifs… Il vous permet de créer un site web professionnel pour présenter vos projets de manière élégante, sans avoir besoin de connaissances techniques approfondies.

### Caractéristiques principales

- ✨ **Interface moderne et épurée**
- 📱 **Responsive design** (mobile, tablette, desktop)
- 🎨 **Personnalisable** facilement
- 🚀 **Performances optimales** avec génération statique et optimisation des images au build (WebP)
- 🔍 **SEO friendly** avec métadonnées OG pour le partage social, `sitemap.xml` et `robots.txt`
- 🗺️ **Carte mondiale des projets** — MapLibre GL sur les tuiles vectorielles OpenFreeMap, sans clé API, styles clair et sombre
- 🏷️ **Système de tags et filtres** avec compteurs et liste repliable
- 📊 **Différents modes d'affichage** (grille, liste, carte)
- 🌐 **Prêt pour domaine personnalisé**
- 🌙 **Mode sombre** avec toggle et préférence persistante
- 🔗 **URLs partageables** — filtres, recherche, tri et pagination synchronisés dans l'URL
- 🌍 **Internationalisation** — anglais/français via svelte-i18n, support RTL
- 📄 **Pagination et tri** — lignes par page personnalisable, tri par date, titre, type ou localisation
- 🖼️ **Lightbox d'images** avec affichage des métadonnées EXIF/IPTC
- ⚖️ **Mentions légales et politique de confidentialité** — modèles de pages liés depuis le pied de page

## Structure de la documentation

### [0. Premiers pas — Guide du débutant](00-premiers-pas.md)

- Jamais ouvert un terminal ? Commencez ici
- Prérequis expliqués pas à pas (Mac et Windows)
- Premier projet, nommage des fichiers, introduction à Markdown
- Problèmes courants et solutions

### [1. Guide d'Installation](01-installation.md)

- Prérequis (Node.js, Git, pnpm)
- Installation du projet
- Premier lancement
- Dépannage

### [2. Guide de Configuration](02-configuration.md)

- Personnalisation des pages
- Configuration du domaine
- Customisation des couleurs et styles
- Configuration du mode sombre
- Internationalisation (locale)
- Métadonnées et SEO
- Fonctionnalités avancées

### [3. Préparation des images](03-preparation-images.md)

- Tailles, formats et nommage
- Les métadonnées EXIF/IPTC affichées par la lightbox, champ par champ
- Outils d'édition (Affinity Photo, exiftool)
- Vie privée : quoi retirer avant de publier

### [4. Guide d'Ajout de Projets](04-ajout-projets.md)

- Structure d'un projet
- Création de nouveaux projets
- Gestion des médias (images, vidéos)
- Métadonnées et organisation
- Bonnes pratiques

### [5. Guide de Publication](05-publication.md)

- Préparation pour la publication
- Build du site
- Publication sur GitHub Pages
- Domaines personnalisés
- Autres options d'hébergement
- Maintenance et mises à jour

## Démarrage rapide

### Option 1 : Installation via Homebrew (Recommandée pour Mac)

**Homebrew** est un gestionnaire de paquets pour macOS qui simplifie grandement l'installation :

```bash
# Approuver le tap AKER, puis installer microfolio
brew trust aker-dev/tap
brew install aker-dev/tap/microfolio

# Créer un nouveau portfolio
microfolio new mon-portfolio
cd mon-portfolio

# Démarrer le serveur de développement
microfolio dev
```

Votre site sera accessible à l'adresse : http://localhost:5555

**Avantages de cette méthode :**

- Installation automatique de toutes les dépendances (Node.js, pnpm, Git)
- Commandes simplifiées : `microfolio new`, `microfolio dev`, `microfolio build`
- Mise à jour facile avec `brew upgrade microfolio`

### Option 2 : Installation manuelle

```bash
# Cloner le repository
git clone https://github.com/aker-dev/microfolio.git mon-portfolio
cd mon-portfolio

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

### Personnalisation de base

1. **Éditez votre profil** dans `content/index.md` et `content/about.md`
2. **Ajoutez vos projets** dans `content/projects/`
3. **Renseignez votre adresse** dans `src/lib/config.js` (`url`)
4. **Testez localement** avec `pnpm run dev`
5. **Publiez** avec `pnpm run build`

## Note importante sur le terminal / ligne de commande

**Rassurez-vous !** Ce guide utilise le terminal (ou "ligne de commande"), mais **aucune connaissance technique n'est requise**. Vous devrez simplement taper ou copier-coller quelques commandes simples. C'est plus facile qu'il n'y paraît ! 😊

### Comment ouvrir le terminal

**Sur Mac :**

- Appuyez sur `Cmd + Espace` pour ouvrir Spotlight
- Tapez "Terminal" et appuyez sur Entrée
- Ou allez dans Applications > Utilitaires > Terminal

**Sur Windows :**

- Appuyez sur `Windows + R`
- Tapez "powershell" et appuyez sur Entrée
- Ou cherchez "PowerShell" dans le menu Démarrer

## Public cible

Cette documentation s'adresse principalement aux **créatifs non-développeurs** :

- 🏗️ **Architectes**
- 🎨 **Designers graphiques**
- 🖼️ **Artistes**
- 🏠 **Designers d'intérieur**
- 📸 **Photographes**
- ✏️ **Illustrateurs**
- 🌐 **Créateurs de contenu**

**Aucune connaissance technique approfondie n'est requise** pour utiliser Microfolio. Les guides sont conçus pour être accessibles à tous.

## Tutoriels vidéo (à venir)

Une série de courts tutoriels vidéo est en préparation. Sujets prévus :

1. **Installer microfolio avec Homebrew** — de zéro à un site qui tourne
2. **Votre premier projet** — dossier, `index.md`, images
3. **Le faire vôtre** — configuration, couleurs, mode sombre
4. **Publier sur GitHub Pages** — de votre ordinateur au web
5. **Utiliser un domaine personnalisé** — DNS et HTTPS sans larmes

Les liens seront ajoutés ici au fil des épisodes.

## Aide et support

### Ressources

- **Documentation officielle** : Ce dossier `doc/`
- **Exemples de projets** : Dossier `content/projects/`
- **[Issues GitHub](https://github.com/aker-dev/microfolio/issues)** : Pour reporter des bugs
- **[Discussions](https://github.com/aker-dev/microfolio/discussions)** : Pour poser des questions

### Contact

Pour toute question ou problème :

📧 **Email** : hello@aker.pro

Dans votre message, précisez :

- Votre système d'exploitation (Mac/Windows)
- Le problème rencontré
- Les étapes que vous avez suivies
- Une capture d'écran si possible

### Contribution

Vos contributions sont les bienvenues ! Consultez **[CONTRIBUER.md](../../CONTRIBUER.md)** pour :

- Améliorer la documentation
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Aider à traduire microfolio
- Partager vos réalisations

## Changelog

Consultez le changelog complet dans [CHANGELOG.md](../../CHANGELOG.md).

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer selon les termes de cette licence.

---

**Bonne création avec Microfolio ! 🎨**
