import { createFileRoute } from "@tanstack/react-router";
import { SOSButton } from "@/components/sos-button";
import { Phone, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard/sos")({
  head: () => ({ meta: [{ title: "SOS — Sunaulo" }] }),
  component: SOSPage,
});

const timeline = [
  { time: "Today · 7:30 AM", text: "System check — SOS ready", tone: "primary" },
  { time: "Yesterday · 6:49 PM", text: "Emergency resolved by Caregiver Sarah", tone: "primary" },
  { time: "Yesterday · 6:45 PM", text: "SOS activated — family notified", tone: "destructive" },
  { time: "3 days ago", text: "Emergency contact list updated", tone: "teal" },
];

function SOSPage() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emergency SOS</h1>
        <p className="text-sm text-muted-foreground mt-1">
          One tap alerts caregivers and family with live location.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-gradient-to-br from-destructive/10 to-warning/10 border border-destructive/20 p-10 flex flex-col items-center justify-center text-center">
          <SOSButton />
          <p className="mt-6 font-semibold text-lg">Tap to send SOS</p>
          <p className="text-sm text-muted-foreground max-w-xs mt-1">
            Your caregiver and family will be notified instantly with your live location.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
            <h3 className="font-semibold mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {[
                { name: "Sarah Chen", role: "Primary Caregiver", phone: "+1 555 0102" },
                { name: "Rohan Patel", role: "Son", phone: "+1 555 0144" },
                { name: "Priya Sharma", role: "Daughter", phone: "+1 555 0188" },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role} · {c.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Live Location
            </h3>
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 via-teal/20 to-accent grid place-items-center text-muted-foreground text-sm">
              Map preview · 12 Lotus Lane, Pokhara
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" /> Emergency Timeline
        </h3>
        <div className="space-y-3">
          {timeline.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/40">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: `var(--color-${t.tone})` }}
              />
              <p className="text-sm flex-1">{t.text}</p>
              <span className="text-xs text-muted-foreground">{t.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
