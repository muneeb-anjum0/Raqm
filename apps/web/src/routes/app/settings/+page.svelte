<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { lockVault } from '$lib/crypto-vault';
	import { vaultStatus } from '$lib/app-data';
	function doLock() {
		lockVault();
		vaultStatus.update((state) => ({ ...state, isUnlocked: false, message: 'Vault locked manually.' }));
	}
</script>

<PageHeader title="Settings" description="Manage local vault state and review MVP boundaries." />
{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<section class="card grid gap-4 p-5">
		<div>
			<p class="eyebrow">Local controls</p>
			<h2 class="text-xl font-bold">Auto-lock</h2>
			<p class="mt-1 text-sm leading-6 text-raqm-muted">
				The MVP auto-locks after 15 minutes of inactivity. Non-sensitive UI preferences may use localStorage in later
				releases; the current MVP stores financial records only in the encrypted vault.
			</p>
		</div>
		<button class="btn btn-secondary w-fit" type="button" onclick={doLock}>Lock vault now</button>
		<a class="btn btn-danger w-fit" href="/app">Panic wipe controls</a>
	</section>
{/if}
