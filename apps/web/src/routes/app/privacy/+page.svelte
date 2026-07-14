<script>
	import PageHeader from '$lib/components/PageHeader.svelte';

	const items = [
		'Data stays on this device',
		'Financial data is stored in an encrypted IndexedDB vault',
		'No password or raw encryption key is stored',
		'No financial data is sent to a backend',
		'Exports are generated locally',
		'Lost passwords cannot be recovered'
	];
</script>

<PageHeader
	title="Privacy"
	description="Raqm is local-first: no account system, no analytics, no cloud database for financial records."
/>

<div class="grid gap-3 md:grid-cols-2">
	{#each items as item}
		<div class="summary-row">
			<span class="flow-index">✓</span>
			<strong>{item}</strong>
		</div>
	{/each}
</div>

<section class="card mt-3 p-5">
	<p class="eyebrow">Threat model</p>
	<div class="grid gap-3 md:grid-cols-2">
		<div>
			<h2 class="text-lg font-bold">What Raqm does</h2>
			<p class="mt-2 text-sm leading-6 text-raqm-muted">
				Encrypts local records, exports files in your browser, and avoids accounts, cloud sync, analytics, and financial
				data collection.
			</p>
		</div>
		<div>
			<h2 class="text-lg font-bold">What you still control</h2>
			<p class="mt-2 text-sm leading-6 text-raqm-muted">
				Browser access, shared-computer risk, installed extensions, exported files, and remembering the vault password.
			</p>
		</div>
	</div>
</section>
