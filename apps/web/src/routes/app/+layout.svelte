<script lang="ts">
	import AppShell from '$lib/components/AppShell.svelte';
	import { onMount } from 'svelte';
	import { refreshVaultStatus } from '$lib/app-data';

	let { children } = $props();

	onMount(() => {
		refreshVaultStatus();
	});
</script>

<AppShell>
	{@render children()}
</AppShell>
