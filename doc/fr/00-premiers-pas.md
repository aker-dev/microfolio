# Premiers pas avec microfolio — Guide du débutant

## Bienvenue !

microfolio est un générateur de portfolio statique moderne, conçu spécialement pour les créatifs : designers, architectes, photographes, artistes, graphistes, collectifs… Il vous permet de créer un site web professionnel pour présenter vos projets de manière élégante, sans avoir besoin de connaissances techniques approfondies.

Ce guide vous emmène d'un ordinateur vierge à un portfolio qui tourne en local, étape par étape. Si vous n'avez jamais ouvert un terminal de votre vie, c'est exactement pour vous qu'il a été écrit.

## Note importante sur le terminal / ligne de commande

**Rassurez-vous !** Ce guide utilise le terminal (ou « ligne de commande »), mais **aucune connaissance technique n'est requise**. Vous devrez simplement taper ou copier-coller quelques commandes simples. C'est plus facile qu'il n'y paraît ! 😊

### Comment ouvrir le terminal

**Sur Mac :**

- Appuyez sur `Cmd + Espace` pour ouvrir Spotlight
- Tapez « Terminal » et appuyez sur Entrée
- Ou allez dans Applications > Utilitaires > Terminal

**Sur Windows :**

- Appuyez sur `Windows + R`
- Tapez « powershell » et appuyez sur Entrée
- Ou cherchez « PowerShell » dans le menu Démarrer

## Installation des prérequis

### Pour Mac

#### Option 1 : Installation via Homebrew (recommandée)

**Homebrew** est un gestionnaire de paquets pour macOS qui simplifie grandement l'installation de logiciels de développement.

