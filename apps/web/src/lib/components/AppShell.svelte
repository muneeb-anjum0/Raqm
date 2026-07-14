<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Home, Lock, Settings, Shield, Sparkles } from '@lucide/svelte';
	import { lockVault } from '$lib/crypto-vault';
	import { raqmData, vaultStatus } from '$lib/app-data';
	import Dock from '$lib/components/Dock.svelte';

	let { children } = $props();

	const dockItems = [
		['/hub', 'Hub', Sparkles],
		['/app', 'Home', Home],
		['/app/rules', 'Rules', Shield],
		['/app/privacy', 'Privacy', Shield],
		['/app/settings', 'Settings', Settings]
	];

	function isActive(href) {
		return $page.url.pathname === href;
	}

	function doLock() {
		lockVault();
		vaultStatus.update((state) => ({ ...state, isUnlocked: false, message: 'Vault locked manually.' }));
		goto('/app#vault');
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
			</div>
		</div>
	</header>

	<main class="content-panel">
		{#if $vaultStatus.message}
			<div class="save-toast">{$vaultStatus.message}</div>
		{/if}
		{@render children()}
	</main>

	<Dock
		items={[
			...dockItems.map(([href, label, icon]) => ({
				href,
				label,
				icon,
				className: isActive(href) ? 'active' : ''
			})),
			{
				label: 'Lock',
				icon: Lock,
				onClick: doLock,
				className: $vaultStatus.isUnlocked ? '' : 'disabled-look'
			}
		]}
	/>
</div>
