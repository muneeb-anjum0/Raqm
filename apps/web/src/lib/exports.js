import ExcelJS from 'exceljs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { createChecklist, createIrisMapping, formatPkr } from '$lib/tax-engine';

export async function exportPdf(data) {
	const result = ensureResult(data);
	const pdf = await PDFDocument.create();
	const page = pdf.addPage([595, 842]);
	const font = await pdf.embedFont(StandardFonts.Helvetica);
	const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
	let y = 790;
	page.drawText('Raqm Tax Preparation Summary', { x: 48, y, size: 18, font: bold, color: rgb(0.105, 0.227, 0.361) });
	y -= 28;
	for (const line of reportLines(data, result)) {
		if (y < 60) break;
		page.drawText(line, { x: 48, y, size: 10.5, font, color: rgb(0.118, 0.165, 0.208) });
		y -= 18;
	}
	const bytes = await pdf.save();
	return new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)], {
		type: 'application/pdf'
	});
}

export async function exportXlsx(data) {
	const result = ensureResult(data);
	const workbook = new ExcelJS.Workbook();
	workbook.creator = 'Raqm';
	const summary = workbook.addWorksheet('Summary');
	summary.columns = [
		{ header: 'Field', key: 'field', width: 34 },
		{ header: 'Value', key: 'value', width: 28 },
		{ header: 'Notes', key: 'notes', width: 50 }
	];
	for (const mapping of createIrisMapping(data, result)) summary.addRow(mapping);
	const checklist = workbook.addWorksheet('Checklist');
	checklist.columns = [
		{ header: 'Title', key: 'title', width: 34 },
		{ header: 'Status', key: 'status', width: 16 },
		{ header: 'Description', key: 'description', width: 60 }
	];
	for (const item of createChecklist(data, result)) checklist.addRow(item);
	const buffer = await workbook.xlsx.writeBuffer();
	return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function exportCsv(data) {
	const result = ensureResult(data);
	const rows = [
		['Raqm Tax Preparation Summary'],
		['Generated date', new Date().toISOString()],
		['Tax year', result.taxYear],
		['Rule pack', result.rulePackVersion],
		['Annual salary', result.annualSalary],
		['Gross tax', result.grossTax],
		['Employer withholding', result.withholdingPaid],
		['Bank tax', result.bankTaxPaid],
		['Estimated payable', result.estimatedPayable],
		['Estimated refund', result.estimatedRefund],
		[],
		['Disclaimer', 'Raqm prepares a local summary and does not submit your return to FBR.']
	];
	return new Blob([rows.map((row) => row.map(csvCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
}

export function safeReportFilename(taxYear, extension) {
	return `raqm-tax-summary-${taxYear}.${extension}`;
}

export function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

function ensureResult(data) {
	if (data.calculationResults) return data.calculationResults;
	throw new Error('Run calculation before exporting reports.');
}

function reportLines(data, result) {
	return [
		`Tax year: ${result.taxYear}`,
		`Rule pack: ${result.rulePackVersion}`,
		`Generated: ${new Date(result.generatedAt).toLocaleString()}`,
		`Annual salary: PKR ${formatPkr(result.annualSalary)}`,
		`Gross tax: PKR ${formatPkr(result.grossTax)}`,
		`Employer withholding: PKR ${formatPkr(result.withholdingPaid)}`,
		`Bank profit: PKR ${formatPkr(data.bankProfit.profitAmount)}`,
		`Bank tax deducted: PKR ${formatPkr(result.bankTaxPaid)}`,
		`Estimated payable: PKR ${formatPkr(result.estimatedPayable)}`,
		`Estimated refund: PKR ${formatPkr(result.estimatedRefund)}`,
		`Assets total: PKR ${formatPkr(data.assets.cash + data.assets.bankBalance + data.assets.vehicle + data.assets.property + data.assets.investments + data.assets.other)}`,
		`Liabilities total: PKR ${formatPkr(data.liabilities.loans + data.liabilities.creditCardPayable + data.liabilities.personalPayable + data.liabilities.other)}`,
		'Use this summary while preparing your return on FBR Iris.',
		'Raqm does not submit your return to FBR.',
		'Disclaimer: Verify details before filing or consult a qualified tax professional for complex cases.'
	];
}

function csvCell(value) {
	return `"${String(value ?? '').replaceAll('"', '""')}"`;
}
