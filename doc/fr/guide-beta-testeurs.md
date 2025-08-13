# Guide de prise en main microfolio - Beta-testeurs été 2025

## Bienvenue !

Bienvenue dans le programme de beta-test de **microfolio** ! 🎉

microfolio est un générateur de portfolio statique moderne, conçu spécialement pour les créatifs : designers, architectes, photographes, artistes, graphistes, collectifs… Il vous permet de créer un site web professionnel pour présenter vos projets de manière élégante, sans avoir besoin de connaissances techniques approfondies.

Cette **première phase de test** se concentre sur le travail en local (sur votre ordinateur).

Une **seconde phase** suivra pour tester la publication (build) et l'hébergement des sites en ligne.

**Merci** de participer à cette phase de test ! Votre aide est précieuse pour améliorer l'outil et le rendre plus accessible aux créatifs de tous horizons.

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

## Votre mission en tant que beta-testeur

En tant que beta-testeur, voici votre mission :

### ✅ Tester la procédure d'installation

- Suivre ce guide étape par étape
- Noter les difficultés rencontrées
- Vérifier que tous les prérequis sont clairs

### ✅ Tester le travail en serveur local

- Lancer le serveur de développement
- Naviguer dans l'interface
- Tester les différentes vues (projets, liste, carte)

### ✅ Ajouter quelques projets personnels

- Créer une dizaine projets avec vos propres créations
- Tester l'ajout d'images, vidéos et documents
- Vérifier que l'affichage est correct

### ✅ Faire des retours constructifs

Envoyez vos retours à **hello@aker.pro** en précisant :

