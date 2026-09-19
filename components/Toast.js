"use client";

export default function Toast({ message, type = "success", onDismiss }) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "bg-red-50 text-red-600 border-red-100"
      : "bg-[#f4fbf6] text-emerald-700 border-emerald-100";

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 border ${styles} rounded-full px-5 py-2.5 text-[13.5px] font-medium shadow-sm flex items-center gap-3 max-w-[90vw]`}
      role="status"
    >
      <span className="truncate">{message}</span>
      <button
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
