# Guide de Build et Publication

## Préparation pour la publication

### 1. Vérification du contenu

Avant de publier votre portfolio, assurez-vous que :

**Contenu obligatoire :**

- [ ] Page d'accueil personnalisée (`content/index.md`)
- [ ] Page à propos complétée (`content/about.md`)
- [ ] Au moins 3-5 projets avec images
- [ ] Toutes les images de miniatures présentes
- [ ] Informations de contact

**Vérification technique :**

- [ ] Liens fonctionnels
- [ ] Images optimisées
- [ ] Métadonnées complètes
- [ ] Pas d'erreurs dans le terminal

### 2. Configuration du domaine

#### Option A : Domaine personnalisé

Si vous avez votre propre domaine :

1. **Renseignez l'adresse dans la configuration**

   ```js
   // src/lib/config.js
   url: 'https://votre-domaine.com';
   ```

   C'est le seul endroit où l'adresse est écrite. Le chemin de base et toutes
   les URL absolues — balises de partage, liens canoniques, sitemap — en
   découlent.

2. **Déclarez le domaine à GitHub Pages**
   - Dans le dépôt, Settings › Pages › Custom domain
   - Saisissez votre domaine et enregistrez

   Il n'y a pas de fichier `CNAME` à écrire : publié par un workflow Actions,
   comme l'est microfolio, GitHub ignore tout `CNAME` présent dans le build.

3. **Configurez votre DNS**
   - Chez votre registrar, créez un enregistrement CNAME
   - Pointez votre domaine vers `votre-utilisateur.github.io`

#### Option B : Domaine GitHub Pages

Si vous utilisez GitHub Pages sans domaine personnalisé :

1. **Le site sera accessible à :**
   ```
   https://votre-utilisateur.github.io/microfolio
   ```

## Build du site

### 1. Build local

Testez toujours localement avant de publier :

```bash
pnpm build
```

### 2. Vérification du build

Après le build, vérifiez :

- Dossier `build/` créé
- Fichier `build/index.html` présent
- Dossier `build/content/` avec vos projets

### 3. Aperçu du site

Prévisualisez le site en production :

```bash
pnpm preview
```

Testez toutes les pages et fonctionnalités.

## Publication sur GitHub Pages

### 1. Préparation du repository

```bash
# Assurez-vous d'être sur la branche main
git checkout main

# Ajoutez tous vos fichiers
git add .
git commit -m "Préparation pour publication"

# Poussez vers GitHub
git push origin main
```

### 2. Configuration GitHub Pages

1. **Accédez à votre repository GitHub**
2. **Allez dans Settings > Pages**
3. **Configurez la source :**
   - Source : "GitHub Actions"

### 3. GitHub Actions (automatique)

Le repository fournit un workflow, `.github/workflows/deploy.yml`, qui construit le site, le vérifie (lint, tests, une passe de fumée sur les fichiers construits) puis le publie sur GitHub Pages. **Il s'exécute à chaque push sur `main`** — publier se résume donc à :

```bash
git push origin main
```

Quelques minutes plus tard, le site est en ligne. Vous pouvez aussi déclencher un déploiement à la main depuis l'onglet **Actions** du repository (« Deploy to GitHub Pages › Run workflow »). Si vous préférez travailler sur une autre branche et publier délibérément, fusionnez-la dans `main` quand vous êtes prêt — ou changez la ligne `branches` en tête du workflow.

### 4. Deux branches : `dev` pour travailler, `main` pour publier

Puisque chaque push sur `main` part en ligne, gardez une seconde branche pour le travail en cours :

```bash
git switch -c dev          # une fois : créer la branche de travail
# …éditer, ajouter des projets, vérifier avec pnpm dev…
git add . && git commit -m "Nouveau projet : …"

git switch main            # publier : ramener dev dans main et pousser
git merge dev
git push origin main
git switch dev             # retour au travail
```

`main` ne reçoit jamais que ce que vous avez déjà vu fonctionner en local — et un projet à moitié écrit qui attend sur `dev` n'atteint jamais le site publié par accident. Un push sur `dev` lance tout de même les vérifications (tests, build, test de fumée) sans rien publier : l'onglet **Actions** vous dit que la fusion est sûre avant que vous la fassiez.

