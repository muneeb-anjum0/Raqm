<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import {
		createVault,
		exportEncryptedBackup,
		hasVault,
		importEncryptedBackup,
		panicWipe,
		unlockVault
	} from '$lib/crypto-vault';
	import { loadVaultData, refreshVaultStatus, vaultStatus } from '$lib/app-data';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let password = '';
	let confirm = '';
	let exists = false;
	let error = '';
	let wipeConfirm = '';
	let hydrated = false;

	onMount(async () => {
		hydrated = true;
		exists = await hasVault();
		await refreshVaultStatus();
	});

	async function createOrUnlock() {
		error = '';
		try {
			if (!exists) {
				if (password !== confirm) throw new Error('Password confirmation does not match.');
				await createVault(password);
			} else {
				await unlockVault(password);
			}
			await loadVaultData();
			await refreshVaultStatus();
			goto('/app/setup');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Vault action failed.';
		}
	}

	async function backup() {
		const blob = new Blob([JSON.stringify(await exportEncryptedBackup(), null, 2)], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'raqm-encrypted-backup.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	async function importBackup(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		await importEncryptedBackup(JSON.parse(await file.text()));
		exists = await hasVault();
		await refreshVaultStatus();
	}

	async function wipe() {
		if (wipeConfirm !== 'WIPE RAQM') return;
		await panicWipe();
		password = '';
		confirm = '';
		wipeConfirm = '';
		exists = false;
		await refreshVaultStatus();
	}
</script>

<svelte:head><title>Vault | Raqm</title></svelte:head>

<PageHeader
	title="Encrypted local vault"
	description="Create or unlock the browser vault. Raqm never stores your password or raw encryption key."
/>

<div class="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
	<form class="card grid gap-4 p-6">
		<h2 class="text-xl font-black">{exists ? 'Unlock vault' : 'Create vault password'}</h2>
		<p class="text-sm text-raqm-muted">
			Lost passwords cannot be recovered because the decryption key is derived locally. Use at least 8 characters.
		</p>
		<label class="field">
			<span class="label">Vault password</span>
			<input class="input" type="password" bind:value={password} autocomplete="current-password" />
		</label>
		{#if !exists}
			<label class="field">
				<span class="label">Confirm password</span>
				<input class="input" type="password" bind:value={confirm} autocomplete="new-password" />
			</label>
		{/if}
		{#if error}<p class="rounded-lg bg-red-50 p-3 text-sm font-bold text-raqm-danger">{error}</p>{/if}
		<button class="btn btn-primary" type="button" disabled={!hydrated} onclick={createOrUnlock}
			>{exists ? 'Unlock vault' : 'Create encrypted vault'}</button
		>
	</form>

	<section class="card grid gap-4 p-6">
		<h2 class="text-xl font-black">Vault controls</h2>
		<p class="text-sm text-raqm-muted">
			Backup files remain encrypted. Import replaces the local vault metadata and records.
		</p>
		<button class="btn btn-secondary" type="button" disabled={!$vaultStatus.hasVault} onclick={backup}
			>Export encrypted backup</button
		>
		<label class="btn btn-secondary cursor-pointer">
			Import encrypted backup
			<input class="sr-only" type="file" accept="application/json" onchange={importBackup} />
		</label>
		<div class="rounded-lg border border-raqm-border p-4">
			<h3 class="font-black text-raqm-danger">Panic wipe</h3>
			<p class="mt-1 text-sm text-raqm-muted">Type WIPE RAQM to delete encrypted local records from this browser.</p>
			<input class="input mt-3" bind:value={wipeConfirm} />
			<button class="btn btn-danger mt-3 w-full" type="button" disabled={wipeConfirm !== 'WIPE RAQM'} onclick={wipe}
				>Panic wipe local data</button
			>
		</div>
	</section>
</div>
