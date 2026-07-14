<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, runCalculation, vaultStatus } from '$lib/app-data';
	import { createExplanation, formatPkr } from '$lib/tax-engine';

	let error = '';

	async function calculate() {
		error = '';
		try {
			await runCalculation();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Calculation failed.';
		}
	}
</script>

<PageHeader
	title="Calculate"
	description="The JavaScript rules engine calculates tax. Explanation text only explains the result."
/>

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<section class="card p-5">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<p class="eyebrow">Rules engine</p>
				<h2 class="text-xl font-bold">Run a precise local estimate.</h2>
			</div>
			<button class="btn btn-primary" type="button" onclick={calculate}>Run rules-based calculation</button>
		</div>
		{#if error}<p class="mt-3 rounded-lg bg-red-50 p-3 font-bold text-raqm-danger">{error}</p>{/if}
		{#if $raqmData.calculationResults}
			<div class="mt-5 grid gap-3 md:grid-cols-3">
				<div class="metric-card result-card">
					<p>Gross tax</p>
					<strong>PKR {formatPkr($raqmData.calculationResults.grossTax)}</strong>
				</div>
				<div class="metric-card result-card" style="animation-delay: 70ms">
					<p>Adjustable paid</p>
					<strong>PKR {formatPkr($raqmData.calculationResults.totalAdjustableTaxPaid)}</strong>
				</div>
				<div class="metric-card result-card" style="animation-delay: 140ms">
					<p>Payable / refund</p>
					<strong>
						PKR {formatPkr(
							$raqmData.calculationResults.estimatedPayable || $raqmData.calculationResults.estimatedRefund
						)}
					</strong>
				</div>
			</div>
			<div class="mt-5 grid gap-2">
				<h2 class="text-lg font-bold">Deterministic explanation</h2>
				{#each createExplanation($raqmData.calculationResults) as line}
					<p class="rounded-xl border border-raqm-border bg-white p-3 text-sm leading-6 text-raqm-muted">{line}</p>
				{/each}
			</div>
			<details class="mt-5 rounded-xl border border-raqm-border bg-raqm-background p-4">
				<summary>Audit trail</summary>
				<div class="mt-3 grid gap-2">
					{#each $raqmData.calculationResults.auditTrail as item}
						<div class="rounded-xl bg-white p-3">
							<p class="font-bold">{item.ruleId}</p>
							<p class="text-sm text-raqm-muted">{item.message}</p>
						</div>
					{/each}
				</div>
			</details>
		{/if}
	</section>
{/if}
