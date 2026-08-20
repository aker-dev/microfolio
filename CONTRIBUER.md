# Contribuer à microfolio

_[🇬🇧 Read in English](CONTRIBUTING.md)_

Merci de vouloir aider ! microfolio se construit au grand jour, et toutes les contributions sont les bienvenues — pas besoin d'écrire du code pour améliorer l'outil.

## Signaler un bug

[Ouvrez une issue](https://github.com/aker-dev/microfolio/issues/new/choose) en précisant :

- votre système d'exploitation (Mac/Windows/Linux) et votre version de Node.js (`node --version`)
- ce que vous avez fait, ce que vous attendiez, ce qui s'est passé à la place
- une capture d'écran ou la sortie du terminal si possible

Les issues rédigées en français sont les bienvenues.

## Proposer une fonctionnalité

Commencez par une [discussion](https://github.com/aker-dev/microfolio/discussions) ou une [issue de demande de fonctionnalité](https://github.com/aker-dev/microfolio/issues/new/choose). Décrivez le problème que vous cherchez à résoudre plutôt que seulement la solution que vous avez en tête — cela mène généralement à de meilleures réponses.

## Aider à traduire

microfolio est livré en anglais et en français ; les chaînes de l'interface vivent dans `src/lib/locales/`, et l'ajout d'une langue est [documenté dans le guide de configuration](doc/fr/02-configuration.md#7-internationalisation-i18n). Si vous souhaitez traduire l'interface ou la documentation dans votre langue, écrivez à **hello@aker.pro** — votre aide est précieuse.

## Contribuer du code

### Mise en place

```bash
git clone https://github.com/aker-dev/microfolio.git
cd microfolio
pnpm install                                    # nécessite Node.js 22.13+
cd content/projects && unzip example_projects.zip && cd ../..   # le jeu de démo attendu par les tests
pnpm dev                                        # http://localhost:5555
```

### Avant d'ouvrir une Pull Request

- Travaillez depuis la branche **`dev`** — c'est là que le développement se passe ; `main` porte les releases
- Lancez les vérifications : `pnpm lint && pnpm test`, et `pnpm test:e2e` si votre changement touche au comportement
- Les messages de commit suivent [Conventional Commits](https://www.conventionalcommits.org/fr/) (`feat:`, `fix:`, `docs:`, …)
- Un sujet par PR — petit et ciblé vaut mieux que gros et mélangé

### La suite

Un mainteneur relit votre PR, demande éventuellement des ajustements, et la fusionne dans `dev`. Votre changement part avec la release suivante et gagne sa ligne dans le [changelog](CHANGELOG.md).

## Code de conduite

Soyez bienveillant. Les détails sont dans [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Des questions ?

- 💬 [GitHub Discussions](https://github.com/aker-dev/microfolio/discussions)
- 📧 **hello@aker.pro**
