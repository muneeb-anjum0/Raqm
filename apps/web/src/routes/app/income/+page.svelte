<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import MoneyInput from '$lib/components/MoneyInput.svelte';
	import { raqmData, updateData, vaultStatus } from '$lib/app-data';
</script>

<PageHeader
	title="Income"
	description="Enter salary income manually from your salary certificate or payroll records."
/>

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<form class="card grid gap-4 p-6 md:grid-cols-2" onchange={() => updateData(() => $raqmData)}>
		<MoneyInput
			label="Monthly salary"
			bind:value={$raqmData.income.monthlySalary}
			hint="Used when setup salary mode is monthly."
		/>
		<MoneyInput
			label="Annual salary"
			bind:value={$raqmData.income.annualSalary}
			hint="Used when setup salary mode is annual."
		/>
		<MoneyInput label="Bonus (optional)" bind:value={$raqmData.income.bonus} />
		<MoneyInput label="Other taxable salary components (optional)" bind:value={$raqmData.income.otherTaxableSalary} />
		<a class="btn btn-primary w-fit" href="/app/withholding">Continue</a>
	</form>
{/if}
