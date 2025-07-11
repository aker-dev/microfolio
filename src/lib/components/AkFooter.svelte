<script>
	import { siteConfig } from '../config.js';
</script>

<footer>
	<div
		class="mr-auto ml-auto flex h-12 max-w-6xl items-center justify-between border-t border-solid border-black pr-4 pl-4"
	>
		<p>
			© {siteConfig.author}
			{new Date().getFullYear()} — generated with µFolio
		</p>
		<nav>
			<ul class="flex justify-end gap-4">
				<li>
					<a href={siteConfig.socialLinks.instagram} target="_blank" class="">IG</a>
				</li>
				<li>
					<a href={siteConfig.socialLinks.linkedin} target="_blank" class="">LI</a>
				</li>
				<li>
					<a href={siteConfig.socialLinks.github} target="_blank" class="">GH</a>
				</li>
			</ul>
		</nav>
	</div>
</footer>
