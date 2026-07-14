import { get, writable } from 'svelte/store';
import { defaultRaqmData } from '$lib/validation';
import { calculateTax } from '$lib/tax-engine';
import { hasVault, isVaultUnlocked, loadCollection, saveCollection } from '$lib/crypto-vault';

export const raqmData = writable(structuredClone(defaultRaqmData));
export const vaultStatus = writable({
	hasVault: false,
	isUnlocked: false,
	autoLockMinutes: 15,
	message: ''
});

let autoLockTimer = null;

export async function refreshVaultStatus() {
	vaultStatus.update((state) => ({
		...state,
		hasVault: false
	}));
	const exists = await hasVault();
	vaultStatus.update((state) => ({ ...state, hasVault: exists, isUnlocked: isVaultUnlocked() }));
}

export async function loadVaultData() {
	if (!isVaultUnlocked()) throw new Error('Vault is locked.');
	const loaded = await loadCollection('raqmData', structuredClone(defaultRaqmData));
	raqmData.set({ ...structuredClone(defaultRaqmData), ...loaded });
	vaultStatus.update((state) => ({
		...state,
		isUnlocked: true,
		message: 'Vault unlocked. Data stays on this device.'
	}));
	resetAutoLock();
}

export async function persistData() {
	if (!isVaultUnlocked()) return;
	await saveCollection('raqmData', get(raqmData));
	vaultStatus.update((state) => ({ ...state, message: `Saved locally at ${new Date().toLocaleTimeString()}` }));
	resetAutoLock();
}

export async function updateData(mutator) {
	raqmData.update((current) => mutator(structuredClone(current)));
	await persistData();
}

export async function runCalculation() {
	const current = get(raqmData);
	const calculationResults = calculateTax(current);
	raqmData.set({ ...current, calculationResults });
	await persistData();
	return calculationResults;
}

export function resetAutoLock() {
	if (autoLockTimer) clearTimeout(autoLockTimer);
	autoLockTimer = setTimeout(
		() => {
			import('$lib/crypto-vault').then(({ lockVault }) => {
				lockVault();
				vaultStatus.update((state) => ({
					...state,
					isUnlocked: false,
					message: 'Vault auto-locked after inactivity.'
				}));
			});
		},
		15 * 60 * 1000
	);
}
