<script>
	import { ArrowRight, Database, FileCheck, Lock, ShieldCheck, Sparkles } from '@lucide/svelte';
	import { pkTy2026Manifest } from '$lib/rules/pkTy2026';

	const flow = [
		'Create encrypted browser vault',
		'Enter salary and withholding',
		'Review assets and liabilities',
		'Run rules-based estimate',
		'Export Iris-ready reports'
	];

	const learning = [
		['Tax filing', 'Report income, tax deducted, assets, liabilities, and required annual return details.'],
		['Salaried filers', 'Employer deduction is not the same as filing. Raqm helps reconcile the whole picture.'],
		['FBR Iris', 'The official portal where you manually prepare and submit your return. Raqm does not submit it.'],
		['NTN and ATL', 'Learn the language before opening Iris, without turning tax prep into a panic spiral.'],
		['Withholding', 'Track employer and bank deductions so they can be reviewed as adjustable tax paid.'],
		['Documents', 'Salary certificate, bank certificates, statements, asset details, and liability records.']
	];
</script>

<svelte:head>
	<title>Raqm | Private by design. Ready for Iris.</title>
	<meta
		name="description"
		content="Raqm is a Pakistan-only local-first tax preparation workspace for salaried filers preparing for FBR Iris."
	/>
</svelte:head>

<main class="landing-page">
	<section class="hero-shell">
		<div class="reveal">
			<div class="mb-5 flex flex-wrap gap-2">
				<span class="badge"><ShieldCheck size={15} /> Data stays on device</span>
				<span class="badge"><Lock size={15} /> No account</span>
				<span class="badge"><Database size={15} /> No cloud database</span>
			</div>
			<h1 class="hero-title">Raqm</h1>
			<p class="hero-subtitle">Private by design. Ready for Iris.</p>
			<p class="hero-copy">
				A calm Pakistan-only tax preparation workspace for salaried filers. Understand what matters, organize your
				numbers locally, run a rules-based estimate, and prepare a clean summary before opening FBR Iris.
			</p>
			<div class="hero-actions">
				<a class="btn btn-primary" href="/app/vault">Start private preparation <ArrowRight size={18} /></a>
				<a class="btn btn-secondary" href="/hub">Open Docker hub</a>
			</div>
		</div>

		<div class="hero-board reveal delay-1">
			<p class="eyebrow">Preparation flow</p>
			<div class="mt-4 grid gap-3">
				{#each flow as item, index}
					<div class="flow-step">
						<span class="flow-index">{index + 1}</span>
						<strong>{item}</strong>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="feature-grid">
		{#each learning as [title, body], index}
			<article class="service-card reveal" style={`animation-delay: ${index * 70}ms`}>
				<div class="service-icon"><Sparkles size={20} /></div>
				<span>Learn</span>
				<h2>{title}</h2>
				<p>{body}</p>
			</article>
		{/each}
	</section>

	<section class="section">
		<div class="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
			<article class="card p-6">
				<h2 class="text-2xl font-black">What Raqm can do</h2>
				<p class="mt-3 leading-7 text-raqm-muted">
					Manual data entry, encrypted local storage, salary withholding, bank profit, assets, liabilities, rules-engine
					calculation, deterministic explanation, Iris summary, checklist, and local exports.
				</p>
			</article>
			<article class="card p-6">
				<h2 class="text-2xl font-black">What Raqm cannot do</h2>
				<p class="mt-3 leading-7 text-raqm-muted">
					No FBR replacement, direct Iris submission, legal guarantee, cloud tax record, backend financial-data
					processing, ATL lookup, CNIC verification, or AI accountant claims.
				</p>
			</article>
		</div>
	</section>

	<section class="section pt-0">
		<div class="mx-auto max-w-6xl">
			<div class="card p-6 md:p-8">
				<div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
					<div>
						<p class="eyebrow">Pakistan Tax Rules</p>
						<h2 class="text-3xl font-black">Rule pack status: Verification Required</h2>
						<p class="mt-3 leading-7 text-raqm-muted">
							Tax Year {pkTy2026Manifest.taxYear}, pack {pkTy2026Manifest.id}. Values are intentionally marked
							unverified until manually checked against official sources.
						</p>
					</div>
					<a class="btn btn-primary" href="/app/rules">View rules</a>
				</div>
			</div>
		</div>
	</section>

	<section class="section pt-0">
		<div class="mx-auto max-w-4xl text-center">
			<FileCheck class="mx-auto text-raqm-secondary" size={44} />
			<h2 class="mt-4 text-4xl font-black">Prepare privately, file manually.</h2>
			<p class="mx-auto mt-3 max-w-2xl leading-7 text-raqm-muted">
				Raqm helps you get organized. You still verify everything and submit your return yourself on FBR Iris.
			</p>
			<a class="btn btn-primary mt-6" href="/app/vault">Start Private Preparation</a>
		</div>
	</section>
</main>
