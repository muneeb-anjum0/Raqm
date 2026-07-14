<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LockedNotice from '$lib/components/LockedNotice.svelte';
	import { raqmData, vaultStatus } from '$lib/app-data';
	import { downloadBlob, exportCsv, exportPdf, exportXlsx, safeReportFilename } from '$lib/exports';
	let error = '';
	async function run(type) {
		error = '';
		try {
			const taxYear = $raqmData.calculationResults?.taxYear ?? '2026';
			const blob =
				type === 'pdf'
					? await exportPdf($raqmData)
					: type === 'xlsx'
						? await exportXlsx($raqmData)
						: exportCsv($raqmData);
			downloadBlob(blob, safeReportFilename(taxYear, type));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Export failed.';
		}
	}
</script>

<PageHeader
	title="Reports"
	description="Export local PDF, Excel, and CSV summaries. Report data is not sent to a backend."
/>
{#if !$vaultStatus.isUnlocked}
	<LockedNotice />
{:else}
	<section class="card p-5">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div>
				<p class="eyebrow">Local exports</p>
				<h2 class="text-xl font-bold">Generate a filing handoff.</h2>
				<p class="mt-2 text-sm leading-6 text-raqm-muted">Generated locally with rule pack metadata and date.</p>
			</div>
		</div>
		<div class="mt-4 flex flex-wrap gap-2">
			<button class="btn btn-primary" type="button" onclick={() => run('pdf')}>Export PDF</button>
			<button class="btn btn-secondary" type="button" onclick={() => run('xlsx')}>Export Excel</button>
			<button class="btn btn-secondary" type="button" onclick={() => run('csv')}>Export CSV</button>
		</div>
		{#if error}<p class="mt-4 rounded-lg bg-red-50 p-3 font-bold text-raqm-danger">{error}</p>{/if}
		<p class="mt-4 rounded-xl border border-raqm-border bg-raqm-background p-3 text-sm leading-6 text-raqm-muted">
			Reports include the title, tax year, rule pack version, calculation summary, income, withholding, bank profit,
			assets, liabilities, checklist, disclaimer, and generated date.
		</p>
	</section>
{/if}
