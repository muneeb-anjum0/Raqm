import { beforeEach, describe, expect, it } from 'vitest';
import {
	createVault,
	encryptForTest,
	hasVault,
	loadCollection,
	panicWipe,
	saveCollection,
	unlockVault,
	vaultDb
} from '$lib/crypto-vault';

describe('crypto vault', () => {
	beforeEach(async () => {
		await panicWipe();
	});

	it('key derivation enables encryption/decryption round trip', async () => {
		await createVault('correct horse battery');
		await saveCollection('profile', { salary: 123 });
		await unlockVault('correct horse battery');
		await expect(loadCollection('profile', {})).resolves.toEqual({ salary: 123 });
	});

	it('different IV produces different ciphertext', async () => {
		const one = await encryptForTest({ value: 1 });
		const two = await encryptForTest({ value: 1 });
		expect(one.ciphertext).not.toBe(two.ciphertext);
		expect(one.iv).not.toBe(two.iv);
	});

	it('wrong password fails', async () => {
		await createVault('correct horse battery');
		await saveCollection('profile', { salary: 123 });
		await expect(unlockVault('wrong password')).rejects.toThrow();
	});

	it('sensitive data is not stored as plaintext', async () => {
		await createVault('correct horse battery');
		await saveCollection('income', { salary: 999_999 });
		const raw = JSON.stringify(await vaultDb.records.toArray());
		expect(raw).not.toContain('999999');
	});

	it('panic wipe clears encrypted records', async () => {
		await createVault('correct horse battery');
		await saveCollection('income', { salary: 1 });
		await panicWipe();
		expect(await hasVault()).toBe(false);
	});
});
