<script>
	let { handler, identifier, children, class: className = '', ...props } = $props();
</script>

<th class={className} {...props}>
	{@render children()}
</th>
