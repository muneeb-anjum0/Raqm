<script>
	let { items = [], label = 'Application dock' } = $props();

	function run(item) {
		item.onClick?.();
	}

	function keyRun(event, item) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		run(item);
	}
</script>

<div class="dock-outer" aria-label={label}>
	<div class="dock-panel" role="toolbar" aria-label={label}>
		{#each items as item}
			{@const Icon = item.icon}
			{#if item.href}
				<a class="dock-item {item.className ?? ''}" href={item.href} aria-label={item.label}>
					<Icon size={18} />
					<span class="dock-label">{item.label}</span>
				</a>
			{:else}
				<button
					class="dock-item {item.className ?? ''}"
					type="button"
					aria-label={item.label}
					onclick={() => run(item)}
					onkeydown={(event) => keyRun(event, item)}
				>
					<Icon size={18} />
					<span class="dock-label">{item.label}</span>
				</button>
			{/if}
		{/each}
	</div>
</div>
