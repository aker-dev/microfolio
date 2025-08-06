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

### 2. Page À propos

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

### 3. Configuration du domaine personnalisé

Si vous avez un nom de domaine personnalisé :

1. Modifiez le fichier `static/CNAME` et remplacez le contenu par votre domaine :

   ```
   monportfolio.com
   ```

2. Dans le fichier `.env`, définissez :
   ```
   CUSTOM_DOMAIN=true
   ```

### 4. Personnalisation des couleurs et du style

Le site utilise Tailwind CSS v4. Vous pouvez personnaliser les couleurs et le style dans le fichier `src/app.css`.

**Exemple de personnalisation :**

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap');

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
