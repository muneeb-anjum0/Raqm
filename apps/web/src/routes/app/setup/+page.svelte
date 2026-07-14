<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, updateData, vaultStatus } from '$lib/app-data';
</script>

<PageHeader title="Setup" description="Choose the tax year and MVP filer type. Later filer modes are shown." />

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<form class="card grid gap-4 p-6" onchange={() => updateData(() => $raqmData)}>
		<label class="field"
			><span class="label">Name (optional)</span><input class="input" bind:value={$raqmData.profile.name} /></label
		>
		<label class="field"
			><span class="label">Tax year</span><select class="input" bind:value={$raqmData.profile.taxYear}
				><option value="2026">2026</option></select
			></label
		>
		<label class="field"
			><span class="label">Filer type</span><select class="input" bind:value={$raqmData.profile.filerType}
				><option value="salaried">Salaried</option><option disabled>Freelancer - Coming later</option><option disabled
					>Business - Coming later</option
				><option disabled>Landlord - Coming later</option><option disabled>Investor - Coming later</option></select
			></label
		>
		<label class="field"
			><span class="label">Employment type</span><select class="input" bind:value={$raqmData.profile.employmentType}
				><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option
					value="contract">Contract</option
				></select
			></label
		>
		<label class="field"
			><span class="label">Salary mode</span><select class="input" bind:value={$raqmData.profile.salaryMode}
				><option value="monthly">Monthly salary</option><option value="annual">Annual salary</option></select
			></label
		>
		<a class="btn btn-primary w-fit" href="/app/income">Continue to income</a>
	</form>
{/if}
