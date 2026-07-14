<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		Calculator,
		CheckSquare,
		FileText,
		Landmark,
		LayoutDashboard,
		Lock,
		Network,
		Shield,
		SlidersHorizontal
	} from '@lucide/svelte';
	import { lockVault } from '$lib/crypto-vault';
	import { vaultStatus } from '$lib/app-data';

	let { children } = $props();

	const nav = [
		['/hub', 'Hub', Network],
		['/app', 'Dashboard', LayoutDashboard],
		['/app/setup', 'Setup', SlidersHorizontal],
		['/app/income', 'Income', FileText],
		['/app/withholding', 'Withholding', Landmark],
		['/app/bank-profit', 'Bank Profit', Landmark],
		['/app/assets', 'Assets', FileText],
		['/app/liabilities', 'Liabilities', FileText],
		['/app/review', 'Review', CheckSquare],
		['/app/calculate', 'Calculate', Calculator],
		['/app/iris-summary', 'Iris Summary', FileText],
		['/app/checklist', 'Checklist', CheckSquare],
		['/app/reports', 'Reports', FileText],
		['/app/rules', 'Rules', Shield],
		['/app/privacy', 'Privacy', Shield],
		['/app/settings', 'Settings', SlidersHorizontal]
	];

	function doLock() {
		lockVault();
		vaultStatus.update((state) => ({ ...state, isUnlocked: false, message: 'Vault locked manually.' }));
		goto('/app/vault');
	}
</script>

<div class="app-frame">
	<header class="topbar">
		<div class="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-3 px-5 py-4">
			<a href="/" class="flex items-center gap-3 text-raqm-secondary no-underline">
				<span class="brand-mark">R</span>
				<span>
					<span class="block text-lg font-black leading-none text-raqm-text">Raqm</span>
					<span class="text-xs font-black uppercase tracking-[0.14em] text-raqm-muted">Private by design</span>
				</span>
			</a>
			<div class="flex items-center gap-2">
				<a class="btn btn-secondary hidden py-2 md:inline-flex" href="/hub">Hub</a>
				<span class="badge">
					<Lock size={14} />
					{$vaultStatus.isUnlocked ? 'Vault unlocked' : 'Vault locked'}
				</span>
				{#if $vaultStatus.isUnlocked}
					<button class="btn btn-primary py-2" type="button" onclick={doLock}>Lock</button>
				{/if}
			</div>
		</div>
	</header>

	<div class="app-grid">
		<aside class="sidebar">
			<nav class="grid gap-1">
				{#each nav as [href, label, Icon]}
					<a class:active={$page.url.pathname === href} class="nav-link" {href}>
						<Icon size={17} />
						{label}
					</a>
				{/each}
			</nav>
		</aside>
		<main class="content-panel">
			{#if $vaultStatus.message}
				<div class="save-toast">{$vaultStatus.message}</div>
			{/if}
			{@render children()}
		</main>
	</div>
</div>
