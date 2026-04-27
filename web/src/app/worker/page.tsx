"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type WorkerOrder = {
  id: string;
  customer: string;
  plateNumber: string;
  service: string;
  status: string;
  zone: string;
  slot: string;
  worker?: string;
};

export default function WorkerPage() {
  const [orders, setOrders] = useState<WorkerOrder[]>([]);
  const [active, setActive] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadOrders() {
      const response = await fetch("/api/orders", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { orders: WorkerOrder[] };
      const openOrders = data.orders.filter((order) => order.status !== "completed");
      setOrders(openOrders);
      setActive((current) => current ?? openOrders[0]?.id);
    }

    void loadOrders();
  }, []);

  const current = useMemo(
    () => orders.find((order) => order.id === active) ?? orders[0],
    [active, orders],
  );

  async function updateStatus(action: "accept" | "start" | "complete") {
    if (!current?.id) return;
    const response = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: current.id, action }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as { order: WorkerOrder };

    setOrders((items) => {
      const next = items
        .map((item) => (item.id === current.id ? data.order : item))
        .filter((item) => item.status !== "completed");
      if (!next.find((item) => item.id === active)) {
        setActive(next[0]?.id);
      }
      return next;
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f6] text-[#1E3951]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(255,0,125,0.12),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(68,152,131,0.14),transparent_26%)]" />
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link href="/" className="block w-28 sm:w-36" aria-label="WIPER home">
          <Image
            alt="WIPER logo"
            className="h-auto w-full"
            height={249}
            priority
            src="/wiperclear.png"
            width={521}
          />
        </Link>
        <span className="rounded-full border border-[#1E3951]/15 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#1E3951]/70">
          Worker
        </span>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-[380px_1fr]">
        <aside className="rounded-[2rem] border border-[#1E3951]/10 bg-white p-5 shadow-[0_18px_45px_rgba(30,57,81,0.08)]">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#FF007D]">
            Worker
          </p>
          <h1 className="mt-4 text-4xl font-black">Today&apos;s queue</h1>
          <p className="mt-3 text-[#1E3951]/62">
            Accept jobs, start service, complete work, and upload photo proof.
          </p>
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setActive(order.id)}
                type="button"
                className={`focus-ring w-full rounded-3xl border p-4 text-left ${
                  active === order.id
                    ? "border-[#FF007D] bg-[#FF007D]/16"
                    : "border-[#1E3951]/10 bg-[#f7f7f6]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black">{order.id}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#1E3951]/46">
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#1E3951]/62">
                  {order.service} | {order.plateNumber}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1E3951]/52">
                  {order.customer} | {order.zone}
                </p>
              </button>
            ))}
            {orders.length === 0 && (
              <div className="rounded-3xl border border-dashed border-[#1E3951]/20 bg-[#f7f7f6] p-4 text-sm font-bold text-[#1E3951]/58">
                No open jobs in queue.
              </div>
            )}
          </div>
        </aside>

        <section className="rounded-[2rem] border border-[#1E3951]/10 bg-white p-6 shadow-[0_18px_45px_rgba(30,57,81,0.08)] sm:p-8">
          {!current ? (
            <div className="grid min-h-80 place-items-center text-center">
              <p className="text-lg font-black text-[#1E3951]/58">All queued jobs are completed.</p>
            </div>
          ) : (
            <>
          <div className="flex flex-col justify-between gap-5 border-b border-[#1E3951]/10 pb-6 sm:flex-row">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#FF007D]">
                {current.id}
              </p>
              <h2 className="mt-3 text-4xl font-black">{current.service}</h2>
              <p className="mt-2 text-[#1E3951]/64">
                {current.customer} | Plate {current.plateNumber}
              </p>
            </div>
            <span className="h-fit rounded-full bg-[#f7f7f6] px-4 py-2 text-sm font-black capitalize">
              {current.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              ["Location", current.zone],
              ["Time window", current.slot],
              ["Plate number", current.plateNumber],
              ["Assigned worker", current.worker ?? "Take from queue"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-[#f7f7f6] p-5">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#1E3951]/42">
                  {label}
                </p>
                <p className="mt-3 text-xl font-black">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#1E3951]/10 bg-[#f7f7f6] p-6">
              <h3 className="text-2xl font-black">Job checklist</h3>
              <div className="mt-5 space-y-3">
                {[
                  "Confirm customer and car details",
                  "Confirm plate number before accepting",
                  "Capture before photos",
                  "Complete selected service checklist",
                  "Capture after photos",
                  "Mark job complete to trigger rating email",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-[#1E3951]/10 bg-white p-3 text-sm font-bold"
                  >
                    <input type="checkbox" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#1E3951]/10 bg-[#f7f7f6] p-6">
              <h3 className="text-2xl font-black">Photo proof</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {["Before", "After"].map((label) => (
                  <div
                    key={label}
                    className="grid min-h-44 place-items-center rounded-3xl border border-dashed border-[#1E3951]/20 bg-white text-center"
                  >
                    <div>
                      <p className="font-black">{label}</p>
                      <p className="mt-2 text-xs text-[#1E3951]/46">
                        Upload image
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-[#1E3951]/56">
                Uploaded photos are visible in admin and attached to the
                completed work order.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {["Accept", "Start job", "Complete job"].map((action) => (
              <button
                key={action}
                type="button"
                    onClick={() =>
                      action === "Accept"
                        ? void updateStatus("accept")
                        : action === "Start job"
                          ? void updateStatus("start")
                          : void updateStatus("complete")
                    }
                className="focus-ring rounded-full bg-[#FF007D] px-6 py-4 text-sm font-black uppercase tracking-[0.18em]"
              >
                {action}
              </button>
            ))}
          </div>
              </>
            )}
        </section>
      </section>
    </main>
  );
}
