# Guide de Configuration Personnalisée

## Pages légales

`content/legal.md` et `content/privacy.md` sont fournis en gabarits, et **vous
devez les remplir**. Un site publié en France doit porter des mentions légales
nommant son éditeur et son hébergeur ; publier celles d'autrui est pire que de
n'en publier aucune.

Le gabarit de confidentialité décrit déjà ce que fait microfolio — aucun cookie,
aucune mesure d'audience, une préférence d'interface conservée localement — et
reste donc exact tant que vous n'ajoutez ni mesure d'audience, ni embed, ni
formulaire. Si vous le faites, dites-le à cet endroit.

Les deux sont liées depuis le pied de chaque page.

## Configuration de base

### 1. Modification du fichier config.js

Le fichier `src/lib/config.js` contient les paramètres principaux de votre portfolio. Voici comment le personnaliser :

```javascript
// Configuration du site
export const config = {
	// Informations générales
	siteName: 'Mon Portfolio',
	siteDescription: 'Portfolio de [Votre Nom] - [Votre profession]',
	author: 'Votre Nom',

	// Navigation
	navigation: [
		{ name: 'Accueil', href: '/' },
		{ name: 'Projets', href: '/projects' },
		{ name: 'Liste', href: '/list' },
		{ name: 'Carte', href: '/map' },
		{ name: 'À propos', href: '/about' }
	],

	// Liens sociaux
	social: {
		email: 'votre@email.com',
		linkedin: 'https://linkedin.com/in/votre-profil',
		instagram: 'https://instagram.com/votre-compte',
		github: 'https://github.com/votre-compte'
	}
};
```

**Personnalisez les sections suivantes :**

- **siteName** : Le nom de votre portfolio
- **siteDescription** : Description pour le SEO
- **author** : Votre nom complet
- **navigation** : Ajustez ou supprimez des liens de navigation
- **social** : Vos profils sur les réseaux sociaux

### 2. Informations personnelles

Éditez le fichier `content/index.md` pour personnaliser votre page d'accueil :

```markdown
---
title: 'Bienvenue sur mon portfolio'
description: 'Portfolio de [Votre Nom] - [Votre profession/spécialité]'
---

## Qui suis-je ?

Présentez-vous ici. Parlez de votre parcours, vos passions, votre approche créative.

## Mon travail

Décrivez votre style, vos domaines d'expertise, ce qui vous inspire.
```

### 3. Page À propos

Modifiez le fichier `content/about.md` :

```markdown
---
title: 'À propos'
description: 'Découvrez mon parcours et ma philosophie créative'
---

## Mon parcours

Racontez votre histoire, votre formation, vos expériences importantes.

## Ma philosophie

Expliquez votre approche du design/art, vos valeurs, ce qui vous motive.

## Mes compétences

- Compétence 1
- Compétence 2
- Compétence 3

## Formation

- **Année** - Diplôme, École
- **Année** - Formation, Organisme

## Expérience

- **Année** - Poste, Entreprise
- **Année** - Projet, Client
```

#### Des images et des vidéos dans ces pages

Les pages d'accueil, à propos, mentions légales et confidentialité peuvent
embarquer des images. Placez les fichiers dans `content/images/` et
référencez-les relativement à `content/` :

```markdown
![Une vue de mon atelier](images/atelier.jpg)
```

L'adresse est résolue au build : cela fonctionne aussi bien en développement
que sous un sous-chemin (GitHub Pages). Les liens externes de ces pages
s'ouvrent automatiquement dans un nouvel onglet. Sur grand écran, les images
s'étalent plus large que la colonne de texte — c'est la mise en page
éditoriale de ces pages.

**Vidéos YouTube ou Vimeo** : collez le code d'intégration fourni par la
plateforme (« Partager › Intégrer ») directement dans le Markdown, sur une
ligne à part :

```markdown
<iframe src="https://www.youtube.com/embed/ID_VIDEO" title="Mon film" allowfullscreen></iframe>
```

