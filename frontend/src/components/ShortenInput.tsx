import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  url: string;
  onUrlChange: (v: string) => void;
  onShorten: () => void;
  loading: boolean;
  error: string;
}

export const ShortenInput = ({ url, onUrlChange, onShorten, loading, error }: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) onShorten();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      <div className="relative group flex items-center">
        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your link..."
          className="w-full h-14 px-5 pr-14 rounded-2xl glass text-foreground placeholder:text-muted-foreground text-base outline-none transition-all duration-300 focus:glow-focus focus:shadow-soft focus:border-foreground/10"
          disabled={loading}
        />
        <motion.button
          onClick={onShorten}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="absolute right-2 top-0 bottom-0 my-auto h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-colors duration-200 hover:bg-primary/85 disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </motion.button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-destructive text-sm pl-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
