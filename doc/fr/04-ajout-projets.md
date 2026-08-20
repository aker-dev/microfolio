# Guide d'Ajout de Projets

## Structure d'un projet

Chaque projet dans Microfolio est organisé dans un dossier séparé situé dans `content/projects/`. Voici la structure recommandée :

```
content/projects/mon-projet/
├── index.md          # Fichier principal du projet
├── thumbnail.jpg     # Image miniature (obligatoire)
├── images/          # Dossier des images
│   ├── main-view.jpg
│   ├── detail-view.jpg
│   └── context-view.jpg
├── videos/          # Dossier des vidéos (optionnel)
│   └── overview.mp4
└── documents/       # Dossier des documents (optionnel)
    ├── project-brief.pdf
    └── technical-specs.pdf
```

## Création d'un nouveau projet

### 1. Créer le dossier du projet

```bash
mkdir content/projects/nom-de-votre-projet
cd content/projects/nom-de-votre-projet
```

**Règles de nommage :**

- Utilisez des tirets (-) au lieu d'espaces
- Évitez les caractères spéciaux
- Préférez les noms courts et descriptifs
- Exemples : `villa-moderne`, `logo-restaurant`, `exposition-art`

### 2. Créer le fichier principal

Créez le fichier `index.md` avec la structure suivante :

```markdown
---
# ── Obligatoire ── un projet auquel il manque l'un des deux est ignoré partout
title: 'Titre de votre projet'
date: '2024-01-15' # AAAA-MM-JJ

# ── Recommandé ──
description: 'Description courte et percutante de votre projet'
type: 'architecture' # alimente le filtre par type — voir la liste ci-dessous

# ── Optionnel ──
location: 'Ville, Pays'
coordinates: [48.8566, 2.3522] # [latitude, longitude], place le projet sur la carte
tags: ['moderne', 'durable', 'espace-public'] # ne répétez pas le type
authors:
  - name: 'Votre Nom'
    role: 'Designer Principal'
  - name: 'Collaborateur'
    role: 'Consultant'
featured: true # true met le projet en avant sur la page d'accueil

# ── Panneau d'infos optionnel ── affiché sur la page projet quand présent
owner: "Client ou maître d'ouvrage"
status: 'delivered' # texte libre : delivered, ongoing, competition…
surface_area: '250 m²'
cost: '1 200 000 €'
---

## Description du projet

Décrivez votre projet en détail. Expliquez le contexte, les défis, votre approche créative.

## Concept et inspiration

Parlez de votre démarche créative, vos sources d'inspiration, votre vision.

## Processus de création

Détaillez les étapes de votre travail, les techniques utilisées, les outils employés.

## Résultats et impact

Présentez les résultats obtenus, l'accueil du projet, son impact.
```

### 3. Métadonnées importantes

**Champs obligatoires** (un projet auquel il en manque un est ignoré, et nommé dans un résumé en fin de build) :

- `title` : Titre du projet
- `date` : Date de réalisation (format YYYY-MM-DD)

**Champs recommandés :**

- `description` : Description courte pour les aperçus
- `type` : Type de projet, alimente le filtre par type (voir liste ci-dessous)

**Champs optionnels :**

- `location` : Localisation du projet
- `coordinates` : Coordonnées GPS [latitude, longitude]

> La carte affiche OpenStreetMap dans le monde entier, via OpenFreeMap, et suit
> votre thème clair ou sombre. Le fond de carte et ses limites de zoom se règlent
> en tête de `src/routes/map/+page.svelte` si vous en préférez un autre.

- `tags` : Mots-clés pour le filtrage — ne répétez pas le type, il a son propre filtre
- `authors` : Créateurs et collaborateurs (chacun avec un `name` et un `role`)
- `featured` : Projet mis en avant (true/false)
- `owner`, `status`, `surface_area`, `cost` : champs en texte libre, affichés dans le panneau d'infos de la page projet quand ils sont présents

### 4. Exemples de types de projets

- `architecture` : Projets architecturaux
- `design` : Design graphique, produit
- `art` : Œuvres artistiques
- `web` : Sites web, applications
- …

## Ajout de médias

### 1. Image miniature (obligatoire)

Ajoutez une image `thumbnail.jpg` dans le dossier du projet — 1200×900 pixels recommandés (4:3, le ratio des cartes).

### 2. Images du projet

Créez un dossier `images/` et ajoutez vos images.

Tailles, formats, nommage, et les métadonnées EXIF/IPTC que la lightbox affiche — y compris ce qu'il faut retirer avant de publier — sont couverts dans le guide **[Préparation des images](03-preparation-images.md)**.

### 3. Vidéos (optionnel)

Pour ajouter des vidéos, créez un dossier `videos/`

**Formats supportés :**

- MP4 (recommandé)
- WebM
- OGV

