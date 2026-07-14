<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, vaultStatus } from '$lib/app-data';
	import { createChecklist } from '$lib/tax-engine';
</script>

<PageHeader
	title="Filing Checklist"
	description="A dynamic checklist based on missing documents, entered data, and rule-engine warnings."
/>

{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<div class="grid gap-3">
		{#each createChecklist($raqmData, $raqmData.calculationResults) as item}
			<article class="card p-5">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h2 class="text-lg font-bold">{item.title}</h2>
						<p class="mt-1 text-sm leading-6 text-raqm-muted">{item.description}</p>
					</div>
					<span class="status-pill capitalize">{item.status}</span>
				</div>
			</article>
		{/each}
	</div>
{/if}
