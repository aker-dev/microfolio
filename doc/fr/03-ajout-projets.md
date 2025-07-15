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
title: "Titre de votre projet"
date: "2024-01-15"
location: "Ville, Pays"
coordinates: [latitude, longitude]
description: "Description courte et percutante de votre projet"
type: "architecture"
tags: ["architecture", "design", "moderne", "durable"]
authors:
  - name: "Votre Nom"
    role: "Designer Principal"
  - name: "Collaborateur"
    role: "Consultant"
featured: true
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

**Champs obligatoires :**
- `title` : Titre du projet
- `date` : Date de réalisation (format YYYY-MM-DD)
- `description` : Description courte pour les aperçus
- `type` : Type de projet (voir liste ci-dessous)

**Champs optionnels :**
- `location` : Localisation du projet
- `coordinates` : Coordonnées GPS [latitude, longitude]
- `tags` : Mots-clés pour le filtrage
- `authors` : Créateurs et collaborateurs
- `featured` : Projet mis en avant (true/false)

### 4. Types de projets disponibles

- `architecture` : Projets architecturaux
- `design` : Design graphique, produit
- `art` : Œuvres artistiques
- `interior` : Design d'intérieur
- `landscape` : Architecture paysagère
- `digital` : Projets numériques
- `branding` : Identité visuelle
- `photography` : Photographie
- `illustration` : Illustration
- `web` : Sites web, applications

## Ajout de médias

### 1. Image miniature (obligatoire)

Ajoutez une image `thumbnail.jpg` dans le dossier du projet :
- **Format** : JPG ou PNG
- **Taille recommandée** : 800x600 pixels
- **Poids** : Maximum 200 KB
- **Qualité** : Haute résolution pour l'affichage

### 2. Images du projet

Créez un dossier `images/` et ajoutez vos images :

```markdown
## Galerie

![Vue principale](images/main-view.jpg)
*Légende de l'image principale*

![Détail](images/detail-view.jpg)
*Gros plan sur un détail important*

![Contexte](images/context-view.jpg)
*Vue d'ensemble dans son environnement*
```

**Conseils pour les images :**
- Nommez vos fichiers de manière descriptive
- Utilisez des formats web optimisés (JPG, PNG, WebP)
- Ajoutez des légendes explicatives
- Respectez une cohérence visuelle

### 3. Vidéos (optionnel)

Pour ajouter des vidéos, créez un dossier `videos/` :

```markdown
## Vidéo de présentation

<video controls>
  <source src="videos/overview.mp4" type="video/mp4">
  Votre navigateur ne supporte pas la lecture vidéo.
</video>
```

**Formats supportés :**
- MP4 (recommandé)
- WebM
- OGV

### 4. Documents (optionnel)

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
title: "Villa Contemporaine"
date: "2024-03-20"
location: "Nice, France"
coordinates: [43.7102, 7.2620]
description: "Maison individuelle contemporaine avec vue sur mer, intégrant des principes de développement durable"
type: "architecture"
tags: ["architecture", "résidentiel", "contemporain", "durable", "vue mer"]
authors:
  - name: "Marie Dubois"
    role: "Architecte"
  - name: "Jean Martin"
    role: "Architecte paysagiste"
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
*La terrasse principale offre une vue dégagée sur la mer*

![Salon principal](images/living-room.jpg)
*L'espace de vie ouvert baigné de lumière naturelle*

![Façade sud](images/south-facade.jpg)
*Façade sud avec ses grandes ouvertures et brise-soleil*

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

- **Tags pertinents** : Facilitent la recherche
- **Localisation précise** : Permet l'affichage sur carte
- **Date exacte** : Aide au classement chronologique
- **Auteurs complets** : Crédits professionnels

### 4. Référencement

- **URLs descriptives** : Nom de dossier explicite
- **Balises alt** : Descriptions des images
- **Mots-clés naturels** : Intégrés dans le texte
- **Liens internes** : Vers d'autres projets similaires

## Gestion des projets

### Projet en cours

Pour un projet non terminé :

```markdown
---
title: "Projet en cours"
date: "2024-12-01"
status: "en-cours"
completion: 75
---

## État d'avancement

Ce projet est actuellement en phase de réalisation. Completion estimée : 75%

**Étapes terminées :**
- ✅ Conception
- ✅ Études techniques
- ✅ Permis de construire

**Étapes en cours :**
- 🔄 Réalisation
- ⏳ Finitions
```

### Projet conceptuel

Pour un projet non réalisé :

```markdown
---
title: "Concept d'aménagement"
date: "2024-11-15"
status: "concept"
---

## Concept exploratoire

Ce projet explore de nouvelles approches pour l'aménagement urbain. Bien que non réalisé, il présente des solutions innovantes pour l'avenir de nos villes.
```

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
pnpm run dev
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

Une fois vos projets ajoutés, consultez le [Guide de publication](04-publication.md) pour mettre votre portfolio en ligne.

## Ressources utiles

- **Optimisation d'images** : TinyPNG, Squoosh
- **Coordonnées GPS** : Google Maps, OpenStreetMap
- **Inspiration** : Behance, Dribbble, ArchDaily
- **Rédaction** : Grammarly, Antidote