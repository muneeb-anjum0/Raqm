<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import MoneyInput from '$lib/components/MoneyInput.svelte';
	import { raqmData, updateData, vaultStatus } from '$lib/app-data';
</script>

<PageHeader
	title="Employer withholding"
	description="Record tax deducted by your employer and whether the certificate is available."
/>
{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<form class="card grid gap-4 p-6" onchange={() => updateData(() => $raqmData)}>
		<MoneyInput label="Annual employer tax deducted" bind:value={$raqmData.withholding.employerTaxDeducted} />
		<label class="flex items-center gap-3 font-bold"
			><input type="checkbox" bind:checked={$raqmData.withholding.certificateAvailable} /> Certificate available</label
		>
		<a class="btn btn-primary w-fit" href="/app/bank-profit">Continue</a>
	</form>
{/if}
