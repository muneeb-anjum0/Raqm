<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Calculator, CheckSquare, FileText, Home, Landmark, Lock, Shield, SlidersHorizontal } from '@lucide/svelte';
	import { lockVault } from '$lib/crypto-vault';
	import { vaultStatus } from '$lib/app-data';

	let { children } = $props();

	const nav = [
		['/app', 'Dashboard', Home],
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
	] as const;

	function doLock() {
		lockVault();
		vaultStatus.update((state) => ({ ...state, isUnlocked: false, message: 'Vault locked manually.' }));
		goto('/app/vault');
	}
</script>

<div class="min-h-screen bg-raqm-background text-raqm-text">
	<header class="sticky top-0 z-30 border-b border-raqm-border bg-white/95 backdrop-blur">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
			<a href="/" class="flex items-center gap-3 font-extrabold text-raqm-secondary">
				<span class="grid h-9 w-9 place-items-center rounded-lg bg-raqm-secondary text-white">R</span>
				<span>Raqm</span>
			</a>
			<div class="flex items-center gap-2">
				<span class="badge">
					<Lock size={14} />
					{$vaultStatus.isUnlocked ? 'Vault unlocked' : 'Vault locked'}
				</span>
				{#if $vaultStatus.isUnlocked}
					<button class="btn btn-secondary py-2" type="button" onclick={doLock}>Lock</button>
				{/if}
			</div>
		</div>
	</header>

	<div class="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:grid-cols-[250px_1fr]">
		<aside class="card h-fit p-2 lg:sticky lg:top-20">
			<nav class="grid gap-1">
				{#each nav as [href, label, Icon]}
					<a
						class:!bg-raqm-secondary={$page.url.pathname === href}
						class:!text-white={$page.url.pathname === href}
						class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-raqm-muted hover:bg-raqm-background hover:text-raqm-secondary"
						{href}
					>
						<Icon size={16} />
						{label}
					</a>
				{/each}
			</nav>
		</aside>
		<main class="min-w-0">
			{#if $vaultStatus.message}
				<div class="mb-4 rounded-lg border border-raqm-border bg-white px-4 py-3 text-sm font-semibold text-raqm-muted">
					{$vaultStatus.message}
				</div>
			{/if}
			{@render children()}
		</main>
	</div>
</div>
