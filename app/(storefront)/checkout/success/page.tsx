"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  const orderNumber = useSearchParams().get("order");
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 lg:py-32 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
      >
        <CheckCircle2 className="w-20 h-20 text-brand-green mx-auto mb-6" strokeWidth={1.5} />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl lg:text-5xl font-bold tracking-tight mb-4"
      >
        Захиалга амжилттай!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-ink-muted mb-3"
      >
        Захиалгын дугаар
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="inline-block bg-bg-secondary rounded-pill px-6 py-3 font-mono font-semibold mb-10"
      >
        {orderNumber}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Link
          href="/shop"
          className="border-[1.5px] border-ink rounded-pill px-8 py-3.5 text-sm font-semibold"
        >
          ҮРГЭЛЖЛҮҮЛЭН ДЭЛГҮҮРЛЭХ
        </Link>
        <Link
          href="/account/orders"
          className="bg-ink text-ink-inverse rounded-pill px-8 py-3.5 text-sm font-semibold"
        >
          ЗАХИАЛГА ҮЗЭХ
        </Link>
      </motion.div>
    </div>
  );
}
