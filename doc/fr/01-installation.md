# Guide d'Installation Microfolio

## À propos

Microfolio est un système de portfolio moderne qui vous permet de présenter vos projets créatifs de manière élégante et professionnelle. Ce guide vous accompagne pas à pas pour installer et configurer votre propre site portfolio.

## Prérequis

### 1. Installation de Node.js

Node.js est nécessaire pour faire fonctionner Microfolio.

**Sur Windows :**
1. Rendez-vous sur [nodejs.org](https://nodejs.org)
2. Téléchargez la version LTS (Long Term Support) recommandée
3. Exécutez le fichier .exe téléchargé
4. Suivez les instructions d'installation (laissez les options par défaut)

**Sur macOS :**
1. Rendez-vous sur [nodejs.org](https://nodejs.org)
2. Téléchargez la version LTS pour macOS
3. Ouvrez le fichier .pkg et suivez les instructions
4. Ou utilisez Homebrew : `brew install node`

**Sur Linux (Ubuntu/Debian) :**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Vérification :**
Ouvrez un terminal/invite de commande et tapez :
```bash
node --version
npm --version
```
Vous devriez voir les numéros de version s'afficher.

### 2. Installation de Git

Git est nécessaire pour télécharger et gérer le code source.

**Sur Windows :**
1. Rendez-vous sur [git-scm.com](https://git-scm.com)
2. Téléchargez Git pour Windows
3. Installez avec les options par défaut

**Sur macOS :**
1. Ouvrez le Terminal
2. Tapez `git --version`
3. Si Git n'est pas installé, macOS vous proposera de l'installer
4. Ou utilisez Homebrew : `brew install git`

**Sur Linux (Ubuntu/Debian) :**
```bash
sudo apt-get update
sudo apt-get install git
```

**Vérification :**
```bash
git --version
```

### 3. Installation de pnpm

pnpm est un gestionnaire de paquets plus rapide et efficace que npm.

**Installation (toutes plateformes) :**
```bash
npm install -g pnpm
```

**Vérification :**
```bash
pnpm --version
```

## Installation de Microfolio

### 1. Téléchargement du code

Ouvrez un terminal dans le dossier où vous voulez installer Microfolio et exécutez :

```bash
git clone https://github.com/votre-utilisateur/microfolio.git
cd microfolio
```

### 2. Installation des dépendances

```bash
pnpm install
```

Cette commande va télécharger toutes les bibliothèques nécessaires au fonctionnement de Microfolio.

### 3. Configuration initiale

Copiez le fichier de configuration d'exemple :

```bash
cp .env.example .env
```

### 4. Premier lancement

Lancez le serveur de développement :

```bash
pnpm run dev
```

Ouvrez votre navigateur et rendez-vous sur `http://localhost:5173`

Vous devriez voir votre site portfolio avec les projets d'exemple !

## Dépannage

### Problème : "command not found"
Si vous obtenez des erreurs "command not found", vérifiez que :
- Node.js est correctement installé
- Vous avez redémarré votre terminal après l'installation
- Les variables d'environnement sont correctement configurées

### Problème : Erreurs de permissions
Sur macOS/Linux, si vous avez des erreurs de permissions :
```bash
sudo chown -R $(whoami) ~/.npm
```

### Problème : Port déjà utilisé
Si le port 5173 est déjà utilisé, pnpm utilisera automatiquement un autre port. Regardez les messages dans le terminal pour voir l'URL correcte.

## Prochaines étapes

Maintenant que Microfolio est installé, consultez :
- [Guide de configuration](02-configuration.md) pour personnaliser votre site
- [Guide d'ajout de projets](03-ajout-projets.md) pour ajouter vos propres créations
- [Guide de publication](04-publication.md) pour mettre votre site en ligne

## Aide

Si vous rencontrez des problèmes, n'hésitez pas à :
- Consulter la documentation officielle
- Poser des questions sur le forum de support
- Vérifier les issues GitHub du projet