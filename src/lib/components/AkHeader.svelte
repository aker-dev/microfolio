<script>
	import { siteConfig } from '../config.js';
</script>

<header>
	<h1>{siteConfig.title}</h1>
	<h2>{siteConfig.description}</h2>
	<nav>
		<ul>
			{#each siteConfig.navigation as item}
				<li><a href={item.href}>{item.name}</a></li>
			{/each}
		</ul>
	</nav>
</header>
