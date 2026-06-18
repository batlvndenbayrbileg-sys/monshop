import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatMNT(n: number): string {
  return new Intl.NumberFormat("mn-MN").format(n) + "₮";
}

export function orderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `MS${ymd}${rand}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("monshop_session_id");
  if (!id) {
    id = "guest_" + Math.random().toString(36).slice(2, 18);
    localStorage.setItem("monshop_session_id", id);
  }
  return id;
}
