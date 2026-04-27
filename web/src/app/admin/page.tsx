"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  formatQar,
  services as defaultServices,
  workers,
  type ServiceOption,
} from "@/lib/wiper";
import type { SubscriptionRecord } from "@/lib/store";

type ApiOrder = {
  id: string;
  customer: string;
  service: string;
  zone: string;
  day?: string;
  slot: string;
  worker?: string;
  status: string;
  amount: number;
};

type AdminTab =
  | "dashboard"
  | "services"
  | "orders"
  | "subscriptions"
  | "workers"
  | "customers"
  | "invoices"
  | "ratings"
  | "promos"
  | "settings"
  | "logs";

const tabs: Array<{ id: AdminTab; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "services", label: "Services" },
  { id: "orders", label: "Orders" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "workers", label: "Workers" },
  { id: "customers", label: "Customers" },
  { id: "invoices", label: "Invoices" },
  { id: "ratings", label: "Ratings" },
  { id: "promos", label: "Promos" },
  { id: "settings", label: "Settings" },
  { id: "logs", label: "Audit logs" },
];

const customers = [
  ["Maha Al Thani", "The Pearl", "6 orders", formatQar(690)],
  ["Fahad Al Kuwari", "West Bay", "Subscription", formatQar(280)],
  ["Noora Saleh", "Lusail", "3 orders", formatQar(260)],
];

const invoices = [
  ["INV-8821", "WO-2048", "Paid", formatQar(150)],
  ["INV-8822", "SUB-104", "Paid", formatQar(280)],
  ["INV-8823", "WO-2050", "Pending", formatQar(80)],
];

const logs = [
  "Admin changed VIP wash price to QAR 150",
  "System assigned WO-2050 to Khaled Nasser",
  "Rating email queued for completed order WO-2047",
];

