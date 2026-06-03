export interface CompanyLegalInfo {
  legalNameEn: string;
  legalNameAr?: string;
  vatNumber: string;
  crNumber?: string;
  taxRegistrationNumber?: string;
  businessActivity?: string;
  companyAddress?: string;
  buildingNumber?: string;
  streetName?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  country: string;
  contactPerson?: string;
  phoneNumber?: string;
  emailAddress?: string;
  companyLogo?: string;
}

export interface ZatcaIntegration {
  environment: "sandbox" | "production";
  vatNumber: string;
  organizationIdentifier?: string;
  egsSerialNumber?: string;
  deviceUuid?: string;
  hasOtp: boolean;
  hasCsr: boolean;
  hasCertificate: boolean;
  hasPrivateKey: boolean;
  hasPublicKey: boolean;
  hasComplianceCsid: boolean;
  hasProductionCsid: boolean;
  hasAccessToken: boolean;
  hasSecretToken: boolean;
  officialResources: OfficialResource[];
}

export interface OfficialResource {
  label: string;
  url: string;
}

export interface ZatcaInvoiceStatusRow {
  id: number;
  invoiceId: number;
  invoiceUuid?: string;
  invoiceCounter: number;
  invoiceHash?: string;
  status: string;
  errorCode?: string;
  errorMessage?: string;
  updatedAt: string;
}

export interface ZatcaApiLog {
  id: number;
  invoiceId?: number;
  action: string;
  environment: string;
  endpoint?: string;
  requestPayload?: any;
  responsePayload?: any;
  httpStatus?: number;
  status: string;
  errorCode?: string;
  errorMessage?: string;
  ipAddress?: string;
  userId?: number;
  createdAt: string;
}

export interface ZatcaStatusReport {
  rows: ZatcaInvoiceStatusRow[];
  logs: ZatcaApiLog[];
}

export interface ZatcaDashboardData {
  totalInvoices: number;
  clearedInvoices: number;
  pendingInvoices: number;
  failedInvoices: number;
  vatSummary: number;
  apiStatus: string;
  certificateExpiryWarning: string;
}

export interface WizardStep {
  step: number;
  label: string;
  complete: boolean;
}

export type InvoiceMode = "standard" | "simplified";

export interface InvoicePackage {
  invoiceId: number;
  invoiceUuid: string;
  invoiceCounter: number;
  invoiceHash: string;
}

export const ZATCA_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  signed: "Signed",
  pending: "Pending",
  submitted: "Submitted",
  cleared: "Cleared",
  reported: "Reported",
  rejected: "Rejected",
  failed: "Failed",
};

export const ZATCA_STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  signed: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  submitted: "bg-cyan-100 text-cyan-700",
  cleared: "bg-emerald-100 text-emerald-700",
  reported: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  failed: "bg-rose-100 text-rose-700",
};

export const OFFICIAL_LINKS: OfficialResource[] = [
  { label: "Official ZATCA Portal", url: "https://zatca.gov.sa" },
  { label: "Developer Portal", url: "https://zatca.gov.sa/en/E-Invoicing/SystemsDevelopers" },
  { label: "E-Invoicing Guidelines", url: "https://zatca.gov.sa/en/E-Invoicing" },
  { label: "SDK & Technical Documentation", url: "https://zatca1.discourse.group" },
];
