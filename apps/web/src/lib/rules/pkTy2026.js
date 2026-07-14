export const pkTy2026Manifest = {
	id: 'PK-TY2026',
	taxYear: '2026',
	version: '0.1.0-placeholder',
	country: 'PK',
	status: 'verification-required',
	lastVerified: 'Not manually verified',
	effectiveFrom: '2025-07-01',
	checksum: 'sha256-placeholder-pending-controlled-rule-release',
	sources: [
		{
			label: 'FBR income tax guidance and Finance Act references',
			url: 'https://www.fbr.gov.pk/',
			lastChecked: 'Not checked in this MVP build',
			notes: 'Rule values are placeholders and must be verified by a maintainer before production filing reliance.'
		}
	]
};

export const salariedSlabs = [
	{
		ruleId: 'PK-TY2026-SAL-001',
		label: 'Up to PKR 600,000',
		lowerBound: 0,
		upperBound: 600_000,
		rate: 0,
		baseTax: 0
	},
	{
		ruleId: 'PK-TY2026-SAL-002',
		label: 'PKR 600,001 to PKR 1,200,000',
		lowerBound: 600_000,
		upperBound: 1_200_000,
		rate: 0.05,
		baseTax: 0
	},
	{
		ruleId: 'PK-TY2026-SAL-003',
		label: 'PKR 1,200,001 to PKR 2,200,000',
		lowerBound: 1_200_000,
		upperBound: 2_200_000,
		rate: 0.15,
		baseTax: 30_000
	},
	{
		ruleId: 'PK-TY2026-SAL-004',
		label: 'PKR 2,200,001 to PKR 3,200,000',
		lowerBound: 2_200_000,
		upperBound: 3_200_000,
		rate: 0.25,
		baseTax: 180_000
	},
	{
		ruleId: 'PK-TY2026-SAL-005',
		label: 'PKR 3,200,001 to PKR 4,100,000',
		lowerBound: 3_200_000,
		upperBound: 4_100_000,
		rate: 0.3,
		baseTax: 430_000
	},
	{
		ruleId: 'PK-TY2026-SAL-006',
		label: 'Above PKR 4,100,000',
		lowerBound: 4_100_000,
		upperBound: null,
		rate: 0.35,
		baseTax: 700_000
	}
];
