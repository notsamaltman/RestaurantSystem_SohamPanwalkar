import { useState, useEffect } from "react";
import { Plus, Minus, Moon, Sun } from "lucide-react";
import { useParams } from "react-router-dom";
import { serverLink } from "@/utils/links";

export default function OrderingPage() {
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState({});
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { restaurant_id, table_id } = useParams();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(serverLink+`info/${restaurant_id}/`);
        if (!res.ok) throw new Error("Failed to fetch restaurant");
        const data = await res.json();
        setRestaurant({
          name: data.restaurant.name,
          description: data.restaurant.description,
          address: data.restaurant.address,
        });
        setMenu(data.menu);
      } catch (err) {
        console.error(err);
        setError("Unable to load restaurant data");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [restaurant_id]);

  const add = (item) => {
    setCart((c) => ({
      ...c,
      [item.id]: c[item.id]
        ? { ...c[item.id], qty: c[item.id].qty + 1 }
        : { ...item, qty: 1 },
    }));
  };

  const remove = (item) => {
    setCart((c) => {
      if (!c[item.id]) return c;
      if (c[item.id].qty === 1) {
        const copy = { ...c };
        delete copy[item.id];
        return copy;
      }
      return { ...c, [item.id]: { ...c[item.id], qty: c[item.id].qty - 1 } };
    });
  };

  const total = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!restaurant) return null;

  return (
    <div
      style={{
        backgroundColor: dark ? "#09090b" : "#fafafa",
        color: dark ? "#fafafa" : "#09090b",
        minHeight: "100vh",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: dark ? "rgba(9,9,11,0.8)" : "rgba(250,250,250,0.8)",
          borderColor: dark ? "#27272a" : "#e4e4e7",
        }}
        className="sticky top-0 z-10 backdrop-blur border-b p-4 flex justify-between items-center"
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight">{restaurant.name}</h1>
          <p className="text-xs opacity-70">{restaurant.description} · Table {table_id}</p>
          <p className="text-[11px] opacity-50">{restaurant.address}</p>
        </div>
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full border"
          style={{ borderColor: dark ? "#27272a" : "#d4d4d8" }}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Menu */}
      <main className="p-4 pb-32 space-y-8">
        {menu.map((section) => (
          <section key={section.category}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-60">
              {section.category}
            </h2>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: dark ? "#18181b" : "#ffffff",
                    borderColor: dark ? "#27272a" : "#e4e4e7",
                  }}
                  className="rounded-2xl border p-4 transition"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm opacity-70 mt-1">{item.description || item.desc}</p>
                      <span
                        style={{
                          backgroundColor: item.veg
                            ? dark
                              ? "#052e16"
                              : "#dcfce7"
                            : dark
                            ? "#450a0a"
                            : "#fee2e2",
                          color: item.veg
                            ? dark
                              ? "#4ade80"
                              : "#166534"
                            : dark
                            ? "#f87171"
                            : "#991b1b",
                        }}
                        className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        {item.veg ? "VEG" : "NON-VEG"}
                      </span>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <span className="font-semibold">₹{item.price}</span>

                      {!cart[item.id] ? (
                        <button
                          onClick={() => add(item)}
                          className="mt-3 px-4 py-1.5 text-sm rounded-full"
                          style={{
                            backgroundColor: dark ? "#fafafa" : "#09090b",
                            color: dark ? "#09090b" : "#fafafa",
                          }}
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={() => remove(item)}>
                            <Minus size={16} />
                          </button>
                          <span>{cart[item.id].qty}</span>
                          <button onClick={() => add(item)}>
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Checkout Bar */}
      <footer
        style={{
          backgroundColor: dark ? "#09090b" : "#ffffff",
          borderColor: dark ? "#27272a" : "#e4e4e7",
        }}
        className="fixed bottom-0 left-0 right-0 p-4 border-t flex justify-between items-center"
      >
        <div>
          <p className="text-xs opacity-60">Total</p>
          <p className="text-lg font-bold">₹{total}</p>
        </div>
        <button
          disabled={!total}
          className="px-6 py-3 rounded-xl font-semibold disabled:opacity-40"
          style={{
            backgroundColor: dark ? "#fafafa" : "#09090b",
            color: dark ? "#09090b" : "#fafafa",
          }}
        >
          Place Order
        </button>
      </footer>
    </div>
  );
}
