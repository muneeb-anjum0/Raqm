<script>
	import { ArrowRight, Database, FileText, Globe2, Server, ShieldCheck } from '@lucide/svelte';

	const services = [
		{
			title: 'Start / Continue',
			status: 'Available',
			description: 'Resume the local preparation workflow in the same Svelte container.',
			href: '/app',
			action: 'Open workflow',
			icon: FileText
		},
		{
			title: 'Private Vault',
			status: 'Available',
			description: 'Encrypted browser storage for salary, withholding, assets, liabilities, and reports.',
			href: '/app/vault',
			action: 'Open vault',
			icon: ShieldCheck
		},
		{
			title: 'Backend API',
			status: 'Not in MVP',
			description: 'No backend receives financial data. Raqm is intentionally local-first.',
			href: '/app/privacy',
			action: 'Privacy model',
			icon: Server
		},
		{
			title: 'Database Interface',
			status: 'Not in MVP',
			description: 'No server database exists. Sensitive records stay in encrypted browser IndexedDB.',
			href: '/app/privacy',
			action: 'Storage details',
			icon: Database
		}
	];
</script>

<svelte:head>
	<title>Hub | Raqm</title>
</svelte:head>

<main class="hub-page">
	<nav class="site-nav" aria-label="Hub navigation">
		<a href="/" class="brand-lockup">
			<span class="brand-mark">R</span>
			<span>
				<span class="brand-name">Raqm</span>
				<span class="brand-sub">One container</span>
			</span>
		</a>
		<div class="top-actions">
			<a class="top-link" href="/">Landing</a>
			<a class="btn btn-primary" href="/app">Open app</a>
		</div>
	</nav>

	<section class="hub-hero">
		<div class="reveal">
			<p class="eyebrow">Command center</p>
			<h1>Raqm Hub</h1>
			<p class="hero-copy">
				One local Docker entry point for the web app, vault, rule status, privacy model, and export workflow. No
				separate portal container. No backend database holding financial records.
			</p>
			<div class="hero-actions">
				<a class="btn btn-primary" href="/app">Resume preparation <ArrowRight size={17} /></a>
				<a class="btn btn-secondary" href="/app/reports">Reports</a>
			</div>
		</div>
		<aside class="hub-status-card reveal delay-1">
			<div class="flex items-center gap-2">
				<span class="live-dot"></span>
				<p class="m-0 text-sm font-bold text-raqm-secondary">Docker endpoint</p>
			</div>
			<strong class="mt-4 block text-2xl font-bold">http://localhost:8080</strong>
			<p class="mt-2 text-sm leading-6 text-raqm-muted">
				Expected running service: web. Expected container: raqm-web-1.
			</p>
			<div class="mt-4 grid gap-2">
				<div class="summary-row">
					<span class="flow-index"><Globe2 size={15} /></span>
					<div>
						<strong>Workflow progress</strong>
						<p class="m-0 text-sm text-raqm-muted">Vault to reports in 12 compact steps.</p>
					</div>
				</div>
				<div class="summary-row">
					<span class="flow-index"><ShieldCheck size={15} /></span>
					<div>
						<strong>Rule pack</strong>
						<p class="m-0 text-sm text-raqm-muted">Verification required before relying on final values.</p>
					</div>
				</div>
			</div>
		</aside>
	</section>

	<section class="hub-grid" aria-label="Available endpoints">
		{#each services as service, index}
			<article class="service-card reveal" style={`animation-delay: ${index * 55}ms`}>
				<div class="service-icon">
					<svelte:component this={service.icon} size={18} />
				</div>
				<span class:muted-status={service.status !== 'Available'}>{service.status}</span>
				<h2>{service.title}</h2>
				<p>{service.description}</p>
				<a class="service-link" href={service.href}>{service.action} <ArrowRight size={15} /></a>
			</article>
		{/each}
	</section>
</main>
