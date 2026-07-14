<script>
	import { ArrowRight, Check, FileCheck, FileText, Lock, ShieldCheck } from '@lucide/svelte';
	import { pkTy2026Manifest } from '$lib/rules/pkTy2026';

	const workflow = [
		['Collect', 'Salary certificate, tax deducted, bank profit certificates, assets, and liabilities.'],
		['Prepare', 'Enter the numbers into an encrypted browser vault. Nothing is uploaded.'],
		['Calculate', 'Run the local rules engine and read the deterministic explanation.'],
		['Handoff', 'Use the Iris summary and reports while filing manually on FBR Iris.']
	];

	const needs = [
		'Salary certificate',
		'Employer tax deducted',
		'Bank certificates',
		'Asset statement',
		'Liability details'
	];

	const faq = [
		[
			'What is FBR Iris?',
			'FBR Iris is the official portal where you prepare and submit your Pakistan income tax return. Raqm helps you organize and estimate before you open Iris.'
		],
		[
			'Why file if tax is already deducted?',
			'Withholding is tax paid in advance. Filing reconciles your annual income, deductions, assets, liabilities, and any payable or refund position.'
		],
		[
			'Does Raqm submit my return?',
			'No. Raqm prepares local summaries and exports. You verify the numbers and submit manually on FBR Iris.'
		]
	];
</script>

<svelte:head>
	<title>Raqm | Private by design. Ready for Iris.</title>
	<meta
		name="description"
		content="Raqm is a local-first Pakistan tax preparation guide for salaried filers preparing for FBR Iris."
	/>
</svelte:head>

<main class="landing-page">
	<section class="hero-shell">
		<div class="reveal">
			<div class="mb-4 flex flex-wrap gap-2">
				<span class="privacy-chip"><ShieldCheck size={14} /> Data stays on device</span>
				<span class="privacy-chip"><Lock size={14} /> No account</span>
			</div>
			<h1 class="hero-title">Raqm</h1>
			<p class="hero-subtitle">Private by design. Ready for Iris.</p>
			<p class="hero-copy">
				A compact local-first guide for salaried Pakistani filers: understand the return, organize your numbers,
				estimate tax, and walk into FBR Iris with a clean handoff.
			</p>
			<div class="hero-actions">
				<a class="btn btn-primary" href="/app">Start private preparation <ArrowRight size={17} /></a>
				<a class="btn btn-secondary" href="#guide">Learn the flow</a>
			</div>
		</div>

		<aside class="hero-panel reveal delay-1" aria-label="Product preview">
			<p class="eyebrow">One Docker endpoint</p>
			<strong class="mt-2 block text-2xl font-bold">http://localhost:8080</strong>
			<p class="mt-2 text-sm leading-6 text-raqm-muted">
				Expected running service: web. Expected container: raqm-web-1.
			</p>
			<div class="my-4 h-px bg-raqm-border"></div>
			<p class="eyebrow">Before Iris</p>
			<div class="timeline">
				{#each workflow as [title, body], index}
					<div class="flow-step">
						<span class="flow-index">{index + 1}</span>
						<div>
							<strong>{title}</strong>
							<p class="m-0 mt-1 text-sm leading-6 text-raqm-muted">{body}</p>
						</div>
					</div>
				{/each}
			</div>
		</aside>
	</section>

	<section id="guide" class="section pt-8">
		<div class="mx-auto grid max-w-[1180px] gap-3 md:grid-cols-3">
			<article class="card p-5">
				<div class="service-icon">
					<FileText size={18} />
				</div>
				<p class="eyebrow mt-3">Start / Continue</p>
				<h2 class="text-xl font-bold">Resume the local workflow.</h2>
				<p class="mt-3 text-sm leading-6 text-raqm-muted">
					Open the focused preparation flow in the same Svelte container, from vault through reports.
				</p>
				<a class="service-link" href="/app">Open workflow <ArrowRight size={15} /></a>
			</article>
			<article class="card p-5">
				<div class="service-icon">
					<ShieldCheck size={18} />
				</div>
				<p class="eyebrow mt-3">Private Vault</p>
				<h2 class="text-xl font-bold">Encrypted browser storage.</h2>
				<p class="mt-3 text-sm leading-6 text-raqm-muted">
					Salary, withholding, assets, liabilities, and reports stay in the encrypted local vault.
				</p>
				<a class="service-link" href="/app">Open vault <ArrowRight size={15} /></a>
			</article>
			<article class="card p-5">
				<p class="eyebrow">Tax filing, explained simply</p>
				<h2 class="text-xl font-bold">Your return is the annual story of your money.</h2>
				<p class="mt-3 text-sm leading-6 text-raqm-muted">
					Raqm turns salary, withholding, bank profit, assets, and liabilities into a checklist you can review before
					entering Iris.
				</p>
			</article>
		</div>
	</section>

	<section class="section pt-0">
		<div class="mx-auto grid max-w-[1180px] gap-3 md:grid-cols-[0.9fr_1.1fr]">
			<div class="card p-5">
				<p class="eyebrow">What you need</p>
				<div class="grid gap-2">
					{#each needs as item}
						<div class="summary-row">
							<span class="flow-index"><Check size={15} /></span>
							<strong>{item}</strong>
						</div>
					{/each}
				</div>
			</div>
			<div class="card p-5">
				<p class="eyebrow">What Raqm does</p>
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<h3 class="font-bold">Inside Raqm</h3>
						<p class="mt-2 text-sm leading-6 text-raqm-muted">
							Enter data locally, calculate with a transparent rules engine, review warnings, and export reports.
						</p>
					</div>
					<div>
						<h3 class="font-bold">On your device</h3>
						<p class="mt-2 text-sm leading-6 text-raqm-muted">
							Your financial data stays in the encrypted browser vault. No backend database receives it.
						</p>
					</div>
				</div>
				<div class="mt-4 rounded-xl border border-raqm-border bg-raqm-background p-4">
					<p class="eyebrow">Latest Pakistan tax rules status</p>
					<p class="text-sm leading-6 text-raqm-muted">
						Tax Year {pkTy2026Manifest.taxYear}, pack {pkTy2026Manifest.id}. Status:
						<strong class="text-raqm-warning"> verification required</strong>.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="section pt-0">
		<div class="mx-auto max-w-[860px]">
			<p class="eyebrow">Beginner FAQ</p>
			<div class="grid gap-2">
				{#each faq as [question, answer]}
					<details class="card p-4">
						<summary>{question}</summary>
						<p class="mt-3 text-sm leading-6 text-raqm-muted">{answer}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<section class="section pt-0">
		<div class="mx-auto max-w-[860px] rounded-2xl border border-raqm-border bg-white p-6 text-center">
			<FileCheck class="mx-auto text-raqm-secondary" size={34} />
			<h2 class="mt-3 text-3xl font-bold">Prepare privately, file manually.</h2>
			<p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-raqm-muted">
				Raqm helps you get calm and organized before Iris. You stay in control of every number.
			</p>
			<a class="btn btn-primary mt-5" href="/app">Start private preparation</a>
		</div>
	</section>
</main>
