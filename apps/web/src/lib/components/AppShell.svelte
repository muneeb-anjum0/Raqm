<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Home, Lock, Settings, Shield, Sparkles } from '@lucide/svelte';
	import { lockVault } from '$lib/crypto-vault';
	import { vaultStatus } from '$lib/app-data';
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
	<main class="content-panel">
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
