"use client";

import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "tr";
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const t = {
    en: {
      title: "Share Your Feedback",
      subtitle: "Your feedback helps us improve GRAINZ 3D",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "your.email@example.com",
      messageLabel: "Message",
      messagePlaceholder: "Tell us what you think...",
      submit: "Send Feedback",
      sending: "Sending...",
      success: "Thank you! Your feedback has been sent.",
      error: "Something went wrong. Please try again.",
      close: "Close",
    },
    tr: {
      title: "Görüşlerinizi Paylaşın",
      subtitle: "Görüşleriniz GRAINZ 3D'yi geliştirmemize yardımcı olur",
      nameLabel: "İsim",
      namePlaceholder: "Adınız",
      emailLabel: "E-posta",
      emailPlaceholder: "ornek@email.com",
      messageLabel: "Mesaj",
      messagePlaceholder: "Düşüncelerinizi paylaşın...",
      submit: "Gönder",
      sending: "Gönderiliyor...",
      success: "Teşekkürler! Görüşleriniz gönderildi.",
      error: "Bir hata oluştu. Lütfen tekrar deneyin.",
      close: "Kapat",
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || t.error;
        throw new Error(errorMsg);
      }

      setSubmitStatus("success");
      setName("");
      setEmail("");
      setMessage("");

      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === 'string') {
        setErrorMessage(error);
      } else {
        setErrorMessage(t.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border-[0.75px] border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl ring-1 ring-white/10"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{t.title}</h2>
                <p className="mt-1 text-sm text-white/70">{t.subtitle}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-white/90"
                  >
                    {t.nameLabel}
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    required
                    className="w-full rounded-lg border-[0.75px] border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-white/90"
                  >
                    {t.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                    className="w-full rounded-lg border-[0.75px] border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-white/90"
                  >
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.messagePlaceholder}
                    required
                    rows={5}
                    className="w-full rounded-lg border-[0.75px] border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition resize-none"
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-green-500/20 border border-green-500/30 px-4 py-3 text-sm text-green-200"
                  >
                    {t.success}
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-200"
                  >
                    {errorMessage || t.error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success"}
                  className="w-full rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20 hover:border-white/30 border-[0.75px] border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t.submit}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
