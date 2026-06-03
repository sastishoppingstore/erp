import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, ArrowRight, CheckCircle2, Shield, Key, Server, Globe, Copy, Download } from "lucide-react";
import { OFFICIAL_LINKS } from "../types/zatca";

const STEPS = [
  {
    step: 1,
    title: "Obtain VAT Registration from Saudi Tax Authority",
    icon: FileText,
    description: "Register with the Saudi Zakat, Tax and Customs Authority (ZATCA) to obtain your VAT certificate.",
    details: [
      "Visit the ZATCA portal and log in to your business account.",
      "Navigate to VAT Registration section.",
      "Submit your company details and commercial registration.",
      "Receive your 15-digit VAT Number (starts with 3 and ends with 3).",
      "Copy the VAT number into the ERP Company Legal Information page.",
    ],
    link: "https://zatca.gov.sa",
  },
  {
    step: 2,
    title: "Obtain Commercial Registration (CR)",
    icon: FileText,
    description: "Your Commercial Registration number from the Ministry of Commerce is required for ZATCA onboarding.",
    details: [
      "Log in to the Ministry of Commerce portal (maroof.sa or business.sa).",
      "Access your company profile.",
      "Locate your Commercial Registration (CR) number.",
      "Enter the CR number in the ERP under Company Legal Information.",
    ],
    link: "https://business.sa",
  },
  {
    step: 3,
    title: "Generate CSR (Certificate Signing Request)",
    icon: Key,
    description: "Generate a CSR using your ERP system to request certificates from ZATCA.",
    details: [
      "Go to Settings > ZATCA Integration in the ERP.",
      "Ensure your company legal information is complete (Step 1 & 2).",
      "Click 'Generate CSR' – the system will create a CSR using your company details.",
      "Copy the generated CSR (PEM format).",
      "Keep your Private Key secure – it is encrypted and stored safely.",
    ],
  },
  {
    step: 4,
    title: "Request Compliance Certificate (CCSID)",
    icon: Shield,
    description: "Submit the CSR to ZATCA's developer portal to obtain your Compliance CSID.",
    details: [
      "Go to the ZATCA Developer Portal (sandbox environment).",
      "Log in with your business credentials.",
      "Select 'Request Compliance Certificate'.",
      "Paste the CSR generated in Step 3.",
      "Download the Compliance CSID (CCSID) certificate.",
      "Copy the CCSID token and paste it in ERP under ZATCA Integration.",
    ],
    link: "https://zatca.gov.sa/en/E-Invoicing/SystemsDevelopers",
  },
  {
    step: 5,
    title: "Obtain Production Certificate (PCSID)",
    icon: Globe,
    description: "After successful compliance testing, request your Production CSID.",
    details: [
      "Run the compliance test using the CCSID from Step 4.",
      "Verify that test invoices are accepted by ZATCA.",
      "Log in to the ZATCA production portal.",
      "Request 'Production CSID' (PCSID).",
      "Download the PCSID certificate.",
      "Copy the PCSID token into the ERP under ZATCA Integration.",
    ],
  },
  {
    step: 6,
    title: "Copy Credentials into ERP",
    icon: Copy,
    description: "Enter all ZATCA credentials into the ERP's encrypted storage.",
    details: [
      "Navigate to Settings > ZATCA Integration in the ERP.",
      "Select your Environment (Sandbox or Production).",
      "Enter your VAT Number and Organization Identifier.",
      "Paste the CSR, CCSID, PCSID, and keys into the respective fields.",
      "Enter the Access Token and Secret Token provided by ZATCA.",
      "Click 'Save Credentials' – all data is encrypted with AES-256-GCM.",
      "Verify the credential status indicators all show green checkmarks.",
    ],
  },
];

export default function ZatcaSetupHelp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
            <Shield className="size-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">ZATCA Phase 2 Setup Guide</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Complete 6-step guide to configure your ERP for Saudi Arabia E-Invoicing compliance
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Phase 2</Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Saudi Arabia</Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Fatoora</Badge>
          </div>
        </div>

        <div className="space-y-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={step.step} className="relative border-slate-200 hover:border-emerald-200 transition-colors">
                <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {step.step}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="absolute -left-1.5 top-12 bottom-0 w-0.5 bg-emerald-200 hidden sm:block" />
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <Icon className="size-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Step {step.step}: {step.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 mt-3"
                    >
                      <ExternalLink className="size-3.5" />
                      Visit Portal
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><ExternalLink className="size-5" />Official ZATCA Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OFFICIAL_LINKS.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all text-sm text-slate-700"
                >
                  <ExternalLink className="size-4 text-emerald-600 shrink-0" />
                  <span className="flex-1">{link.label}</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-slate-400">
          Need help? Contact your system administrator or refer to ZATCA official documentation.
        </div>
      </div>
    </div>
  );
}
