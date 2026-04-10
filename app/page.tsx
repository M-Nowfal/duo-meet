"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Imported Image component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Shield,
  Zap,
  ArrowRight,
  Link as LinkIcon,
  Lock,
  MousePointerClick,
  Share2,
  Trash2,
  Loader2,
  Download
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [inviteLink, setInviteLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Generates a random room ID and navigates the host there
  const handleStartConversation = () => {
    setIsCreating(true);
    // Generate a secure random UUID for the room
    const roomId = crypto.randomUUID();
    router.push(`/room/${roomId}`);
  };

  // Parses the pasted link or ID and navigates the guest there
  const handleJoin = () => {
    if (!inviteLink.trim()) return;

    let roomId = inviteLink.trim();

    // If the user pasted the full URL, extract just the ID at the end
    if (roomId.includes("/room/")) {
      roomId = roomId.split("/room/")[1].split("?")[0].split("/")[0];
    }

    router.push(`/room/${roomId}`);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstallable(false);
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030305] text-white selection:bg-indigo-500/30 font-sans tracking-wide">

      {/* Header / Logo Section */}
      <header className="absolute top-0 left-0 w-full p-6 md:px-12 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          {/* Replace src with your actual logo path in the public folder */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative">
            <Image
              src="/favicon.svg"
              alt="Duo Meet Logo"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-br from-white via-indigo-400 to-cyan-300 drop-shadow-sm">Duo Meet</span>
        </div>
        {isInstallable && (
          <Button
            size="sm"
            className="h-8 px-3 rounded-md gap-2 text-white border-0 transition-all duration-500 bg-linear-to-r from-indigo-900 via-cyan-500 to-indigo-700 bg-size-[200%_auto] hover:bg-position-[right_center]"
            onClick={handleInstallClick}
          >
            <Download className="h-5 w-5" />
            Install App
          </Button>
        )}
      </header>

      {/* Modern Gradient Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-indigo-600/20 rounded-full blur-[160px] -z-10 animate-pulse duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-cyan-600/20 rounded-full blur-[160px] -z-10 animate-pulse duration-1000 delay-700"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-purple-600/10 rounded-full blur-[160px] -z-10"></div>

      <main className="container px-6 py-24 md:px-12 flex flex-col items-center text-center max-w-6xl z-10">

        {/* Top Badge */}
        <Badge variant="outline" className="mb-10 py-3 px-5 bg-indigo-950/40 border-indigo-500/30 text-indigo-300 shadow-sm rounded-full backdrop-blur-md">
          <Lock className="w-3.5 h-3.5 mr-2 inline-block" />
          End-to-End Encrypted 1-on-1 Calls
        </Badge>

        {/* Hero Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-linear-to-br from-white via-indigo-300 to-cyan-400 drop-shadow-sm pb-2">
          Instant. Secure. <br className="hidden sm:block" />
          Disposable Meetings.
        </h1>

        {/* Hero Subtext */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-14 leading-relaxed font-light">
          Start a private, high-fidelity video conversation in seconds.
          Generate a one-time link. Once the meeting ends, the room ceases to exist. No downloads, no history.
        </p>

        {/* Call to Action Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mb-24">

          <Button
            size="lg"
            onClick={handleStartConversation}
            disabled={isCreating}
            className="w-full sm:w-auto font-medium rounded-lg group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 h-12 px-8 bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border-none disabled:opacity-70 disabled:hover:scale-100"
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Video className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            )}
            {isCreating ? "Creating Room..." : "Start Conversation"}
          </Button>

          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <LinkIcon className="w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <Input
              type="text"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="Paste invite link or ID..."
              className="pl-11 pr-12 h-12 rounded-lg bg-zinc-950/50 backdrop-blur-xl border-zinc-800 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500 transition-all duration-300 text-base text-white placeholder:text-zinc-600 shadow-inner"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleJoin}
              disabled={!inviteLink.trim()}
              className="absolute inset-y-0 right-1 top-1 bottom-1 h-10 w-10 rounded-md hover:bg-cyan-500/10 hover:text-cyan-500 text-cyan-500 transition-colors disabled:opacity-50"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="w-full max-w-5xl mb-32 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white">
            How it <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-indigo-500">Works</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-transparent via-zinc-800 to-transparent -z-10"></div>

            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] group-hover:border-indigo-500/50 transition-colors duration-300">
                <MousePointerClick className="w-10 h-10 text-indigo-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">1. Generate</h4>
              <p className="text-zinc-400 text-sm leading-relaxed px-4">Click start to instantly create a unique, cryptographically secure room on our Edge network.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(34,211,238,0.15)] group-hover:border-cyan-500/50 transition-colors duration-300">
                <Share2 className="w-10 h-10 text-cyan-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">2. Share</h4>
              <p className="text-zinc-400 text-sm leading-relaxed px-4">Send the one-time link to your guest. No accounts, logins, or app downloads required.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] group-hover:border-purple-500/50 transition-colors duration-300">
                <Trash2 className="w-10 h-10 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">3. Vanish</h4>
              <p className="text-zinc-400 text-sm leading-relaxed px-4">Once the second person joins, the link dies. When the call ends, the room is erased forever.</p>
            </div>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Card className="bg-zinc-950/40 backdrop-blur-md border border-slate-700 hover:border-indigo-500/30 hover:bg-zinc-900/50 transition-all duration-500 hover:-translate-y-1 group rounded-2xl overflow-hidden shadow-lg">
            <CardContent className="p-8 flex flex-col items-start text-left">
              <div className="p-3 bg-indigo-500/10 rounded-xl mb-5 group-hover:bg-indigo-500/20 transition-colors duration-300">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">Absolute Privacy</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Links deactivate the moment a second person joins. No uninvited guests, ever.</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/40 backdrop-blur-md border border-slate-700 hover:border-cyan-500/30 hover:bg-zinc-900/50 transition-all duration-500 hover:-translate-y-1 group rounded-2xl overflow-hidden shadow-lg">
            <CardContent className="p-8 flex flex-col items-start text-left">
              <div className="p-3 bg-cyan-500/10 rounded-xl mb-5 group-hover:bg-cyan-500/20 transition-colors duration-300">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">Frictionless</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Built on LiveKit and Next.js for sub-second latency. Works directly in the browser.</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/40 backdrop-blur-md border border-slate-700 hover:border-purple-500/30 hover:bg-zinc-900/50 transition-all duration-500 hover:-translate-y-1 group rounded-2xl overflow-hidden shadow-lg">
            <CardContent className="p-8 flex flex-col items-start text-left">
              <div className="p-3 bg-purple-500/10 rounded-xl mb-5 group-hover:bg-purple-500/20 transition-colors duration-300">
                <Video className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">High Fidelity</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Crystal clear WebRTC video and audio streams optimized for two participants.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent"></div>
    </div>
  );
}