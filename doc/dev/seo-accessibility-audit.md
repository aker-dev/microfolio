# 🔍 AUDIT SEO & ACCESSIBILITÉ - MICROFOLIO

**Date d'audit :** 24 septembre 2025  
**Version analysée :** 0.4.0-beta.4  
**Auditeur :** Claude Code

---

## 📊 RÉSUMÉ EXÉCUTIF

**Score global estimé : 7.5/10**
- ✅ Structure technique solide (SvelteKit + SSR)
- ⚠️ Quelques améliorations SEO nécessaires
- ⚠️ Problèmes d'accessibilité à corriger
- ✅ Performance satisfaisante

---

## 🔍 ANALYSE DÉTAILLÉE

### ✅ POINTS FORTS IDENTIFIÉS

1. **Architecture technique excellente**
   - SSR avec SvelteKit pour un bon référencement
   - Prerendering de 106 pages statiques
   - Sitemap automatique via la génération des routes
   - Bundle optimisé (≤150KB pour le plus gros chunk)

2. **Performance**
   - Fonts optimisées (WOFF2 + fallbacks TTF)
   - Images avec `fetchpriority="high"` approprié
   - Code splitting efficace

3. **Structure sémantique de base**
   - Balises `<main>`, `<header>`, `<footer>`, `<nav>` présentes
   - Hiérarchie H1-H6 respectée globalement

4. **UX moderne**
   - Design responsive mobile-first
   - Navigation intuitive
   - Galerie d'images avec lightbox accessible

---

## ⚠️ PROBLÈMES CRITIQUES IDENTIFIÉS

### 🚨 SEO Fondamental

1. **Langue incorrecte**
   - Fichier: `src/app.html:2`
   - Problème: `<html lang="en">` alors que le contenu semble français
   - Impact: Référencement international incorrect

2. **Métadonnées Open Graph manquantes**
   - Aucune balise `og:*` détectée
   - Impact: Partage social inefficace

3. **Schema.org absent**
   - Aucun JSON-LD détecté
   - Impact: Rich snippets impossibles

### 🚨 Accessibilité

1. **Navigation clavier défaillante**
   - Fichier: `src/lib/components/AkHeader.svelte:77-87`
   - Problème: Menu mobile sans gestion Escape/Tab
   - Impact: Utilisateurs clavier bloqués

2. **ARIA insuffisants**
   - `aria-expanded` manquant pour menu mobile
   - `aria-current` absent pour navigation active
   - Impact: Lecteurs d'écran perdus

---

## 📋 PLAN D'ACTION DÉTAILLÉ

### 🚨 PRIORITÉ 1 - CRITIQUE (À corriger immédiatement)

#### 1.1 **SEO FONDAMENTAL**

**Tâche 1.1.1 : Corriger la langue du site**
```html
<!-- src/app.html:2 -->
<!-- AVANT -->
<html lang="en">

<!-- APRÈS -->
<html lang="fr">
```
- **Effort :** 5 minutes
- **Impact :** Amélioration référencement international

**Tâche 1.1.2 : Créer sitemap.xml automatique**
- **Fichier à créer :** `static/sitemap.xml` ou génération dynamique
- **Effort :** 2 heures
- **Impact :** Indexation complète des 106 pages

**Tâche 1.1.3 : Ajouter robots.txt**
```txt
# static/robots.txt
User-agent: *
Allow: /
Sitemap: https://votredomaine.com/sitemap.xml
```
- **Effort :** 15 minutes
- **Impact :** Crawling optimisé

#### 1.2 **MÉTADONNÉES CRITIQUES**

**Tâche 1.2.1 : Open Graph complet**
```svelte
<!-- À ajouter dans chaque page -->
<svelte:head>
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:image" content="{imageUrl}" />
  <meta property="og:url" content="{canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="microfolio" />
</svelte:head>
```
- **Effort :** 4 heures
- **Impact :** Partage social efficace

**Tâche 1.2.2 : Twitter Cards**
```svelte
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
<meta name="twitter:image" content="{imageUrl}" />
```
- **Effort :** 2 heures
- **Impact :** Visibilité Twitter/X

**Tâche 1.2.3 : Schema.org JSON-LD**
```svelte
<!-- Page d'accueil -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "microfolio",
  "description": "static portfolio generator",
  "url": "https://votredomaine.com",
  "logo": "https://votredomaine.com/logo.png"
}
</script>
```
- **Effort :** 6 heures (toutes pages)
- **Impact :** Rich snippets Google

