<script>
	let { label, value = $bindable(0), hint = '' } = $props();
</script>

<label class="field">
	<span class="label">{label}</span>
	<input class="input" type="number" min="0" step="1" bind:value />
	{#if hint}<span class="text-xs font-medium leading-relaxed text-raqm-muted">{hint}</span>{/if}
</label>
