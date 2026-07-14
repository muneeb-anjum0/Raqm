<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, vaultStatus } from '$lib/app-data';
	import { calculateAnnualSalary, formatPkr } from '$lib/tax-engine';
	import { ArrowRight, Calculator, FileCheck, ShieldCheck } from '@lucide/svelte';

	const quickLinks = [
		['Setup', '/app/setup'],
		['Income', '/app/income'],
		['Withholding', '/app/withholding'],
		['Calculate', '/app/calculate'],
		['Iris Summary', '/app/iris-summary'],
		['Reports', '/app/reports']
	];
</script>

<svelte:head><title>Dashboard | Raqm</title></svelte:head>

<PageHeader
	title="Preparation Dashboard"
	description="A calmer command center for your local Pakistan salaried filer workflow."
/>

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<div class="dashboard-grid">
		<div class="metric-card">
			<p>Tax year</p>
			<strong>{$raqmData.profile.taxYear}</strong>
		</div>
		<div class="metric-card" style="animation-delay: 80ms">
			<p>Annual salary</p>
			<strong>PKR {formatPkr(calculateAnnualSalary($raqmData))}</strong>
		</div>
		<div class="metric-card" style="animation-delay: 160ms">
			<p>Withholding paid</p>
			<strong>PKR {formatPkr($raqmData.withholding.employerTaxDeducted)}</strong>
		</div>
		<div class="metric-card" style="animation-delay: 240ms">
			<p>Estimate</p>
			<strong>
				{$raqmData.calculationResults ? `PKR ${formatPkr($raqmData.calculationResults.estimatedPayable)}` : 'Pending'}
			</strong>
		</div>
	</div>

	<section class="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
		<div class="card p-6">
			<div class="flex items-center gap-3">
				<div class="service-icon"><ShieldCheck size={22} /></div>
				<div>
					<p class="eyebrow">Local-first workspace</p>
					<h2 class="text-2xl font-black">Your data stays in this browser vault.</h2>
				</div>
			</div>
			<p class="mt-4 leading-7 text-raqm-muted">
				Move through the flow, save encrypted records locally, and generate a summary for manual Iris preparation.
			</p>
			<div class="mt-5 grid gap-3 sm:grid-cols-2">
				{#each quickLinks as [label, href]}
					<a class="flow-step no-underline" {href}>
						<span class="flow-index"><ArrowRight size={16} /></span>
						<strong>{label}</strong>
					</a>
				{/each}
			</div>
		</div>
		<div class="card p-6">
			<div class="flex items-center gap-3">
				<div class="service-icon"><Calculator size={22} /></div>
				<div>
					<p class="eyebrow">Next best action</p>
					<h2 class="text-2xl font-black">Run a clean calculation.</h2>
				</div>
			</div>
			<p class="mt-4 leading-7 text-raqm-muted">
				The rules engine calculates. The explainer only explains. No AI decides tax and no financial data leaves the
				device.
			</p>
			<a class="btn btn-primary mt-5" href="/app/calculate">Calculate now <FileCheck size={18} /></a>
		</div>
	</section>
{/if}
