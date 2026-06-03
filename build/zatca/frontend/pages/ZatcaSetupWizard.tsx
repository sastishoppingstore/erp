import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Building2, Receipt, FileText,
  Key, Shield, Globe, PartyPopper, Loader2, Save
} from "lucide-react";
import { ZATCA_STATUS_COLORS } from "../types/zatca";

const TOTAL_STEPS = 7;

interface WizardData {
  legalNameEn: string; legalNameAr: string; vatNumber: string; crNumber: string;
  city: string; country: string; buildingNumber: string; streetName: string;
  district: string; postalCode: string; contactPerson: string; phoneNumber: string;
  emailAddress: string;
  environment: "sandbox" | "production";
  otpCode: string; csrInformation: string; complianceCsid: string;
  productionCsid: string; privateKey: string; publicKey: string;
}

export default function ZatcaSetupWizard() {
  const { data: wizardSteps, refetch: refetchWizard } = trpc.zatca.wizardState.useQuery();
  const legalSave = trpc.zatca.companyLegalSave.useMutation();
  const integrationSave = trpc.zatca.integrationSave.useMutation();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardData>({
    legalNameEn: "", legalNameAr: "", vatNumber: "", crNumber: "",
    city: "", country: "Saudi Arabia", buildingNumber: "", streetName: "",
    district: "", postalCode: "", contactPerson: "", phoneNumber: "", emailAddress: "",
    environment: "sandbox", otpCode: "", csrInformation: "",
    complianceCsid: "", productionCsid: "", privateKey: "", publicKey: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof WizardData, value: string) => setForm(p => ({ ...p, [field]: value }));

  const handleNext = async () => {
    if (step === 1) {
      if (!form.legalNameEn || !form.vatNumber) { toast.error("Company name and VAT number are required"); return; }
      setSaving(true);
      try {
        await legalSave.mutateAsync({ legalNameEn: form.legalNameEn, legalNameAr: form.legalNameAr || undefined, vatNumber: form.vatNumber, crNumber: form.crNumber || undefined, city: form.city || undefined, country: form.country, buildingNumber: form.buildingNumber || undefined, streetName: form.streetName || undefined, district: form.district || undefined, postalCode: form.postalCode || undefined, contactPerson: form.contactPerson || undefined, phoneNumber: form.phoneNumber || undefined, emailAddress: form.emailAddress || undefined });
        toast.success("Company information saved");
        refetchWizard();
      } catch (e: any) { toast.error(e.message); setSaving(false); return; }
      setSaving(false);
    }
    if (step === 4) {
      setSaving(true);
      try {
        await integrationSave.mutateAsync({
          environment: form.environment, vatNumber: form.vatNumber,
          otpCode: form.otpCode || undefined, csrInformation: form.csrInformation || undefined,
          complianceCsid: form.complianceCsid || undefined, productionCsid: form.productionCsid || undefined,
          privateKey: form.privateKey || undefined, publicKey: form.publicKey || undefined,
        });
        toast.success("ZATCA credentials saved securely");
        refetchWizard();
      } catch (e: any) { toast.error(e.message); setSaving(false); return; }
      setSaving(false);
    }
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      if (form.complianceCsid && form.productionCsid) {
        await integrationSave.mutateAsync({
          environment: "production", vatNumber: form.vatNumber,
          complianceCsid: form.complianceCsid, productionCsid: form.productionCsid,
          privateKey: form.privateKey || undefined, publicKey: form.publicKey || undefined,
        });
      }
      toast.success("ZATCA Phase 2 setup complete!");
      setSuccess(true);
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <PartyPopper className="size-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">Setup Complete!</h2>
        <p className="text-slate-500">Your ERP is now configured for ZATCA Phase 2 compliance.</p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => { setStep(1); setSuccess(false); }}>Start Over</Button>
          <Button onClick={() => window.location.href = "/app"}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Shield className="size-6 text-emerald-600" />
          ZATCA Phase 2 Setup Wizard
        </h2>
        <p className="text-slate-500">Step {step} of {TOTAL_STEPS}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} className={`w-8 h-1.5 rounded-full transition-colors ${
            i + 1 === step ? "bg-emerald-600" :
            i + 1 < step ? "bg-emerald-300" : "bg-slate-200"
          }`} />
        ))}
      </div>

      <Card>
        {step === 1 && (
          <>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="size-5" />Company Information</CardTitle><CardDescription>Step 1 of 7: Enter your basic company details</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Company Name (English) *</Label><Input value={form.legalNameEn} onChange={e => update("legalNameEn", e.target.value)} placeholder="Al Watan Trading Co." /></div>
                <div className="space-y-2"><Label>Company Name (Arabic)</Label><Input value={form.legalNameAr} onChange={e => update("legalNameAr", e.target.value)} placeholder="شركة الوطن للتجارة" dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={e => update("city", e.target.value)} placeholder="Riyadh" /></div>
                <div className="space-y-2"><Label>Country</Label><Input value={form.country} onChange={e => update("country", e.target.value)} placeholder="Saudi Arabia" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Building Number</Label><Input value={form.buildingNumber} onChange={e => update("buildingNumber", e.target.value)} placeholder="1234" /></div>
                <div className="space-y-2 md:col-span-2"><Label>Street Name</Label><Input value={form.streetName} onChange={e => update("streetName", e.target.value)} placeholder="King Fahd Road" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>District</Label><Input value={form.district} onChange={e => update("district", e.target.value)} placeholder="Al Olaya" /></div>
                <div className="space-y-2"><Label>Postal Code</Label><Input value={form.postalCode} onChange={e => update("postalCode", e.target.value)} placeholder="12211" /></div>
                <div className="space-y-2"><Label>Contact Person</Label><Input value={form.contactPerson} onChange={e => update("contactPerson", e.target.value)} placeholder="Ahmed" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Phone</Label><Input value={form.phoneNumber} onChange={e => update("phoneNumber", e.target.value)} placeholder="+966 11 454 0000" /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={form.emailAddress} onChange={e => update("emailAddress", e.target.value)} placeholder="info@company.sa" type="email" /></div>
              </div>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="size-5" />VAT Details</CardTitle><CardDescription>Step 2 of 7: Enter your VAT registration information</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800 mb-4">
                Your VAT number is issued by ZATCA after registration. It must be 15 digits, starting with 3 and ending with 3.
              </div>
              <div className="space-y-2">
                <Label>VAT Number *</Label>
                <Input value={form.vatNumber} onChange={e => update("vatNumber", e.target.value)} placeholder="3xxxxxxxxxxxx3" maxLength={15} className="font-mono text-lg" />
                <p className="text-xs text-slate-400">15 digits, starts with 3 and ends with 3</p>
              </div>
              <div className="space-y-2">
                <Label>Tax Registration Number</Label>
                <Input value={""} disabled placeholder="Auto-filled from VAT number" />
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-5" />Commercial Registration</CardTitle><CardDescription>Step 3 of 7: Enter your CR details</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 mb-4">
                Your Commercial Registration (CR) number is issued by the Saudi Ministry of Commerce.
              </div>
              <div className="space-y-2">
                <Label>CR Number</Label>
                <Input value={form.crNumber} onChange={e => update("crNumber", e.target.value)} placeholder="1010123456" />
              </div>
            </CardContent>
          </>
        )}

        {step === 4 && (
          <>
            <CardHeader><CardTitle className="flex items-center gap-2"><Key className="size-5" />ZATCA Credentials</CardTitle><CardDescription>Step 4 of 7: Enter your ZATCA onboarding credentials</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 mb-4">
                <Button variant={form.environment === "sandbox" ? "default" : "outline"} className={form.environment === "sandbox" ? "bg-blue-600" : ""} onClick={() => update("environment", "sandbox")}><Shield className="size-4 mr-2" />Sandbox</Button>
                <Button variant={form.environment === "production" ? "default" : "outline"} className={form.environment === "production" ? "bg-amber-600" : ""} onClick={() => update("environment", "production")}><Globe className="size-4 mr-2" />Production</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>OTP Code</Label><Input value={form.otpCode} onChange={e => update("otpCode", e.target.value)} placeholder="OTP from ZATCA" /></div>
                <div className="space-y-2"><Label>CSR Information</Label><Input value={form.csrInformation} onChange={e => update("csrInformation", e.target.value)} placeholder="PEM CSR" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Compliance CSID</Label><Input value={form.complianceCsid} onChange={e => update("complianceCsid", e.target.value)} placeholder="CCSID token" /></div>
                <div className="space-y-2"><Label>Production CSID</Label><Input value={form.productionCsid} onChange={e => update("productionCsid", e.target.value)} placeholder="PCSID token" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Private Key</Label><Input value={form.privateKey} onChange={e => update("privateKey", e.target.value)} placeholder="Encrypted at rest" type="password" /></div>
                <div className="space-y-2"><Label>Public Key</Label><Input value={form.publicKey} onChange={e => update("publicKey", e.target.value)} placeholder="PEM public key" /></div>
              </div>
            </CardContent>
          </>
        )}

        {step === 5 && (
          <>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5" />Compliance Test</CardTitle><CardDescription>Step 5 of 7: Run a compliance check with ZATCA sandbox</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
                  <CheckCircle2 className="size-5" />
                  Compliance Check
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Generate a test invoice and submit it to ZATCA to verify your configuration.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: "Company Name", ok: Boolean(form.legalNameEn) },
                    { label: "VAT Number", ok: /^3\d{13}3$/.test(form.vatNumber) },
                    { label: "CR Number", ok: Boolean(form.crNumber) },
                    { label: "CCSID Configured", ok: Boolean(form.complianceCsid) },
                    { label: "Private Key", ok: Boolean(form.privateKey) },
                    { label: "Environment", ok: form.environment === "sandbox" },
                  ].map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      {check.ok ? <CheckCircle2 className="size-4 text-emerald-600" /> : <div className="size-4 rounded-full border-2 border-slate-300" />}
                      <span className={check.ok ? "text-emerald-700" : "text-slate-400"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Run Compliance Test (requires CCSID)
              </Button>
            </CardContent>
          </>
        )}

        {step === 6 && (
          <>
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="size-5" />Production Activation</CardTitle><CardDescription>Step 6 of 7: Switch to production environment</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-800 font-medium mb-2">Important</p>
                <p className="text-sm text-amber-700">
                  After successful compliance testing, switch to production mode and enter your Production CSID.
                  This enables live invoice clearance and reporting with ZATCA.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Production CSID (PCSID)</Label>
                <Input value={form.productionCsid} onChange={e => update("productionCsid", e.target.value)} placeholder="Production CSID token" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Globe className="size-5 text-amber-600" />
                <div>
                  <div className="text-sm font-medium">Production Mode</div>
                  <div className="text-xs text-slate-500">Switch to production after entering PCSID</div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {step === 7 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PartyPopper className="size-5 text-emerald-600" />
                Success Confirmation
              </CardTitle>
              <CardDescription>Step 7 of 7: Review and confirm your setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Company", value: form.legalNameEn },
                  { label: "VAT Number", value: form.vatNumber },
                  { label: "CR Number", value: form.crNumber || "-" },
                  { label: "Environment", value: form.environment },
                  { label: "CCSID", value: form.complianceCsid ? "Configured" : "Missing" },
                  { label: "PCSID", value: form.productionCsid ? "Configured" : "Missing" },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-400">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-sm text-emerald-800">
                  Your ERP is now configured for ZATCA Phase 2. You can start generating compliant
                  e-invoices with full QR codes, digital signatures, and UBL XML.
                </p>
              </div>
            </CardContent>
          </>
        )}

        <div className="flex justify-between px-6 pb-6 pt-2 border-t mt-4">
          <Button variant="outline" onClick={() => step > 1 ? setStep(s => s - 1) : null} disabled={step === 1}>
            <ArrowLeft className="size-4 mr-2" />Back
          </Button>
          {step < TOTAL_STEPS ? (
            <Button onClick={handleNext} disabled={saving}>
              {saving ? <><Loader2 className="size-4 mr-2 animate-spin" />Saving...</> : <>{step === TOTAL_STEPS - 1 ? "Review" : "Next"}<ArrowRight className="size-4 ml-2" /></>}
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving ? <><Loader2 className="size-4 mr-2 animate-spin" />Finalizing...</> : <><PartyPopper className="size-4 mr-2" />Complete Setup</>}
            </Button>
          )}
        </div>
      </Card>

      {wizardSteps && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Setup Progress</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {wizardSteps.map((ws) => (
                <div key={ws.step} className="text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-1 ${
                    ws.complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                  }`}>
                    {ws.complete ? <CheckCircle2 className="size-4" /> : ws.step}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">{ws.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
