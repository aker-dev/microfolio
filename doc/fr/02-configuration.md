# Guide de Configuration Personnalisée

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

### 4. Configuration du domaine personnalisé

Si vous avez un nom de domaine personnalisé :

1. Modifiez le fichier `static/CNAME` et remplacez le contenu par votre domaine :

   ```
   monportfolio.com
   ```

2. Dans le fichier `.env`, définissez :
   ```
   CUSTOM_DOMAIN=true
   ```

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
	locale: 'en', // Changez en 'fr' pour le français
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

Remplacez le fichier `static/favicon.png` par votre propre favicon.

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

```env
# Configuration du domaine
CUSTOM_DOMAIN=true
```

## Prochaines étapes

- [Guide d'ajout de projets](03-ajout-projets.md)
- [Guide de publication](04-publication.md)

## Conseils

- Testez toujours vos modifications avec `pnpm dev`
- Gardez vos textes courts et impactants
- Utilisez des images de haute qualité
- Vérifiez la compatibilité mobile
- Optimisez le référencement avec des descriptions pertinentes