1. **Installez Homebrew** (si vous ne l'avez pas déjà) :

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Approuvez le tap AKER, puis installez microfolio** :

   ```bash
   brew trust aker-dev/tap
   brew install aker-dev/tap/microfolio
   ```

3. **Créez un nouveau portfolio** :

   ```bash
   microfolio new mon-portfolio
   cd mon-portfolio
   ```

4. **Lancez le serveur de développement** :
   ```bash
   microfolio dev
   ```

Votre site sera accessible à l'adresse : http://localhost:5555

**Avantages de cette méthode :**

- Installation automatique de toutes les dépendances (Node.js, pnpm, Git)
- Commandes simplifiées : `microfolio new`, `microfolio dev`, `microfolio build`
- Mises à jour faciles avec `brew upgrade microfolio`

#### Option 2 : Installation manuelle

Si vous préférez l'installation manuelle ou rencontrez des problèmes avec Homebrew :

#### 1. Installer Node.js

1. Allez sur https://nodejs.org/
2. Téléchargez la version LTS (recommandée)
3. Ouvrez le fichier `.pkg` téléchargé et suivez l'assistant
4. **Fermez et relancez le Terminal** pour que l'installation prenne effet
5. Vérifiez l'installation en tapant :
   ```bash
   node --version
   ```
   Vous devriez voir un numéro de version 22.13 ou supérieur (par exemple v22.14.0)

#### 2. Installer Git

1. Ouvrez le Terminal
2. Tapez la commande suivante :
   ```bash
   xcode-select --install
   ```
3. Un logiciel d'installation s'ouvre automatiquement
4. Suivez les instructions à l'écran pour installer les outils de développement Xcode
5. **Fermez et relancez le Terminal** pour que l'installation prenne effet
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
3. **Fermez et relancez le Terminal** pour que l'installation prenne effet (ou tapez `source ~/.zshrc` dans le terminal courant)
4. Vérifiez l'installation :
   ```bash
   pnpm --version
   ```

### Pour Windows

#### 1. Installer Node.js

1. Allez sur https://nodejs.org/
2. Téléchargez la version LTS (recommandée)
3. Ouvrez le fichier `.msi` téléchargé et suivez l'assistant
4. **Fermez et relancez PowerShell** pour que l'installation prenne effet
5. Vérifiez l'installation en tapant :
   ```bash
   node --version
   ```

#### 2. Installer Git

1. Téléchargez Git depuis https://git-scm.com/download/win
2. Ouvrez le fichier `.exe` et suivez l'assistant
3. Laissez les options par défaut
4. **Fermez et relancez PowerShell** pour que l'installation prenne effet
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
3. **Fermez et relancez PowerShell** pour que l'installation prenne effet
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

## Télécharger microfolio

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

### Lancer le serveur de développement

#### Si vous avez installé via Homebrew

Chaque fois que vous voulez travailler sur votre site :

1. **Ouvrez un terminal**
2. **Naviguez vers votre dossier portfolio** :
   ```bash
   cd chemin/vers/mon-portfolio
   ```
3. **Lancez le serveur** :
   ```bash
   microfolio dev
   ```
4. **Ouvrez votre navigateur** et allez sur http://localhost:5555

#### Si vous avez fait l'installation manuelle

Chaque fois que vous voulez travailler sur votre site :

1. **Ouvrez un terminal** (Terminal sur Mac, PowerShell sur Windows)
2. **Naviguez vers votre dossier microfolio** :
   ```bash
   cd chemin/vers/mon-portfolio
   ```
3. **Lancez le serveur** :
   ```bash
   pnpm dev
   ```
4. **Ouvrez votre navigateur** et allez sur http://localhost:5555

Le serveur reste actif tant que la fenêtre du terminal est ouverte. Pour l'arrêter, appuyez sur `Ctrl+C` dans le terminal.

### Travailler efficacement

- **Changements en temps réel** : dès que vous modifiez un fichier, le navigateur se rafraîchit automatiquement
- **Gardez le terminal ouvert** : ne fermez pas la fenêtre du terminal pendant que vous travaillez
- **Un serveur à la fois** : vous ne pouvez avoir qu'un seul serveur lancé par projet

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
title: 'Le titre de mon projet' # obligatoire
date: '2024-01-15' # obligatoire, AAAA-MM-JJ — tout le reste est optionnel
location: 'Paris, France'
coordinates: [48.8566, 2.3522] # Optionnel, pour la carte
description: 'Une courte description de mon projet'
type: 'architecture' # ou 'design', 'art', 'photography', etc.
tags: ['moderne', 'durable'] # mots-clés — ne répétez pas le type
authors:
  - name: 'Votre Nom'
    role: 'Architecte'
featured: true # true pour mettre en avant
---

## Description

Ici, décrivez votre projet en détail…
```

Seuls `title` et `date` sont obligatoires — un projet auquel il en manque un est ignoré, et nommé dans un résumé en fin de build. Un projet sans `location` n'affiche simplement aucun lieu (pas de texte de remplacement sur sa page ni dans la liste), et sans `coordinates` il n'a pas de marqueur sur la carte. La référence complète des champs, y compris le panneau d'infos optionnel (`owner`, `status`, `surface_area`, `cost`), se trouve dans le [Guide d'ajout de projets](04-ajout-projets.md#3-métadonnées-importantes).

### Étape 4 : Ajouter vos fichiers

- **Vignette** : remplacez `thumbnail.jpg` par votre image de couverture
- **Images** : ajoutez vos images dans le dossier `images/`
- **Vidéos** : ajoutez vos vidéos dans le dossier `videos/`
- **Documents** : ajoutez vos PDF/documents dans le dossier `documents/`

## Conseils de nommage et de préparation des fichiers

### Nommage des fichiers

- **Pas d'espaces** : `mon-image.jpg` ✅ plutôt que `mon image.jpg` ❌
- **Caractères simples** : évitez les accents, cédilles, caractères spéciaux
- **Minuscules** : préférez les noms en minuscules
- **Descriptifs** : `facade-principale.jpg` plutôt que `IMG_001.jpg`

### Préparation des images

- **Vignette** : 1200×900 pixels recommandés, format 4:3
- **Images de galerie** : 1920px de large maximum
- **Formats supportés** : JPG, PNG, WebP, SVG
- **Compression** : utilisez des outils comme TinyPNG pour réduire la taille
- **Métadonnées** : la lightbox affiche la légende, le crédit et les infos de prise de vue embarqués dans vos fichiers — voir [Métadonnées d'images](03-preparation-images.md#métadonnées-dimages-exifiptc) pour savoir quoi renseigner et quoi retirer (le GPS !) avant de publier

### Préparation des vidéos

- **Format** : MP4 H.264 pour une compatibilité maximale
- **Taille** : moins de 50 Mo par vidéo
- **Alternative** : pour les vidéos plus lourdes, utilisez YouTube ou Vimeo et mettez le lien dans le texte

### Documents

- **Formats** : PDF, DOC, DOCX, PPT, PPTX
- **Noms** : évitez les espaces et caractères spéciaux
- **Taille** : raisonnable pour un téléchargement web

## Introduction à Markdown

Markdown est un langage de mise en forme simple que vous utilisez dans vos fichiers `index.md`.

### Syntaxe de base

```markdown
# Titre principal

## Titre secondaire

### Titre tertiaire

**Texte en gras**
_Texte en italique_

- Liste à puces
- Élément 2
- Élément 3

1. Liste numérotée
2. Élément 2
3. Élément 3

[Lien vers un site](https://exemple.com)
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
2. Esquisses et conception
3. Développement technique
4. Réalisation

![Vue d'ensemble du projet](images/vue-ensemble.jpg)

Pour plus de détails, consultez le [dossier technique](documents/specifications.pdf).
```

### Astuces Markdown

- **Sauts de ligne** : laissez une ligne vide entre les paragraphes
- **Retour forcé** : pour passer à la ligne à l'intérieur d'un même paragraphe — une adresse, des horaires, une liste de crédits — terminez la ligne par `\`. Sans cela, Markdown colle les lignes ensemble
- **Images** : placez-les dans le dossier `images/` et référencez-les avec `images/nom-image.jpg`
- **Liens** : utilisez `[texte](url)` pour les liens externes — ils s'ouvrent automatiquement dans un nouvel onglet
- **Vidéos** : une adresse YouTube ou Vimeo seule sur sa ligne devient le lecteur
- **Titres** : utilisez `##` pour les sections (le `#` principal est réservé au titre du projet)

## Ressources utiles

### Outils recommandés

- **Éditeur de texte** : VS Code, Sublime Text, ou même Notepad++
- **Compression d'images** : TinyPNG.com, ImageOptim (Mac)
- **Markdown** : Typora, Mark Text pour la prévisualisation
- **Git** : GitHub Desktop pour une interface graphique

### Liens utiles

- **Documentation Markdown** : https://www.markdownguide.org/
- **Palette de couleurs** : https://coolors.co/
- **Images libres** : https://unsplash.com/, https://pixabay.com/
- **Icônes** : https://heroicons.com/

## Problèmes courants et solutions

### « Command not found » ou « n'est pas reconnu »

- Vérifiez que Node.js, Git et pnpm sont bien installés
- Relancez votre terminal
- Sur Windows, utilisez PowerShell en tant qu'administrateur

### Les images ne s'affichent pas

- Vérifiez que `thumbnail.jpg` existe
- Évitez les espaces dans les noms de fichiers
- Utilisez des formats supportés (JPG, PNG, WebP)

### Le serveur ne démarre pas

- Vérifiez que vous êtes dans le bon dossier (`cd mon-portfolio`)
- Vérifiez que `pnpm install` a bien été exécuté
- Fermez et rouvrez le terminal

### Les modifications ne sont pas visibles

- Enregistrez vos fichiers
- Vérifiez que le serveur tourne toujours
- Rafraîchissez la page (F5 ou Ctrl+R)

## Aller plus loin

Une fois votre portfolio lancé en local, les guides suivants prennent le relais :

- **[Installation](01-installation.md)** — l'installation en détail
- **[Configuration](02-configuration.md)** — faites de ce site le vôtre : titre, couleurs, pages légales
- **[Préparation des images](03-preparation-images.md)** — tailles, formats, et les métadonnées que la lightbox affiche
- **[Ajout de projets](04-ajout-projets.md)** — tout ce qu'un dossier de projet peut contenir
- **[Publication](05-publication.md)** — mettez votre portfolio en ligne

## Contact et support

Pour toute question ou problème :

- 🐛 **Bugs** : [ouvrez une issue](https://github.com/aker-dev/microfolio/issues)
- 💬 **Questions et idées** : [GitHub Discussions](https://github.com/aker-dev/microfolio/discussions)
- 📧 **Email** : hello@aker.pro

Dans votre message, précisez si possible :

- Votre système d'exploitation (Mac/Windows)
- Le problème rencontré
- Les étapes que vous avez suivies
- Une capture d'écran si possible
