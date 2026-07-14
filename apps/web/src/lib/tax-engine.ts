import { type FilingChecklistItem, type IrisFieldMapping, type TaxCalculationResult, type TaxInput } from '$lib/types';
import { taxInputSchema } from '$lib/validation';
import { pkTy2026Manifest, salariedSlabs } from '$lib/rules/pkTy2026';

export function calculateAnnualSalary(input: TaxInput) {
	const salary =
		input.profile.salaryMode === 'monthly' ? (input.income.monthlySalary ?? 0) * 12 : (input.income.annualSalary ?? 0);
	return salary + (input.income.bonus ?? 0) + (input.income.otherTaxableSalary ?? 0);
}

export function calculateTax(input: TaxInput): TaxCalculationResult {
	const parsed = taxInputSchema.safeParse(structuredClone(input));
	if (!parsed.success) {
		return {
			taxYear: input.profile?.taxYear ?? '2026',
			country: 'PK',
			filerType: 'salaried',
			annualSalary: 0,
			taxableIncome: 0,
			grossTax: 0,
			withholdingPaid: 0,
			bankTaxPaid: 0,
			totalAdjustableTaxPaid: 0,
			estimatedPayable: 0,
			estimatedRefund: 0,
			slabBreakdown: [],
			warnings: ['Calculation could not run because required information is incomplete.'],
			missingFields: parsed.error.issues.map((issue) => {
				const path = issue.path.join('.');
				return path === 'income.annualSalary' ? 'income.salary' : path || issue.message;
			}),
			auditTrail: [
				{
					ruleId: 'PK-TY2026-VALIDATION',
					message: 'Input validation failed safely.',
					inputs: {},
					output: { issues: parsed.error.issues }
				}
			],
			rulePackVersion: pkTy2026Manifest.version,
			generatedAt: new Date().toISOString()
		};
	}

	const safeInput = parsed.data as TaxInput;
	const annualSalary = calculateAnnualSalary(safeInput);
	const taxableIncome = annualSalary;
	const matchedSlab =
		salariedSlabs.find(
			(slab) => taxableIncome > slab.lowerBound && (slab.upperBound === null || taxableIncome <= slab.upperBound)
		) ?? salariedSlabs[0];
	const taxableAmountInSlab = Math.max(0, taxableIncome - matchedSlab.lowerBound);
	const grossTax = Math.round(matchedSlab.baseTax + taxableAmountInSlab * matchedSlab.rate);
	const withholdingPaid = safeInput.withholding.employerTaxDeducted;
	const bankTaxPaid = safeInput.bankProfit.taxDeducted;
	const totalAdjustableTaxPaid = withholdingPaid + bankTaxPaid;
	const balance = grossTax - totalAdjustableTaxPaid;
	const warnings = createWarnings(safeInput, annualSalary);
	const missingFields = createMissingFields(safeInput);

	return {
		taxYear: safeInput.profile.taxYear,
		country: 'PK',
		filerType: 'salaried',
		annualSalary,
		taxableIncome,
		grossTax,
		withholdingPaid,
		bankTaxPaid,
		totalAdjustableTaxPaid,
		estimatedPayable: Math.max(0, balance),
		estimatedRefund: Math.max(0, -balance),
		slabBreakdown: [
			{
				...matchedSlab,
				taxableAmountInSlab,
				taxForSlab: grossTax
			}
		],
		warnings,
		missingFields,
		auditTrail: [
			{
				ruleId: 'PK-TY2026-INCOME-ANNUALIZE',
				message: 'Annual taxable salary income calculated from the selected salary mode.',
				inputs: { salaryMode: safeInput.profile.salaryMode, income: safeInput.income },
				output: { annualSalary, taxableIncome }
			},
			{
				ruleId: matchedSlab.ruleId,
				message: 'Salary slab applied from the selected Pakistan rule pack.',
				inputs: { taxableIncome },
				output: { grossTax, matchedSlab }
			},
			{
				ruleId: 'PK-TY2026-WHT-ADJUST',
				message: 'Employer and bank withholding treated as adjustable tax paid for MVP estimate.',
				inputs: { withholdingPaid, bankTaxPaid },
				output: { totalAdjustableTaxPaid, balance }
			}
		],
		rulePackVersion: pkTy2026Manifest.version,
		generatedAt: new Date().toISOString()
	};
}

export function createExplanation(result: TaxCalculationResult) {
	const balanceText =
		result.estimatedPayable > 0
			? `Your estimated remaining payable amount is PKR ${formatPkr(result.estimatedPayable)}.`
			: `Your estimated refund or excess adjustable amount is PKR ${formatPkr(result.estimatedRefund)}.`;
	return [
		`Your annual salary is PKR ${formatPkr(result.annualSalary)}. Raqm calculated your estimate using rule pack ${result.rulePackVersion}.`,
		`The gross salary tax estimate is PKR ${formatPkr(result.grossTax)}. Employer withholding is PKR ${formatPkr(result.withholdingPaid)} and bank tax is PKR ${formatPkr(result.bankTaxPaid)}.`,
		balanceText,
		'This is a preparation estimate based on the selected rule pack. Verify details before filing on FBR Iris or consult a qualified tax professional for complex cases.'
	];
}