### 4. Documents (optionnel)

Pour ajouter des documents, créez un dossier `documents/`

Pour des documents PDF ou autres :

```markdown
## Documents

- [Dossier technique](documents/technical-specs.pdf)
- [Brief du projet](documents/project-brief.pdf)
```

## Exemple complet

Voici un exemple complet d'un projet d'architecture :

```markdown
---
title: 'Villa Contemporaine'
date: '2024-03-20'
location: 'Nice, France'
coordinates: [43.7102, 7.2620]
description: 'Maison individuelle contemporaine avec vue sur mer, intégrant des principes de développement durable'
type: 'architecture'
tags: ['résidentiel', 'contemporain', 'durable', 'vue mer']
authors:
  - name: 'Marie Dubois'
    role: 'Architecte'
  - name: 'Jean Martin'
    role: 'Architecte paysagiste'
owner: 'Client privé'
status: 'delivered'
surface_area: '250 m²'
cost: '1 850 000 €'
featured: true
---

## Description du projet

Cette villa contemporaine de 250m² a été conçue pour une famille de quatre personnes souhaitant allier confort moderne et respect de l'environnement. Située sur les hauteurs de Nice, elle bénéficie d'une vue panoramique sur la Méditerranée.

## Concept architectural

Le projet s'articule autour de trois principes fondamentaux :

- **Ouverture sur le paysage** : Grandes baies vitrées orientées sud
- **Intégration environnementale** : Utilisation de matériaux locaux
- **Performance énergétique** : Certification BBC

## Galerie

![Vue depuis la terrasse](images/terrace-view.jpg)
_La terrasse principale offre une vue dégagée sur la mer_

![Salon principal](images/living-room.jpg)
_L'espace de vie ouvert baigné de lumière naturelle_

![Façade sud](images/south-facade.jpg)
_Façade sud avec ses grandes ouvertures et brise-soleil_

## Matériaux et techniques

- **Structure** : Béton armé et acier
- **Isolation** : Laine de bois et ouate de cellulose
- **Menuiseries** : Aluminium à rupture de pont thermique
- **Revêtements** : Pierre locale et bois douglas

## Développement durable

- Panneaux solaires photovoltaïques
- Récupération d'eau de pluie
- Végétalisation des toitures
- Géothermie pour le chauffage

## Reconnaissance

- **2024** : Prix d'architecture durable PACA
- **2024** : Publication dans "Maisons Contemporaines"
- **2024** : Sélection Architectures à Vivre

## Documents

- [Plans architecturaux](documents/plans.pdf)
- [Dossier technique](documents/technical-specs.pdf)
- [Certification BBC](documents/bbc-certificate.pdf)
```

## Bonnes pratiques

### 1. Rédaction

- **Titre accrocheur** : Clair et descriptif
- **Description courte** : Maximum 160 caractères
- **Texte structuré** : Utilisez des sous-titres
- **Langage accessible** : Évitez le jargon technique
- **Storytelling** : Racontez l'histoire du projet

### 2. Images

- **Qualité professionnelle** : Photos nettes et bien éclairées
- **Diversité des vues** : Ensemble, détails, contexte
- **Cohérence visuelle** : Style photographique homogène
- **Optimisation web** : Taille et poids optimisés

### 3. Métadonnées

- **Tags pertinents** : Facilitent la recherche — et ne répétez jamais le type, qui a son propre filtre
- **Localisation précise** : Permet l'affichage sur carte
- **Date exacte** : Aide au classement chronologique
- **Auteurs complets** : Crédits professionnels

### 4. Référencement

- **URLs descriptives** : Nom de dossier explicite
- **Mots-clés naturels** : Intégrés dans le texte
- **Liens internes** : Vers d'autres projets similaires

## Validation et publication

### 1. Vérification

Avant de publier, vérifiez :

- [ ] Fichier `index.md` complet
- [ ] Image `thumbnail.jpg` présente
- [ ] Métadonnées correctes
- [ ] Liens fonctionnels
- [ ] Orthographe et grammaire

### 2. Test local

```bash
pnpm dev
```

Vérifiez que votre projet s'affiche correctement dans :

- La liste des projets
- Le détail du projet
- Les filtres et la recherche
- La vue carte (si coordonnées GPS)

### 3. Optimisation

- Compressez vos images
- Vérifiez les temps de chargement
- Testez sur mobile
- Validez l'accessibilité

## Prochaines étapes

Une fois vos projets ajoutés, consultez le [Guide de publication](05-publication.md) pour mettre votre portfolio en ligne.

## Ressources utiles

- **Optimisation d'images** : TinyPNG, Squoosh
- **Coordonnées GPS** : Google Maps, OpenStreetMap
- **Inspiration** : Behance, Dribbble, ArchDaily
- **Rédaction** : Grammarly, Antidote
