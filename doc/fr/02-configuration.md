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

`src/lib/config.js` contient tout ce qui concerne **votre** site, et rien d'autre — cinq blocs, du général au particulier :

```javascript
export const siteConfig = {
	// --- Your site -------------------------------------------------------------
	title: 'microfolio', // l'en-tête, et le début du titre de chaque page
	description: 'static portfolio generator', // sous le titre, et la méta-description par défaut
	author: 'AKER', // la ligne de copyright du pied de page
	url: 'https://aker-dev.github.io/microfolio', // l'adresse de publication, sans slash final
	locale: 'en', // langue de l'interface : 'en' ou 'fr'

	// --- Navigation and links --------------------------------------------------
	navigation: [
		{ name: 'nav.home', href: '/' },
		{ name: 'nav.about', href: '/about' },
		{ name: 'nav.projects', href: '/projects' },
		{ name: 'nav.list', href: '/list' },
		{ name: 'nav.map', href: '/map' }
	],
	socialLinks: {
		github: 'https://github.com/aker-dev/microfolio',
		linkedin: 'https://www.linkedin.com/company/aker-network/',
		instagram: 'https://www.instagram.com/aker.pro/'
	},

	// --- Sharing and images ----------------------------------------------------
	ogImage: '/og.jpg',
	images: { optimizeOnBuild: true },

	// --- Typeface --------------------------------------------------------------
	font: {
		url: 'https://fonts.bunny.net/css?family=ibm-plex-sans:400,400i,600&display=swap',
		family: "'IBM Plex Sans', sans-serif"
	},

	// --- Lightbox --------------------------------------------------------------
	lightbox: { hideControlsDelay: 3000, showExtendedMetadata: true }
};
```

- **`title`, `description`, `author`** — votre nom, votre accroche, votre ligne de copyright
- **`url`** — le seul endroit où l'adresse est écrite : le chemin de base et toutes les URL absolues (balises de partage, liens canoniques, sitemap) en découlent. Voir [Configuration du domaine personnalisé](#4-configuration-du-domaine-personnalisé)
- **`locale`** — `'en'` ou `'fr'` ; l'ajout d'une langue est décrit sous [Internationalisation](#7-internationalisation-i18n)
- **`navigation`** — le menu, dans l'ordre. `name` est une clé de traduction de `src/lib/locales/` (`nav.home`, `nav.about`…), le menu suit donc la langue ; supprimez une entrée pour retirer une page du menu
- **`socialLinks`** — le pied de page affiche une icône pour chacun de `github`, `linkedin` et `instagram` ; supprimez ceux que vous n'utilisez pas
- **`font`** — la police : la feuille de style qui la charge et le nom de la famille, voir [Fonts personnalisées](#2-fonts-personnalisées)
- **`ogImage`, `images`, `lightbox`** — l'image de partage, l'optimisation des images au build et les deux réglages de la lightbox, couverts dans [Configuration avancée](#configuration-avancée)

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

**Vidéos YouTube ou Vimeo** : collez l'adresse de la vidéo sur une ligne à
part — rien d'autre sur la ligne — et elle devient le lecteur :

```markdown
https://www.youtube.com/watch?v=ID_VIDEO
```

Les adresses `youtu.be/…`, Shorts et `vimeo.com/…` fonctionnent de la même
façon. Un lien rédigé (`[voir le film](…)`) ou une adresse au milieu d'une
phrase reste un simple lien. Besoin des options de la plateforme (minutage de
départ, playlist…) ? Le code d'intégration de « Partager › Intégrer » peut être
collé tel quel à la place.

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

La police se règle dans le bloc `font` de `src/lib/config.js` — pas dans `src/app.html`, qu'une mise à jour de microfolio écrase :

```js
font: {
	url: 'https://fonts.bunny.net/css?family=ibm-plex-sans:400,400i,600&display=swap',
	family: "'IBM Plex Sans', sans-serif"
}
```

- **Une autre famille chez Bunny Fonts** (le catalogue de Google Fonts, servi depuis l'UE sans pistage) : choisissez-la sur [fonts.bunny.net](https://fonts.bunny.net), collez l'adresse fournie dans `url`, et le nom de la famille dans `family` — comme le CSS l'attend, avec une police de repli
- **Une police que vous hébergez vous-même** : `url: ''` pour ne rien charger d'un tiers, les fichiers dans `static/fonts/` avec un `@font-face` dans `src/app.css`, et la famille dans `family` :

  ```css
  @font-face {
  	font-family: 'MaPolice';
  	src: url('/fonts/mapolice.woff2') format('woff2');
  	font-weight: normal;
  	font-style: normal;
  }
  ```

- **La police système** : `url: ''` et `family: 'system-ui, sans-serif'`

Qui sert les fichiers de police voit les adresses IP de vos visiteurs, et `content/privacy.md` nomme Bunny.net pour cette raison : si vous changez de fournisseur, ou hébergez les fichiers vous-même, mettez son tableau à jour.

### 3. Personnalisation des modes d'affichage

Le site propose différents modes d'affichage des projets :

- **Grid** : Affichage en grille
- **List** : Affichage en liste
- **Map** : Affichage sur carte (si coordonnées GPS)

Vous pouvez personnaliser ces modes dans les fichiers correspondants :

- `src/routes/projects/+page.svelte` (grille)
- `src/routes/list/+page.svelte` (liste)
- `src/routes/map/+page.svelte` (carte)

### 4. Aller plus loin : les templates Svelte

Tout ce qui précède est de la configuration. Quand vous voulez changer l'apparence ou le comportement, les templates sont à vous aussi — microfolio est un projet SvelteKit, et un petit :

| Ce que vous voulez changer                                          | Où ça vit                                                   |
| ------------------------------------------------------------------- | ----------------------------------------------------------- |
| La mise en page d'une page (accueil, projets, liste, carte, projet) | `src/routes/**/+page.svelte`                                |
| En-tête, pied de page, cartes, filtres, lightbox                    | `src/lib/components/Ak*.svelte`                             |
| Couleurs, thème sombre, style de la prose                           | `src/lib/theme.css` et `src/app.css`                        |
| Les textes de l'interface                                           | `src/lib/locales/en.json`, `fr.json`                        |
| Les icônes                                                          | `src/lib/icons/` — `pnpm icons` en ajoute une depuis Carbon |
| Le menu, la lightbox, l'image de partage                            | `src/lib/config.js` (ce guide)                              |

`pnpm dev` recharge la page à chaque enregistrement. La pile est [SvelteKit 2](https://svelte.dev/docs/kit), [Svelte 5](https://svelte.dev/docs/svelte) et [Tailwind CSS 4](https://tailwindcss.com/docs) ; leur documentation couvre ce que font les templates. Un conseil : gardez des modifications petites et localisées — une couleur ici, un bloc là — pour que `git merge` ramène les futures versions de microfolio sans bagarre.

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
