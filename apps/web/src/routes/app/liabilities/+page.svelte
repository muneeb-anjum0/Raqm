<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import MoneyInput from '$lib/components/MoneyInput.svelte';
	import { raqmData, updateData, vaultStatus } from '$lib/app-data';
</script>

<PageHeader title="Liabilities" description="Record loans and payables for your Iris preparation summary." />
{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<form class="card grid gap-4 p-5 md:grid-cols-2" onchange={() => updateData(() => $raqmData)}>
		<div class="md:col-span-2">
			<p class="eyebrow">Payables</p>
			<h2 class="text-xl font-bold">Record loans and liabilities.</h2>
		</div>
		<MoneyInput label="Loans" bind:value={$raqmData.liabilities.loans} />
		<MoneyInput label="Credit card payable" bind:value={$raqmData.liabilities.creditCardPayable} />
		<MoneyInput label="Personal payable" bind:value={$raqmData.liabilities.personalPayable} />
		<MoneyInput label="Other liabilities" bind:value={$raqmData.liabilities.other} />
		<a class="btn btn-primary w-fit" href="/app/review">Continue</a>
	</form>
{/if}
