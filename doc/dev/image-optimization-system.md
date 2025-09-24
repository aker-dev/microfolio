# 📸 Système d'Optimisation d'Images - microfolio

Ce document explique le système automatique de génération d'images optimisées intégré dans microfolio.

## 🎯 Objectifs

- **Performance** : Réduire drastiquement la taille des images (90%+ d'économie)
- **Formats modernes** : Support AVIF et WebP avec fallback JPG
- **Responsive** : Images adaptées aux différentes tailles d'écran
- **Développement** : Images optimisées disponibles en dev et production
- **SEO friendly** : Images optimisées pour le référencement

## 🏗️ Architecture

### Composants principaux

1. **Script de génération** : `scripts/generate-optimized-images.js`
2. **Composant Svelte** : `src/lib/components/OptimizedImage.svelte`
3. **Intégration build** : `build.js` modifié
4. **Usage dans les composants** : AkProjectCard, pages projets

### Formats générés

```
content/projects/{project-slug}/
├── thumbnail.jpg              # Original (250K)
├── thumbnail.avif             # Optimisé AVIF (24K - 90% réduction)
├── thumbnail.webp             # Optimisé WebP (19K - 92% réduction)
└── images/
    ├── image.jpg              # Images originales
    ├── {image}_thumb.avif     # Thumbnails galerie AVIF
    └── {image}_thumb.webp     # Thumbnails galerie WebP
```

## 📐 Tailles générées

### Thumbnails projets
- **Dimensions** : 300x400px (ratio 3:4)
- **Usage** : Cartes projets dans grilles
- **Formats** : AVIF (qualité 75) + WebP (qualité 80) + JPG fallback

### Thumbnails galerie
- **Dimensions** : 300x300px (carré)
- **Usage** : Aperçus dans galeries projets
- **Formats** : AVIF (qualité 70) + WebP (qualité 75) + JPG fallback

## 🚀 Utilisation

### Commandes disponibles

```bash
# Génération des images optimisées (recommandé avant build)
pnpm run optimize-images

# Nettoyage des images optimisées
pnpm run clean-images


# Build standard (sans génération d'images)
pnpm run build

# Build complet avec images optimisées
pnpm run build:full

# Déploiement production (avec images optimisées)
pnpm run deploy
```

### Workflow recommandé

#### Développement quotidien
```bash
# Générer les images optimisées (recommandé)
pnpm run optimize-images

# Démarrer le serveur de développement
pnpm dev

# Les images optimisées sont disponibles pour tester les performances
# Le composant OptimizedImage utilise AVIF/WebP si disponibles
```

#### Avant mise en production
```bash
# 1. Générer les images optimisées (une fois ou après ajout de nouveaux projets)
pnpm run optimize-images

# 2. Build standard (rapide)
pnpm run build

# OU en une commande
pnpm run build:full
```

#### Nettoyage et maintenance
```bash
# Supprimer uniquement les images optimisées
pnpm run clean-images


# Workflow complet après nettoyage
pnpm run clean-images
pnpm run build:full
```

#### Quand régénérer les images ?

- ✅ **Après ajout de nouveaux projets**
- ✅ **Après modification des thumbnails existants**
- ✅ **Pour tester les performances en développement**
- ✅ **Avant un déploiement**
- ❌ **Pas nécessaire à chaque build (images persistantes)**

### Composant OptimizedImage

```svelte
<OptimizedImage
  src="/content/projects/mon-projet/thumbnail.jpg"
  alt="Mon projet"
  class="w-full h-full object-cover"
  isProjectThumbnail={true}
  loading="lazy"
  fetchpriority="high"
  sizes="(max-width: 768px) 50vw, 33vw"
/>
```

### Props du composant

| Prop | Type | Description |
|------|------|-------------|
| `src` | string | Chemin image source |
| `alt` | string | Texte alternatif |
| `class` | string | Classes CSS |
| `isProjectThumbnail` | boolean | Utiliser thumbnails projets optimisés |
| `isGalleryThumbnail` | boolean | Utiliser thumbnails galerie optimisés |
| `loading` | 'eager'\|'lazy' | Stratégie de chargement |
| `fetchpriority` | 'high'\|'low'\|'auto' | Priorité de fetch |
| `sizes` | string | Attribut sizes responsive |

## 🔧 Configuration

### Paramètres dans le script

```javascript
// Tailles des images
const THUMBNAIL_SIZE = { width: 300, height: 400 };
const GALLERY_THUMBNAIL_SIZE = { width: 300, height: 300 };

// Qualités de compression
const AVIF_QUALITY = 75; // Thumbnails projets
const WEBP_QUALITY = 80; // Thumbnails projets
const AVIF_GALLERY_QUALITY = 70; // Galerie
const WEBP_GALLERY_QUALITY = 75; // Galerie
```

### Personnalisation

Pour modifier les tailles ou qualités, éditer `scripts/generate-optimized-images.js` :

```javascript
// Exemple : thumbnails plus petits
const THUMBNAIL_SIZE = { width: 250, height: 300 };

// Exemple : qualité plus élevée
await generateAVIF(inputPath, outputPath, size, 85); // au lieu de 75
```

## 📊 Performances

### Gains de compression typiques

| Format | Taille moyenne | Réduction |
|--------|----------------|-----------|
| JPG original | 250KB | - |
| AVIF optimisé | 24KB | **90%** |
| WebP optimisé | 19KB | **92%** |

### Impact performance

- **Temps de chargement** : -80% en moyenne
- **Bande passante** : 90% d'économie
- **Core Web Vitals** : Amélioration LCP significative
- **SEO** : Boost PageSpeed Insights

## 🔄 Processus de génération

1. **Lecture des projets** : Scan du dossier `/content/projects/`
2. **Détection des images** : `thumbnail.jpg` + images dans `/images/`
3. **Vérification timestamps** : Skip si déjà générées et récentes
4. **Génération AVIF/WebP** : Via Sharp avec paramètres optimisés
5. **Sauvegarde sur place** : Directement dans `/content/projects/`

## 🔧 Gestion des fallbacks

Le système est conçu pour fonctionner même sans images optimisées :

### Comportement du composant OptimizedImage

```svelte
<!-- Si les images optimisées existent -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="...">
</picture>

<!-- Si les images optimisées n'existent pas -->
<img src="image.jpg" alt="...">
```

### En développement

- Les images optimisées sont **disponibles** si générées
- Le composant utilise les formats AVIF/WebP si disponibles, sinon fallback JPG
- Génération recommandée pour tester les performances réelles

### En production

- Les images optimisées sont **recommandées** pour les performances
- Le navigateur choisit automatiquement le meilleur format disponible
- Fallback JPG toujours disponible

## 🛠️ Dépannage

### Images non générées

```bash
# Vérifier les permissions
ls -la content/projects/
ls -la build/content/projects/

# Forcer la régénération
pnpm run clean-images
pnpm run optimize-images

pnpm run build:full
```

### Erreurs Sharp

```bash
# Réinstaller Sharp
pnpm remove sharp
pnpm add -D sharp

# Sur certains systèmes
pnpm add -D sharp --platform=linux --arch=x64
```

### Debug mode

Modifier le script pour plus de logs :

```javascript
console.log('Processing:', inputPath);
console.log('Output:', outputPath);
console.log('Size:', size);
```

## 🌐 Support navigateurs

### AVIF
- Chrome 85+
- Firefox 93+
- Safari 16+
- Edge 85+

### WebP
- Chrome 23+
- Firefox 65+
- Safari 14+
- Edge 18+

### Fallback JPG
- Tous navigateurs

## 📈 Monitoring

### Métriques à surveiller

- **Ratio de compression** : Objectif >85%
- **Temps de build** : Augmentation acceptable <30%
- **Taille totale images** : Réduction globale >80%
- **Utilisation AVIF** : Via Google Analytics

### Outils recommandés

- **Lighthouse** : Performance scores
- **WebPageTest** : Analyse détaillée
- **Google PageSpeed** : Core Web Vitals
- **Browser DevTools** : Network tab

## 🔮 Évolutions futures

### Améliorations possibles

1. **Responsive images** : Génération multiple tailles
2. **Lazy loading avancé** : Intersection Observer
3. **Preload hints** : Images critiques
4. **CDN integration** : Pour de gros volumes
5. **WebP animation** : Support GIF animés

### Format émergents

- **JPEG XL** : Prochaine génération (en attente support)
- **HEIF** : Images haute efficacité
- **AVIF progressive** : Chargement progressif

---

**📝 Note** : Ce système est optimisé pour les portfolios créatifs avec besoins de qualité image élevée et performance web maximale.

**🔗 Liens utiles** :
- [Documentation Sharp](https://sharp.pixelplumbing.com/)
- [Guide AVIF](https://web.dev/compress-images-avif/)
- [Web.dev Image optimization](https://web.dev/fast/#optimize-your-images)