export default function AdminPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [serviceList, setServiceList] = useState<ServiceOption[]>(defaultServices);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [newService, setNewService] = useState({
    name: "",
    price: "90",
    duration: "60",
    kind: "single" as ServiceOption["kind"],
  });

  const revenue = useMemo(() => orders.reduce((total, order) => total + order.amount, 0), [orders]);

  useEffect(() => {
    async function loadData() {
      const [ordersResponse, subscriptionsResponse] = await Promise.all([
        fetch("/api/orders", { cache: "no-store" }),
        fetch("/api/subscriptions", { cache: "no-store" }),
      ]);

      if (ordersResponse.ok) {
        const data = (await ordersResponse.json()) as { orders: ApiOrder[] };
        setOrders(data.orders);
      }

      if (subscriptionsResponse.ok) {
        const data = (await subscriptionsResponse.json()) as { subscriptions: SubscriptionRecord[] };
        setSubscriptions(data.subscriptions);
      }
    }

    void loadData();
  }, []);

  function updateServicePrice(id: string, price: string) {
    const nextPrice = Number(price);
    setServiceList((items) =>
      items.map((item) =>
        item.id === id ? { ...item, price: Number.isNaN(nextPrice) ? 0 : nextPrice } : item,
      ),
    );
  }

  function addService() {
    if (!newService.name.trim()) return;

    const id = newService.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setServiceList((items) => [
      ...items,
      {
        id,
        label: { en: newService.name, ar: newService.name },
        description: {
          en: "New admin-created service.",
          ar: "خدمة جديدة من لوحة التحكم.",
        },
        price: Number(newService.price) || 0,
        durationMinutes: Number(newService.duration) || 60,
        kind: newService.kind,
      },
    ]);
    setNewService({ name: "", price: "90", duration: "60", kind: "single" });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f6] text-[#1E3951]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(255,0,125,0.12),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(68,152,131,0.14),transparent_26%)]" />
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-72 border-r border-[#1E3951]/10 bg-white/92 shadow-[0_24px_70px_rgba(30,57,81,0.12)] backdrop-blur-xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-24 items-center justify-between gap-3 px-4">
          <Image
            alt="WIPER"
            className="h-auto w-36"
            height={249}
            src="/wiperclear.png"
            width={521}
          />
          <span className="rounded-full bg-[#FF007D]/12 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#FF007D]">
            Admin
          </span>
        </div>

        <nav className="space-y-2 px-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`focus-ring flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                activeTab === tab.id
                  ? "bg-[#FF007D] text-white shadow-[0_16px_35px_rgba(255,0,125,0.22)]"
                  : "bg-[#f7f7f6] text-[#1E3951]/72 hover:text-[#1E3951]"
              }`}
              type="button"
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <button
        className={`focus-ring fixed top-1/2 z-40 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#1E3951]/15 bg-white text-lg font-black text-[#1E3951] shadow-[0_10px_24px_rgba(30,57,81,0.16)] transition-all duration-300 ${
          drawerOpen ? "left-[16.4rem]" : "left-2"
        }`}
        onClick={() => setDrawerOpen((open) => !open)}
        type="button"
        aria-label="Toggle admin sidebar"
      >
        {drawerOpen ? "‹" : "›"}
      </button>

      <section className={`min-h-screen transition-[padding] duration-300 ${drawerOpen ? "pl-72" : "pl-0"}`}>
        <header className="sticky top-0 z-20 border-b border-[#1E3951]/10 bg-[#f7f7f6]/86 px-6 py-5 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#FF007D]">
                Admin only
              </p>
              <h1 className="mt-1 text-4xl font-black tracking-[-0.05em]">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex gap-3">
              <button className="rounded-full bg-white px-5 py-3 text-sm font-black shadow-sm" type="button">
                Export
              </button>
              <button className="rounded-full bg-[#1E3951] px-5 py-3 text-sm font-black text-white" type="button">
                Save changes
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-4">
                {[
                  ["Revenue", formatQar(revenue)],
                  ["Open invoices", "12"],
                  ["Completion rate", "94%"],
                  ["Average rating", "4.8"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(30,57,81,0.08)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#1E3951]/45">
                      {label}
                    </p>
                    <p className="mt-4 text-4xl font-black text-[#FF007D]">{value}</p>
                  </div>
                ))}
              </div>
              <Panel title="Command shortcuts">
                <div className="grid gap-3 md:grid-cols-4">
                  {["Assign queued orders", "Send rating emails", "Create promo", "Download invoices"].map((action) => (
                    <button key={action} className="rounded-2xl bg-[#f7f7f6] p-4 text-left font-black" type="button">
                      {action}
                    </button>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "services" && (
            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <Panel title="Prices and service catalog">
                <div className="space-y-3">
                  {serviceList.map((service) => (
                    <div key={service.id} className="grid gap-3 rounded-3xl bg-[#f7f7f6] p-4 md:grid-cols-[1fr_120px_120px_120px] md:items-center">
                      <div>
                        <p className="font-black">{service.label.en}</p>
                        <p className="text-sm text-[#1E3951]/55">{service.description.en}</p>
                      </div>
                      <input
                        className="rounded-2xl border border-[#1E3951]/10 bg-white px-4 py-3 font-black"
                        value={service.price}
                        onChange={(event) => updateServicePrice(service.id, event.target.value)}
                        aria-label={`${service.label.en} price`}
                      />
                      <span className="rounded-2xl bg-white px-4 py-3 text-sm font-black">
                        {service.durationMinutes} min
                      </span>
                      <span className="rounded-2xl bg-[#FF007D]/10 px-4 py-3 text-sm font-black capitalize text-[#FF007D]">
                        {service.kind}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Add service">
                <div className="space-y-3">
                  <input className="admin-input" placeholder="Service name" value={newService.name} onChange={(event) => setNewService({ ...newService, name: event.target.value })} />
                  <input className="admin-input" placeholder="Price QAR" value={newService.price} onChange={(event) => setNewService({ ...newService, price: event.target.value })} />
                  <input className="admin-input" placeholder="Duration minutes" value={newService.duration} onChange={(event) => setNewService({ ...newService, duration: event.target.value })} />
                  <select className="admin-input" value={newService.kind} onChange={(event) => setNewService({ ...newService, kind: event.target.value as ServiceOption["kind"] })}>
                    <option value="single">Single</option>
                    <option value="subscription">Subscription</option>
                  </select>
                  <button className="w-full rounded-full bg-[#FF007D] px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-white" onClick={addService} type="button">
                    Add service
                  </button>
                </div>
              </Panel>
            </div>
          )}

          {activeTab === "orders" && (
            <Panel title="Order actions">
              <AdminTable
                headers={["ID", "Customer", "Service", "Zone", "Slot", "Worker", "Status", "Amount"]}
                rows={orders.map((order) => [
                  order.id,
                  order.customer,
                  order.service,
                  order.zone,
                  order.day ? `${order.day} | ${order.slot}` : order.slot,
                  order.worker ?? "Queue",
                  order.status.replace("_", " "),
                  formatQar(order.amount),
                ])}
              />
            </Panel>
          )}

          {activeTab === "subscriptions" && (
            <Panel title="Subscription controls">
              <AdminTable
                headers={["ID", "Customer", "Plate", "Weekday", "Time", "Status", "Amount"]}
                rows={subscriptions.map((subscription) => [
                  subscription.id,
                  subscription.customer,
                  subscription.plateNumber,
                  subscription.weekday,
                  subscription.slot,
                  subscription.status,
                  formatQar(subscription.amount),
                ])}
              />
            </Panel>
          )}

          {activeTab === "workers" && (
            <Panel title="Worker dispatch">
              <div className="grid gap-4 md:grid-cols-3">
                {workers.map((worker) => (
                  <div key={worker.id} className="rounded-3xl bg-[#f7f7f6] p-5">
                    <p className="text-xl font-black">{worker.name}</p>
                    <p className="mt-1 text-sm text-[#1E3951]/58">{worker.location} | {worker.shift}</p>
                    <p className="mt-4 font-black text-[#FF007D]">Rating {worker.rating}</p>
                    <button className="mt-4 rounded-full bg-[#1E3951] px-4 py-2 text-sm font-black text-white" type="button">Assign job</button>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {activeTab === "customers" && (
            <Panel title="Customer logs">
              <AdminTable headers={["Customer", "Area", "History", "Spend"]} rows={customers} />
            </Panel>
          )}

          {activeTab === "invoices" && (
            <Panel title="Invoices and receipts">
              <AdminTable headers={["Invoice", "Reference", "Status", "Total"]} rows={invoices} />
            </Panel>
          )}

          {activeTab === "ratings" && (
            <Panel title="Ratings commands">
              <ActionGrid actions={["Send pending rating emails", "Review low ratings", "Export comments", "Open dispute log"]} />
            </Panel>
          )}

          {activeTab === "promos" && (
            <Panel title="Promo manager">
              <div className="grid gap-3 md:grid-cols-3">
                <input className="admin-input" placeholder="Code e.g. WIPER20" />
                <input className="admin-input" placeholder="Discount %" />
                <button className="rounded-full bg-[#FF007D] px-5 py-4 font-black text-white" type="button">Create promo</button>
              </div>
            </Panel>
          )}

          {activeTab === "settings" && (
            <Panel title="System settings">
              <ActionGrid actions={["Set VAT rate", "Edit working hours", "Set slot duration", "Configure email sender", "Manage admin roles", "Assignment rules"]} />
            </Panel>
          )}

          {activeTab === "logs" && (
            <Panel title="Audit logs">
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log} className="rounded-2xl bg-[#f7f7f6] p-4 font-bold">{log}</div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(30,57,81,0.08)]">
      <h2 className="mb-5 text-2xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function ActionGrid({ actions }: { actions: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <button key={action} className="rounded-2xl bg-[#f7f7f6] p-5 text-left font-black" type="button">
          {action}
        </button>
      ))}
    </div>
  );
}

function AdminTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left text-sm">
        <thead className="text-[#1E3951]/45">
          <tr>{headers.map((header) => <th key={header} className="px-4">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="bg-[#f7f7f6]">
              {row.map((cell, index) => (
                <td key={cell + index} className={`px-4 py-4 font-bold ${index === 0 ? "rounded-l-2xl" : ""} ${index === row.length - 1 ? "rounded-r-2xl text-[#FF007D]" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