Le lecteur s'adapte à la colonne en gardant son ratio 16:9. microfolio fait
aussi passer chaque embed par les modes sans cookies des plateformes au build
— `youtube.com/embed` devient `youtube-nocookie.com/embed`, et les lecteurs
Vimeo reçoivent `dnt=1` — pour que la promesse « aucun cookie » de votre site
survive à un code collé. Charger un lecteur envoie tout de même l'adresse IP
du visiteur à YouTube ou Vimeo : **ajoutez-les au tableau des tiers de
`content/privacy.md`**, qui le demande lui-même. Ça fonctionne de la même
façon dans le corps d'un projet.

### 4. Configuration du domaine personnalisé

Si vous avez un nom de domaine personnalisé :

1. Renseignez l'adresse dans `src/lib/config.js` :

   ```js
   url: 'https://monportfolio.com';
   ```

   C'est le seul endroit où l'adresse est écrite : le chemin de base et toutes
   les URL absolues — balises de partage, liens canoniques, sitemap — en
   découlent.

2. Déclarez le domaine à GitHub Pages, dans Settings › Pages › Custom domain,
   puis faites pointer un enregistrement CNAME vers `votre-compte.github.io`
   chez votre registrar.

   Il n'y a pas de fichier `CNAME` à écrire : publié par un workflow Actions,
   comme l'est microfolio, GitHub ignore tout `CNAME` présent dans le build.

### 5. Personnalisation des couleurs et du style

Le site utilise Tailwind CSS v4. Vous pouvez personnaliser les couleurs et le style dans le fichier `src/app.css`.

**Exemple de personnalisation :**

```css
@import url(https://fonts.bunny.net/css?family=ibm-plex-sans:400,400i,600&display=swap);

@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@theme {
	--default-font-family: 'IBM Plex Sans', 'sans-serif';

	/* Personnalisation des couleurs */
	--color-primary-50: #f0f9ff;
	--color-primary-500: #3b82f6;
	--color-primary-900: #1e3a8a;

	/* Personnalisation des espacements */
	--spacing-custom: 2.5rem;
}
```

### 6. Mode sombre

microfolio inclut un toggle de mode sombre dans le footer. Le comportement suit une priorité à trois niveaux :

1. **Préférence système** — par défaut, le site respecte `prefers-color-scheme: dark`
2. **Choix manuel** — l'utilisateur peut cliquer sur le toggle pour forcer le mode clair ou sombre
3. **Persistance** — le mode choisi est sauvegardé dans le `localStorage` et restauré à la prochaine visite

Les couleurs du mode sombre sont définies comme propriétés CSS personnalisées dans `src/app.css` :

```css
@theme {
	/* Couleurs du thème clair (par défaut) */
	--color-primary: black;
	--color-background: oklch(97% 0 0);
	--color-box: white;

	/* Couleurs du thème sombre */
	--color-primary-dark: white;
	--color-background-dark: oklch(20.5% 0 0);
	--color-box-dark: oklch(26.9% 0 0);
}

/* Préférence système : s'applique quand aucun choix manuel (.light) n'est défini */
@media (prefers-color-scheme: dark) {
	:root:not(.light) {
		--color-primary: var(--color-primary-dark);
		--color-background: var(--color-background-dark);
		--color-box: var(--color-box-dark);
		color-scheme: dark;
	}
}

/* Mode sombre forcé par l'utilisateur via le toggle */
:root.dark {
	--color-primary: var(--color-primary-dark);
	--color-background: var(--color-background-dark);
	--color-box: var(--color-box-dark);
	color-scheme: dark;
}
```

Pour personnaliser les couleurs du mode sombre, modifiez les variables `--color-*-dark` dans le bloc `@theme`.

### 7. Internationalisation (i18n)

microfolio supporte plusieurs langues via `svelte-i18n`. L'anglais et le français sont actifs par défaut.

**Changer la locale par défaut :**

Modifiez le champ `locale` dans `src/lib/config.js` :

```javascript
export const siteConfig = {
	// ...
	locale: 'en' // Changez en 'fr' pour le français
	// ...
};
```

**Les fichiers de traduction** se trouvent dans `src/lib/locales/` :

- `en.json` — chaînes en anglais
- `fr.json` — chaînes en français

