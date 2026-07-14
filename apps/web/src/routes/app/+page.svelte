<script>
	import { goto } from '$app/navigation';
	import MoneyInput from '$lib/components/MoneyInput.svelte';
	import {
		createVault,
		exportEncryptedBackup,
		hasVault,
		importEncryptedBackup,
		panicWipe,
		unlockVault
	} from '$lib/crypto-vault';
	import { downloadBlob, exportCsv, exportPdf, exportXlsx, safeReportFilename } from '$lib/exports';
	import { loadVaultData, raqmData, refreshVaultStatus, runCalculation, updateData, vaultStatus } from '$lib/app-data';
	import {
		calculateAnnualSalary,
		createChecklist,
		createExplanation,
		createIrisMapping,
		formatPkr
	} from '$lib/tax-engine';
	import { onMount, tick } from 'svelte';
	import { ArrowDown, Check, FileText, Lock, ShieldCheck } from '@lucide/svelte';

	let password = '';
	let confirm = '';
	let wipeConfirm = '';
	let vaultExists = false;
	let hydrated = false;
	let error = '';
	let exportError = '';

	const steps = [
		['setup', 'Setup'],
		['income', 'Income'],
		['withholding', 'Withholding'],
		['bank-profit', 'Bank Profit'],
		['assets', 'Assets'],
		['liabilities', 'Liabilities'],
		['review', 'Review'],
		['calculate', 'Calculate'],
		['iris-summary', 'Iris Summary'],
		['checklist', 'Checklist'],
		['reports', 'Reports']
	];

	onMount(async () => {
		hydrated = true;
		vaultExists = await hasVault();
		await refreshVaultStatus();
		if ($vaultStatus.isUnlocked) await loadVaultData();
	});

	async function createOrUnlock() {
		error = '';
		try {
			if (!vaultExists) {
				if (password !== confirm) throw new Error('Password confirmation does not match.');
				await createVault(password);
			} else {
				await unlockVault(password);
			}
			await loadVaultData();
			await refreshVaultStatus();
			vaultExists = true;
			password = '';
			confirm = '';
			await scrollToStep('setup');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Vault action failed.';
		}
	}

	async function backup() {
		const blob = new Blob([JSON.stringify(await exportEncryptedBackup(), null, 2)], {
			type: 'application/json'
		});
		downloadBlob(blob, 'raqm-encrypted-backup.json');
	}

	async function importBackup(event) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;
		await importEncryptedBackup(JSON.parse(await file.text()));
		vaultExists = await hasVault();
		await refreshVaultStatus();
	}

	async function wipe() {
		if (wipeConfirm !== 'WIPE RAQM') return;
		await panicWipe();
		password = '';
		confirm = '';
		wipeConfirm = '';
		vaultExists = false;
		await refreshVaultStatus();
		goto('/app');
	}

	async function done(nextId) {
		await updateData(() => $raqmData);
		await scrollToStep(nextId);
	}

	async function calculate() {
		error = '';
		try {
			await runCalculation();
			await scrollToStep('iris-summary');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Calculation failed.';
		}
	}

	async function runExport(type) {
		exportError = '';
		try {
			const taxYear = $raqmData.calculationResults?.taxYear ?? '2026';
			const blob =
				type === 'pdf'
					? await exportPdf($raqmData)
					: type === 'xlsx'
						? await exportXlsx($raqmData)
						: exportCsv($raqmData);
			downloadBlob(blob, safeReportFilename(taxYear, type));
		} catch (err) {
			exportError = err instanceof Error ? err.message : 'Export failed.';
		}
	}

	async function scrollToStep(id) {
		await tick();
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:head><title>Private Preparation | Raqm</title></svelte:head>

<section class="single-flow-hero">
	<div>
		<p class="eyebrow">Private preparation</p>
		<h1>One guided filing flow.</h1>
		<p>
			Start by unlocking the encrypted vault. Then complete each section and Raqm will move you down the page toward the
			next step.
		</p>
	</div>
	<div class="mini-stats">
		<span class="status-pill {$vaultStatus.isUnlocked ? 'status-success' : ''}">
			<Lock size={13} />
			{$vaultStatus.isUnlocked ? 'Vault unlocked' : 'Vault locked'}
		</span>
		<span class="status-pill">TY {$raqmData.profile.taxYear}</span>
		<span class="status-pill">Local only</span>
	</div>
</section>

<nav class="section-jump-nav" aria-label="Preparation sections">
	<a href="#vault">Vault</a>
	{#each steps as [id, label]}
		<a class:disabled={!$vaultStatus.isUnlocked} href={`#${id}`}>{label}</a>
	{/each}
</nav>

<section id="vault" class="flow-section">
	<div class="flow-section-heading">
		<span>01</span>
		<div>
			<p class="eyebrow">Secure workspace</p>
			<h2>Encrypted local vault</h2>
			<p>Create or unlock the browser vault. Raqm never stores your password or raw encryption key.</p>
		</div>
	</div>

	<div class="grid gap-3 lg:grid-cols-[1fr_0.78fr]">
		<form class="card compact-vault-card grid gap-3 p-4">
			<div class="flex items-start justify-between gap-3">
				<div>
					<h3 class="text-lg font-bold">{vaultExists ? 'Unlock vault' : 'Create vault password'}</h3>
					<p class="mt-1 text-sm leading-6 text-raqm-muted">
						Use at least 8 characters. Lost passwords cannot be recovered.
					</p>
				</div>
				<span class="status-pill">{$vaultStatus.isUnlocked ? 'Unlocked' : 'Locked'}</span>
			</div>
			<label class="field">
				<span class="label">Vault password</span>
				<input class="input compact-input" type="password" bind:value={password} autocomplete="current-password" />
			</label>
			{#if !vaultExists}
				<label class="field">
					<span class="label">Confirm password</span>
					<input class="input compact-input" type="password" bind:value={confirm} autocomplete="new-password" />
				</label>
			{/if}
			{#if error}<p class="rounded-lg bg-red-50 p-3 text-sm font-bold text-raqm-danger">{error}</p>{/if}
			<button class="btn btn-primary compact-action" type="button" disabled={!hydrated} onclick={createOrUnlock}
				>{vaultExists ? 'Unlock vault' : 'Create encrypted vault'}</button
			>
		</form>

		<section class="card grid gap-3 p-4">
			<div>
				<p class="eyebrow">Controls</p>
				<h3 class="text-lg font-bold">Vault controls</h3>
				<p class="mt-1 text-sm leading-6 text-raqm-muted">
					Backup files remain encrypted. Import replaces local vault metadata.
				</p>
			</div>
			<div class="grid gap-2 sm:grid-cols-2">
				<button class="btn btn-secondary" type="button" disabled={!$vaultStatus.hasVault} onclick={backup}
					>Export encrypted backup</button
				>
				<label class="btn btn-secondary cursor-pointer">
					Import encrypted backup
					<input class="sr-only" type="file" accept="application/json" onchange={importBackup} />
				</label>
			</div>
			<div class="rounded-xl border border-raqm-border bg-white p-3">
				<h3 class="font-bold text-raqm-danger">Panic wipe</h3>
				<p class="mt-1 text-sm leading-6 text-raqm-muted">Type WIPE RAQM to delete encrypted local records.</p>
				<input class="input compact-input mt-2" aria-label="Panic wipe confirmation" bind:value={wipeConfirm} />
				<button class="btn btn-danger mt-2 w-full" type="button" disabled={wipeConfirm !== 'WIPE RAQM'} onclick={wipe}
					>Panic wipe local data</button
				>
			</div>
		</section>
	</div>
</section>

{#if $vaultStatus.isUnlocked}
	<section id="setup" class="flow-section">
		<div class="flow-section-heading">
			<span>02</span>
			<div>
				<h2>Setup</h2>
				<p>Set tax year, filer type, and salary mode.</p>
			</div>
		</div>
		<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
			<label class="field"
				><span class="label">Name (optional)</span><input class="input" bind:value={$raqmData.profile.name} /></label
			>
			<label class="field"
				><span class="label">Tax year</span><select class="input" bind:value={$raqmData.profile.taxYear}
					><option value="2026">2026</option></select
				></label
			>
			<label class="field"
				><span class="label">Filer type</span><select class="input" bind:value={$raqmData.profile.filerType}
					><option value="salaried">Salaried active</option><option disabled>Freelancer - Coming later</option><option
						disabled>Business - Coming later</option
					><option disabled>Landlord - Coming later</option><option disabled>Investor - Coming later</option></select
				></label
			>
			<label class="field"
				><span class="label">Employment type</span><select class="input" bind:value={$raqmData.profile.employmentType}
					><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option
						value="contract">Contract</option
					></select
				></label
			>
			<label class="field"
				><span class="label">Salary mode</span><select class="input" bind:value={$raqmData.profile.salaryMode}
					><option value="monthly">Monthly salary</option><option value="annual">Annual salary</option></select
				></label
			>
			<button class="btn btn-primary compact-action" type="button" onclick={() => done('income')}
				>Done <ArrowDown size={15} /></button
			>
		</form>
	</section>

	<section id="income" class="flow-section">
		<div class="flow-section-heading">
			<span>03</span>
			<div>
				<h2>Income</h2>
				<p>Enter salary income from payroll records.</p>
			</div>
		</div>
		<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
			<MoneyInput label="Monthly salary" bind:value={$raqmData.income.monthlySalary} />
			<MoneyInput label="Annual salary" bind:value={$raqmData.income.annualSalary} />
			<MoneyInput label="Bonus (optional)" bind:value={$raqmData.income.bonus} />
			<MoneyInput label="Other taxable salary components (optional)" bind:value={$raqmData.income.otherTaxableSalary} />
			<div class="metric-card flow-span">
				<p>Live annual salary preview</p>
				<strong>PKR {formatPkr(calculateAnnualSalary($raqmData))}</strong>
			</div>
			<button class="btn btn-primary compact-action" type="button" onclick={() => done('withholding')}
				>Done <ArrowDown size={15} /></button
			>
		</form>
	</section>

	<section id="withholding" class="flow-section">
		<div class="flow-section-heading">
			<span>04</span>
			<div>
				<h2>Employer withholding</h2>
				<p>This is tax already deducted before salary reaches you.</p>
			</div>
		</div>
		<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
			<MoneyInput label="Annual employer tax deducted" bind:value={$raqmData.withholding.employerTaxDeducted} />
			<label class="flex items-center gap-3 text-sm font-bold"
				><input type="checkbox" bind:checked={$raqmData.withholding.certificateAvailable} /> Certificate available</label
			>
			<button class="btn btn-primary compact-action" type="button" onclick={() => done('bank-profit')}
				>Done <ArrowDown size={15} /></button
			>
		</form>
	</section>

	<section id="bank-profit" class="flow-section">
		<div class="flow-section-heading">
			<span>05</span>
			<div>
				<h2>Bank profit</h2>
				<p>Track bank profit and tax deducted by the bank.</p>
			</div>
		</div>
		<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
			<label class="field"
				><span class="label">Bank name (optional)</span><input
					class="input"
					bind:value={$raqmData.bankProfit.bankName}
				/></label
			>
			<MoneyInput label="Profit amount" bind:value={$raqmData.bankProfit.profitAmount} />
			<MoneyInput label="Tax deducted by bank" bind:value={$raqmData.bankProfit.taxDeducted} />
			<label class="flex items-center gap-3 text-sm font-bold"
				><input type="checkbox" bind:checked={$raqmData.bankProfit.certificateAvailable} /> Certificate available</label
			>
			<button class="btn btn-primary compact-action" type="button" onclick={() => done('assets')}
				>Done <ArrowDown size={15} /></button
			>
		</form>
	</section>

	<section id="assets" class="flow-section">
		<div class="flow-section-heading">
			<span>06</span>
			<div>
				<h2>Assets</h2>
				<p>Build a clean asset statement snapshot.</p>
			</div>
		</div>
		<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
			<MoneyInput label="Cash" bind:value={$raqmData.assets.cash} />
			<MoneyInput label="Bank balance" bind:value={$raqmData.assets.bankBalance} />
			<MoneyInput label="Vehicle" bind:value={$raqmData.assets.vehicle} />
			<MoneyInput label="Property" bind:value={$raqmData.assets.property} />
			<MoneyInput label="Investments" bind:value={$raqmData.assets.investments} />
			<MoneyInput label="Other assets" bind:value={$raqmData.assets.other} />
			<label class="flex items-center gap-3 text-sm font-bold"
				><input type="checkbox" bind:checked={$raqmData.assets.statementAvailable} /> Asset statement reviewed</label
			>
			<button class="btn btn-primary compact-action" type="button" onclick={() => done('liabilities')}
				>Done <ArrowDown size={15} /></button
			>
		</form>
	</section>

	<section id="liabilities" class="flow-section">
		<div class="flow-section-heading">
			<span>07</span>
			<div>
				<h2>Liabilities</h2>
				<p>Record loans and payables for Iris.</p>
			</div>
		</div>
		<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
			<MoneyInput label="Loans" bind:value={$raqmData.liabilities.loans} />
			<MoneyInput label="Credit card payable" bind:value={$raqmData.liabilities.creditCardPayable} />
			<MoneyInput label="Personal payable" bind:value={$raqmData.liabilities.personalPayable} />
			<MoneyInput label="Other liabilities" bind:value={$raqmData.liabilities.other} />
			<button class="btn btn-primary compact-action" type="button" onclick={() => done('review')}
				>Done <ArrowDown size={15} /></button
			>
		</form>
	</section>

	<section id="review" class="flow-section">
		<div class="flow-section-heading">
			<span>08</span>
			<div>
				<h2>Review</h2>
				<p>Pre-flight check before calculation.</p>
			</div>
		</div>
		<div class="card p-4">
			<div class="dashboard-grid">
				<div class="metric-card">
					<p>Annual salary</p>
					<strong>PKR {formatPkr(calculateAnnualSalary($raqmData))}</strong>
				</div>
				<div class="metric-card">
					<p>Employer withholding</p>
					<strong>PKR {formatPkr($raqmData.withholding.employerTaxDeducted)}</strong>
				</div>
				<div class="metric-card">
					<p>Bank profit</p>
					<strong>PKR {formatPkr($raqmData.bankProfit.profitAmount)}</strong>
				</div>
			</div>
			<label class="mt-4 flex items-center gap-3 text-sm font-bold"
				><input
					type="checkbox"
					bind:checked={$raqmData.profile.reviewed}
					onchange={() => updateData(() => $raqmData)}
				/> I have reviewed these values before calculation.</label
			>
			<button class="btn btn-primary compact-action mt-4" type="button" onclick={() => done('calculate')}
				>Done <ArrowDown size={15} /></button
			>
		</div>
	</section>

	<section id="calculate" class="flow-section">
		<div class="flow-section-heading">
			<span>09</span>
			<div>
				<h2>Calculate</h2>
				<p>Run the local rules engine.</p>
			</div>
		</div>
		<div class="card p-4">
			<button class="btn btn-primary compact-action" type="button" onclick={calculate}
				>Run rules-based calculation</button
			>
			{#if $raqmData.calculationResults}
				<div class="mt-4 dashboard-grid">
					<div class="metric-card result-card">
						<p>Gross tax</p>
						<strong>PKR {formatPkr($raqmData.calculationResults.grossTax)}</strong>
					</div>
					<div class="metric-card result-card">
						<p>Adjustable paid</p>
						<strong>PKR {formatPkr($raqmData.calculationResults.totalAdjustableTaxPaid)}</strong>
					</div>
					<div class="metric-card result-card">
						<p>Payable / refund</p>
						<strong
							>PKR {formatPkr(
								$raqmData.calculationResults.estimatedPayable || $raqmData.calculationResults.estimatedRefund
							)}</strong
						>
					</div>
				</div>
				<div class="mt-4 grid gap-2">
					<h3 class="text-lg font-bold">Deterministic explanation</h3>
					{#each createExplanation($raqmData.calculationResults) as line}
						<p class="rounded-xl border border-raqm-border bg-white p-3 text-sm leading-6 text-raqm-muted">{line}</p>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<section id="iris-summary" class="flow-section">
		<div class="flow-section-heading">
			<span>10</span>
			<div>
				<h2>Iris summary</h2>
				<p>Use this while preparing your return on FBR Iris.</p>
			</div>
		</div>
		<div class="card overflow-hidden">
			{#if !$raqmData.calculationResults}
				<div class="p-4"><p class="font-bold text-raqm-muted">Run calculation first.</p></div>
			{:else}
				<div class="border-b border-raqm-border p-4">
					<h3 class="text-lg font-bold">Manual Iris preparation fields</h3>
					<p class="mt-1 text-sm leading-6 text-raqm-muted">Raqm does not submit your return to FBR.</p>
				</div>
				{#each createIrisMapping($raqmData, $raqmData.calculationResults) as row}
					<div class="grid gap-2 border-b border-raqm-border p-3 md:grid-cols-[180px_170px_1fr]">
						<p class="font-bold">{row.label}</p>
						<p>{typeof row.value === 'number' ? `PKR ${formatPkr(row.value)}` : row.value}</p>
						<p class="text-sm text-raqm-muted">{row.notes}</p>
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<section id="checklist" class="flow-section">
		<div class="flow-section-heading">
			<span>11</span>
			<div>
				<h2>Checklist</h2>
				<p>Scannable document and warning status.</p>
			</div>
		</div>
		<div class="grid gap-2">
			{#each createChecklist($raqmData, $raqmData.calculationResults) as item}
				<article class="checklist-item">
					<span class="flow-index"><Check size={15} /></span>
					<div>
						<h3 class="m-0 font-bold">{item.title}</h3>
						<p class="m-0 text-sm leading-6 text-raqm-muted">{item.description}</p>
					</div>
					<span class="status-pill capitalize">{item.status}</span>
				</article>
			{/each}
		</div>
	</section>

	<section id="reports" class="flow-section">
		<div class="flow-section-heading">
			<span>12</span>
			<div>
				<h2>Reports</h2>
				<p>Generate local files. No cloud upload.</p>
			</div>
		</div>
		<div class="card p-4">
			<div class="flex flex-wrap gap-2">
				<button class="btn btn-primary" type="button" onclick={() => runExport('pdf')}
					><FileText size={16} /> Export PDF</button
				>
				<button class="btn btn-secondary" type="button" onclick={() => runExport('xlsx')}>Export Excel</button>
				<button class="btn btn-secondary" type="button" onclick={() => runExport('csv')}>Export CSV</button>
			</div>
			{#if exportError}<p class="mt-3 rounded-lg bg-red-50 p-3 text-sm font-bold text-raqm-danger">
					{exportError}
				</p>{/if}
			<p class="mt-3 text-sm leading-6 text-raqm-muted">
				Reports include generated date, rule pack version, calculation summary, Iris handoff fields, checklist, and
				disclaimer.
			</p>
		</div>
	</section>
{:else}
	<section class="flow-section locked-next">
		<ShieldCheck size={24} />
		<h2>Unlock the vault to continue.</h2>
		<p>
			Setup, income, withholding, assets, liabilities, calculation, checklist, and reports appear here after unlock.
		</p>
	</section>
{/if}
