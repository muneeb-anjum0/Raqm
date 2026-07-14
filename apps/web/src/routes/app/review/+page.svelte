<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, updateData, vaultStatus } from '$lib/app-data';
	import { calculateAnnualSalary, createChecklist, formatPkr } from '$lib/tax-engine';
</script>

<PageHeader title="Review" description="Check required data before calculation. Empty states are shown clearly." />

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<div class="grid gap-3 lg:grid-cols-[1fr_0.78fr]">
		<section class="card p-5">
			<p class="eyebrow">Pre-flight</p>
			<h2 class="text-xl font-bold">Entered data</h2>
			<dl class="mt-4 grid gap-2 text-sm md:grid-cols-2">
				<div class="summary-row">
					<dt class="font-bold">Annual salary</dt>
					<dd>PKR {formatPkr(calculateAnnualSalary($raqmData))}</dd>
				</div>
				<div class="summary-row">
					<dt class="font-bold">Employer withholding</dt>
					<dd>PKR {formatPkr($raqmData.withholding.employerTaxDeducted)}</dd>
				</div>
				<div class="summary-row">
					<dt class="font-bold">Bank profit</dt>
					<dd>PKR {formatPkr($raqmData.bankProfit.profitAmount)}</dd>
				</div>
				<div class="summary-row">
					<dt class="font-bold">Bank tax</dt>
					<dd>PKR {formatPkr($raqmData.bankProfit.taxDeducted)}</dd>
				</div>
			</dl>
			<label class="mt-5 flex items-center gap-3 text-sm font-bold">
				<input type="checkbox" bind:checked={$raqmData.profile.reviewed} onchange={() => updateData(() => $raqmData)} />
				I have reviewed these values before calculation.
			</label>
			<a class="btn btn-primary mt-5" href="/app/calculate">Continue to calculation</a>
		</section>
		<section class="card p-5">
			<p class="eyebrow">Checklist</p>
			<h2 class="text-xl font-bold">Preparation checklist preview</h2>
			<div class="mt-4 grid gap-2">
				{#each createChecklist($raqmData) as item}
					<div class="checklist-item">
						<div>
							<p class="m-0 font-bold">{item.title}</p>
							<p class="m-0 text-sm capitalize text-raqm-muted">{item.status}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
{/if}
