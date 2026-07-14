<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader
	title="Privacy"
	description="Raqm is local-first: no account system, no analytics, no cloud database for financial records."
/>
<div class="grid gap-4 md:grid-cols-2">
	{#each ['Data stays on this device', 'Financial data is stored in an encrypted IndexedDB vault', 'No password or raw encryption key is stored', 'No financial data is sent to a backend', 'Exports are generated locally', 'Lost passwords cannot be recovered'] as item}
		<div class="card p-5 font-black">{item}</div>
	{/each}
</div>
