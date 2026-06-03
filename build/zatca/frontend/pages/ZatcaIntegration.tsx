import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import {
  Shield, Key, Globe, Server, Lock, Save, Loader2, CheckCircle2, XCircle,
  ExternalLink, Eye, EyeOff, Radio, ClipboardCopy, RefreshCw
} from "lucide-react";
import { OFFICIAL_LINKS } from "../types/zatca";

type Environment = "sandbox" | "production";

export default function ZatcaIntegration() {
  const { data, refetch, isLoading } = trpc.zatca.integrationGet.useQuery();
  const saveMutation = trpc.zatca.integrationSave.useMutation({
    onSuccess: () => { refetch(); toast.success("ZATCA credentials saved securely"); },
    onError: (e) => toast.error(e.message),
  });

  const [environment, setEnvironment] = useState<Environment>("sandbox");
  const [vatNumber, setVatNumber] = useState("");
  const [organizationIdentifier, setOrganizationIdentifier] = useState("");
  const [egsSerialNumber, setEgsSerialNumber] = useState("");
  const [deviceUuid, setDeviceUuid] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [csrInformation, setCsrInformation] = useState("");
  const [zatcaCertificate, setZatcaCertificate] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [complianceCsid, setComplianceCsid] = useState("");
  const [productionCsid, setProductionCsid] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [secretToken, setSecretToken] = useState("");
  const [certificateExpiresAt, setCertificateExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSecretToken, setShowSecretToken] = useState(false);

  useEffect(() => {
    if (!data) return;
    setEnvironment(data.environment);
    setVatNumber(data.vatNumber);
    setOrganizationIdentifier(data.organizationIdentifier);
    setEgsSerialNumber(data.egsSerialNumber);
    setDeviceUuid(data.deviceUuid);
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMutation.mutateAsync({
        environment,
        vatNumber,
        organizationIdentifier: organizationIdentifier || undefined,
        egsSerialNumber: egsSerialNumber || undefined,
        deviceUuid: deviceUuid || undefined,
        otpCode: otpCode || undefined,
        csrInformation: csrInformation || undefined,
        zatcaCertificate: zatcaCertificate || undefined,
        privateKey: privateKey || undefined,
        publicKey: publicKey || undefined,
        complianceCsid: complianceCsid || undefined,
        productionCsid: productionCsid || undefined,
        accessToken: accessToken || undefined,
        secretToken: secretToken || undefined,
        certificateExpiresAt: certificateExpiresAt || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const credentialStatus = (has: boolean | undefined, label: string) => (
    <div className="flex items-center gap-2 text-sm">
      {has ? (
        <CheckCircle2 className="size-4 text-emerald-600" />
      ) : (
        <XCircle className="size-4 text-slate-300" />
      )}
      <span className={has ? "text-emerald-700" : "text-slate-400"}>{label}</span>
    </div>
  );

  if (isLoading) return <div className="flex items-center justify-center p-12"><Loader2 className="size-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="size-6 text-emerald-600" />
            ZATCA Integration
          </h2>
          <p className="text-slate-500">Saudi Arabia Fatoora Phase 2 – secure encrypted credential storage</p>
        </div>
        <Badge variant="outline" className={environment === "production" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
          {environment === "production" ? "Production" : "Sandbox"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Radio className="size-5" />Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={environment === "sandbox" ? "default" : "outline"}
                  className={environment === "sandbox" ? "bg-blue-600" : ""}
                  onClick={() => setEnvironment("sandbox")}
                >
                  <Server className="size-4 mr-2" />Sandbox
                </Button>
                <Button
                  variant={environment === "production" ? "default" : "outline"}
                  className={environment === "production" ? "bg-amber-600" : ""}
                  onClick={() => setEnvironment("production")}
                >
                  <Globe className="size-4 mr-2" />Production
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Key className="size-5" />EGS & Credentials</CardTitle>
              <CardDescription>ERP Gateway Solution (EGS) registration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>VAT Number <span className="text-red-500">*</span></Label>
                  <Input value={vatNumber} onChange={e => setVatNumber(e.target.value)} placeholder="3xxxxxxxxxxxx3" maxLength={15} />
                </div>
                <div className="space-y-2">
                  <Label>Organization Identifier</Label>
                  <Input value={organizationIdentifier} onChange={e => setOrganizationIdentifier(e.target.value)} placeholder="Company Org ID" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>EGS Serial Number</Label>
                  <Input value={egsSerialNumber} onChange={e => setEgsSerialNumber(e.target.value)} placeholder="EGS serial from ZATCA" />
                </div>
                <div className="space-y-2">
                  <Label>Device UUID</Label>
                  <div className="flex gap-2">
                    <Input value={deviceUuid} onChange={e => setDeviceUuid(e.target.value)} placeholder="Auto-generated if empty" className="flex-1" />
                    <Button variant="outline" size="icon" onClick={() => setDeviceUuid(crypto.randomUUID())} title="Generate UUID">
                      <RefreshCw className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Lock className="size-5" />Certificates & Keys</CardTitle>
              <CardDescription>All values are AES-256-GCM encrypted before storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>OTP Code</Label>
                  <div className="flex gap-2">
                    <Input value={otpCode} onChange={e => setOtpCode(e.target.value)} type={showOtp ? "text" : "password"} placeholder="OTP from ZATCA portal" className="flex-1" />
                    <Button variant="outline" size="icon" onClick={() => setShowOtp(!showOtp)}>
                      {showOtp ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>CSR Information</Label>
                  <Input value={csrInformation} onChange={e => setCsrInformation(e.target.value)} placeholder="PEM-encoded CSR" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ZATCA Certificate</Label>
                  <Input value={zatcaCertificate} onChange={e => setZatcaCertificate(e.target.value)} placeholder="PEM certificate" />
                </div>
                <div className="space-y-2">
                  <Label>Private Key</Label>
                  <div className="flex gap-2">
                    <Input value={privateKey} onChange={e => setPrivateKey(e.target.value)} type={showPrivateKey ? "text" : "password"} placeholder="Encrypted at rest" className="flex-1" />
                    <Button variant="outline" size="icon" onClick={() => setShowPrivateKey(!showPrivateKey)}>
                      {showPrivateKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Public Key</Label>
                  <Input value={publicKey} onChange={e => setPublicKey(e.target.value)} placeholder="PEM public key" />
                </div>
                <div className="space-y-2">
                  <Label>Certificate Expiry Date</Label>
                  <Input value={certificateExpiresAt} onChange={e => setCertificateExpiresAt(e.target.value)} type="date" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Key className="size-5" />CSID Tokens</CardTitle>
              <CardDescription>Compliance and Production CSID from ZATCA onboarding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Compliance CSID (CCSID)</Label>
                  <Input value={complianceCsid} onChange={e => setComplianceCsid(e.target.value)} placeholder="Token from compliance check" />
                </div>
                <div className="space-y-2">
                  <Label>Production CSID (PCSID)</Label>
                  <Input value={productionCsid} onChange={e => setProductionCsid(e.target.value)} placeholder="Token from production activation" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Lock className="size-5" />API Access Tokens</CardTitle>
              <CardDescription>Used for authenticating with ZATCA API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Access Token</Label>
                  <Input value={accessToken} onChange={e => setAccessToken(e.target.value)} placeholder="ZATCA API access token" />
                </div>
                <div className="space-y-2">
                  <Label>Secret Token</Label>
                  <div className="flex gap-2">
                    <Input value={secretToken} onChange={e => setSecretToken(e.target.value)} type={showSecretToken ? "text" : "password"} placeholder="ZATCA API secret token" className="flex-1" />
                    <Button variant="outline" size="icon" onClick={() => setShowSecretToken(!showSecretToken)}>
                      {showSecretToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Credentials Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {credentialStatus(data?.hasOtp, "OTP Code")}
              {credentialStatus(data?.hasCsr, "CSR Generated")}
              {credentialStatus(data?.hasCertificate, "ZATCA Certificate")}
              {credentialStatus(data?.hasPrivateKey, "Private Key")}
              {credentialStatus(data?.hasPublicKey, "Public Key")}
              {credentialStatus(data?.hasComplianceCsid, "Compliance CSID")}
              {credentialStatus(data?.hasProductionCsid, "Production CSID")}
              {credentialStatus(data?.hasAccessToken, "Access Token")}
              {credentialStatus(data?.hasSecretToken, "Secret Token")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><ExternalLink className="size-4" />Official Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(data?.officialResources || OFFICIAL_LINKS).map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline py-1">
                  <ExternalLink className="size-3 shrink-0" />
                  <span>{link.label}</span>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => refetch()}>Discard</Button>
        <Button onClick={handleSave} disabled={saving || !vatNumber} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[160px]">
          {saving ? <><Loader2 className="size-4 mr-2 animate-spin" />Encrypting...</> : <><Save className="size-4 mr-2" />Save Credentials</>}
        </Button>
      </div>
    </div>
  );
}
