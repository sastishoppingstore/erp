import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Building2, Globe, Phone, Mail, MapPin, Save, Loader2, Upload, FileText, ScrollText } from "lucide-react";

export default function CompanyLegalInfo() {
  const { data, refetch, isLoading } = trpc.zatca.companyLegalGet.useQuery();
  const saveMutation = trpc.zatca.companyLegalSave.useMutation({
    onSuccess: () => { refetch(); toast.success("Company legal information saved"); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    legalNameEn: "", legalNameAr: "", vatNumber: "", crNumber: "",
    taxRegistrationNumber: "", businessActivity: "", companyAddress: "",
    buildingNumber: "", streetName: "", district: "", city: "", postalCode: "",
    country: "Saudi Arabia", contactPerson: "", phoneNumber: "", emailAddress: "",
    companyLogo: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        legalNameEn: data.legalNameEn || "",
        legalNameAr: data.legalNameAr || "",
        vatNumber: data.vatNumber || "",
        crNumber: data.crNumber || "",
        taxRegistrationNumber: data.taxRegistrationNumber || "",
        businessActivity: data.businessActivity || "",
        companyAddress: data.companyAddress || "",
        buildingNumber: data.buildingNumber || "",
        streetName: data.streetName || "",
        district: data.district || "",
        city: data.city || "",
        postalCode: data.postalCode || "",
        country: data.country || "Saudi Arabia",
        contactPerson: data.contactPerson || "",
        phoneNumber: data.phoneNumber || "",
        emailAddress: data.emailAddress || "",
        companyLogo: data.companyLogo || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMutation.mutateAsync({
        legalNameEn: form.legalNameEn,
        legalNameAr: form.legalNameAr || undefined,
        vatNumber: form.vatNumber,
        crNumber: form.crNumber || undefined,
        taxRegistrationNumber: form.taxRegistrationNumber || undefined,
        businessActivity: form.businessActivity || undefined,
        companyAddress: form.companyAddress || undefined,
        buildingNumber: form.buildingNumber || undefined,
        streetName: form.streetName || undefined,
        district: form.district || undefined,
        city: form.city || undefined,
        postalCode: form.postalCode || undefined,
        country: form.country,
        contactPerson: form.contactPerson || undefined,
        phoneNumber: form.phoneNumber || undefined,
        emailAddress: form.emailAddress || undefined,
        companyLogo: form.companyLogo || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center p-12"><Loader2 className="size-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="size-6 text-emerald-600" />
            Company Legal Information
          </h2>
          <p className="text-slate-500">All fields appear on invoices and ZATCA tax documents</p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
          <FileText className="size-3" />
          ZATCA Required
        </Badge>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="business"><Building2 className="size-4 mr-2" />Business Info</TabsTrigger>
          <TabsTrigger value="address"><MapPin className="size-4 mr-2" />Address</TabsTrigger>
          <TabsTrigger value="contact"><Phone className="size-4 mr-2" />Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><ScrollText className="size-5" />Legal Identity</CardTitle>
              <CardDescription>As registered with Saudi authorities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Legal Name (English) <span className="text-red-500">*</span></Label>
                  <Input value={form.legalNameEn} onChange={e => setForm({...form, legalNameEn: e.target.value})} placeholder="Al Watan Trading Co." />
                </div>
                <div className="space-y-2">
                  <Label>Company Legal Name (Arabic)</Label>
                  <Input value={form.legalNameAr} onChange={e => setForm({...form, legalNameAr: e.target.value})} placeholder="شركة الوطن للتجارة" dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>VAT Number <span className="text-red-500">*</span></Label>
                  <Input value={form.vatNumber} onChange={e => setForm({...form, vatNumber: e.target.value})} placeholder="3xxxxxxxxxxxx3" maxLength={15} />
                  <p className="text-xs text-slate-400">15 digits, starts with 3 and ends with 3</p>
                </div>
                <div className="space-y-2">
                  <Label>Commercial Registration (CR Number)</Label>
                  <Input value={form.crNumber} onChange={e => setForm({...form, crNumber: e.target.value})} placeholder="1010123456" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Registration Number</Label>
                  <Input value={form.taxRegistrationNumber} onChange={e => setForm({...form, taxRegistrationNumber: e.target.value})} placeholder="Same as VAT or other tax ID" />
                </div>
                <div className="space-y-2">
                  <Label>Business Activity</Label>
                  <Input value={form.businessActivity} onChange={e => setForm({...form, businessActivity: e.target.value})} placeholder="Retail Trade / IT Services / Construction" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-3">
                  <Input value={form.companyLogo} onChange={e => setForm({...form, companyLogo: e.target.value})} placeholder="https://example.com/logo.png or base64 data URL" />
                  <Button variant="outline" size="icon" className="shrink-0"><Upload className="size-4" /></Button>
                </div>
                {form.companyLogo && (
                  <div className="mt-2 p-2 border rounded-lg inline-block">
                    <img src={form.companyLogo} alt="Company Logo" className="h-12 w-auto object-contain" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><MapPin className="size-5" />Registered Address</CardTitle>
              <CardDescription>Must match the address on your CR and VAT certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Building Number</Label>
                  <Input value={form.buildingNumber} onChange={e => setForm({...form, buildingNumber: e.target.value})} placeholder="1234" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Street Name</Label>
                  <Input value={form.streetName} onChange={e => setForm({...form, streetName: e.target.value})} placeholder="King Fahd Road" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>District</Label>
                  <Input value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="Al Olaya" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Riyadh" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} placeholder="12211" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Country</Label>
                  <Input value={form.country} onChange={e => setForm({...form, country: e.target.value})} placeholder="Saudi Arabia" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Full Company Address</Label>
                <Input value={form.companyAddress} onChange={e => setForm({...form, companyAddress: e.target.value})} placeholder="Building 1234, King Fahd Road, Al Olaya, Riyadh 12211, Saudi Arabia" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Globe className="size-5" />Contact Details</CardTitle>
              <CardDescription>For official tax correspondence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} placeholder="Ahmed Al-Mutairi" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} placeholder="+966 11 454 0000" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={form.emailAddress} onChange={e => setForm({...form, emailAddress: e.target.value})} placeholder="info@company.sa" type="email" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => refetch()}>Reset</Button>
        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]">
          {saving ? <><Loader2 className="size-4 mr-2 animate-spin" />Saving...</> : <><Save className="size-4 mr-2" />Save Legal Info</>}
        </Button>
      </div>
    </div>
  );
}
