<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { pkTy2026Manifest } from '$lib/rules/pkTy2026';
</script>

<PageHeader
	title="Pakistan Tax Rules"
	description="Raqm uses controlled local rule packs. Unknown remote data is not auto-trusted."
/>
<section class="card p-6">
	<dl class="grid gap-4 md:grid-cols-2">
		<div>
			<dt class="font-black">Tax Year</dt>
			<dd>{pkTy2026Manifest.taxYear}</dd>
		</div>
		<div>
			<dt class="font-black">Rule Pack Version</dt>
			<dd>{pkTy2026Manifest.version}</dd>
		</div>
		<div>
			<dt class="font-black">Source labels</dt>
			<dd>{pkTy2026Manifest.sources.map((source) => source.label).join(', ')}</dd>
		</div>
		<div>
			<dt class="font-black">Last verified</dt>
			<dd>{pkTy2026Manifest.lastVerified}</dd>
		</div>
		<div>
			<dt class="font-black">Status</dt>
			<dd class="font-black text-raqm-warning">Verification Required</dd>
		</div>
		<div>
			<dt class="font-black">Checksum placeholder</dt>
			<dd>{pkTy2026Manifest.checksum}</dd>
		</div>
		<div>
			<dt class="font-black">Update availability</dt>
			<dd>Manual controlled update pipeline placeholder</dd>
		</div>
	</dl>
</section>
<section class="card mt-4 p-6">
	<h2 class="text-xl font-black">Controlled update pipeline</h2>
	<p class="mt-2 text-raqm-muted">
		Official FBR/source update -> developer updates rule pack -> tests run -> rule pack is signed/checksummed ->
		frontend receives manifest -> browser verifies checksum/signature -> user sees updated status.
	</p>
</section>
