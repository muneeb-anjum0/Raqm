<script>
	import { ArrowRight, Database, Globe2, Server, ShieldCheck } from '@lucide/svelte';

	const services = [
		{
			title: 'Raqm Web App',
			status: 'Available',
			description: 'The complete Svelte preparation workspace running in this same container.',
			href: '/',
			action: 'Open landing page',
			icon: Globe2
		},
		{
			title: 'Private Vault',
			status: 'Available',
			description: 'Encrypted browser vault for salary, withholding, assets, liabilities, and reports.',
			href: '/app/vault',
			action: 'Open vault',
			icon: ShieldCheck
		},
		{
			title: 'Backend API',
			status: 'Not in MVP',
			description: 'No backend receives financial data. Public metadata API can be added later if needed.',
			href: '/app/privacy',
			action: 'Privacy model',
			icon: Server
		},
		{
			title: 'Database Interface',
			status: 'Not in MVP',
			description: 'No server database exists. Sensitive records stay encrypted in browser IndexedDB.',
			href: '/app/privacy',
			action: 'Storage details',
			icon: Database
		}
	];
</script>

<svelte:head>
	<title>Container Hub | Raqm</title>
</svelte:head>

<main class="hub-page">
	<section class="hub-hero">
		<div class="reveal">
			<p class="eyebrow">One container. One access point.</p>
			<h1>Raqm Hub</h1>
			<p class="hero-copy">
				Everything available in the local Docker stack is listed here. This MVP intentionally runs as one Svelte app
				container, with no backend or database service handling financial data.
			</p>
			<div class="hero-actions">
				<a class="btn btn-primary motion-button" href="/app">Open dashboard <ArrowRight size={18} /></a>
				<a class="btn btn-secondary motion-button" href="/">View landing</a>
			</div>
		</div>
		<div class="hub-status-card reveal delay-1">
			<span class="live-dot"></span>
			<p>Docker endpoint</p>
			<strong>http://localhost:8080</strong>
			<small>Single running service: web</small>
		</div>
	</section>

	<section class="hub-grid" aria-label="Available endpoints">
		{#each services as service, index}
			<article class="service-card reveal" style={`animation-delay: ${index * 90}ms`}>
				<div class="service-icon">
					<svelte:component this={service.icon} size={24} />
				</div>
				<span class:muted-status={service.status !== 'Available'}>{service.status}</span>
				<h2>{service.title}</h2>
				<p>{service.description}</p>
				<a class="service-link" href={service.href}>{service.action} <ArrowRight size={16} /></a>
			</article>
		{/each}
	</section>
</main>