#### 1.3 **ACCESSIBILITÉ CRITIQUE**

**Tâche 1.3.1 : Navigation clavier complète**
```svelte
<!-- src/lib/components/AkHeader.svelte -->
<!-- Améliorer la gestion du menu mobile -->
<button
  class="..."
  onclick={toggleMobileMenu}
  onkeydown={handleKeydown}
  aria-label="Toggle mobile menu"
  aria-expanded={mobileMenuOpen}
>
```

```javascript
function handleKeydown(event) {
  if (event.key === 'Escape' && mobileMenuOpen) {
    mobileMenuOpen = false;
  }
}
```
- **Effort :** 3 heures
- **Impact :** Navigation accessible

**Tâche 1.3.2 : ARIA complets**
```svelte
<!-- Navigation avec état actuel -->
<a 
  href="{base}{item.href}"
  aria-current={isCurrentPage ? "page" : undefined}
>
  {item.name}
</a>
```
- **Effort :** 2 heures
- **Impact :** Lecteurs d'écran efficaces

---

### 🟡 PRIORITÉ 2 - IMPORTANT (Semaine suivante)

#### 2.1 **SEO TECHNIQUE**

**Tâche 2.1.1 : URL canoniques**
```svelte
<!-- Dans chaque page -->
<svelte:head>
  <link rel="canonical" href="{canonicalUrl}" />
</svelte:head>
```
- **Effort :** 2 heures
- **Impact :** Éviter contenu dupliqué

**Tâche 2.1.2 : Structured Data enrichie**
```javascript
// Schema pour projets
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{project.title}",
  "description": "{project.description}",
  "image": "{project.thumbnailSrc}",
  "author": {
    "@type": "Person",
    "name": "{author.name}"
  }
}
```
- **Effort :** 4 heures
- **Impact :** Rich snippets projets

#### 2.2 **PERFORMANCE IMAGES**

**Tâche 2.2.1 : Formats modernes**
```svelte
<!-- Remplacer img par picture -->
<picture>
  <source srcset="{image.webp}" type="image/webp">
  <source srcset="{image.avif}" type="image/avif">
  <img src="{image.jpg}" alt="{alt}" loading="lazy">
</picture>
```
- **Effort :** 6 heures + script conversion
- **Impact :** Performance +20%

**Tâche 2.2.2 : Lazy loading généralisé**
```svelte
<!-- Sauf hero images -->
<img 
  src="{src}" 
  alt="{alt}" 
  loading={isHero ? "eager" : "lazy"}
  decoding="async"
/>
```
- **Effort :** 1 heure
- **Impact :** Temps de chargement initial

#### 2.3 **ACCESSIBILITÉ AVANCÉE**

**Tâche 2.3.1 : Contraste couleurs**
- **Outil :** WebAIM Color Contrast Checker
- **Objectif :** Ratio 4.5:1 minimum (AA)
- **Effort :** 3 heures
- **Impact :** Lisibilité améliorée

**Tâche 2.3.2 : Skip links**
```svelte
<!-- En début de body -->
<a href="#main-content" class="skip-link">
  Aller au contenu principal
</a>
```
- **Effort :** 1 heure
- **Impact :** Navigation rapide clavier

---

### 🔵 PRIORITÉ 3 - AMÉLIORATION (Mois suivant)

#### 3.1 **SEO AVANCÉ**

**Tâche 3.1.1 : Fil d'Ariane**
```svelte
<!-- BreadcrumbList Schema -->
<nav aria-label="Fil d'Ariane">
  <ol>
    <li><a href="/">Accueil</a></li>
    <li><a href="/projects">Projets</a></li>
    <li aria-current="page">{project.title}</li>
  </ol>
</nav>
```
- **Effort :** 4 heures
- **Impact :** Navigation + SEO

**Tâche 3.1.2 : Internal linking optimisé**
- Liens contextuels entre projets similaires
- Navigation prev/next automatique
- **Effort :** 6 heures
- **Impact :** Page rank interne

#### 3.2 **UX INCLUSIF**

**Tâche 3.2.1 : Tailles de police**
```css
/* Minimum 16px mobile */
.text-sm { font-size: 1rem; } /* était 0.875rem */
.text-base { font-size: 1.125rem; }
.text-lg { font-size: 1.25rem; }
```
- **Effort :** 2 heures
- **Impact :** Lisibilité mobile

**Tâche 3.2.2 : Mode sombre automatique**
```css
@media (prefers-color-scheme: dark) {
  /* Variables CSS automatiques */
}
```
- **Effort :** 4 heures (déjà partiellement fait)
- **Impact :** Confort utilisateur

