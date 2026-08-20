# Contributing to microfolio

_[🇫🇷 Lire en français](CONTRIBUER.md)_

Thank you for wanting to help! microfolio is built in the open, and contributions of every kind are welcome — you don't need to write code to make the tool better.

## Report a bug

[Open an issue](https://github.com/aker-dev/microfolio/issues/new/choose) and tell us:

- your operating system (Mac/Windows/Linux) and Node.js version (`node --version`)
- what you did, what you expected, what happened instead
- a screenshot or the terminal output if possible

Issues written in French are welcome too.

## Suggest a feature

Start with a [discussion](https://github.com/aker-dev/microfolio/discussions) or a [feature request issue](https://github.com/aker-dev/microfolio/issues/new/choose). Describe the problem you're trying to solve rather than only the solution you have in mind — it usually leads to better answers.

## Help translate

microfolio ships in English and French; the interface strings live in `src/lib/locales/`, and adding a language is [documented in the configuration guide](doc/en/02-configuration.md#7-internationalization-i18n). If you'd like to translate the interface or the documentation into your language, write to **hello@aker.pro** — we'd love the help.

## Contribute code

### Setup

```bash
git clone https://github.com/aker-dev/microfolio.git
cd microfolio
pnpm install                                    # needs Node.js 22.13+
cd content/projects && unzip example_projects.zip && cd ../..   # the demo set the tests expect
pnpm dev                                        # http://localhost:5555
```

### Before opening a Pull Request

- Work from the **`dev`** branch — it's where development happens; `main` holds releases
- Run the checks: `pnpm lint && pnpm test`, and `pnpm test:e2e` if your change touches behaviour
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, …)
- One concern per PR — small and focused beats big and mixed

### What happens next

A maintainer reviews your PR, possibly asks for adjustments, and merges it into `dev`. Your change ships with the next release and gets a line in the [changelog](CHANGELOG.md).

## Code of conduct

Be kind. The details are in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Questions?

- 💬 [GitHub Discussions](https://github.com/aker-dev/microfolio/discussions)
- 📧 **hello@aker.pro**
