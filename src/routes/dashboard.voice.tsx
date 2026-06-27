import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Play, Pause, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/dashboard/voice")({
  head: () => ({ meta: [{ title: "Voice Messages — Sunaulo" }] }),
  component: VoicePage,
});

const messages = [
  { from: "Caregiver Sarah", initials: "SC", time: "10:24 AM", duration: "0:18", mine: false, text: "Good morning! Mom took her morning pills." },
  { from: "You", initials: "AR", time: "10:26 AM", duration: "0:09", mine: true, text: "Thank you so much, Sarah ❤️" },
  { from: "Caregiver Sarah", initials: "SC", time: "11:05 AM", duration: "0:24", mine: false, text: "BP looks great today — 121/80." },
  { from: "Mom", initials: "MA", time: "12:30 PM", duration: "0:15", mine: false, text: "Voice note" },
];

function VoicePage() {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voice Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay close with a simple recording.</p>
      </div>

      <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-secondary/20">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${m.mine ? "justify-end" : ""}`}
            >
              {!m.mine && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-teal text-teal-foreground text-xs font-semibold">
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-3xl p-3 ${
                  m.mine
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                }`}
              >
                {!m.mine && <p className="text-xs font-semibold mb-1">{m.from}</p>}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPlaying(playing === i ? null : i)}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                      m.mine
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                    aria-label="Play"
                  >
                    {playing === i ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1 flex items-end gap-0.5 h-6">
                    {Array.from({ length: 22 }).map((_, k) => (
                      <span
                        key={k}
                        className={`flex-1 rounded-sm ${
                          m.mine ? "bg-primary-foreground/60" : "bg-primary/70"
                        }`}
                        style={{ height: `${20 + Math.abs(Math.sin(k + i)) * 70}%` }}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${m.mine ? "opacity-80" : "text-muted-foreground"}`}>
                    {m.duration}
                  </span>
                </div>
                <p className={`text-[10px] mt-1.5 text-right ${m.mine ? "opacity-70" : "text-muted-foreground"}`}>
                  {m.time}
                </p>
              </div>
              {m.mine && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-border p-6 bg-card">
          <div className="flex items-center justify-center gap-6">
            <select className="rounded-full bg-secondary px-4 py-2 text-sm font-medium border border-border">
              <option>To: Caregiver Sarah</option>
              <option>To: Family Group</option>
            </select>
            <button
              onClick={() => setRecording(!recording)}
              className={`relative grid h-20 w-20 place-items-center rounded-full font-bold transition-all ${
                recording
                  ? "bg-destructive text-destructive-foreground scale-110"
                  : "bg-primary text-primary-foreground hover:scale-105 shadow-glow"
              }`}
              aria-label={recording ? "Stop recording" : "Start recording"}
            >
              {recording && (
                <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-40" />
              )}
              {recording ? <Square className="h-7 w-7" /> : <Mic className="h-8 w-8" />}
            </button>
            <Button size="icon" variant="outline" className="rounded-full h-12 w-12" aria-label="Send">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {recording ? "Recording… tap to stop" : "Tap the microphone to start recording"}
          </p>
        </div>
      </div>
    </div>
  );
}
