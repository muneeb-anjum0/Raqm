import { describe, expect, it } from 'vitest';
import { calculateTax } from '$lib/tax-engine';
import { defaultRaqmData } from '$lib/validation';

function input(overrides = {}) {
	return {
		...structuredClone(defaultRaqmData),
		...overrides
	};
}

describe('Pakistan salaried tax engine', () => {
	it('returns zero tax below taxable threshold', () => {
		const result = calculateTax(
			input({ income: { monthlySalary: 40_000, annualSalary: 0, bonus: 0, otherTaxableSalary: 0 } })
		);
		expect(result.grossTax).toBe(0);
	});

	it('handles salary exactly at slab boundary', () => {
		const result = calculateTax(
			input({
				profile: { ...input().profile, salaryMode: 'annual' },
				income: { annualSalary: 1_200_000, monthlySalary: 0, bonus: 0, otherTaxableSalary: 0 }
			})
		);
		expect(result.grossTax).toBe(30_000);
	});

	it('handles salary inside slab', () => {
		const result = calculateTax(
			input({
				profile: { ...input().profile, salaryMode: 'annual' },
				income: { annualSalary: 1_800_000, monthlySalary: 0, bonus: 0, otherTaxableSalary: 0 }
			})
		);
		expect(result.grossTax).toBe(120_000);
		expect(result.slabBreakdown[0].ruleId).toBe('PK-TY2026-SAL-003');
	});

	it('handles salary above highest slab', () => {
		const result = calculateTax(
			input({
				profile: { ...input().profile, salaryMode: 'annual' },
				income: { annualSalary: 5_000_000, monthlySalary: 0, bonus: 0, otherTaxableSalary: 0 }
			})
		);
		expect(result.grossTax).toBe(1_015_000);
	});

	it('returns refund when withholding exceeds gross tax', () => {
		const result = calculateTax(
			input({
				income: { monthlySalary: 150_000, annualSalary: 0, bonus: 0, otherTaxableSalary: 0 },
				withholding: { employerTaxDeducted: 200_000, certificateAvailable: true }
			})
		);
		expect(result.estimatedRefund).toBeGreaterThan(0);
	});

	it('returns payable when withholding is less than gross tax', () => {
		const result = calculateTax(
			input({
				income: { monthlySalary: 150_000, annualSalary: 0, bonus: 0, otherTaxableSalary: 0 },
				withholding: { employerTaxDeducted: 20_000, certificateAvailable: true }
			})
		);
		expect(result.estimatedPayable).toBeGreaterThan(0);
	});

	it('includes bank tax as adjustable withholding', () => {
		const result = calculateTax(
			input({
				income: { monthlySalary: 100_000, annualSalary: 0, bonus: 0, otherTaxableSalary: 0 },
				bankProfit: { bankName: '', profitAmount: 10_000, taxDeducted: 1_500, certificateAvailable: true }
			})
		);
		expect(result.totalAdjustableTaxPaid).toBe(result.withholdingPaid + 1_500);
	});

	it('rejects negative input safely', () => {
		const result = calculateTax(input({ withholding: { employerTaxDeducted: -1, certificateAvailable: false } }));
		expect(result.missingFields.length).toBeGreaterThan(0);
	});

	it('detects missing required salary fields', () => {
		const result = calculateTax(input());
		expect(result.missingFields).toContain('income.salary');
	});

	it('audit trail contains rule IDs', () => {
		const result = calculateTax(
			input({ income: { monthlySalary: 100_000, annualSalary: 0, bonus: 0, otherTaxableSalary: 0 } })
		);
		expect(result.auditTrail.every((entry) => entry.ruleId)).toBe(true);
	});

	it('does not mutate input', () => {
		const source = input({ income: { monthlySalary: 100_000, annualSalary: 0, bonus: 0, otherTaxableSalary: 0 } });
		const before = structuredClone(source);
		calculateTax(source);
		expect(source).toEqual(before);
	});
});
