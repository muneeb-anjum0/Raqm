<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import MoneyInput from '$lib/components/MoneyInput.svelte';
	import { raqmData, updateData, vaultStatus } from '$lib/app-data';
</script>

<PageHeader title="Bank profit" description="Enter profit on bank deposits and tax deducted, if applicable." />
{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<form class="card grid gap-4 p-6 md:grid-cols-2" onchange={() => updateData(() => $raqmData)}>
		<label class="field"
			><span class="label">Bank name (optional)</span><input
				class="input"
				bind:value={$raqmData.bankProfit.bankName}
			/></label
		>
		<MoneyInput label="Profit amount" bind:value={$raqmData.bankProfit.profitAmount} />
		<MoneyInput label="Tax deducted by bank" bind:value={$raqmData.bankProfit.taxDeducted} />
		<label class="flex items-center gap-3 font-bold"
			><input type="checkbox" bind:checked={$raqmData.bankProfit.certificateAvailable} /> Certificate available</label
		>
		<a class="btn btn-primary w-fit" href="/app/assets">Continue</a>
	</form>
{/if}
