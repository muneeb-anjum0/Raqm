<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, vaultStatus } from '$lib/app-data';
	import { calculateAnnualSalary, formatPkr } from '$lib/tax-engine';
	import { ArrowRight, Calculator, CheckCircle2, FileCheck, ShieldCheck } from '@lucide/svelte';

	const steps = [
		['Setup', '/app/setup', 'Confirm year and filer type.'],
		['Income', '/app/income', 'Enter salary from payroll records.'],
		['Withholding', '/app/withholding', 'Record employer tax already deducted.'],
		['Review', '/app/review', 'Check gaps before calculation.'],
		['Calculate', '/app/calculate', 'Run the rules engine.'],
		['Reports', '/app/reports', 'Export local files.']
	];
</script>

<svelte:head><title>Workflow Home | Raqm</title></svelte:head>

<PageHeader
	title="Workflow home"
	description="A compact guide for the next step, vault state, tax year, and latest local calculation."
/>

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<div class="dashboard-grid">
		<div class="metric-card">
			<p>Vault</p>
			<strong>Unlocked</strong>
		</div>
		<div class="metric-card" style="animation-delay: 50ms">
			<p>Tax year</p>
			<strong>{$raqmData.profile.taxYear}</strong>
		</div>
		<div class="metric-card" style="animation-delay: 100ms">
			<p>Annual salary</p>
			<strong>PKR {formatPkr(calculateAnnualSalary($raqmData))}</strong>
		</div>
		<div class="metric-card" style="animation-delay: 150ms">
			<p>Latest estimate</p>
			<strong>
				{$raqmData.calculationResults ? `PKR ${formatPkr($raqmData.calculationResults.estimatedPayable)}` : 'Pending'}
			</strong>
		</div>
	</div>

	<section class="mt-4 grid gap-3 lg:grid-cols-[1fr_0.72fr]">
		<div class="card p-5">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="eyebrow">Next recommended step</p>
					<h2 class="text-2xl font-bold">Review your preparation, then calculate.</h2>
					<p class="mt-2 max-w-xl text-sm leading-6 text-raqm-muted">
						Raqm is a workflow, not a noisy dashboard. Follow the steps, keep the data local, and export only when
						ready.
					</p>
				</div>
				<span class="service-icon"><Calculator size={18} /></span>
			</div>
			<a class="btn btn-primary mt-5" href="/app/review">Continue workflow <ArrowRight size={17} /></a>
		</div>

		<div class="card p-5">
			<p class="eyebrow">Trust state</p>
			<div class="grid gap-2">
				<div class="summary-row">
					<span class="flow-index"><ShieldCheck size={15} /></span>
					<div>
						<strong>Data is local</strong>
						<p class="m-0 text-sm text-raqm-muted">Encrypted in this browser vault.</p>
					</div>
				</div>
				<div class="summary-row">
					<span class="flow-index"><FileCheck size={15} /></span>
					<div>
						<strong>Rule pack</strong>
						<p class="m-0 text-sm text-raqm-muted">Verification required.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="mt-3 card p-5">
		<p class="eyebrow">Workflow progress</p>
		<div class="grid gap-2 md:grid-cols-2">
			{#each steps as [label, href, body], index}
				<a class="summary-row no-underline" {href}>
					<span class="flow-index">{index + 1}</span>
					<div>
						<strong>{label}</strong>
						<p class="m-0 text-sm leading-6 text-raqm-muted">{body}</p>
					</div>
					<CheckCircle2 class="ml-auto text-raqm-muted" size={16} />
				</a>
			{/each}
		</div>
	</section>
{/if}