- **Bugs** rencontrés (avec captures d'écran et détails si possible)
- **Demandes de fonctionnalités** qui vous sembleraient utiles
- **Erreurs ou imprécisions** dans cette documentation
- **Suggestions d'amélioration** de l'interface

## Installation des prérequis

### Pour Mac

#### Option 1 : Installation via Homebrew (Recommandée)

**Homebrew** est un gestionnaire de paquets pour macOS qui simplifie grandement l'installation de logiciels de développement.

1. **Installer Homebrew** (si vous ne l'avez pas déjà) :
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Installer microfolio via Homebrew** :
   ```bash
   brew install aker-dev/tap/microfolio
   ```

3. **Créer un nouveau portfolio** :
   ```bash
   microfolio new mon-portfolio
   cd mon-portfolio
   ```

4. **Démarrer le serveur de développement** :
   ```bash
   microfolio dev
   ```

Votre site sera accessible à l'adresse : http://localhost:5173

**Avantages de cette méthode :**
- Installation automatique de toutes les dépendances (Node.js, pnpm, Git)
- Commandes simplifiées : `microfolio new`, `microfolio dev`, `microfolio build`
- Mise à jour facile avec `brew upgrade microfolio`

#### Option 2 : Installation manuelle

Si vous préférez l'installation manuelle ou rencontrez des problèmes avec Homebrew :

#### 1. Installer Node.js

1. Rendez-vous sur https://nodejs.org/
2. Téléchargez la version LTS (recommandée)
3. Ouvrez le fichier `.pkg` téléchargé et suivez l'assistant
4. **Fermez et relancez le Terminal** pour que l'installation soit prise en compte
5. Vérifiez l'installation en tapant :
   ```bash
   node --version
   ```
   Vous devriez voir un numéro de version (ex: v20.11.0)

#### 2. Installer Git

1. Ouvrez le Terminal
2. Tapez la commande suivante :
   ```bash
   xcode-select --install
   ```
3. Un logiciel d'installation va s'ouvrir automatiquement
4. Suivez les instructions à l'écran pour installer les outils de développement Xcode
5. **Fermez et relancez le Terminal** pour que l'installation soit prise en compte
6. Vérifiez l'installation une fois terminée :
   ```bash
   git --version
   ```

#### 3. Installer pnpm

1. Ouvrez le Terminal
2. Tapez la commande suivante :
   ```bash
   curl -fsSL https://get.pnpm.io/install.sh | sh
   ```
3. **Fermez et relancez le Terminal** pour que l'installation soit prise en compte (ou tapez `source ~/.zshrc` dans le terminal actuel)
4. Vérifiez l'installation :
   ```bash
   pnpm --version
   ```

### Pour Windows

#### 1. Installer Node.js

1. Rendez-vous sur https://nodejs.org/
2. Téléchargez la version LTS (recommandée)
3. Ouvrez le fichier `.msi` téléchargé et suivez l'assistant
4. **Fermez et relancez PowerShell** pour que l'installation soit prise en compte
5. Vérifiez l'installation en tapant :
   ```bash
   node --version
   ```

#### 2. Installer Git

1. Téléchargez Git depuis https://git-scm.com/download/win
2. Ouvrez le fichier `.exe` et suivez l'assistant
3. Laissez les options par défaut
4. **Fermez et relancez PowerShell** pour que l'installation soit prise en compte
5. Vérifiez l'installation :
   ```bash
   git --version
   ```

#### 3. Installer pnpm

1. Ouvrez PowerShell en tant qu'administrateur
2. Tapez :
   ```bash
   Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
   ```
3. **Fermez et relancez PowerShell** pour que l'installation soit prise en compte
4. Vérifiez l'installation :
   ```bash
   pnpm --version
   ```

## Commandes de base essentielles

### La commande `cd` (Change Directory)

Permet de naviguer entre les dossiers :

```bash
cd Documents          # Aller dans le dossier Documents
cd ..                 # Remonter d'un niveau
cd /                  # Aller à la racine (Mac/Linux)
cd C:\                # Aller à la racine (Windows)
```

### Les commandes Git

```bash
git clone [url]       # Télécharger un projet
git status            # Voir l'état des fichiers
git add .             # Ajouter tous les changements
git commit -m "msg"   # Enregistrer les changements
```

### Les commandes pnpm

```bash
pnpm install          # Installer les dépendances
pnpm dev              # Lancer le serveur de développement
pnpm build            # Construire le site pour la production
```

## Choix du répertoire de travail

### Sur Mac

1. Ouvrez le Terminal
2. Naviguez vers votre dossier Documents :
   ```bash
   cd ~/Documents
   ```
3. Ou créez un dossier dédié :
   ```bash
   mkdir ~/Documents/Projets-Web
   cd ~/Documents/Projets-Web
   ```

### Sur Windows

1. Ouvrez PowerShell
2. Naviguez vers vos Documents :
   ```bash
   cd %USERPROFILE%\Documents
   ```
3. Ou créez un dossier dédié :
   ```bash
   mkdir %USERPROFILE%\Documents\Projets-Web
   cd %USERPROFILE%\Documents\Projets-Web
   ```

## Téléchargement de microfolio

### Si vous avez installé via Homebrew

Utilisez directement la commande `microfolio` :

```bash
microfolio new mon-portfolio
cd mon-portfolio
```

### Si vous avez fait l'installation manuelle

Une fois dans votre répertoire de travail :

```bash
git clone https://github.com/aker-dev/microfolio.git mon-portfolio
cd mon-portfolio
pnpm install
```

**Explication :**

- `git clone` télécharge le projet
- `mon-portfolio` est le nom du dossier créé (vous pouvez le changer)
- `cd mon-portfolio` entre dans le dossier
- `pnpm install` installe toutes les dépendances nécessaires

## Travailler sur votre site

### Démarrer le serveur de développement

#### Si vous avez installé via Homebrew

À chaque fois que vous voulez travailler sur votre site :

1. **Ouvrez un terminal**
2. **Naviguez vers votre dossier portfolio** :
   ```bash
   cd chemin/vers/mon-portfolio
   ```
3. **Lancez le serveur** :
   ```bash
   microfolio dev
   ```
4. **Ouvrez votre navigateur** et allez sur http://localhost:5173

#### Si vous avez fait l'installation manuelle

À chaque fois que vous voulez travailler sur votre site :

1. **Ouvrez un terminal** (Terminal sur Mac, PowerShell sur Windows)
2. **Naviguez vers votre dossier microfolio** :
   ```bash
   cd chemin/vers/mon-portfolio
   ```
3. **Lancez le serveur** :
   ```bash
   pnpm dev
   ```
4. **Ouvrez votre navigateur** et allez sur http://localhost:5173

Le serveur reste actif tant que la fenêtre du terminal reste ouverte. Pour l'arrêter, appuyez sur `Ctrl+C` dans le terminal.

### Travailler efficacement

- **Modifications en temps réel** : Dès que vous modifiez un fichier, le navigateur se rafraîchit automatiquement
- **Garder le terminal ouvert** : Ne fermez pas la fenêtre du terminal pendant que vous travaillez
- **Un seul serveur à la fois** : Vous ne pouvez avoir qu'un seul serveur qui tourne par projet

## Ajouter un nouveau projet

### Étape 1 : Créer le dossier

1. Allez dans le dossier `content/projects/`
2. Créez un nouveau dossier pour votre projet (exemple : `mon-premier-projet`)
3. Le nom du dossier doit être en minuscules, sans espaces ni caractères spéciaux

### Étape 2 : Copier la structure de base

Le plus simple est de copier le dossier `example-project` :

```bash
cp -r content/projects/example-project content/projects/mon-premier-projet
```

### Étape 3 : Modifier le fichier index.md

Ouvrez le fichier `content/projects/mon-premier-projet/index.md` et modifiez :

```markdown
---
title: 'Le titre de mon projet'
date: '2024-01-15'
location: 'Paris, France'
coordinates: [48.8566, 2.3522] # Optionnel, pour la carte
description: 'Une description courte de mon projet'
type: 'architecture' # ou 'design', 'art', 'photography', etc.
tags: ['architecture', 'moderne', 'durable']
authors:
  - name: 'Votre Nom'
    role: 'Architecte'
featured: true # true pour mettre en avant
---

## Description

Ici, décrivez votre projet en détail...
```

### Étape 4 : Ajouter vos fichiers

- **Thumbnail** : Remplacez `thumbnail.jpg` par votre image de couverture
- **Images** : Ajoutez vos images dans le dossier `images/`
- **Vidéos** : Ajoutez vos vidéos dans le dossier `videos/`
- **Documents** : Ajoutez vos PDF/documents dans le dossier `documents/`

## Conseils de nommage et préparation des fichiers

### Nommage des fichiers

- **Pas d'espaces** : `mon-image.jpg` ✅ au lieu de `mon image.jpg` ❌
- **Caractères simples** : évitez les accents, cédilles, caractères spéciaux
- **Minuscules** : préférez les noms en minuscules
- **Descriptifs** : `facade-principale.jpg` plutôt que `IMG_001.jpg`

### Préparation des images

- **Thumbnail** : 800x600 pixels minimum, format 4:3 recommandé
- **Images galerie** : 1920px de large maximum
- **Formats supportés** : JPG, PNG, WebP, SVG
- **Compression** : Utilisez des outils comme TinyPNG pour réduire la taille

### Préparation des vidéos

- **Format** : MP4 H.264 pour une compatibilité maximale
- **Taille** : Moins de 50 Mo par vidéo
- **Alternative** : Pour les vidéos plus lourdes, utilisez YouTube ou Vimeo et mettez le lien dans le texte

### Documents

- **Formats** : PDF, DOC, DOCX, PPT, PPTX
- **Noms** : Évitez les espaces et caractères spéciaux
- **Taille** : Raisonnable pour un téléchargement web

## Introduction au Markdown

Le Markdown est un langage de mise en forme simple que vous utilisez dans vos fichiers `index.md`.

### Syntaxe de base

```markdown
# Titre principal

## Titre secondaire

### Titre tertiaire

**Texte en gras**
_Texte en italique_

- Liste à puces
- Item 2
- Item 3

1. Liste numérotée
2. Item 2
3. Item 3

[Lien vers un site](https://example.com)
![Image](images/mon-image.jpg)
```

### Exemples pratiques

```markdown
## Concept du projet

Ce projet explore la **relation entre l'espace et la lumière** dans l'architecture contemporaine.

### Matériaux utilisés

- Béton brut
- Verre thermoformé
- Acier corten

### Étapes du projet

1. Recherche et analyse du site
2. Esquisse et conception
3. Développement technique
4. Réalisation

![Vue d'ensemble du projet](images/vue-ensemble.jpg)

Pour plus de détails, consultez le [dossier technique](documents/specifications.pdf).
```

### Conseils Markdown

- **Sauts de ligne** : Laissez une ligne vide entre les paragraphes
- **Images** : Placez-les dans le dossier `images/` et référencez-les avec `images/nom-image.jpg`
- **Liens** : Utilisez `[texte](url)` pour les liens externes
- **Titres** : Utilisez `##` pour les sections (le `#` principal est réservé au titre du projet)

## Ressources utiles

### Outils recommandés

- **Éditeur de texte** : VS Code, Sublime Text, ou même Notepad++
- **Compression d'images** : TinyPNG.com, ImageOptim (Mac)
- **Markdown** : Typora, Mark Text pour prévisualiser
- **Git** : GitHub Desktop pour une interface graphique

### Liens utiles

- **Documentation Markdown** : https://www.markdownguide.org/
- **Palette de couleurs** : https://coolors.co/
- **Images libres** : https://unsplash.com/, https://pixabay.com/
- **Icônes** : https://heroicons.com/

## Problèmes fréquents et solutions

### "Command not found" ou "n'est pas reconnu"

- Vérifiez que Node.js, Git et pnpm sont bien installés
- Redémarrez votre terminal
- Sur Windows, utilisez PowerShell en tant qu'administrateur

### Images qui ne s'affichent pas

- Vérifiez que `thumbnail.jpg` existe
- Évitez les espaces dans les noms de fichiers
- Utilisez des formats supportés (JPG, PNG, WebP)

### Le serveur ne démarre pas

- Vérifiez que vous êtes dans le bon dossier (`cd mon-portfolio`)
- Vérifiez que `pnpm install` a bien été exécuté
- Fermez et rouvrez le terminal

### Modifications non visibles

- Sauvegardez vos fichiers
- Vérifiez que le serveur tourne toujours
- Rafraîchissez la page (F5 ou Ctrl+R)

## Contact et support

Pour toute question ou problème :

📧 **Email** : hello@aker.pro

Dans votre message, précisez :

- Votre système d'exploitation (Mac/Windows)
- Le problème rencontré
- Les étapes que vous avez suivies
- Une capture d'écran si possible

---

**Bon test et merci pour votre participation ! 🚀**

Adrien pour AKER
