# Préparation des images

Vos images sont le portfolio. Ce guide couvre le travail d'avant la mise en ligne : exporter les fichiers à la bonne taille, et renseigner les métadonnées que la lightbox transforme en légendes, crédits et fiches techniques — sans oublier ce qu'il faut retirer avant que quoi que ce soit devienne public.

## Tailles et formats

- **Vignette** (`thumbnail.jpg`, une par projet) : 1200×900 pixels recommandés — 4:3, le ratio des cartes. Quelques centaines de Ko au maximum
- **Images de galerie** (dossier `images/`) : 1920px sur le grand côté suffit largement
- **Format** : JPG qualité ~80 pour les photos, PNG pour les aplats graphiques, profil couleur sRGB
- **N'exportez pas de WebP vous-même** : microfolio génère des versions WebP optimisées de chaque image au moment du build
- **Nommage** : noms descriptifs, minuscules, sans espaces ni accents (`facade-sud.jpg`, pas `IMG_001.jpg`)
- **Cohérence** : des cadrages et un traitement homogènes sur un même projet donnent une série, pas un vrac

## Métadonnées d'images (EXIF/IPTC)

La lightbox a un panneau de détails qui lit les métadonnées **embarquées dans vos fichiers image** — renseignez ces champs et chaque image transporte sa légende, son crédit et sa fiche technique, sans rien à maintenir côté Markdown. Voici ce que lit chaque ligne du panneau :

| Ligne du panneau     | Champ dans le fichier                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| Titre                | IPTC _Headline_ (à défaut, le nom du fichier)                                      |
| Légende              | EXIF _ImageDescription_, ou IPTC _Caption-Abstract_                                |
| Crédit               | IPTC _Credit_ (à défaut, EXIF _Artist_)                                            |
| Source               | IPTC _Source_ (affiché après le crédit : « Crédit / Source »)                      |
| Mots-clés            | IPTC _Keywords_                                                                    |
| Boîtier & exposition | EXIF _Make_, _Model_, _LensModel_, _FocalLength_, _FNumber_, _ExposureTime_, _ISO_ |
| Date                 | EXIF _DateTimeOriginal_ (ou _DateTime_)                                            |
| Lieu                 | Coordonnées GPS, IPTC _City_, _Province-State_, _Country_, _Sub-location_          |

Une photo sortie d'un appareil porte déjà les champs techniques et la date ; les champs éditoriaux — titre, légende, crédit, mots-clés — sont à vous.

## Outils pour éditer les métadonnées

- **[Affinity Photo](https://affinity.serif.com)** permet de consulter et d'éditer les métadonnées EXIF/IPTC d'une image et de les conserver à l'export
- **[exiftool](https://exiftool.org)** (gratuit, en ligne de commande) est l'outil de référence :

  ```bash
  # Lire tout ce que contient un fichier
  exiftool images/facade-sud.jpg

  # Écrire les champs éditoriaux
  exiftool -IPTC:Headline='Façade sud au crépuscule' -IPTC:Credit='Jeanne Dupont' images/facade-sud.jpg
  ```

## Vie privée — vérifiez avant de publier

Vos fichiers image sont copiés sur le site publié **tels quels**, métadonnées comprises. Une photo de téléphone embarque généralement les coordonnées GPS de la prise de vue : publiez une photo prise chez vous et le fichier contient votre adresse. Vérifiez ce qu'un fichier transporte (`exiftool image.jpg`, ou le panneau métadonnées de votre logiciel photo) et retirez ce qui ne doit pas voyager :

```bash
# Retirer toutes les données GPS d'une image
exiftool -gps:all= images/chez-moi.jpg
```

## Droits et crédits

Ne publiez que des images dont vous détenez les droits. Quand une photo n'est pas de vous, renseignez _Credit_ (et _Source_) pour que le photographe soit nommé dans la lightbox — et assurez-vous de son accord pour la publication.

## Étape suivante

Images prêtes ? Direction le **[Guide d'ajout de projets](04-ajout-projets.md)** pour les mettre dans un projet.