## Publication manuelle

### 1. Build pour production

```bash
# Assurez-vous que tout est committé
git add .
git commit -m "Prêt pour publication"

# Build du site
pnpm build
```

### 2. Déploiement manuel

Si vous préférez déployer le dossier `build/` vous-même :

```bash
# Déployer vers une branche gh-pages (aucune installation globale requise)
npx gh-pages -d build
```

## Hébergement mutualisé (O2Switch, OVH, Gandi…) : build local, puis FTP

Un site microfolio, ce sont de simples fichiers : n'importe quel hébergement web qui sert du HTML peut l'accueillir, et rien n'est à installer côté serveur — ni Node.js, ni base de données.

1. **Renseignez l'adresse finale** dans `src/lib/config.js`, car le build l'inscrit dans toutes les URL absolues :

   ```js
   url: 'https://www.mon-portfolio.fr'; // à la racine d'un domaine
   url: 'https://www.mon-site.fr/portfolio'; // ou dans un sous-dossier
   ```

2. **Construisez pour la production** avec `pnpm deploy`, pas `pnpm build` : c'est lui qui pose `NODE_ENV=production` et respecte donc un sous-dossier dans `url` (à la racine d'un domaine les deux donnent le même résultat, mais autant prendre l'habitude) :

   ```bash
   pnpm deploy
   ```

   Sous Windows PowerShell, qui ne comprend pas ce préfixe `NODE_ENV=` : `$env:NODE_ENV='production'; pnpm build`. Le site est dans `build/`.

3. **Téléversez le _contenu_ de `build/`** (pas le dossier lui-même) dans la racine web de votre hébergement — appelée `www/`, `public_html/` ou `htdocs/` selon l'hébergeur, ou le sous-dossier choisi. Un client FTP gratuit comme [FileZilla](https://filezilla-project.org) fait l'affaire : créez une connexion avec l'hôte, l'identifiant et le mot de passe indiqués dans le panneau de votre hébergeur (choisissez SFTP quand il le propose), ouvrez `build/` à gauche, la racine web à droite, sélectionnez tout à gauche et glissez-le vers la droite.

4. **Vérifiez le site** à votre adresse — chaque page, la carte, un projet et sa lightbox.

