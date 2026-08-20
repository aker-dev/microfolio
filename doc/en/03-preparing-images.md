# Preparing Your Images

Your images are the portfolio. This guide covers the work before the upload: exporting files at the right size, and filling in the metadata that the lightbox turns into captions, credits and technical sheets — plus what to strip before anything goes public.

## Sizes and Formats

- **Thumbnail** (`thumbnail.jpg`, one per project): 1200×900 pixels recommended — 4:3, the card ratio. A few hundred KB at most
- **Gallery images** (`images/` folder): 1920px on the long edge is plenty
- **Format**: JPG at quality ~80 for photos, PNG for flat graphics, sRGB color profile
- **Don't export WebP yourself**: microfolio generates optimized WebP versions of every image at build time
- **Naming**: descriptive names, lowercase, no spaces or accents (`south-facade.jpg`, not `IMG_001.jpg`)
- **Consistency**: similar framing and treatment across a project reads as a series, not a dump

## Image Metadata (EXIF/IPTC)

The lightbox has a details panel that reads the metadata **embedded in your image files** — fill those fields in and every image carries its own caption, credit and technical sheet, with nothing to maintain in Markdown. This is what each row of the panel reads:

| Panel row         | Field in the file                                                                  |
| ----------------- | ---------------------------------------------------------------------------------- |
| Title             | IPTC _Headline_ (falls back to the file name)                                      |
| Caption           | EXIF _ImageDescription_, or IPTC _Caption-Abstract_                                |
| Credit            | IPTC _Credit_ (falls back to EXIF _Artist_)                                        |
| Source            | IPTC _Source_ (shown after the credit, as "Credit / Source")                       |
| Keywords          | IPTC _Keywords_                                                                    |
| Camera & exposure | EXIF _Make_, _Model_, _LensModel_, _FocalLength_, _FNumber_, _ExposureTime_, _ISO_ |
| Date              | EXIF _DateTimeOriginal_ (or _DateTime_)                                            |
| Location          | GPS coordinates, IPTC _City_, _Province-State_, _Country_, _Sub-location_          |

A photo straight out of a camera already carries the technical fields and the date; the editorial ones — headline, caption, credit, keywords — are yours to add.

## Tools for Editing Metadata

- **[Affinity Photo](https://affinity.serif.com)** lets you view and edit an image's EXIF/IPTC metadata and keep it embedded on export
- **[exiftool](https://exiftool.org)** (free, command line) is the reference tool:

  ```bash
  # Read everything a file carries
  exiftool images/south-facade.jpg

  # Write the editorial fields
  exiftool -IPTC:Headline='South facade at dusk' -IPTC:Credit='Jane Doe' images/south-facade.jpg
  ```

## Privacy — Check Before You Publish

Your image files are copied to the published site **as they are**, metadata included. A phone photo usually embeds the GPS coordinates of where it was taken: publish a photo shot at home and the file contains your address. Review what a file carries (`exiftool image.jpg`, or your photo tool's metadata panel) and strip what should not travel:

```bash
# Remove all GPS data from an image
exiftool -gps:all= images/at-home.jpg
```

## Rights and Credits

Only publish images you hold the rights to. When a photo is not yours, fill in _Credit_ (and _Source_) so the photographer is named in the lightbox — and make sure they agreed to the publication.

## Next Step

Images ready? Head to the **[Project Addition Guide](04-adding-projects.md)** to put them in a project.