#### 3.3 **PERFORMANCE AVANCÉE**

**Tâche 3.3.1 : Preload critique**
```html
<link rel="preload" href="/fonts/IBMPlexSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">
```
- **Effort :** 3 heures
- **Impact :** First Paint amélioré

---

## 🎯 ACTIONS SPÉCIFIQUES PAR PAGE

### Page d'accueil (/)
- [ ] **H1 plus descriptif** que "Welcome!" → "Portfolio AKER - Architecture & Design"
- [ ] **Meta description** → "Découvrez les projets d'architecture et design d'AKER. Portfolio créatif avec 100+ projets innovants."
- [ ] **Schema Organization** complet

### Pages projets (/projects/[slug])
- [ ] **Alt text images** plus descriptifs → "{project.title} - Vue principale" au lieu de juste "{project.title}"
- [ ] **Navigation prev/next** entre projets
- [ ] **Schema CreativeWork** pour chaque projet
- [ ] **Breadcrumb** : Accueil > Projets > {title}

### Page liste (/list)
- [ ] **Filtres accessibles** : labels explicites, ARIA
- [ ] **Pagination sémantique** avec aria-label
- [ ] **Table headers** avec scope approprié

### Page carte (/map)
- [ ] **Contrôles clavier** Leaflet
- [ ] **Alt text markers** descriptifs
- [ ] **Description textuelle** alternative à la carte

---

## 📊 MÉTRIQUES DE SUCCÈS

### Avant corrections (estimé) :
- **Lighthouse SEO :** ~75/100
- **Lighthouse A11Y :** ~80/100  
- **Lighthouse Performance :** ~85/100
- **WAVE Errors :** ~15-20

### Objectifs après corrections :
- **Lighthouse SEO :** >90/100
- **Lighthouse A11Y :** >95/100
- **Lighthouse Performance :** >90/100
- **WAVE Errors :** 0-2 maximum

### KPIs SEO :
- **Indexation :** 106/106 pages indexées
- **Rich Snippets :** Présents sur 80%+ pages
- **Core Web Vitals :** Tous verts
- **Vitesse mobile :** <3s First Contentful Paint

---

## 💰 ESTIMATION TEMPS & RESSOURCES

### Développement requis :

| Priorité | Tâches | Temps estimé | Compétences |
|----------|--------|-------------|-------------|
| **P1 - Critique** | 8 tâches | 18-22 heures | HTML/Svelte/SEO |
| **P2 - Important** | 6 tâches | 16-20 heures | CSS/Images/A11Y |
| **P3 - Amélioration** | 5 tâches | 15-25 heures | Performance/UX |
| **TOTAL** | **19 tâches** | **49-67 heures** | **~8-12 jours dev** |

### Outils recommandés :
- **SEO :** Google Search Console, Screaming Frog
- **A11Y :** WAVE, axe DevTools, Screen Reader
- **Performance :** Lighthouse, GTmetrix, WebPageTest
- **Images :** Squoosh, ImageOptim

---

## 🚀 PLANNING DE MISE EN ŒUVRE

### Semaine 1 (P1 - Critique)
- Jour 1-2 : Métadonnées + langue
- Jour 3-4 : Navigation accessible + ARIA
- Jour 5 : Sitemap + robots.txt

### Semaine 2 (P2 - Important)
- Jour 1-2 : Images optimisées
- Jour 3 : URL canoniques + Schema
- Jour 4-5 : Tests accessibilité + contraste

### Semaine 3-4 (P3 - Amélioration)
- À étaler selon priorités business
- Focus performance et UX avancée

---

## 📋 CHECKLIST DE VALIDATION

### Avant déploiement :
- [ ] Tests Lighthouse sur 5 pages types
- [ ] Validation W3C HTML
- [ ] Test lecteur d'écran (NVDA/VoiceOver)
- [ ] Test navigation clavier complète
- [ ] Vérification Search Console
- [ ] Test partage social (Facebook, Twitter)
- [ ] Test responsive (mobile, tablette, desktop)

### Monitoring post-déploiement :
- [ ] Google Search Console configuré
- [ ] Analytics avec Core Web Vitals
- [ ] Alertes performance
- [ ] Review mensuelle accessibilité

---

**🎯 Prêt à valider ce plan ? Quel point souhaitez-vous prioriser en premier ?**

---

*Audit réalisé avec Claude Code - Outil d'analyse automatique*  
*Pour questions techniques : consulter CLAUDE.md*