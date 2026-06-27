import { useState } from "react";
import { ShieldAlert, Phone, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function SOSButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full font-bold gap-1.5 shadow-glow"
          >
            <ShieldAlert className="h-4 w-4" /> SOS
          </Button>
        ) : (
          <button
            className="group relative grid place-items-center h-32 w-32 rounded-full bg-destructive text-destructive-foreground font-bold text-xl shadow-elevated hover:scale-105 active:scale-95 transition-all"
            aria-label="Activate SOS"
          >
            <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-30" />
            <ShieldAlert className="h-8 w-8 mb-1" />
            SOS
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-3xl max-w-md">
        <DialogHeader>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-2">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <DialogTitle className="text-center text-2xl">Emergency Activated</DialogTitle>
          <DialogDescription className="text-center">
            We're notifying your caregiver and family with your live location.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 my-2">
          {[
            { icon: Phone, label: "Caregiver notified", sub: "Sarah · 2s ago" },
            { icon: Phone, label: "Family notified", sub: "3 contacts · 4s ago" },
            { icon: MapPin, label: "Live location shared", sub: "Updating…" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60 border border-border"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
              <span className="text-xs font-semibold text-primary">✓</span>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => {
            setOpen(false);
            toast.success("Emergency cancelled");
          }}
        >
          <X className="h-4 w-4 mr-1" /> Cancel Emergency
        </Button>
      </DialogContent>
    </Dialog>
  );
}
