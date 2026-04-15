import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";
import { ShortenInput } from "@/components/ShortenInput";
import { ResultCard } from "@/components/ResultCard";
import { ParticleText } from "@/components/ParticleText";
import { shortenUrl } from "@/lib/api";

const Index = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = useCallback(async () => {
    setError("");
    setShortenedUrl("");
    if (!url.trim()) { setError("Please enter a URL"); return; }

    setLoading(true);
    try {
      const data = await shortenUrl(url.trim());
      setShortenedUrl(data.short_url);
    } catch (e: any) {
      setError(e.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  }, [url]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-[26vh] px-4 relative overflow-hidden">
      {/* GitHub link */}
      <a
        href="https://github.com/markpekun"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-5 right-5 z-50 text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <Github size={20} strokeWidth={1.5} />
      </a>
      {/* Subtle ambient gradient */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 30%, hsla(220, 60%, 92%, 0.5), transparent)`,
        }}
      />

      <div className="w-full max-w-lg flex flex-col items-center gap-10 relative z-10">
        <ParticleText text="Short Linker" />

        <div className="w-full">
          <ShortenInput url={url} onUrlChange={setUrl} onShorten={handleShorten} loading={loading} error={error} />
        </div>

        <AnimatePresence>
          {shortenedUrl && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ResultCard url={shortenedUrl} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
