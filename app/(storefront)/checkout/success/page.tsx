"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SuccessInner />
    </Suspense>
  );
}

type PayState = "confirming" | "paid" | "pending";

function SuccessInner() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const orderId = params.get("orderId");
  const needsPayment = params.get("pay") === "1" && !!orderId;

  const [payState, setPayState] = useState<PayState>(needsPayment ? "confirming" : "paid");

  useEffect(() => {
    if (!needsPayment || !orderId) return;
    let active = true;
    let tries = 0;

    const check = async () => {
      try {
        const r = await fetch(`/api/payments/intent?orderId=${orderId}`, { cache: "no-store" });
        const j = await r.json();
        const status = j?.data?.status;
        if (!active) return;
        if (status === "succeeded") {
          setPayState("paid");
          return; // stop polling
        }
      } catch {
        /* keep trying */
      }
      tries += 1;
      if (!active) return;
      if (tries >= 20) {
        setPayState("pending"); // ~60s elapsed, let user check later
        return;
      }
      setTimeout(check, 3000);
    };

    check();
    return () => {
      active = false;
    };
  }, [needsPayment, orderId]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 lg:py-32 text-center">
      {payState === "confirming" ? (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
          >
            <Loader2 className="w-16 h-16 text-brand-pink mx-auto mb-6 animate-spin" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Төлбөр баталгаажиж байна…
          </h1>
          <p className="text-ink-muted mb-10">
            QPay-ээр төлсний дараа энэ хуудас автоматаар шинэчлэгдэнэ. Хаахгүй түр хүлээнэ үү.
          </p>
        </>
      ) : payState === "pending" ? (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
          >
            <Clock className="w-16 h-16 text-amber-500 mx-auto mb-6" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Захиалга хүлээн авлаа
          </h1>
          <p className="text-ink-muted mb-3">
            Төлбөр баталгаажихыг хүлээж байна. Төлбөр хийгдсэн бол захиалга автоматаар идэвхжинэ.
          </p>
        </>
      ) : (
        <>
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
        </>
      )}

      {orderNumber && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-ink-muted mb-3"
          >
            Захиалгын дугаар
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-block bg-bg-soft border border-line rounded-pill px-6 py-3 font-mono font-semibold mb-10"
          >
            {orderNumber}
          </motion.div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
