<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import MoneyInput from '$lib/components/MoneyInput.svelte';
	import { raqmData, updateData, vaultStatus } from '$lib/app-data';
</script>

<PageHeader title="Assets" description="Prepare basic asset totals for Iris review." />
{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<form class="card grid gap-4 p-5 md:grid-cols-2" onchange={() => updateData(() => $raqmData)}>
		<div class="md:col-span-2">
			<p class="eyebrow">Asset statement</p>
			<h2 class="text-xl font-bold">Build a clean asset snapshot.</h2>
		</div>
		<MoneyInput label="Cash" bind:value={$raqmData.assets.cash} />
		<MoneyInput label="Bank balance" bind:value={$raqmData.assets.bankBalance} />
		<MoneyInput label="Vehicle" bind:value={$raqmData.assets.vehicle} />
		<MoneyInput label="Property" bind:value={$raqmData.assets.property} />
		<MoneyInput label="Investments" bind:value={$raqmData.assets.investments} />
		<MoneyInput label="Other assets" bind:value={$raqmData.assets.other} />
		<label class="flex items-center gap-3 text-sm font-bold"
			><input type="checkbox" bind:checked={$raqmData.assets.statementAvailable} /> Asset statement reviewed</label
		>
		<a class="btn btn-primary w-fit" href="/app/liabilities">Continue</a>
	</form>
{/if}
