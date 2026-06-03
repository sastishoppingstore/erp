# ZATCA Phase 2 Integration Module

## Overview

Complete Saudi Arabia ZATCA (Fatoora Phase 2) E-Invoicing integration for the multi-tenant ERP system.

## Module Structure

```
build/zatca/
├── api/
│   └── zatcaRouter.ts          # (reference) Existing at api/zatcaRouter.ts
├── frontend/
│   ├── pages/
│   │   ├── CompanyLegalInfo.tsx    # Settings → Company Legal Information
│   │   ├── ZatcaIntegration.tsx    # Settings → ZATCA Integration
│   │   ├── ZatcaStatusReport.tsx   # Reports → ZATCA Status
│   │   ├── ZatcaSetupHelp.tsx      # Public help page (/help/zatca-setup)
│   │   └── ZatcaSetupWizard.tsx    # Setup wizard
│   └── components/
│       ├── ZatcaDashboardWidgets.tsx  # Dashboard widgets
│       └── ... (helpers)
├── db/
│   └── migration.sql             # Additional DB migration
├── types/
│   └── zatca.ts                  # Shared types
└── README.md
```

## What Already Exists (DO NOT MODIFY)

### Database Tables (db/schema.ts)
- `company_legal_details` - All legal fields
- `zatca_credentials` - Encrypted credentials (OTP, CSR, keys, CSIDs, tokens)
- `zatca_certificates` - Certificate history
- `zatca_api_logs` - API request/response audit
- `zatca_invoice_status` - Invoice lifecycle (draft→cleared→reported)
- `zatca_qr_codes` - TLV QR payloads
- `zatca_xml_documents` - XML versions (unsigned/signed/cleared)
- `zatca_activity_logs` - User activity audit

### API Router (api/zatcaRouter.ts)
- `officialResources` - ZATCA links
- `companyLegalGet` / `companyLegalSave`
- `integrationGet` / `integrationSave`
- `generateXml` - UBL XML generation
- `generateQrCode` - 9-tag QR with TLV
- `signInvoice` - RSA-SHA256 signing
- `complianceCheck` - Sandbox compliance test
- `clearanceInvoice` - Standard invoice clearance
- `reportInvoice` - Simplified invoice reporting
- `syncStatus` - Status synchronization
- `downloadResponse` - API response download
- `statusReport` - Full status report
- `dashboard` - Dashboard statistics
- `wizardState` - Setup wizard progress

Already registered in `api/router.ts` as `zatca: zatcaRouter`.

### Frontend (src/pages/settings/TaxComplianceSettings.tsx)
- ZATCA Phase 2 settings in Compliance tab

## What These New Pages Add

| File | Route | Purpose |
|------|-------|---------|
| `CompanyLegalInfo.tsx` | `/app/settings/legal` | Dedicated company legal info with all ZATCA-required fields |
| `ZatcaIntegration.tsx` | `/app/settings/zatca` | Full credential management with encrypted storage |
| `ZatcaStatusReport.tsx` | `/app/reports/zatca` | Invoice status tracking with filtering and API logs |
| `ZatcaDashboardWidgets.tsx` | Dashboard | Summary widgets (cleared, pending, failed, VAT, cert expiry) |
| `ZatcaSetupHelp.tsx` | `/help/zatca-setup` | Public 6-step setup guide |
| `ZatcaSetupWizard.tsx` | `/app/setup/zatca` | 7-step onboarding wizard |

## How to Integrate

### 1. Add Routes to App.tsx

```typescript
// In src/App.tsx, add lazy imports:
const CompanyLegalInfo = lazy(() => import("./build/zatca/frontend/pages/CompanyLegalInfo"));
const ZatcaIntegration = lazy(() => import("./build/zatca/frontend/pages/ZatcaIntegration"));
const ZatcaStatusReport = lazy(() => import("./build/zatca/frontend/pages/ZatcaStatusReport"));
const ZatcaSetupHelp = lazy(() => import("./build/zatca/frontend/pages/ZatcaSetupHelp"));
const ZatcaSetupWizard = lazy(() => import("./build/zatca/frontend/pages/ZatcaSetupWizard"));

// Add routes:
<Route path="/app/settings/legal" element={<LayoutWrapper><CompanyLegalInfo /></LayoutWrapper>} />
<Route path="/app/settings/zatca" element={<LayoutWrapper><ZatcaIntegration /></LayoutWrapper>} />
<Route path="/app/reports/zatca" element={<LayoutWrapper><ZatcaStatusReport /></LayoutWrapper>} />
<Route path="/help/zatca-setup" element={<ZatcaSetupHelp />} />
<Route path="/app/setup/zatca" element={<LayoutWrapper><ZatcaSetupWizard /></LayoutWrapper>} />
```

