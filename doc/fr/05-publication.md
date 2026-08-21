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

## Autres options d'hébergement

### 1. Netlify

1. **Connectez votre repository GitHub à Netlify**
2. **Configurez le build :**
   - Build command: `pnpm build`
   - Publish directory: `build`
   - Renseignez `url` dans `src/lib/config.js` avec votre adresse Netlify

3. **Domaine personnalisé :**
   - Ajoutez votre domaine dans Netlify
   - Configurez le DNS chez votre registrar

### 2. Vercel

1. **Importez votre projet depuis GitHub**
2. **Configuration automatique pour SvelteKit**
3. **Renseignez `url`** dans `src/lib/config.js` avec votre adresse Vercel

### 3. Hébergement traditionnel

Pour un hébergement classique :

1. **Build du site :**

   ```bash
   pnpm build
   ```

2. **Upload du contenu :**
   - Uploadez le contenu du dossier `build/`
   - Configurez le serveur web (Apache, Nginx)

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

### 3. Mise à jour des dépendances

```bash
# Vérifiez les mises à jour
pnpm outdated

# Mettez à jour
pnpm update

# Testez
pnpm dev
pnpm build

# Publiez
git add .
git commit -m "Mise à jour des dépendances"
git push origin main
```

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
# Nettoyez le cache
pnpm clean
rm -rf node_modules package-lock.json
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
- **Netlify** : https://www.netlify.com/
- **Vercel** : https://vercel.com/
- **DNS Checker** : https://dnschecker.org/
- **PageSpeed Insights** : https://pagespeed.web.dev/
- **Google Search Console** : https://search.google.com/search-console

---

Félicitations ! Votre portfolio Microfolio est maintenant en ligne et accessible au monde entier. N'oubliez pas de le maintenir à jour avec vos nouveaux projets et de surveiller ses performances régulièrement.
