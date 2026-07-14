<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, vaultStatus } from '$lib/app-data';
	import { formatPkr } from '$lib/tax-engine';
</script>

<svelte:head><title>Dashboard | Raqm</title></svelte:head>

<PageHeader
	title="Preparation dashboard"
	description="A single private workspace for your Pakistan salaried filer preparation flow."
/>

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		<div class="card p-5">
			<p class="text-sm font-bold text-raqm-muted">Tax year</p>
			<p class="mt-2 text-2xl font-black">{$raqmData.profile.taxYear}</p>
		</div>
		<div class="card p-5">
			<p class="text-sm font-bold text-raqm-muted">Annual salary</p>
			<p class="mt-2 text-2xl font-black">
				PKR {formatPkr($raqmData.income.annualSalary || 0 || ($raqmData.income.monthlySalary || 0) * 12)}
			</p>
		</div>
		<div class="card p-5">
			<p class="text-sm font-bold text-raqm-muted">Withholding paid</p>
			<p class="mt-2 text-2xl font-black">PKR {formatPkr($raqmData.withholding.employerTaxDeducted)}</p>
		</div>
		<div class="card p-5">
			<p class="text-sm font-bold text-raqm-muted">Estimate</p>
			<p class="mt-2 text-2xl font-black">
				{$raqmData.calculationResults
					? `PKR ${formatPkr($raqmData.calculationResults.estimatedPayable)} payable`
					: 'Not run'}
			</p>
		</div>
	</div>
	<div class="card mt-4 p-6">
		<h2 class="text-xl font-black">Guided flow</h2>
		<div class="mt-4 grid gap-3 md:grid-cols-3">
			{#each [['Setup', '/app/setup'], ['Income', '/app/income'], ['Calculate', '/app/calculate'], ['Iris Summary', '/app/iris-summary'], ['Checklist', '/app/checklist'], ['Reports', '/app/reports']] as [label, href]}
				<a class="rounded-lg border border-raqm-border bg-raqm-background p-4 font-black text-raqm-secondary" {href}
					>{label}</a
				>
			{/each}
		</div>
	</div>
{/if}
