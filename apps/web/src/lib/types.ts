export type TaxYear = '2026';
export type FilerType = 'salaried' | 'freelancer' | 'business' | 'landlord' | 'investor';

export type UserProfile = {
	name?: string;
	taxYear: TaxYear;
	filerType: FilerType;
	employmentType: 'full-time' | 'part-time' | 'contract';
	salaryMode: 'monthly' | 'annual';
	reviewed: boolean;
};

export type SalaryIncome = {
	monthlySalary: number;
	annualSalary: number;
	bonus: number;
	otherTaxableSalary: number;
};

export type WithholdingEntry = {
	employerTaxDeducted: number;
	certificateAvailable: boolean;
	monthlyBreakdown?: number[];
};

export type BankProfitEntry = {
	bankName?: string;
	profitAmount: number;
	taxDeducted: number;
	certificateAvailable: boolean;
};

export type AssetEntry = {
	cash: number;
	bankBalance: number;
	vehicle: number;
	property: number;
	investments: number;
	other: number;
	statementAvailable: boolean;
};

export type LiabilityEntry = {
	loans: number;
	creditCardPayable: number;
	personalPayable: number;
	other: number;
};

export type TaxInput = {
	profile: UserProfile;
	income: SalaryIncome;
	withholding: WithholdingEntry;
	bankProfit: BankProfitEntry;
	assets: AssetEntry;
	liabilities: LiabilityEntry;
};

export type TaxBreakdown = {
	ruleId: string;
	label: string;
	lowerBound: number;
	upperBound: number | null;
	rate: number;
	baseTax: number;
	taxableAmountInSlab: number;
	taxForSlab: number;
};

export type AuditTrailItem = {
	ruleId: string;
	message: string;
	inputs: Record<string, unknown>;
	output: Record<string, unknown>;
};

export type TaxCalculationResult = {
	taxYear: string;
	country: 'PK';
	filerType: 'salaried';
	annualSalary: number;
	taxableIncome: number;
	grossTax: number;
	withholdingPaid: number;
	bankTaxPaid: number;
	totalAdjustableTaxPaid: number;
	estimatedPayable: number;
	estimatedRefund: number;
	slabBreakdown: TaxBreakdown[];
	warnings: string[];
	missingFields: string[];
	auditTrail: AuditTrailItem[];
	rulePackVersion: string;
	generatedAt: string;
};

export type IrisFieldMapping = {
	label: string;
	value: string | number;
	notes: string;
};

export type FilingChecklistItem = {
	id: string;
	title: string;
	description: string;
	status: 'missing' | 'ready' | 'optional' | 'warning';
	source: 'profile' | 'income' | 'withholding' | 'bank-profit' | 'assets' | 'liabilities' | 'rules-engine';
};

export type ExportReport = {
	filename: string;
	mimeType: string;
	createdAt: string;
};

export type RulePackManifest = {
	id: string;
	taxYear: TaxYear;
	version: string;
	country: 'PK';
	status: 'verified' | 'verification-required';
	lastVerified: string;
	effectiveFrom: string;
	checksum: string;
	sources: RuleSource[];
};

export type RuleSource = {
	label: string;
	url?: string;
	lastChecked: string;
	notes: string;
};

export type VaultState = {
	isReady: boolean;
	isUnlocked: boolean;
	hasVault: boolean;
	lastUnlockedAt?: string;
	autoLockMinutes: number;
};

export type EncryptedRecord = {
	id: string;
	collection: string;
	iv: string;
	saltVersion: string;
	ciphertext: string;
	createdAt: string;
	updatedAt: string;
};

export type RaqmData = {
	profile: UserProfile;
	income: SalaryIncome;
	withholding: WithholdingEntry;
	bankProfit: BankProfitEntry;
	assets: AssetEntry;
	liabilities: LiabilityEntry;
	calculationResults?: TaxCalculationResult;
};
