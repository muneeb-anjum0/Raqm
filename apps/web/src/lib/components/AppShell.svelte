<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { FileText, Lock, Settings, Shield, Sparkles } from '@lucide/svelte';
	import { lockVault } from '$lib/crypto-vault';
	import { raqmData, vaultStatus } from '$lib/app-data';

	let { children } = $props();

	const workflow = [
		['/app/vault', 'Vault'],
		['/app/setup', 'Setup'],
		['/app/income', 'Income'],
		['/app/withholding', 'Withholding'],
		['/app/bank-profit', 'Bank Profit'],
		['/app/assets', 'Assets'],
		['/app/liabilities', 'Liabilities'],
		['/app/review', 'Review'],
		['/app/calculate', 'Calculate'],
		['/app/iris-summary', 'Iris Summary'],
		['/app/checklist', 'Checklist'],
		['/app/reports', 'Reports']
	];

	const utility = [
		['/hub', 'Hub', Sparkles],
		['/app', 'Home', FileText],
		['/app/rules', 'Rules', Shield],
		['/app/privacy', 'Privacy', Shield],
		['/app/settings', 'Settings', Settings]
	];

	function isWorkflowActive(href) {
		return $page.url.pathname === href;
	}

	function isUtilityActive(href) {
		return $page.url.pathname === href;
	}

	function doLock() {
		lockVault();
		vaultStatus.update((state) => ({ ...state, isUnlocked: false, message: 'Vault locked manually.' }));
		goto('/app/vault');
	}
</script>

<div class="app-frame">
	<header class="topbar">
		<div class="topbar-inner">
			<a href="/" class="brand-lockup" aria-label="Raqm home">
				<span class="brand-mark">R</span>
				<span>
					<span class="brand-name">Raqm</span>
					<span class="brand-sub">Local tax workspace</span>
				</span>
			</a>

			<div class="top-actions" aria-label="Workspace status and links">
				<span class="privacy-chip">
					<Lock size={13} />
					{$vaultStatus.isUnlocked ? 'Vault unlocked' : 'Vault locked'}
				</span>
				<span class="status-pill">TY {$raqmData.profile.taxYear}</span>
				<span class="status-pill">Private mode</span>
				{#each utility as [href, label, Icon]}
					<a class:active={isUtilityActive(href)} class="top-link" {href}>
						<Icon size={14} />
						{label}
					</a>
				{/each}
				{#if $vaultStatus.isUnlocked}
					<button class="btn btn-secondary" type="button" onclick={doLock}>Lock</button>
				{/if}
			</div>
		</div>
	</header>

	<aside class="workflow-wrap" aria-label="Workflow rail">
		<div class="workflow-inner">
			<nav class="workflow-nav" aria-label="Tax preparation workflow">
				{#each workflow as [href, label], index}
					<a class:active={isWorkflowActive(href)} class="workflow-link" {href}>
						<span class="workflow-index">{index + 1}</span>
						{label}
					</a>
				{/each}
			</nav>
		</div>
	</aside>

	<main class="content-panel">
		{#if $vaultStatus.message}
			<div class="save-toast">{$vaultStatus.message}</div>
		{/if}
		{@render children()}
	</main>
</div>
