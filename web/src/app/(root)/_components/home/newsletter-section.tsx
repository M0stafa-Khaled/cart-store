"use client";

import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Successfully subscribed to newsletter!");

      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-purple-950">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Get the latest updates on new products, exclusive deals, and special
            offers delivered straight to your inbox
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="h-auto flex-1 px-6 py-4 rounded-full text-white placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              Subscribe
            </button>
          </form>

          <p className="text-white/70 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
