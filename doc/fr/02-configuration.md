# Guide de Configuration Personnalisée

## Configuration de base

### 1. Informations personnelles

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

/* Styles personnalisés */
.mon-style-perso {
	color: var(--color-primary-500);
	font-family: var(--default-font-family);
}
```

### 5. Configuration des métadonnées

Modifiez le fichier `src/app.html` pour personnaliser les métadonnées globales :

```html
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Portfolio de [Votre Nom]" />
	<meta name="author" content="[Votre Nom]" />
	<title>Portfolio - [Votre Nom]</title>

	<!-- Ajoutez vos propres métadonnées -->
	<meta property="og:title" content="Portfolio - [Votre Nom]" />
	<meta property="og:description" content="Découvrez mes créations..." />
	<meta property="og:image" content="/images/og-image.jpg" />
</head>
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

### 3. Google Analytics

Pour ajouter Google Analytics :

1. Créez un fichier `src/lib/components/Analytics.svelte` :

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		// Code Google Analytics
		window.gtag =
			window.gtag ||
			function () {
				(window.gtag.q = window.gtag.q || []).push(arguments);
			};

		gtag('js', new Date());
		gtag('config', 'GA_MEASUREMENT_ID');
	});
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
</svelte:head>
```

2. Importez-le dans votre layout principal.

### 4. Personnalisation des modes d'affichage

Le site propose différents modes d'affichage des projets :

- **Grid** : Affichage en grille
- **List** : Affichage en liste
- **Map** : Affichage sur carte (si coordonnées GPS)

Vous pouvez personnaliser ces modes dans les fichiers correspondants :

- `src/routes/projects/+page.svelte` (grille)
- `src/routes/list/+page.svelte` (liste)
- `src/routes/map/+page.svelte` (carte)

### 5. Filtres et catégories

Les projets peuvent être filtrés par :

- **Type** : architecture, design, art, etc.
- **Localisation** : ville, pays
- **Année** : période de réalisation
- **Statut** : terminé, en cours, concept

Ces filtres se configurent dans les métadonnées de chaque projet (voir guide suivant).

## Variables d'environnement

Le fichier `.env` contient les variables importantes :

```env
# Configuration du domaine
CUSTOM_DOMAIN=true

# Mode de développement
NODE_ENV=development
```

## Sauvegarde et versioning

N'oubliez pas de sauvegarder vos modifications avec Git :

```bash
git add .
git commit -m "Personnalisation du portfolio"
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
