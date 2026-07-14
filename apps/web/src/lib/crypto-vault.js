import Dexie from 'dexie';

class RaqmVaultDb extends Dexie {
	constructor() {
		super('raqm-vault');
		this.version(1).stores({
			records: 'id, collection, updatedAt',
			meta: 'id'
		});
	}
}

export const vaultDb = new RaqmVaultDb();

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const KDF_ITERATIONS = 250_000;
const activeSaltVersion = 'v1';

let activeKey = null;

export async function hasVault() {
	return Boolean(await vaultDb.meta.get('vault'));
}

export async function createVault(password) {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	await vaultDb.meta.put({
		id: 'vault',
		salt: bytesToBase64(salt),
		kdf: 'PBKDF2',
		iterations: KDF_ITERATIONS,
		createdAt: new Date().toISOString()
	});
	activeKey = await deriveKey(password, salt, KDF_ITERATIONS);
	return true;
}

export async function unlockVault(password) {
	const meta = await vaultDb.meta.get('vault');
	if (!meta) throw new Error('No local vault exists yet.');
	const key = await deriveKey(password, base64ToBytes(meta.salt), meta.iterations);
	const probe = await vaultDb.records.get('vault-probe');
	if (probe) await decryptRecord(probe, key);
	activeKey = key;
	return true;
}

export function lockVault() {
	activeKey = null;
}

export function isVaultUnlocked() {
	return Boolean(activeKey);
}

export async function saveCollection(collection, value) {
	if (!activeKey) throw new Error('Vault is locked.');
	const now = new Date().toISOString();
	const existing = await vaultDb.records.get(collection);
	const encrypted = await encryptValue(collection, value, activeKey, existing?.createdAt ?? now);
	await vaultDb.records.put(encrypted);
	if (!(await vaultDb.records.get('vault-probe'))) {
		await vaultDb.records.put(await encryptValue('vault-probe', { ok: true }, activeKey, now));
	}
}

export async function loadCollection(collection, fallback) {
	if (!activeKey) throw new Error('Vault is locked.');
	const record = await vaultDb.records.get(collection);
	if (!record) return fallback;
	return decryptRecord(record, activeKey);
}

export async function exportEncryptedBackup() {
	const [meta, records] = await Promise.all([vaultDb.meta.toArray(), vaultDb.records.toArray()]);
	return {
		format: 'raqm-encrypted-backup',
		version: 1,
		exportedAt: new Date().toISOString(),
		meta,
		records
	};
}

export async function importEncryptedBackup(backup) {
	if (!Array.isArray(backup?.meta) || !Array.isArray(backup?.records)) {
		throw new Error('Invalid backup file.');
	}
	await vaultDb.transaction('rw', vaultDb.meta, vaultDb.records, async () => {
		await vaultDb.meta.clear();
		await vaultDb.records.clear();
		await vaultDb.meta.bulkPut(backup.meta);
		await vaultDb.records.bulkPut(backup.records);
	});
	lockVault();
}

export async function panicWipe() {
	await vaultDb.delete();
	await vaultDb.open();
	activeKey = null;
}

export async function encryptForTest(value, password = 'test-password') {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const key = await deriveKey(password, salt, 10_000);
	return encryptValue('test', value, key, new Date().toISOString());
}

async function encryptValue(collection, value, key, createdAt) {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const plaintext = encoder.encode(JSON.stringify(value));
	const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
	const now = new Date().toISOString();
	return {
		id: collection,
		collection,
		iv: bytesToBase64(iv),
		saltVersion: activeSaltVersion,
		ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
		createdAt,
		updatedAt: now
	};
}

async function decryptRecord(record, key) {
	const plaintext = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: base64ToBytes(record.iv) },
		key,
		base64ToBytes(record.ciphertext)
	);
	return JSON.parse(decoder.decode(plaintext));
}

async function deriveKey(password, salt, iterations) {
	if (password.length < 8) throw new Error('Use at least 8 characters for the vault password.');
	const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: toArrayBuffer(salt),
			iterations,
			hash: 'SHA-256'
		},
		material,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

function bytesToBase64(bytes) {
	return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value) {
	return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

function toArrayBuffer(bytes) {
	return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}
