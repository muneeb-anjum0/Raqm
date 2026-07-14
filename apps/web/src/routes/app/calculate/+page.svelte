<script lang="ts">
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
	description="The TypeScript rules engine calculates tax. Explanation text only explains the result."
/>
{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<section class="card p-6">
		<button class="btn btn-primary" type="button" onclick={calculate}>Run rules-based calculation</button>
		{#if error}<p class="mt-3 rounded-lg bg-red-50 p-3 font-bold text-raqm-danger">{error}</p>{/if}
		{#if $raqmData.calculationResults}
			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<div class="rounded-lg bg-raqm-background p-4">
					<p class="text-sm font-bold text-raqm-muted">Gross tax</p>
					<p class="text-2xl font-black">PKR {formatPkr($raqmData.calculationResults.grossTax)}</p>
				</div>
				<div class="rounded-lg bg-raqm-background p-4">
					<p class="text-sm font-bold text-raqm-muted">Adjustable paid</p>
					<p class="text-2xl font-black">PKR {formatPkr($raqmData.calculationResults.totalAdjustableTaxPaid)}</p>
				</div>
				<div class="rounded-lg bg-raqm-background p-4">
					<p class="text-sm font-bold text-raqm-muted">Payable / refund</p>
					<p class="text-2xl font-black">
						PKR {formatPkr(
							$raqmData.calculationResults.estimatedPayable || $raqmData.calculationResults.estimatedRefund
						)}
					</p>
				</div>
			</div>
			<div class="mt-6 grid gap-3">
				<h2 class="text-xl font-black">Deterministic explanation</h2>
				{#each createExplanation($raqmData.calculationResults) as line}
					<p class="rounded-lg border border-raqm-border bg-white p-3 text-raqm-muted">{line}</p>
				{/each}
			</div>
			<div class="mt-6">
				<h2 class="text-xl font-black">Audit trail</h2>
				<div class="mt-3 grid gap-2">
					{#each $raqmData.calculationResults.auditTrail as item}
						<div class="rounded-lg bg-raqm-background p-3">
							<p class="font-black">{item.ruleId}</p>
							<p class="text-sm text-raqm-muted">{item.message}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
