<script lang="ts">
	import { ArrowRight, Database, FileCheck, Lock, ShieldCheck } from '@lucide/svelte';
	import { pkTy2026Manifest } from '$lib/rules/pkTy2026';

	const sections = [
		[
			'What is tax filing?',
			'Tax filing is the yearly process of reporting income, tax already deducted, assets, liabilities, and other required information to Pakistan tax authorities.'
		],
		[
			'Why do salaried people still need to file?',
			'Employer tax deduction is not the same as filing a return. Filing helps reconcile income, withholding, assets, and filer status.'
		],
		[
			'What is FBR Iris?',
			'Iris is the official FBR portal where taxpayers prepare and submit returns. Raqm prepares a local summary; it does not submit to Iris.'
		],
		[
			'What is NTN?',
			'An NTN is a taxpayer registration identity used in Pakistan tax records. Raqm avoids collecting CNIC or NTN in the MVP.'
		],
		[
			'What is the Active Taxpayer List?',
			'The ATL is the public filer status list maintained by FBR. Raqm does not perform ATL lookup in the MVP.'
		],
		[
			'What is withholding tax?',
			'Withholding is tax deducted at source, such as by an employer or bank, that may be adjustable in your return.'
		],
		[
			'What documents do you need?',
			'Salary certificate, employer withholding certificate, bank withholding certificate, bank statements, asset details, liabilities, and previous return if available.'
		]
	];

	const faqs = [
		['Does Raqm replace FBR Iris?', 'No. You still file manually on FBR Iris.'],
		[
			'Does Raqm send my salary or assets to a backend?',
			'No. The MVP stores financial data locally in an encrypted browser vault.'
		],
		[
			'Is the tax estimate guaranteed?',
			'No. It is a preparation estimate based on the selected rule pack. Complex cases need professional advice.'
		],
		['Does AI calculate my tax?', 'No. The rules engine calculates; deterministic templates explain the result.']
	];
</script>

<svelte:head>
	<title>Raqm | Private by design. Ready for Iris.</title>
	<meta
		name="description"
		content="Raqm is a Pakistan-only local-first tax preparation workspace for salaried filers preparing for FBR Iris."
	/>
</svelte:head>

<main class="bg-raqm-background text-raqm-text">
	<section class="section min-h-[92vh]">
		<div class="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
			<div>
				<div class="mb-5 flex flex-wrap gap-2">
					<span class="badge"><ShieldCheck size={15} /> Data stays on device</span>
					<span class="badge"><Lock size={15} /> No account required</span>
					<span class="badge"><Database size={15} /> No cloud database</span>
				</div>
				<h1 class="max-w-4xl text-5xl font-black leading-[1.02] text-raqm-text md:text-7xl">Raqm</h1>
				<p class="mt-4 text-2xl font-extrabold text-raqm-secondary">Private by design. Ready for Iris.</p>
				<p class="mt-6 max-w-2xl text-lg leading-8 text-raqm-muted">
					Tax filing sounds complicated because nobody explains it like a normal person. Raqm breaks it into simple
					steps: what you earned, what tax was already deducted, what you own, what is missing, and what you need before
					opening FBR Iris.
				</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<a class="btn btn-primary" href="/app/vault">Start Private Preparation <ArrowRight size={18} /></a>
					<a class="btn btn-secondary" href="#learn">Learn first</a>
				</div>
			</div>
			<div class="card p-6">
				<div class="rounded-lg border border-raqm-border bg-raqm-background p-5">
					<p class="text-sm font-extrabold uppercase tracking-[0.12em] text-raqm-secondary">Iris-ready workspace</p>
					<div class="mt-5 grid gap-3">
						{#each ['Create encrypted local vault', 'Enter salary and withholding', 'Run rules-based estimate', 'Generate Iris summary and checklist', 'Export PDF, Excel, or CSV'] as item, index}
							<div class="flex items-center gap-3 rounded-lg bg-white p-3">
								<span class="grid h-8 w-8 place-items-center rounded-md bg-raqm-secondary text-sm font-black text-white"
									>{index + 1}</span
								>
								<span class="font-bold">{item}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="learn" class="section bg-white">
		<div class="mx-auto max-w-7xl">
			<h2 class="text-3xl font-black md:text-4xl">Pakistan tax filing, explained calmly</h2>
			<div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each sections as [title, body]}
					<article class="card p-5">
						<h3 class="text-lg font-black">{title}</h3>
						<p class="mt-2 text-raqm-muted">{body}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="section">
		<div class="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
			<div class="card p-6">
				<h2 class="text-2xl font-black">How Raqm works</h2>
				<p class="mt-3 text-raqm-muted">
					Create a password-protected browser vault, enter your salaried filer details, run a deterministic rules-engine
					estimate, and export a summary for manual Iris preparation.
				</p>
			</div>
			<div class="card p-6">
				<h2 class="text-2xl font-black">Why local-first privacy matters</h2>
				<p class="mt-3 text-raqm-muted">
					Salary, bank profit, assets, and liabilities are sensitive. Raqm’s MVP avoids accounts, analytics, cloud
					databases, and backend financial-data processing.
				</p>
			</div>
			<div class="card p-6">
				<h2 class="text-2xl font-black">What Raqm can do</h2>
				<p class="mt-3 text-raqm-muted">
					Manual data entry, encrypted local storage, estimated salaried tax calculation, deterministic explanation,
					Iris summary, checklist, and local exports.
				</p>
			</div>
			<div class="card p-6">
				<h2 class="text-2xl font-black">What Raqm cannot do</h2>
				<p class="mt-3 text-raqm-muted">
					Raqm is not an FBR replacement, AI accountant, legal guarantee, direct Iris submission tool, ATL lookup, CNIC
					verification, or accountant replacement for complex cases.
				</p>
			</div>
		</div>
	</section>

	<section class="section bg-white">
		<div class="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.8fr_1.2fr]">
			<div class="card p-6">
				<h2 class="text-2xl font-black">Latest Pakistan tax rules panel</h2>
				<dl class="mt-4 grid gap-3 text-sm">
					<div>
						<dt class="font-black">Tax year</dt>
						<dd>{pkTy2026Manifest.taxYear}</dd>
					</div>
					<div>
						<dt class="font-black">Rule pack</dt>
						<dd>{pkTy2026Manifest.id}</dd>
					</div>
					<div>
						<dt class="font-black">Status</dt>
						<dd class="text-raqm-warning">Verification Required</dd>
					</div>
					<div>
						<dt class="font-black">Checksum</dt>
						<dd>{pkTy2026Manifest.checksum}</dd>
					</div>
				</dl>
			</div>
			<div class="grid gap-4">
				{#each faqs as [question, answer]}
					<details class="card p-5">
						<summary class="cursor-pointer font-black">{question}</summary>
						<p class="mt-2 text-raqm-muted">{answer}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<section class="section">
		<div class="mx-auto max-w-4xl text-center">
			<FileCheck class="mx-auto text-raqm-secondary" size={44} />
			<h2 class="mt-4 text-3xl font-black">Start private preparation</h2>
			<p class="mt-3 text-raqm-muted">
				No account. No cloud tax record. No direct FBR submission claim. Just a private workspace to help you prepare
				carefully before Iris.
			</p>
			<a class="btn btn-primary mt-6" href="/app/vault">Start Private Preparation</a>
		</div>
	</section>
</main>
