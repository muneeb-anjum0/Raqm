<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, vaultStatus } from '$lib/app-data';
	import { createIrisMapping, formatPkr } from '$lib/tax-engine';
</script>

<PageHeader
	title="Iris-ready Summary"
	description="Use this summary while preparing your return on FBR Iris. Raqm does not submit your return to FBR."
/>

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else if !$raqmData.calculationResults}
	<div class="card p-5">
		<p class="font-bold text-raqm-muted">Run calculation first.</p>
		<a class="btn btn-primary mt-4" href="/app/calculate">Calculate</a>
	</div>
{:else}
	<section class="card overflow-hidden">
		<div class="border-b border-raqm-border p-5">
			<p class="eyebrow">Filing handoff</p>
			<h2 class="text-xl font-bold">Manual Iris preparation fields</h2>
			<p class="mt-1 text-sm leading-6 text-raqm-muted">
				Generated {new Date($raqmData.calculationResults.generatedAt).toLocaleString()} using rule pack {$raqmData
					.calculationResults.rulePackVersion}.
			</p>
		</div>
		<div class="grid divide-y divide-raqm-border">
			{#each createIrisMapping($raqmData, $raqmData.calculationResults) as row}
				<div class="grid gap-2 p-4 md:grid-cols-[220px_180px_1fr]">
					<p class="font-bold">{row.label}</p>
					<p>{typeof row.value === 'number' ? `PKR ${formatPkr(row.value)}` : row.value}</p>
					<p class="text-sm text-raqm-muted">{row.notes}</p>
				</div>
			{/each}
		</div>
		<p class="p-5 text-sm font-bold text-raqm-muted">
			Raqm prepares a local summary to help you review your information. It does not submit your return to FBR.
		</p>
	</section>
{/if}
