import { z } from 'zod';

const amount = z.coerce.number().min(0, 'Amount cannot be negative').max(1_000_000_000_000);
const optionalAmount = z.coerce.number().min(0, 'Amount cannot be negative').optional();

export const profileSchema = z.object({
	name: z.string().max(120).optional().or(z.literal('')),
	taxYear: z.literal('2026'),
	filerType: z.literal('salaried', {
		error: 'Only salaried filer mode is available in the MVP'
	}),
	employmentType: z.enum(['full-time', 'part-time', 'contract']),
	salaryMode: z.enum(['monthly', 'annual']),
	reviewed: z.boolean()
});

export const incomeSchema = z
	.object({
		monthlySalary: optionalAmount,
		annualSalary: optionalAmount,
		bonus: optionalAmount.default(0),
		otherTaxableSalary: optionalAmount.default(0)
	})
	.superRefine((value, ctx) => {
		if (!value.monthlySalary && !value.annualSalary) {
			ctx.addIssue({
				code: 'custom',
				message: 'Enter either monthly salary or annual salary',
				path: ['annualSalary']
			});
		}
	});

export const withholdingSchema = z.object({
	employerTaxDeducted: amount,
	certificateAvailable: z.boolean(),
	monthlyBreakdown: z.array(amount).max(12).optional()
});

export const bankProfitSchema = z.object({
	bankName: z.string().max(120).optional().or(z.literal('')),
	profitAmount: amount,
	taxDeducted: amount,
	certificateAvailable: z.boolean()
});

export const assetsSchema = z.object({
	cash: amount,
	bankBalance: amount,
	vehicle: amount,
	property: amount,
	investments: amount,
	other: amount,
	statementAvailable: z.boolean()
});

export const liabilitiesSchema = z.object({
	loans: amount,
	creditCardPayable: amount,
	personalPayable: amount,
	other: amount
});

export const taxInputSchema = z.object({
	profile: profileSchema,
	income: incomeSchema,
	withholding: withholdingSchema,
	bankProfit: bankProfitSchema,
	assets: assetsSchema,
	liabilities: liabilitiesSchema
});

export const defaultRaqmData = {
	profile: {
		name: '',
		taxYear: '2026',
		filerType: 'salaried',
		employmentType: 'full-time',
		salaryMode: 'monthly',
		reviewed: false
	},
	income: {
		monthlySalary: 0,
		annualSalary: 0,
		bonus: 0,
		otherTaxableSalary: 0
	},
	withholding: {
		employerTaxDeducted: 0,
		certificateAvailable: false
	},
	bankProfit: {
		bankName: '',
		profitAmount: 0,
		taxDeducted: 0,
		certificateAvailable: false
	},
	assets: {
		cash: 0,
		bankBalance: 0,
		vehicle: 0,
		property: 0,
		investments: 0,
		other: 0,
		statementAvailable: false
	},
	liabilities: {
		loans: 0,
		creditCardPayable: 0,
		personalPayable: 0,
		other: 0
	}
};

export function suspiciousWarnings(values) {
	return Object.entries(values)
		.filter(([, value]) => value > 500_000_000)
		.map(([key]) => `${key} looks unusually large. Please review it before filing.`);
}
