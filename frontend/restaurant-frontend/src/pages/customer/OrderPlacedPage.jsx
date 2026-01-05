import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useParams } from "react-router-dom";
import { serverLink } from "@/utils/links";

const STEPS = ["pending", "preparing", "ready", "served"];
const STEPS_SHOW = ["PLACED", "PREPARING", "READY", "SERVED"];

export default function OrderPlacedPage() {
  const { order_id } = useParams();
  const [dark, setDark] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // store interval ref so we can stop polling
  const intervalRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch(serverLink + `orders/${order_id}/`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data = await res.json();
      setOrder(data);
      setLoading(false);

      // 🟢 stop polling once served
      if (data.status === "served" && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();

    intervalRef.current = setInterval(fetchStatus, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [order_id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!order) return null;

  const stepIndex = Math.max(0, STEPS.indexOf(order.status));
  const progress = ((stepIndex + 1) / STEPS.length) * 100;
  const isServed = order.status === "served";

  return (
    <div
      style={{
        backgroundColor: dark ? "#09090b" : "#fafafa",
        color: dark ? "#fafafa" : "#09090b",
        minHeight: "100vh",
        transition: "all 0.3s",
      }}
    >
      {/* HEADER */}
      <header
        className="sticky top-0 z-10 backdrop-blur border-b p-4 flex justify-between items-center"
        style={{
          backgroundColor: dark
            ? "rgba(9,9,11,0.8)"
            : "rgba(250,250,250,0.8)",
          borderColor: dark ? "#27272a" : "#e4e4e7",
        }}
      >
        <div>
          <h1 className="text-lg font-bold">Order Status</h1>
          <p className="text-xs opacity-60">Order #{order.order_id}</p>
        </div>

        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full border"
          style={{ borderColor: dark ? "#27272a" : "#d4d4d8" }}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* CONTENT */}
      <main className="p-4 space-y-6 pb-24">
        {/* SUCCESS MESSAGE */}
        {isServed && (
          <div
            className="rounded-xl border px-4 py-3 text-sm font-semibold"
            style={{
              backgroundColor: dark ? "#052e16" : "#dcfce7",
              color: "#166534",
              borderColor: "#22c55e",
            }}
          >
            ✅ Your order has been successfully served. Enjoy your meal!
          </div>
        )}

        {/* PROGRESS CARD */}
        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: dark ? "#18181b" : "#ffffff",
            borderColor: dark ? "#27272a" : "#e4e4e7",
          }}
        >
          <p className="text-sm font-semibold mb-3">
            Current Status: {STEPS_SHOW[stepIndex]}
          </p>

          {/* PROGRESS BAR */}
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: dark ? "#27272a" : "#e5e7eb" }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: isServed
                  ? "#22c55e"
                  : dark
                  ? "#fafafa"
                  : "#09090b",
              }}
            />
          </div>

          {/* STEPS */}
          <div className="flex justify-between text-[10px] mt-3">
            {STEPS_SHOW.map((label, i) => (
              <span
                key={label}
                style={{
                  opacity: i <= stepIndex ? 1 : 0.4,
                  fontWeight: i === stepIndex ? 600 : 400,
                  color: isServed ? "#22c55e" : "inherit",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ITEMS */}
        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: dark ? "#18181b" : "#ffffff",
            borderColor: dark ? "#27272a" : "#e4e4e7",
          }}
        >
          <h2 className="text-sm font-semibold mb-3">Items Ordered</h2>

          <div className="space-y-3">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="opacity-80">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">₹{item.price}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-4 pt-3 border-t flex justify-between font-semibold"
            style={{ borderColor: dark ? "#27272a" : "#e4e4e7" }}
          >
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="fixed bottom-0 left-0 right-0 p-4 border-t text-center text-xs opacity-60"
        style={{
          backgroundColor: dark ? "#09090b" : "#ffffff",
          borderColor: dark ? "#27272a" : "#e4e4e7",
        }}
      >
        Restaurant managed using Dinely!
      </footer>
    </div>
  );
}
