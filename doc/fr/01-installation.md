# Guide d'Installation Microfolio

## À propos

microfolio est un générateur de portfolio statique moderne, conçu spécialement pour les créatifs : designers, architectes, photographes, artistes, graphistes, collectifs… Il vous permet de créer un site web professionnel pour présenter vos projets de manière élégante, sans avoir besoin de connaissances techniques approfondies.

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
   brew trust aker-dev/tap
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

Votre site sera accessible à l'adresse : http://localhost:5555

**Avantages de cette méthode :**

- Installation automatique de toutes les dépendances (Node.js, pnpm, Git)
- Commandes simplifiées : `microfolio new`, `microfolio dev`, `microfolio build`
- `brew upgrade microfolio` maintient la commande à jour ; un site se met à jour avec `pnpm update-microfolio` (voir [Mettre à jour microfolio](05-publication.md#3-mettre-à-jour-microfolio))

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
   Vous devriez voir un numéro de version égal ou supérieur à 22.13 (ex : v22.14.0)

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

1. Ouvrez PowerShell (une fenêtre ordinaire — aucun droit administrateur n'est nécessaire)
2. Autorisez PowerShell à exécuter les scripts signés pour votre compte. Windows les refuse tous par défaut, et la commande `pnpm` en est un — sans cela, chaque commande `pnpm` échouera ensuite sur `running scripts is disabled on this system` :
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   Confirmez par `O`. C'est à faire une seule fois.
3. Installez pnpm :
   ```powershell
   Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
   ```
4. **Fermez et relancez PowerShell** pour que l'installation soit prise en compte
5. Vérifiez l'installation :
   ```bash
   pnpm --version
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
microfolio dev
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
4. **Ouvrez votre navigateur** et allez sur http://localhost:5555

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
4. **Ouvrez votre navigateur** et allez sur http://localhost:5555

Le serveur reste actif tant que la fenêtre du terminal reste ouverte. Pour l'arrêter, appuyez sur `Ctrl+C` dans le terminal.

## Problèmes fréquents et solutions

### "Command not found" ou "n'est pas reconnu"

- Vérifiez que Node.js, Git et pnpm sont bien installés
- Redémarrez votre terminal
- Sur Windows, fermez et rouvrez PowerShell après chaque installation

### `pnpm : ... cannot be loaded because running scripts is disabled on this system` (Windows)

Windows interdit l'exécution des scripts PowerShell par défaut, et la commande `pnpm` en est un. Autorisez les scripts signés pour votre compte — une seule fois, dans une fenêtre PowerShell ordinaire, sans droits administrateur :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Confirmez par `O`, puis fermez et rouvrez PowerShell.

### Images qui ne s'affichent pas

- Vérifiez que `thumbnail.jpg` existe
- Évitez les espaces dans les noms de fichiers
- Utilisez des formats supportés (JPG, PNG, WebP)

### Le serveur ne démarre pas

- Vérifiez que vous êtes dans le bon dossier (`cd mon-portfolio`)
- Vérifiez que `pnpm install` a bien été exécuté
- Fermez et rouvrez le terminal

### `Cannot verify the identity of the @pnpm/exe...` (Mac Intel)

Un site créé avec microfolio 1.0.0 ou une version antérieure fige une version exacte de pnpm
dans son `package.json`. Dès que le pnpm installé sur votre machine en diffère, pnpm tente de
changer de version — et pnpm 11 ne publie aucun binaire pour les Mac Intel, ce changement ne
peut donc jamais aboutir.

Ouvrez `package.json`, supprimez la ligne qui commence par `"packageManager"`, puis relancez
`pnpm install`. Mettre le site à jour avec `pnpm update-microfolio` revient au même.

### `env: node: No such file or directory`

Homebrew a installé microfolio à une époque où sa formule dépendait d'un Node qu'il ne mettait pas à
portée. Lancez `brew update && brew upgrade microfolio`, qui en installe un désormais ;
`brew install node` corrige aussi.

### Modifications non visibles

- Sauvegardez vos fichiers
- Vérifiez que le serveur tourne toujours
- Rafraîchissez la page (F5 ou Ctrl+R)

## Prochaines étapes

Maintenant que microfolio est installé, les guides suivants prennent le relais :

- **[Configuration](02-configuration.md)** — faites de ce site le vôtre : titre, couleurs, pages légales
- **[Préparation des images](03-preparation-images.md)** — tailles, formats, et les métadonnées que la lightbox affiche
- **[Ajout de projets](04-ajout-projets.md)** — tout ce qu'un dossier de projet peut contenir
- **[Publication](05-publication.md)** — mettez votre portfolio en ligne

## Contact et support

Pour toute question ou problème :

📧 **Email** : hello@aker.pro

Dans votre message, précisez :

- Votre système d'exploitation (Mac/Windows)
- Le problème rencontré
- Les étapes que vous avez suivies
- Une capture d'écran si possible
