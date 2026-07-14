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
	<section class="card p-6">
		<button class="btn btn-primary" type="button" onclick={calculate}>Run rules-based calculation</button>
		{#if error}<p class="mt-3 rounded-lg bg-red-50 p-3 font-bold text-raqm-danger">{error}</p>{/if}
		{#if $raqmData.calculationResults}
			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<div class="metric-card">
					<p>Gross tax</p>
					<strong>PKR {formatPkr($raqmData.calculationResults.grossTax)}</strong>
				</div>
				<div class="metric-card">
					<p>Adjustable paid</p>
					<strong>PKR {formatPkr($raqmData.calculationResults.totalAdjustableTaxPaid)}</strong>
				</div>
				<div class="metric-card">
					<p>Payable / refund</p>
					<strong>
						PKR {formatPkr(
							$raqmData.calculationResults.estimatedPayable || $raqmData.calculationResults.estimatedRefund
						)}
					</strong>
				</div>
			</div>
			<div class="mt-6 grid gap-3">
				<h2 class="text-xl font-black">Deterministic explanation</h2>
				{#each createExplanation($raqmData.calculationResults) as line}
					<p class="rounded-2xl border border-raqm-border bg-white p-4 text-raqm-muted">{line}</p>
				{/each}
			</div>
			<div class="mt-6">
				<h2 class="text-xl font-black">Audit trail</h2>
				<div class="mt-3 grid gap-2">
					{#each $raqmData.calculationResults.auditTrail as item}
						<div class="rounded-2xl bg-raqm-background p-4">
							<p class="font-black">{item.ruleId}</p>
							<p class="text-sm text-raqm-muted">{item.message}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
