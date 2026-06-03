/**
 * ZATCA Phase 2 Integration – Complete tRPC Router
 *
 * This file mirrors the existing api/zatcaRouter.ts.
 * All functions already exist at api/zatcaRouter.ts and are registered
 * in api/router.ts as `zatca: zatcaRouter`.
 *
 * DO NOT duplicate this file. Instead, ensure api/zatcaRouter.ts is the source of truth.
 * This file is a reference for the build pipeline.
 *
 * Current location: /home/ubuntu/erp/api/zatcaRouter.ts (916 lines)
 * 
 * Exported procedures:
 *   - officialResources        (public)   ZATCA official links
 *   - companyLegalGet          (authed)   Get legal info
 *   - companyLegalSave         (admin)    Save legal info
 *   - integrationGet           (authed)   Get integration status
 *   - integrationSave          (admin)    Save credentials (encrypted)
 *   - generateXml              (authed)   Generate UBL XML
 *   - generateQrCode           (authed)   Generate 9-tag QR
 *   - signInvoice              (authed)   RSA-SHA256 sign
 *   - complianceCheck          (authed)   Run compliance check
 *   - clearanceInvoice         (authed)   Submit clearance
 *   - reportInvoice            (authed)   Submit reporting
 *   - syncStatus               (authed)   Sync ZATCA status
 *   - downloadResponse         (authed)   Download API response
 *   - statusReport             (authed)   Full status report
 *   - dashboard                (authed)   Dashboard statistics
 *   - wizardState              (authed)   Setup wizard progress
 */
