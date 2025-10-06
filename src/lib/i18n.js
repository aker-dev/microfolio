import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import { siteConfig } from './config.js';

import en from './locales/en.json';
import fr from './locales/fr.json';
// import es from './locales/es.json';
// import it from './locales/it.json';
// import de from './locales/de.json';
// import ja from './locales/ja.json';
// import ar from './locales/ar.json';

addMessages('en', en);
addMessages('fr', fr);
// addMessages('es', es);
// addMessages('it', it);
// addMessages('de', de);
// addMessages('ja', ja);
// addMessages('ar', ar);

init({
	fallbackLocale: 'en',
	initialLocale: siteConfig.locale
});
