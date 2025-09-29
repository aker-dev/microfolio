import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import { siteConfig } from './config.js';

import en from './locales/en.json';
import fr from './locales/fr.json';

addMessages('en', en);
addMessages('fr', fr);

init({
	fallbackLocale: 'en',
	initialLocale: siteConfig.locale,
});