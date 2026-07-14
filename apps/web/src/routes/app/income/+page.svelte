<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import MoneyInput from '$lib/components/MoneyInput.svelte';
	import { raqmData, updateData, vaultStatus } from '$lib/app-data';
	import { calculateAnnualSalary, formatPkr } from '$lib/tax-engine';
</script>

<PageHeader
	title="Income"
	description="Enter salary income manually from your salary certificate or payroll records."
/>

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<form class="card grid gap-4 p-5 md:grid-cols-2" onchange={() => updateData(() => $raqmData)}>
		<div class="md:col-span-2">
			<p class="eyebrow">Salary income</p>
			<h2 class="text-xl font-bold">Enter the numbers from your salary certificate.</h2>
		</div>
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
		<div class="metric-card md:col-span-2">
			<p>Live annual salary preview</p>
			<strong>PKR {formatPkr(calculateAnnualSalary($raqmData))}</strong>
		</div>
		<a class="btn btn-primary w-fit" href="/app/withholding">Continue</a>
	</form>
{/if}
