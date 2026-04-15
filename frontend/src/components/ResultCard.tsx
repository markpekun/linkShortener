import { useState } from "react";
import { Check, Copy, QrCode, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  url: string;
}

export const ResultCard = ({ url }: Props) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const svg = document.querySelector("#qr-code-svg") as SVGSVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement("a");
      a.download = "qrcode.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const iconBtn =
    "shrink-0 h-9 w-9 rounded-xl border border-border flex items-center justify-center transition-colors duration-200 hover:bg-secondary";

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl glass shadow-soft p-4 flex items-center justify-between gap-3"
      >
        <span className="text-foreground font-medium truncate">{url}</span>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setShowQr((v) => !v)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={iconBtn}
          >
            {showQr ? (
              <X className="w-4 h-4 text-muted-foreground" />
            ) : (
              <QrCode className="w-4 h-4 text-muted-foreground" />
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={iconBtn}
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
        </div>
      </motion.div>

      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl glass shadow-soft p-6 flex flex-col items-center gap-4">
              <QRCodeSVG
                id="qr-code-svg"
                value={url}
                size={160}
                bgColor="transparent"
                fgColor="hsl(var(--foreground))"
                level="M"
              />
              <button
                onClick={handleDownloadQr}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Download PNG
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