**Ajouter une nouvelle langue :**

1. Créez un nouveau fichier JSON dans `src/lib/locales/` (ex : `es.json`) en utilisant un fichier existant comme modèle
2. Décommentez l'import et la ligne `addMessages` correspondante dans `src/lib/i18n.js` :
   ```javascript
   import es from './locales/es.json';
   addMessages('es', es);
   ```
3. Définissez `locale: 'es'` dans `src/lib/config.js`

**Support RTL :** Le layout détecte automatiquement les locales RTL (ex : arabe) et définit l'attribut `dir` sur l'élément HTML.

## Configuration avancée

### 1. Favicon personnalisé

Remplacez le fichier `static/favicon.svg` par votre propre favicon (le SVG couvre toutes les tailles avec un seul fichier ; un PNG fonctionne aussi si vous mettez à jour le `<link rel="icon">` dans `src/app.html`).

### 1b. Image de partage (Open Graph)

Quand une page est partagée sur un réseau social ou une messagerie, la carte d'aperçu utilise une image :

- **Les pages projet ont déjà la leur** : un `og.jpg` est généré depuis la vignette de chaque projet au build — rien à faire
- **Toutes les autres pages** (accueil, à propos, liste, carte…) se replient sur l'image du site déclarée dans `src/lib/config.js` :

  ```js
  ogImage: '/og.jpg';
  ```

  Remplacez `static/og.jpg` par la vôtre — **1200×630 pixels**, le format que tous les réseaux recadrent. Mettez `ogImage: ''` pour ne pas en fournir.

### 1c. Lightbox

Deux réglages dans le bloc `lightbox` de `src/lib/config.js` :

```js
lightbox: {
	hideControlsDelay: 3000,
	showExtendedMetadata: true
}
```

- **`hideControlsDelay`** — délai en millisecondes avant que les flèches, le bouton de fermeture et le bouton des détails s'effacent quand le visiteur est inactif ; tout mouvement de souris, touche ou contact les fait revenir. `0` les garde affichés en permanence.
- **`showExtendedMetadata`** — le panneau de détails affiche toujours le titre, la légende et le crédit de l'image (depuis ses champs IPTC/EXIF, voir [Préparation des images](03-preparation-images.md)). Avec `true`, il affiche aussi ce que le fichier transporte d'autre : **Détails techniques** (boîtier, objectif, exposition), **Lieu & date** et **Mots-clés**. Passez-le à `false` pour limiter le panneau aux trois champs éditoriaux — pour un portfolio où les réglages de l'appareil ne regardent personne, ou dont les photos viennent de plusieurs mains.

### 2. Fonts personnalisées

Pour utiliser des polices personnalisées :

1. Ajoutez vos fichiers de police dans `static/fonts/`
2. Modifiez le fichier `src/app.css` :

```css
@font-face {
	font-family: 'MaPolice';
	src: url('/fonts/mapolice.woff2') format('woff2');
	font-weight: normal;
	font-style: normal;
}

@theme {
	--default-font-family: 'MaPolice', 'sans-serif';
}
```

### 3. Personnalisation des modes d'affichage

Le site propose différents modes d'affichage des projets :

- **Grid** : Affichage en grille
- **List** : Affichage en liste
- **Map** : Affichage sur carte (si coordonnées GPS)

Vous pouvez personnaliser ces modes dans les fichiers correspondants :

- `src/routes/projects/+page.svelte` (grille)
- `src/routes/list/+page.svelte` (liste)
- `src/routes/map/+page.svelte` (carte)

## Variables d'environnement

Le fichier `.env` contient les variables importantes :

microfolio n'en lit aucune qui lui soit propre. L'adresse du site vit dans
`src/lib/config.js`, sous `url`.

## Prochaines étapes

- [Guide d'ajout de projets](04-ajout-projets.md)
- [Guide de publication](05-publication.md)

## Conseils

- Testez toujours vos modifications avec `pnpm dev`
- Gardez vos textes courts et impactants
- Utilisez des images de haute qualité
- Vérifiez la compatibilité mobile
- Optimisez le référencement avec des descriptions pertinentes
