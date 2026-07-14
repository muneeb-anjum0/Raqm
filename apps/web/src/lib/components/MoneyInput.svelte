<script lang="ts">
	let {
		label,
		value = $bindable(0),
		hint = ''
	} = $props<{
		label: string;
		value: number;
		hint?: string;
	}>();
</script>

<label class="field">
	<span class="label">{label}</span>
	<input class="input" type="number" min="0" step="1" bind:value />
	{#if hint}<span class="text-xs font-semibold text-raqm-muted">{hint}</span>{/if}
</label>