export function createIrisMapping(input: TaxInput, result: TaxCalculationResult): IrisFieldMapping[] {
	return [
		{ label: 'Tax year', value: result.taxYear, notes: 'Confirm selected year in Iris.' },
		{ label: 'Salary income', value: result.annualSalary, notes: 'Use salary certificate values.' },
		{
			label: 'Tax deducted by employer',
			value: result.withholdingPaid,
			notes: 'Match employer withholding certificate.'
		},
		{
			label: 'Bank profit',
			value: input.bankProfit.profitAmount,
			notes: 'Enter if applicable in Iris income/withholding sections.'
		},
		{ label: 'Bank tax deducted', value: result.bankTaxPaid, notes: 'Use bank withholding certificate.' },
		{ label: 'Assets total', value: totalAssets(input), notes: 'Use the assets statement section.' },
		{ label: 'Liabilities total', value: totalLiabilities(input), notes: 'Use the liabilities section.' },
		{ label: 'Estimated payable', value: result.estimatedPayable, notes: 'Raqm does not submit payment or return.' },
		{ label: 'Estimated refund', value: result.estimatedRefund, notes: 'Verify in Iris before filing.' }
	];
}

export function createChecklist(input: TaxInput, result?: TaxCalculationResult): FilingChecklistItem[] {
	const items: FilingChecklistItem[] = [
		{
			id: 'salary-certificate',
			title: 'Salary certificate',
			description: 'Use your annual salary certificate to verify salary and taxable benefits.',
			status: calculateAnnualSalary(input) > 0 ? 'ready' : 'missing',
			source: 'income'
		},
		{
			id: 'employer-withholding',
			title: 'Employer withholding certificate',
			description: 'Keep evidence for tax deducted by employer.',
			status: input.withholding.certificateAvailable ? 'ready' : 'missing',
			source: 'withholding'
		},
		{
			id: 'bank-certificate',
			title: 'Bank withholding certificate',
			description: 'Needed when bank profit and tax deducted are included.',
			status: input.bankProfit.profitAmount > 0 && !input.bankProfit.certificateAvailable ? 'missing' : 'optional',
			source: 'bank-profit'
		},
		{
			id: 'asset-statement',
			title: 'Asset statement',
			description: 'Review cash, bank balances, property, vehicles, investments, and other assets.',
			status: input.assets.statementAvailable ? 'ready' : 'warning',
			source: 'assets'
		},
		{
			id: 'liability-details',
			title: 'Liability details',
			description: 'Confirm loans, card payable, and personal payables.',
			status: totalLiabilities(input) > 0 ? 'ready' : 'optional',
			source: 'liabilities'
		},
		{
			id: 'rule-status',
			title: 'Review tax rule status',
			description: 'This MVP rule pack is marked verification required.',
			status: pkTy2026Manifest.status === 'verified' ? 'ready' : 'warning',
			source: 'rules-engine'
		}
	];
	if (result?.estimatedPayable) {
		items.push({
			id: 'payable-review',
			title: 'Review payable before Iris submission',
			description: 'Confirm challan/payment handling directly in Iris or with a professional.',
			status: 'warning',
			source: 'rules-engine'
		});
	}
	return items;
}

export function formatPkr(value: number) {
	return new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

function createWarnings(input: TaxInput, annualSalary: number) {
	const warnings: string[] = [];
	if (pkTy2026Manifest.status === 'verification-required') {
		warnings.push(
			'Rule Verification Required: rule values must be checked against official Pakistan tax sources before relying on the estimate.'
		);
	}
	if (!input.profile.reviewed) warnings.push('Review step is not marked complete.');
	if (!input.withholding.certificateAvailable) warnings.push('Employer withholding certificate is missing.');
	if (input.bankProfit.profitAmount > 0 && !input.bankProfit.certificateAvailable)
		warnings.push('Bank withholding certificate is missing.');
	if (!input.assets.statementAvailable) warnings.push('Asset statement is not confirmed.');
	if (annualSalary > 100_000_000) warnings.push('Annual salary looks unusually large. Please verify the number.');
	return warnings;
}

function createMissingFields(input: TaxInput) {
	const missing: string[] = [];
	if (calculateAnnualSalary(input) <= 0) missing.push('income.salary');
	if (!input.profile.taxYear) missing.push('profile.taxYear');
	if (input.profile.filerType !== 'salaried') missing.push('profile.filerType');
	return missing;
}

function totalAssets(input: TaxInput) {
	return (
		input.assets.cash +
		input.assets.bankBalance +
		input.assets.vehicle +
		input.assets.property +
		input.assets.investments +
		input.assets.other
	);
}

function totalLiabilities(input: TaxInput) {
	return (
		input.liabilities.loans +
		input.liabilities.creditCardPayable +
		input.liabilities.personalPayable +
		input.liabilities.other
	);
}
