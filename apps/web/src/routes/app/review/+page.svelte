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
	<div class="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
		<section class="card p-6">
			<h2 class="text-xl font-black">Entered data</h2>
			<dl class="mt-4 grid gap-3 text-sm md:grid-cols-2">
				<div>
					<dt class="font-black">Annual salary</dt>
					<dd>PKR {formatPkr(calculateAnnualSalary($raqmData))}</dd>
				</div>
				<div>
					<dt class="font-black">Employer withholding</dt>
					<dd>PKR {formatPkr($raqmData.withholding.employerTaxDeducted)}</dd>
				</div>
				<div>
					<dt class="font-black">Bank profit</dt>
					<dd>PKR {formatPkr($raqmData.bankProfit.profitAmount)}</dd>
				</div>
				<div>
					<dt class="font-black">Bank tax</dt>
					<dd>PKR {formatPkr($raqmData.bankProfit.taxDeducted)}</dd>
				</div>
			</dl>
			<label class="mt-5 flex items-center gap-3 font-bold">
				<input type="checkbox" bind:checked={$raqmData.profile.reviewed} onchange={() => updateData(() => $raqmData)} />
				I have reviewed these values before calculation.
			</label>
			<a class="btn btn-primary mt-5" href="/app/calculate">Continue to calculation</a>
		</section>
		<section class="card p-6">
			<h2 class="text-xl font-black">Preparation checklist preview</h2>
			<div class="mt-4 grid gap-2">
				{#each createChecklist($raqmData) as item}
					<div class="rounded-2xl border border-raqm-border p-3">
						<p class="font-black">{item.title}</p>
						<p class="text-sm capitalize text-raqm-muted">{item.status}</p>
					</div>
				{/each}
			</div>
		</section>
	</div>
{/if}
