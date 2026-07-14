import { describe, expect, it } from 'vitest';
import { bankProfitSchema, incomeSchema, profileSchema, suspiciousWarnings } from '$lib/validation';

describe('validation schemas', () => {
	it('negative amounts fail', () => {
		expect(bankProfitSchema.safeParse({ profitAmount: -1, taxDeducted: 0, certificateAvailable: false }).success).toBe(
			false
		);
	});

	it('empty required salary fields fail', () => {
		expect(incomeSchema.safeParse({ monthlySalary: 0, annualSalary: 0, bonus: 0, otherTaxableSalary: 0 }).success).toBe(
			false
		);
	});

	it('optional fields behave properly', () => {
		expect(
			bankProfitSchema.safeParse({ bankName: '', profitAmount: 0, taxDeducted: 0, certificateAvailable: false }).success
		).toBe(true);
	});

	it('suspicious large values produce warnings', () => {
		expect(suspiciousWarnings({ salary: 600_000_000 })).toHaveLength(1);
	});

	it('invalid tax year fails', () => {
		expect(
			profileSchema.safeParse({
				taxYear: '2025',
				filerType: 'salaried',
				employmentType: 'full-time',
				salaryMode: 'monthly',
				reviewed: false
			}).success
		).toBe(false);
	});

	it('unsupported filer type is blocked', () => {
		expect(
			profileSchema.safeParse({
				taxYear: '2026',
				filerType: 'business',
				employmentType: 'full-time',
				salaryMode: 'monthly',
				reviewed: false
			}).success
		).toBe(false);
	});
});
