<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { pkTy2026Manifest } from '$lib/rules/pkTy2026';
</script>

<PageHeader
	title="Pakistan Tax Rules"
	description="Raqm uses controlled local rule packs. Unknown remote data is not auto-trusted."
/>
<section class="card p-5">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<p class="eyebrow">Versioned local pack</p>
			<h2 class="text-xl font-bold">Pakistan tax rules</h2>
		</div>
		<span class="status-pill status-warning">Verification required</span>
	</div>
	<dl class="mt-4 grid gap-2 md:grid-cols-2">
		<div class="summary-row">
			<dt class="font-bold">Tax Year</dt>
			<dd>{pkTy2026Manifest.taxYear}</dd>
		</div>
		<div class="summary-row">
			<dt class="font-bold">Rule Pack Version</dt>
			<dd>{pkTy2026Manifest.version}</dd>
		</div>
		<div class="summary-row">
			<dt class="font-bold">Source labels</dt>
			<dd>{pkTy2026Manifest.sources.map((source) => source.label).join(', ')}</dd>
		</div>
		<div class="summary-row">
			<dt class="font-bold">Last verified</dt>
			<dd>{pkTy2026Manifest.lastVerified}</dd>
		</div>
		<div class="summary-row">
			<dt class="font-bold">Status</dt>
			<dd class="font-bold text-raqm-warning">Verification Required</dd>
		</div>
		<div class="summary-row">
			<dt class="font-bold">Checksum placeholder</dt>
			<dd>{pkTy2026Manifest.checksum}</dd>
		</div>
		<div class="summary-row">
			<dt class="font-bold">Update availability</dt>
			<dd>Manual controlled update pipeline placeholder</dd>
		</div>
	</dl>
</section>
<section class="card mt-3 p-5">
	<h2 class="text-lg font-bold">Controlled update pipeline</h2>
	<p class="mt-2 text-sm leading-6 text-raqm-muted">
		Official FBR/source update -> developer updates rule pack -> tests run -> rule pack is signed/checksummed ->
		frontend receives manifest -> browser verifies checksum/signature -> user sees updated status.
	</p>
</section>
