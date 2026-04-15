import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  url: string;
}

export const ResultCard = ({ url }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl glass shadow-soft p-4 flex items-center justify-between gap-4"
    >
      <span className="text-foreground font-medium truncate">{url}</span>
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="shrink-0 h-9 w-9 rounded-xl border border-border flex items-center justify-center transition-colors duration-200 hover:bg-secondary"
      >
        {copied ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Check className="w-4 h-4 text-foreground" />
          </motion.div>
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </motion.button>
    </motion.div>
  );
};
