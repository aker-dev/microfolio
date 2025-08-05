# Documentation Microfolio

Bienvenue dans la documentation complète de **microfolio** ! 🎉

## À propos de Microfolio

microfolio est un générateur de portfolio statique moderne, conçu spécialement pour les créatifs : designers, architectes, photographes, artistes, graphistes, collectifs… Il vous permet de créer un site web professionnel pour présenter vos projets de manière élégante, sans avoir besoin de connaissances techniques approfondies.

### Caractéristiques principales

- ✨ **Interface moderne et épurée**
- 📱 **Responsive design** (mobile, tablette, desktop)
- 🎨 **Personnalisable** facilement
- 🚀 **Performances optimales**
- 🔍 **SEO friendly**
- 🗺️ **Affichage sur carte** des projets géolocalisés
- 🏷️ **Système de tags et filtres**
- 📊 **Différents modes d'affichage** (grille, liste, carte)
- 🌐 **Prêt pour domaine personnalisé**

## Structure de la documentation

### [1. Guide d'Installation](01-installation.md)
- Prérequis (Node.js, Git, pnpm)
- Installation du projet
- Premier lancement
- Dépannage

### [2. Guide de Configuration](02-configuration.md)
- Personnalisation des pages
- Configuration du domaine
- Customisation des couleurs et styles
- Métadonnées et SEO
- Fonctionnalités avancées

### [3. Guide d'Ajout de Projets](03-ajout-projets.md)
- Structure d'un projet
- Création de nouveaux projets
- Gestion des médias (images, vidéos)
- Métadonnées et organisation
- Bonnes pratiques

### [4. Guide de Publication](04-publication.md)
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
# Installer microfolio via Homebrew
brew install aker-dev/tap/microfolio

# Créer un nouveau portfolio
microfolio new mon-portfolio
cd mon-portfolio

# Démarrer le serveur de développement
microfolio dev
```

Votre site sera accessible à l'adresse : http://localhost:5173

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
3. **Configurez votre domaine** dans `static/CNAME`
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

## Aide et support

### Ressources

- **Documentation officielle** : Ce dossier `doc/`
- **Exemples de projets** : Dossier `content/projects/`
- **Issues GitHub** : Pour reporter des bugs
- **Discussions** : Pour poser des questions

### Contact

Pour toute question ou problème :

📧 **Email** : hello@aker.pro

Dans votre message, précisez :
- Votre système d'exploitation (Mac/Windows)
- Le problème rencontré
- Les étapes que vous avez suivies
- Une capture d'écran si possible

### Contribution

Vos contributions sont les bienvenues ! N'hésitez pas à :

- Améliorer la documentation
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Partager vos réalisations

## Changelog

### Version 0.1.0-beta.1
- Documentation complète en français
- Guides détaillés pour non-développeurs
- Exemples pratiques
- Structure modulaire

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer selon les termes de cette licence.

---

**Bonne création avec Microfolio ! 🎨**