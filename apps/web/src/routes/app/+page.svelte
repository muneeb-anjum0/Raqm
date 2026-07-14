<script>
	import MoneyInput from '$lib/components/MoneyInput.svelte';
	import LineSidebar from '$lib/components/LineSidebar.svelte';
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
	import { ArrowLeft, ArrowRight, Check, FileText, Lock } from '@lucide/svelte';

	let password = '';
	let confirm = '';
	let wipeConfirm = '';
	let vaultExists = false;
	let hydrated = false;
	let error = '';
	let exportError = '';
	let activeStep = 0;

	const steps = [
		{ id: 'home', label: 'Home' },
		{ id: 'setup', label: 'Setup' },
		{ id: 'income', label: 'Income' },
		{ id: 'withholding', label: 'Withholding' },
		{ id: 'bank-profit', label: 'Bank Profit' },
		{ id: 'assets', label: 'Assets' },
		{ id: 'liabilities', label: 'Liabilities' },
		{ id: 'review', label: 'Review' },
		{ id: 'calculate', label: 'Calculate' },
		{ id: 'iris-summary', label: 'Iris Summary' },
		{ id: 'checklist', label: 'Checklist' },
		{ id: 'reports', label: 'Reports' }
	];

	$: current = steps[activeStep];
	$: started =
		Boolean($raqmData.profile.name) ||
		calculateAnnualSalary($raqmData) > 0 ||
		$raqmData.withholding.employerTaxDeducted > 0 ||
		$raqmData.bankProfit.profitAmount > 0 ||
		Boolean($raqmData.calculationResults);

	onMount(async () => {
		hydrated = true;
		vaultExists = await hasVault();
		await refreshVaultStatus();
		if ($vaultStatus.isUnlocked) {
			await loadVaultData();
			await tick();
			activeStep = started ? 0 : 1;
		}
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
			await tick();
			activeStep = started ? 0 : 1;
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
		activeStep = 0;
		await refreshVaultStatus();
	}

	async function saveAndGo(index) {
		await updateData(() => $raqmData);
		activeStep = Math.max(0, Math.min(index, steps.length - 1));
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function next() {
		await saveAndGo(activeStep + 1);
	}

	async function back() {
		await saveAndGo(activeStep - 1);
	}

	async function calculate() {
		error = '';
		try {
			await runCalculation();
			window.scrollTo({ top: 0, behavior: 'smooth' });
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
</script>

<svelte:head><title>Private Preparation | Raqm</title></svelte:head>

{#if !$vaultStatus.isUnlocked}
	<section class="vault-entry">
		<div class="vault-entry__intro">
			<h1>Encrypted local vault</h1>
			<p>Create or unlock your browser vault. Your password and raw encryption key are never stored.</p>
		</div>

		<div class="vault-entry__grid">
			<form class="card compact-vault-card grid gap-3 p-4">
				<div class="flex items-start justify-between gap-3">
					<div>
						<h2 class="text-lg font-bold">{vaultExists ? 'Unlock vault' : 'Create vault'}</h2>
						<p class="mt-1 text-sm leading-6 text-raqm-muted">Use at least 8 characters.</p>
					</div>
					<span class="status-pill">Locked</span>
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
				<button class="btn btn-primary compact-action" type="button" disabled={!hydrated} onclick={createOrUnlock}>
					{vaultExists ? 'Unlock vault' : 'Create encrypted vault'}
				</button>
			</form>

			<section class="card grid gap-3 p-4">
				<div>
					<p class="eyebrow">Vault controls</p>
					<p class="text-sm leading-6 text-raqm-muted">Backups are encrypted. Panic wipe only affects this browser.</p>
				</div>
				<div class="grid gap-2 sm:grid-cols-2">
					<button class="btn btn-secondary" type="button" disabled={!$vaultStatus.hasVault} onclick={backup}>
						Export backup
					</button>
					<label class="btn btn-secondary cursor-pointer">
						Import backup
						<input class="sr-only" type="file" accept="application/json" onchange={importBackup} />
					</label>
				</div>
				<div class="rounded-xl border border-raqm-border bg-white p-3">
					<h3 class="font-bold text-raqm-danger">Panic wipe</h3>
					<input class="input compact-input mt-2" aria-label="Panic wipe confirmation" bind:value={wipeConfirm} />
					<button
						class="btn btn-danger mt-2 w-full"
						type="button"
						disabled={wipeConfirm !== 'WIPE RAQM'}
						onclick={wipe}
					>
						Panic wipe local data
					</button>
				</div>
			</section>
		</div>
	</section>
{:else}
	<div class="prep-shell">
		<aside class="prep-sidebar">
			<LineSidebar items={steps} active={activeStep} onSelect={(index) => saveAndGo(index)} />
		</aside>

		<section class="step-panel">
			<div class="step-panel__header">
				<div>
					<p class="eyebrow">{String(activeStep + 1).padStart(2, '0')} / {steps.length}</p>
					<h1>{current.label}</h1>
				</div>
				<div class="mini-stats">
					<span class="status-pill status-success"><Lock size={13} /> Vault unlocked</span>
					<span class="status-pill">Private mode</span>
				</div>
			</div>

			{#if current.id === 'home'}
				<div class="grid gap-3">
					<section class="card p-5">
						<p class="eyebrow">Continue</p>
						<h2 class="text-2xl font-bold">Pick up where you left off.</h2>
						<p class="mt-2 max-w-xl text-sm leading-6 text-raqm-muted">
							Your preparation is saved locally in the encrypted browser vault.
						</p>
						<div class="mt-4 dashboard-grid">
							<div class="metric-card">
								<p>Annual salary</p>
								<strong>PKR {formatPkr(calculateAnnualSalary($raqmData))}</strong>
							</div>
							<div class="metric-card">
								<p>Withholding</p>
								<strong>PKR {formatPkr($raqmData.withholding.employerTaxDeducted)}</strong>
							</div>
							<div class="metric-card">
								<p>Estimate</p>
								<strong
									>{$raqmData.calculationResults
										? `PKR ${formatPkr($raqmData.calculationResults.estimatedPayable)}`
										: 'Pending'}</strong
								>
							</div>
						</div>
					</section>
					<div class="step-actions">
						<button class="btn btn-primary" type="button" onclick={() => saveAndGo(started ? 7 : 1)}>
							{started ? 'Review progress' : 'Start setup'}
							<ArrowRight size={15} />
						</button>
					</div>
				</div>
			{:else if current.id === 'setup'}
				<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
					<label class="field"
						><span class="label">Name (optional)</span><input
							class="input"
							bind:value={$raqmData.profile.name}
						/></label
					>
					<label class="field"
						><span class="label">Tax year</span><select class="input" bind:value={$raqmData.profile.taxYear}
							><option value="2026">2026</option></select
						></label
					>
					<label class="field"
						><span class="label">Filer type</span><select class="input" bind:value={$raqmData.profile.filerType}
							><option value="salaried">Salaried active</option><option disabled>Freelancer - Coming later</option
							><option disabled>Business - Coming later</option><option disabled>Landlord - Coming later</option><option
								disabled>Investor - Coming later</option
							></select
						></label
					>
					<label class="field"
						><span class="label">Employment type</span><select
							class="input"
							bind:value={$raqmData.profile.employmentType}
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
				</form>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Done <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'income'}
				<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
					<MoneyInput label="Monthly salary" bind:value={$raqmData.income.monthlySalary} />
					<MoneyInput label="Annual salary" bind:value={$raqmData.income.annualSalary} />
					<MoneyInput label="Bonus (optional)" bind:value={$raqmData.income.bonus} />
					<MoneyInput
						label="Other taxable salary components (optional)"
						bind:value={$raqmData.income.otherTaxableSalary}
					/>
					<div class="metric-card flow-span">
						<p>Live annual salary preview</p>
						<strong>PKR {formatPkr(calculateAnnualSalary($raqmData))}</strong>
					</div>
				</form>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Done <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'withholding'}
				<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
					<MoneyInput label="Annual employer tax deducted" bind:value={$raqmData.withholding.employerTaxDeducted} />
					<label class="flex items-center gap-3 text-sm font-bold"
						><input type="checkbox" bind:checked={$raqmData.withholding.certificateAvailable} /> Certificate available</label
					>
				</form>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Done <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'bank-profit'}
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
				</form>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Done <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'assets'}
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
				</form>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Done <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'liabilities'}
				<form class="card flow-card" onchange={() => updateData(() => $raqmData)}>
					<MoneyInput label="Loans" bind:value={$raqmData.liabilities.loans} />
					<MoneyInput label="Credit card payable" bind:value={$raqmData.liabilities.creditCardPayable} />
					<MoneyInput label="Personal payable" bind:value={$raqmData.liabilities.personalPayable} />
					<MoneyInput label="Other liabilities" bind:value={$raqmData.liabilities.other} />
				</form>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Done <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'review'}
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
				</div>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Done <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'calculate'}
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
							{#each createExplanation($raqmData.calculationResults) as line}<p
									class="rounded-xl border border-raqm-border bg-white p-3 text-sm leading-6 text-raqm-muted"
								>
									{line}
								</p>{/each}
						</div>
					{/if}
				</div>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Next <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'iris-summary'}
				<div class="card overflow-hidden">
					{#if !$raqmData.calculationResults}
						<div class="p-4"><p class="font-bold text-raqm-muted">Run calculation first.</p></div>
					{:else}
						<div class="border-b border-raqm-border p-4">
							<h3 class="text-lg font-bold">Manual Iris preparation fields</h3>
							<p class="mt-1 text-sm leading-6 text-raqm-muted">Raqm does not submit your return to FBR.</p>
						</div>
						{#each createIrisMapping($raqmData, $raqmData.calculationResults) as row}<div
								class="grid gap-2 border-b border-raqm-border p-3 md:grid-cols-[180px_170px_1fr]"
							>
								<p class="font-bold">{row.label}</p>
								<p>{typeof row.value === 'number' ? `PKR ${formatPkr(row.value)}` : row.value}</p>
								<p class="text-sm text-raqm-muted">{row.notes}</p>
							</div>{/each}
					{/if}
				</div>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Next <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'checklist'}
				<div class="grid gap-2">
					{#each createChecklist($raqmData, $raqmData.calculationResults) as item}<article class="checklist-item">
							<span class="flow-index"><Check size={15} /></span>
							<div>
								<h3 class="m-0 font-bold">{item.title}</h3>
								<p class="m-0 text-sm leading-6 text-raqm-muted">{item.description}</p>
							</div>
							<span class="status-pill capitalize">{item.status}</span>
						</article>{/each}
				</div>
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button><button
						class="btn btn-primary"
						type="button"
						onclick={next}>Next <ArrowRight size={15} /></button
					>
				</div>
			{:else if current.id === 'reports'}
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
				<div class="step-actions">
					<button class="btn btn-secondary" type="button" onclick={back}><ArrowLeft size={15} /> Back</button>
				</div>
			{/if}
		</section>
	</div>
{/if}
