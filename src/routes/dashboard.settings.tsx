import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Sunaulo" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const toggles = [
    { name: "Medicine reminders", desc: "Soft alerts before each dose", on: true },
    { name: "Vitals alerts", desc: "Notify when readings go out of range", on: true },
    { name: "Family notifications", desc: "Share daily summary with family", on: true },
    { name: "Voice message sounds", desc: "Play notification sound", on: false },
    { name: "Large text mode", desc: "Increase text size across the app", on: false },
  ];
  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Personalize your Sunaulo experience.</p>
      </div>

      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input defaultValue="Aarti Rai" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="aarti@example.com" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input defaultValue="+1 555 0188" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input defaultValue="Family" className="rounded-xl" />
          </div>
        </div>
        <Button className="rounded-full">Save changes</Button>
      </div>

      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
        <h2 className="font-semibold mb-4">Preferences</h2>
        <div className="divide-y divide-border">
          {toggles.map((t) => (
            <div key={t.name} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
              <Switch defaultChecked={t.on} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