**Mettre à jour le site**, ce sont les mêmes étapes : `pnpm deploy`, puis téléversement. Videz la racine web avant de téléverser (ou laissez FileZilla écraser, puis supprimez ce qui n'est plus dans `build/`) : les noms des fichiers générés changent d'un build à l'autre, et les anciens resteraient là.

## Domaines personnalisés

### 1. Configuration DNS

**Pour un domaine principal (exemple.com) :**

```
Type: A
Host: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

**Pour un sous-domaine (portfolio.exemple.com) :**

```
Type: CNAME
Host: portfolio
Value: votre-utilisateur.github.io
```

### 2. Configuration HTTPS

GitHub Pages active automatiquement HTTPS pour les domaines personnalisés. Patientez quelques minutes après la configuration DNS.

### 3. Vérification du domaine

Vérifiez que votre domaine fonctionne :

- `https://votre-domaine.com`
- Redirection HTTP → HTTPS
- Certificat SSL valide

## Maintenance et mises à jour

### 1. Ajout de nouveaux projets

```bash
# Ajoutez votre nouveau projet
# Commitez les changements
git add .
git commit -m "Nouveau projet: [nom du projet]"
git push origin main

# Le site sera automatiquement rebuild
```

### 2. Modifications du design

```bash
# Modifiez les fichiers nécessaires
# Testez localement
pnpm dev

# Build et test
pnpm build
pnpm preview

# Publiez
git add .
git commit -m "Mise à jour du design"
git push origin main
```

### 3. Mettre à jour microfolio

Une nouvelle version de microfolio, c'est une nouvelle version du moteur ; vos projets, votre `config.js`, votre favicon et votre image de partage sont à vous et restent en place. Depuis le dossier de votre site, tout étant commité :

```bash
pnpm update-microfolio            # vers la dernière version
pnpm update-microfolio --dry-run  # dire seulement ce qui changerait
```

(`microfolio update`, mêmes options, si vous avez installé avec Homebrew.)

Le script télécharge la version que vous utilisez et celle vers laquelle vous allez, et décide fichier par fichier : ce que vous n'avez jamais touché prend la nouvelle version, ce que vous avez modifié et que microfolio n'a pas changé reste tel quel, et quand les deux côtés ont changé le même fichier il tente de combiner les deux — à défaut, votre version reste et la nouvelle est écrite à côté, en `<fichier>.upstream`, pour que vous la regardiez. `content/`, `src/lib/config.js`, `static/favicon.svg` et `static/og.jpg` ne sont jamais touchés ; quand `config.js` a gagné des réglages en amont, la différence est affichée pour que vous recopiiez ce qui vous intéresse. Ensuite :

```bash
pnpm install
pnpm dev                                    # regarder le site
git add -A && git commit -m "Mise à jour de microfolio en 1.1.0"
git push origin main                        # publie, si GitHub Pages déploie main
```

Si le résultat ne vous plaît pas, `git checkout . && git clean -fd` juste après la mise à jour remet tout en place — c'est pour cela que le script exige un dépôt sans modification en attente avant de commencer.

**Un site plus ancien que le script** (d'avant la 1.0) n'a pas encore `pnpm update-microfolio`. Récupérez le script une fois et lancez-le ; il fait partie du site ensuite :

```bash
curl -fsSL https://raw.githubusercontent.com/aker-dev/microfolio/main/scripts/update-microfolio.js -o update-microfolio.js
node update-microfolio.js
rm update-microfolio.js
```

**À la main**, si vous préférez voir chaque étape : téléchargez la version voulue depuis [la page des releases](https://github.com/aker-dev/microfolio/releases) et décompressez-la à côté de votre site, puis copiez tout son contenu dans le dossier de votre site **sauf** `content/`, `src/lib/config.js`, `static/favicon.svg` et `static/og.jpg`. Rapportez les modifications que vous aviez faites aux templates ou à `src/app.css` en comparant avec votre historique git, lancez `pnpm install`, vérifiez avec `pnpm dev`, et commitez. Cela marche aussi pour un site qui n'a jamais été un dépôt git.

**Avec git seul**, si vous avez cloné le dépôt plutôt qu'utilisé `microfolio new` : votre historique est commun avec celui de microfolio, donc `git remote add upstream https://github.com/aker-dev/microfolio.git`, `git fetch upstream --tags` puis `git merge v1.1.0` ramènent la version. Attendez-vous à des conflits sur les fichiers que vous avez réécrits — pages d'accueil et à propos, `config.js` — et sur le projet d'exemple si vous l'avez supprimé ; résolvez chacun en gardant le vôtre.

## Optimisation pour la production

### 1. Images

```bash
# Optimisez toutes les images
find content/ -name "*.jpg" -exec jpegoptim --max=85 {} \;
find content/ -name "*.png" -exec optipng -o5 {} \;
```

### 2. Performances

- Compressez les images
- Utilisez des formats modernes (WebP)
- Minimisez les vidéos
- Optimisez les PDF

### 3. SEO

- Vérifiez les métadonnées
- Générez un sitemap
- Ajoutez des balises Open Graph
- Configurez Google Analytics

## Dépannage

### Problème : Build échoue

```bash
# Repartez d'une installation propre
rm -rf node_modules .svelte-kit
pnpm install

# Rebuild
pnpm build
```

### Problème : Images manquantes

- Vérifiez les chemins dans les fichiers markdown
- Assurez-vous que les images sont dans le repository
- Respectez la casse des noms de fichiers

### Problème : Domaine personnalisé ne fonctionne pas

- Vérifiez `url` dans `src/lib/config.js`
- Vérifiez le domaine dans Settings › Pages
- Configurez correctement le DNS
- Patientez la propagation DNS (24-48h)
- Vérifiez les paramètres GitHub Pages

## Ressources utiles

- **GitHub Pages** : https://pages.github.com/
- **DNS Checker** : https://dnschecker.org/
- **PageSpeed Insights** : https://pagespeed.web.dev/
- **Google Search Console** : https://search.google.com/search-console

---

Félicitations ! Votre portfolio Microfolio est maintenant en ligne et accessible au monde entier. N'oubliez pas de le maintenir à jour avec vos nouveaux projets et de surveiller ses performances régulièrement.