### 2. Add Sidebar Links (AppLayout.tsx)

In the SYSTEM section:
```typescript
{ label: "ZATCA Status", labelAr: "حالة ZATCA", icon: Activity, path: "/app/reports/zatca" },
```

In Settings section:
```typescript
{ label: "Legal Info", labelAr: "المعلومات القانونية", icon: Building2, path: "/app/settings/legal" },
{ label: "ZATCA Integration", labelAr: "تكامل ZATCA", icon: Shield, path: "/app/settings/zatca" },
```

### 3. Add Dashboard Widget

```typescript
// In Dashboard.tsx
import { ZatcaDashboardWidgets } from "./build/zatca/frontend/components/ZatcaDashboardWidgets";

// Then render:
<ZatcaDashboardWidgets />
```

### 4. Add to Settings Tabs

```typescript
// In src/pages/settings/index.tsx, add new tabs:
<TabsTrigger value="legal"><Building2 className="w-4 h-4 mr-2" />Legal Info</TabsTrigger>
<TabsTrigger value="zatca"><Shield className="w-4 h-4 mr-2" />ZATCA</TabsTrigger>

// Add content:
<TabsContent value="legal"><CompanyLegalInfo /></TabsContent>
<TabsContent value="zatca"><ZatcaIntegrationPage /></TabsContent>
```

### 5. Run Database Migration

```bash
npx drizzle-kit push
```

Or run the SQL in `build/zatca/db/migration.sql` manually.

## Security

- All credentials encrypted with AES-256-GCM before storage
- Private keys never stored in plaintext (encrypted at rest)
- Audit logs track all credential operations
- Multi-tenant isolation enforced via tenant_id
- IP tracking and user tracking on all API calls

## Multi-Tenant Isolation

Each tenant (company) has:
- Own company_legal_details row (1:1 with tenant)
- Own zatca_credentials (per environment)
- Own zatca_certificates
- Own invoice status tracking
- Complete data isolation

Company A → Own ZATCA Credentials
Company B → Own ZATCA Credentials
Company C → Own ZATCA Credentials

## ZATCA API Coverage

| Function | Endpoint | Status |
|----------|----------|--------|
| Generate UBL XML | `zatca.generateXml` | ✅ Complete |
| Generate QR Code (9 tags) | `zatca.generateQrCode` | ✅ Complete |
| Sign Invoice (RSA-SHA256) | `zatca.signInvoice` | ✅ Complete |
| Compliance Check | `zatca.complianceCheck` | ✅ Complete |
| Clearance Invoice | `zatca.clearanceInvoice` | ✅ Complete |
| Report Invoice | `zatca.reportInvoice` | ✅ Complete |
| Sync Status | `zatca.syncStatus` | ✅ Complete |
| Download Response | `zatca.downloadResponse` | ✅ Complete |
| Status Report | `zatca.statusReport` | ✅ Complete |
| Dashboard Stats | `zatca.dashboard` | ✅ Complete |
| Setup Wizard | `zatca.wizardState` | ✅ Complete |
| Official Resources | `zatca.officialResources` | ✅ Complete |

## Invoice Statuses

```
Draft → Signed → Pending → Submitted → Cleared (standard)
                                     → Reported (simplified)
          Rejected/Failed (any step)
```

## Official ZATCA Resources

- Portal: https://zatca.gov.sa
- Developer Portal: https://zatca.gov.sa/en/E-Invoicing/SystemsDevelopers
- Guidelines: https://zatca.gov.sa/en/E-Invoicing
- SDK/Docs: https://zatca1.discourse.group
