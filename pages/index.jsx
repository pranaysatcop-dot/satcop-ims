import { useState, useEffect, useRef } from "react";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#f0f4f8",
  surface: "#ffffff",
  surfaceAlt: "#f7f9fc",
  border: "#e2e8f0",
  borderBright: "#cbd5e1",
  accent: "#2563eb",
  accentGlow: "#2563eb15",
  green: "#16a34a",
  greenGlow: "#16a34a12",
  amber: "#d97706",
  red: "#dc2626",
  text: "#0f172a",
  textMid: "#475569",
  textDim: "#94a3b8",
  yellow: "#ca8a04",
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const INVENTORY = [
  { id: "INV-001", sku: "GPS-VT-001", name: "GPS Tracker GT06N", category: "GPS Device", brand: "Concox", model: "GT06N", stock: 42, reserved: 8, min: 10, location: "WH-A", rack: "R01", price: 1850, status: "active", warranty: "2026-03-15", serial: "SN2024001" },
  { id: "INV-002", sku: "RFID-RDR-002", name: "RFID Reader 125kHz", category: "RFID", brand: "HID", model: "RDR-60", stock: 7, reserved: 2, min: 10, location: "WH-A", rack: "R02", price: 4200, status: "low_stock", warranty: "2025-12-01", serial: "SN2024002" },
  { id: "INV-003", sku: "CAM-IP-003", name: "IP Camera 4MP", category: "Surveillance", brand: "Hikvision", model: "DS-2CD2143G2", stock: 28, reserved: 5, min: 8, location: "WH-B", rack: "R05", price: 6500, status: "active", warranty: "2027-01-20", serial: "SN2024003" },
  { id: "INV-004", sku: "CBL-POE-004", name: "POE Cable Cat6 (30m)", category: "Cable", brand: "D-Link", model: "NCB-C6UGRYR1-1", stock: 3, reserved: 1, min: 15, location: "WH-A", rack: "R08", price: 380, status: "critical", warranty: "-", serial: "-" },
  { id: "INV-005", sku: "SWT-POE-005", name: "POE Switch 8-Port", category: "Networking", brand: "TP-Link", model: "TL-SF1009P", stock: 14, reserved: 0, min: 5, location: "WH-B", rack: "R03", price: 3200, status: "active", warranty: "2026-09-10", serial: "SN2024005" },
  { id: "INV-006", sku: "SIM-4G-006", name: "4G SIM Card (Jio)", category: "Connectivity", brand: "Jio", model: "IoT SIM", stock: 89, reserved: 12, min: 20, location: "WH-A", rack: "R10", price: 299, status: "active", warranty: "-", serial: "-" },
  { id: "INV-007", sku: "ANT-GPS-007", name: "GPS Antenna External", category: "Accessory", brand: "Generic", model: "SMA-GPS", stock: 0, reserved: 0, min: 10, location: "WH-B", rack: "R07", price: 150, status: "out_of_stock", warranty: "-", serial: "-" },
  { id: "INV-008", sku: "NVR-16-008", name: "NVR 16 Channel", category: "Surveillance", brand: "Dahua", model: "DHI-NVR4416", stock: 6, reserved: 2, min: 3, location: "WH-B", rack: "R04", price: 22500, status: "active", warranty: "2027-06-01", serial: "SN2024008" },
];

const TRANSACTIONS = [
  { id: "TXN-001", type: "stock_out", item: "GPS Tracker GT06N", qty: 5, by: "Rahul Kumar", date: "2025-05-18", status: "approved", customer: "Maharashtra MSRTC" },
  { id: "TXN-002", type: "stock_in", item: "IP Camera 4MP", qty: 20, by: "Priya Store Mgr", date: "2025-05-18", status: "completed", customer: "-" },
  { id: "TXN-003", type: "return", item: "GPS Tracker GT06N", qty: 2, by: "Arun Tech", date: "2025-05-17", status: "pending", customer: "Pune PMPML" },
  { id: "TXN-004", type: "stock_out", item: "POE Cable Cat6", qty: 8, by: "Vijay Sales", date: "2025-05-17", status: "pending_approval", customer: "Delhi Metro" },
  { id: "TXN-005", type: "replacement", item: "RFID Reader 125kHz", qty: 1, by: "Suresh Tech", date: "2025-05-16", status: "approved", customer: "Infosys Pune" },
  { id: "TXN-006", type: "purchase", item: "POE Cable Cat6 (30m)", qty: 50, by: "Priya Store Mgr", date: "2025-05-15", status: "director_approval", customer: "-" },
];

const APPROVALS = [
  { id: "APR-001", type: "Stock Out", item: "POE Cable Cat6 (30m)", qty: 8, requestedBy: "Vijay Sales", date: "2025-05-17", priority: "high", stage: "Accountant Review" },
  { id: "APR-002", type: "Purchase Request", item: "POE Cable Cat6 (30m)", qty: 50, requestedBy: "Priya Store Mgr", date: "2025-05-15", priority: "critical", stage: "Director Approval" },
  { id: "APR-003", type: "Inventory Add", item: "Smart Bus Validator", qty: 25, requestedBy: "Admin", date: "2025-05-14", priority: "medium", stage: "Director Approval" },
  { id: "APR-004", type: "Return", item: "GPS Tracker GT06N", qty: 2, requestedBy: "Arun Tech", date: "2025-05-17", priority: "low", stage: "Store Manager Review" },
];

const VENDORS = [
  { id: "V-001", name: "Concox Technologies", contact: "Ramesh@concox.in", items: 12, status: "active" },
  { id: "V-002", name: "HID Global India", contact: "sales@hidglobal.in", items: 8, status: "active" },
  { id: "V-003", name: "Hikvision India", contact: "info@hikvision.in", items: 24, status: "active" },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "inventory", label: "Inventory", icon: "⊞" },
  { id: "transactions", label: "Transactions", icon: "⇌" },
  { id: "approvals", label: "Approvals", icon: "◎", badge: 4 },
  { id: "purchase", label: "Purchase", icon: "⊕" },
  { id: "reports", label: "Reports", icon: "▤" },
  { id: "vendors", label: "Vendors", icon: "◇" },
  { id: "users", label: "Users", icon: "○" },
  { id: "settings", label: "Settings", icon: "⊙" },
];

const STAT_CARDS = [
  { label: "Total Items", value: "248", sub: "+12 this month", color: C.accent, icon: "⊞" },
  { label: "Inventory Value", value: "₹18.4L", sub: "across all warehouses", color: C.green, icon: "◈" },
  { label: "Low Stock Alerts", value: "7", sub: "requires attention", color: C.amber, icon: "⚠" },
  { label: "Pending Approvals", value: "4", sub: "awaiting action", color: C.red, icon: "◎" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusBadge = (s) => {
  const map = {
    active: { label: "Active", bg: "#dcfce7", color: "#15803d" },
    low_stock: { label: "Low Stock", bg: "#fef3c7", color: "#b45309" },
    critical: { label: "Critical", bg: "#fee2e2", color: "#b91c1c" },
    out_of_stock: { label: "Out of Stock", bg: "#fee2e2", color: "#b91c1c" },
    approved: { label: "Approved", bg: "#dcfce7", color: "#15803d" },
    completed: { label: "Completed", bg: "#dbeafe", color: "#1d4ed8" },
    pending: { label: "Pending", bg: "#fef3c7", color: "#b45309" },
    pending_approval: { label: "Pending Approval", bg: "#fee2e2", color: "#b91c1c" },
    director_approval: { label: "Director Approval", bg: "#ede9fe", color: "#6d28d9" },
  };
  const cfg = map[s] || { label: s, bg: "#1d2130", color: "#8892a4" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "monospace" }}>
      {cfg.label}
    </span>
  );
};

const txnType = (t) => {
  const map = { stock_out: ["↑ Out", "#ef4444"], stock_in: ["↓ In", "#22c97a"], return: ["↩ Return", "#f59e0b"], replacement: ["⇄ Replace", "#a78bfa"], purchase: ["⊕ Purchase", "#4f8ef7"] };
  const [label, color] = map[t] || [t, "#8892a4"];
  return <span style={{ color, fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{label}</span>;
};

// ── Components ────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, role }) {
  return (
    <aside style={{ width: 220, minHeight: "100vh", background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #2563eb, #4f46e5)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff" }}>◈</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>SATCOP</div>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace", letterSpacing: "0.12em" }}>INDIA · IMS</div>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}30`, borderRadius: 6, padding: "6px 10px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
          <span style={{ fontSize: 10, color: C.accent, fontFamily: "monospace", fontWeight: 700 }}>{role}</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 12px" }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7, border: "none", cursor: "pointer", marginBottom: 2,
              background: active === item.id ? `${C.accent}15` : "transparent",
              color: active === item.id ? C.accent : C.textMid,
              transition: "all 0.15s",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 14, width: 18, textAlign: "center", opacity: active === item.id ? 1 : 0.6 }}>{item.icon}</span>
            <span style={{ fontSize: 12, fontWeight: active === item.id ? 700 : 500, letterSpacing: "0.01em" }}>{item.label}</span>
            {item.badge && (
              <span style={{ marginLeft: "auto", background: C.red, color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 10, padding: "1px 5px", fontFamily: "monospace" }}>
                {item.badge}
              </span>
            )}
            {active === item.id && (
              <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, background: C.accent, borderRadius: "0 3px 3px 0" }} />
            )}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "16px 16px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800 }}>
            D
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>Director</div>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>satcop.india</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, sub }) {
  const [search, setSearch] = useState("");
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
        <p style={{ fontSize: 11, color: C.textDim, margin: 0, fontFamily: "monospace", marginTop: 2 }}>{sub}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inventory, SKU, serial..."
            style={{ width: 260, background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px 8px 32px", color: C.text, fontSize: 11, fontFamily: "monospace", outline: "none" }}
          />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textDim, fontSize: 12 }}>⌕</span>
        </div>
        <button style={{ background: C.accentGlow, border: `1px solid ${C.accent}40`, color: C.accent, borderRadius: 8, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" }}>
          + New Entry
        </button>
      </div>
    </div>
  );
}

// ── Dashboard View ────────────────────────────────────────────────────────────
function Dashboard() {
  const bar = (pct, color) => (
    <div style={{ height: 4, background: C.border, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4 }} />
    </div>
  );

  return (
    <div style={{ padding: 28, overflowY: "auto", flex: 1 }}>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {STAT_CARDS.map((card, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: card.color }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>{card.label}</span>
              <span style={{ fontSize: 18, opacity: 0.4, color: card.color }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: "-0.04em", marginBottom: 4 }}>{card.value}</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Recent Transactions */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.text }}>Recent Transactions</span>
            <span style={{ fontSize: 10, color: C.accent, fontFamily: "monospace", cursor: "pointer" }}>View all →</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID", "Type", "Item", "Qty", "By", "Status"].map(h => (
                  <th key={h} style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace", letterSpacing: "0.08em", textAlign: "left", paddingBottom: 10, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.slice(0, 5).map((t, i) => (
                <tr key={t.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 0", fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{t.id}</td>
                  <td style={{ padding: "10px 0" }}>{txnType(t.type)}</td>
                  <td style={{ padding: "10px 0", fontSize: 11, color: C.text, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.item}</td>
                  <td style={{ padding: "10px 0", fontSize: 11, color: C.text, fontFamily: "monospace" }}>{t.qty}</td>
                  <td style={{ padding: "10px 0", fontSize: 10, color: C.textMid }}>{t.by}</td>
                  <td style={{ padding: "10px 0" }}>{statusBadge(t.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts Panel */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 16 }}>Stock Alerts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INVENTORY.filter(i => ["low_stock","critical","out_of_stock"].includes(i.status)).map(item => (
              <div key={item.id} style={{ padding: "10px 12px", background: C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: C.text, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>{item.sku} · {item.location}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {statusBadge(item.status)}
                  <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", marginTop: 4 }}>{item.stock} left / min {item.min}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 16 }}>Inventory by Category</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { name: "GPS Devices", count: 42, pct: 84, color: C.accent },
            { name: "RFID", count: 7, pct: 35, color: C.yellow },
            { name: "Surveillance", count: 34, pct: 68, color: C.green },
            { name: "Cables & Acc.", count: 3, pct: 12, color: C.red },
            { name: "Networking", count: 14, pct: 70, color: "#a78bfa" },
            { name: "Connectivity", count: 89, pct: 100, color: C.green },
            { name: "NVR/DVR", count: 6, pct: 60, color: C.accent },
            { name: "Accessories", count: 0, pct: 0, color: C.red },
          ].map((cat, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: C.textMid }}>{cat.name}</span>
                <span style={{ fontSize: 10, color: C.text, fontFamily: "monospace", fontWeight: 700 }}>{cat.count}</span>
              </div>
              {bar(cat.pct, cat.color)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Inventory View ────────────────────────────────────────────────────────────
function InventoryView() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = filter === "all" ? INVENTORY : INVENTORY.filter(i => i.status === filter);

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["all", "All Items"], ["active", "Active"], ["low_stock", "Low Stock"], ["critical", "Critical"], ["out_of_stock", "Out of Stock"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: "6px 14px", borderRadius: 6, border: `1px solid ${filter === val ? C.accent : C.border}`,
              background: filter === val ? `${C.accent}15` : "transparent", color: filter === val ? C.accent : C.textMid,
              fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "monospace",
            }}>{label}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.textMid, fontSize: 11, cursor: "pointer" }}>⤓ Export</button>
            <button style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.textMid, fontSize: 11, cursor: "pointer" }}>⤒ Import</button>
            <button style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.accent}`, background: `${C.accent}15`, color: C.accent, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+ Add Item</button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.surfaceAlt }}>
                {["SKU", "Item Name", "Category", "Stock", "Reserved", "Location", "Price", "Warranty", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 9, color: C.textDim, fontFamily: "monospace", letterSpacing: "0.08em", textAlign: "left", fontWeight: 700, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(selected?.id === item.id ? null : item)}
                  style={{
                    borderBottom: `1px solid ${C.border}`, cursor: "pointer",
                    background: selected?.id === item.id ? `${C.accent}08` : "transparent",
                    transition: "background 0.1s",
                  }}
                >
                  <td style={{ padding: "12px 14px", fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{item.sku}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace", marginTop: 1 }}>{item.brand} · {item.model}</div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 10, color: C.textMid }}>{item.category}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: item.stock === 0 ? C.red : item.stock < item.min ? C.amber : C.text, fontFamily: "monospace" }}>{item.stock}</span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 11, color: C.textMid, fontFamily: "monospace" }}>{item.reserved}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: C.textMid }}>{item.location} / {item.rack}</span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 11, color: C.text, fontFamily: "monospace" }}>₹{item.price.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px", fontSize: 10, color: item.warranty === "-" ? C.textDim : C.textMid, fontFamily: "monospace" }}>{item.warranty}</td>
                  <td style={{ padding: "12px 14px" }}>{statusBadge(item.status)}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "3px 8px", fontSize: 9, border: `1px solid ${C.border}`, borderRadius: 4, background: "transparent", color: C.textMid, cursor: "pointer" }}>Edit</button>
                      <button style={{ padding: "3px 8px", fontSize: 9, border: `1px solid ${C.border}`, borderRadius: 4, background: "transparent", color: C.textMid, cursor: "pointer" }}>QR</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div style={{ width: 300, borderLeft: `1px solid ${C.border}`, background: C.surface, padding: 24, overflowY: "auto", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 4 }}>{selected.name}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{selected.sku}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: C.textDim, fontSize: 18, cursor: "pointer" }}>×</button>
          </div>

          {statusBadge(selected.status)}

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Item ID", selected.id],
              ["Brand / Model", `${selected.brand} · ${selected.model}`],
              ["Category", selected.category],
              ["Current Stock", selected.stock],
              ["Reserved", selected.reserved],
              ["Available", selected.stock - selected.reserved],
              ["Min Stock", selected.min],
              ["Location", `${selected.location} / Rack ${selected.rack}`],
              ["Purchase Price", `₹${selected.price.toLocaleString()}`],
              ["Warranty Expiry", selected.warranty],
              ["Serial/Batch", selected.serial],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 12, color: C.text, fontFamily: ["Current Stock","Reserved","Available","Min Stock"].includes(k) ? "monospace" : "inherit", fontWeight: ["Current Stock"].includes(k) ? 800 : 400 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["↑ Stock Out", C.red, `${C.red}15`],
              ["↓ Stock In", C.green, `${C.green}15`],
              ["↩ Return / Replace", C.amber, `${C.amber}15`],
              ["⊕ Raise Purchase", C.accent, `${C.accent}15`],
            ].map(([label, color, bg]) => (
              <button key={label} style={{ padding: "9px", borderRadius: 7, border: `1px solid ${color}40`, background: bg, color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Approvals View ────────────────────────────────────────────────────────────
function ApprovalsView() {
  const [approvals, setApprovals] = useState(APPROVALS);

  const priorityColor = { high: C.amber, critical: C.red, medium: C.accent, low: C.textDim };

  const handleAction = (id, action) => {
    setApprovals(a => a.filter(i => i.id !== id));
  };

  return (
    <div style={{ padding: 28, overflowY: "auto", flex: 1 }}>
      {/* Approval pipeline */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Sales Person Review", count: 1, color: C.textDim },
          { label: "Store Manager", count: 1, color: C.accent },
          { label: "Accountant", count: 1, color: C.amber },
          { label: "Director Approval", count: 2, color: C.red },
        ].map((stage, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, position: "relative" }}>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Stage {i + 1}</div>
            <div style={{ fontSize: 11, color: C.text, fontWeight: 700, marginBottom: 6 }}>{stage.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: stage.color, fontFamily: "monospace" }}>{stage.count}</div>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>pending</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      {approvals.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.textDim, fontFamily: "monospace" }}>
          <div style={{ fontSize: 32, marginBottom: 12, color: C.green }}>✓</div>
          All approvals handled!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {approvals.map(apr => (
            <div key={apr.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{apr.id}</span>
                    <span style={{ background: `${priorityColor[apr.priority]}20`, color: priorityColor[apr.priority], fontSize: 9, fontFamily: "monospace", fontWeight: 800, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase" }}>{apr.priority}</span>
                    <span style={{ background: `${C.accent}15`, color: C.accent, fontSize: 9, fontFamily: "monospace", fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>{apr.type}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 4 }}>{apr.item}</div>
                  <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>
                    Qty: <strong style={{ color: C.text }}>{apr.qty}</strong> · Requested by: {apr.requestedBy} · {apr.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Stage</div>
                  <div style={{ fontSize: 11, color: C.amber, fontFamily: "monospace", fontWeight: 700 }}>{apr.stage}</div>
                </div>
              </div>

              {/* Workflow trail */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 16, background: C.surfaceAlt, borderRadius: 8, padding: "8px 12px" }}>
                {["Requested", "Store Review", "Accountant", "Director", "Done"].map((step, i, arr) => {
                  const stageMap = { "Requested": 0, "Store Manager Review": 1, "Accountant Review": 2, "Director Approval": 3 };
                  const currentIdx = stageMap[apr.stage] ?? 0;
                  const done = i <= currentIdx;
                  return (
                    <>
                      <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: done ? C.accent : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: done ? "#fff" : C.textDim, fontWeight: 800 }}>{done ? "✓" : i + 1}</div>
                        <div style={{ fontSize: 8, color: done ? C.accent : C.textDim, fontFamily: "monospace", marginTop: 4, whiteSpace: "nowrap" }}>{step}</div>
                      </div>
                      {i < arr.length - 1 && <div style={{ flex: 1, height: 1, background: done && i < currentIdx ? C.accent : C.border, margin: "0 4px", marginBottom: 14 }} />}
                    </>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleAction(apr.id, "approve")} style={{ padding: "8px 20px", borderRadius: 7, border: `1px solid ${C.green}40`, background: `${C.green}12`, color: C.green, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>✓ Approve</button>
                <button onClick={() => handleAction(apr.id, "reject")} style={{ padding: "8px 20px", borderRadius: 7, border: `1px solid ${C.red}40`, background: `${C.red}10`, color: C.red, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>✗ Reject</button>
                <button style={{ padding: "8px 20px", borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", color: C.textMid, fontSize: 11, cursor: "pointer" }}>Request Info</button>
                <button style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", color: C.textMid, fontSize: 11, cursor: "pointer" }}>View Details →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Transactions View ─────────────────────────────────────────────────────────
function TransactionsView() {
  return (
    <div style={{ padding: 28, overflowY: "auto", flex: 1 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[["↑ Stock Out", C.red], ["↓ Stock In", C.green], ["↩ Return", C.amber], ["⇄ Replace", "#a78bfa"], ["⊕ Purchase", C.accent]].map(([label, color]) => (
          <button key={label} style={{ padding: "8px 16px", borderRadius: 7, border: `1px solid ${color}40`, background: `${color}10`, color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.surfaceAlt }}>
              {["ID", "Type", "Item", "Qty", "Requested By", "Date", "Customer/Project", "Status", ""].map(h => (
                <th key={h} style={{ padding: "12px 14px", fontSize: 9, color: C.textDim, fontFamily: "monospace", letterSpacing: "0.08em", textAlign: "left", fontWeight: 700, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((t) => (
              <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "12px 14px", fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{t.id}</td>
                <td style={{ padding: "12px 14px" }}>{txnType(t.type)}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: C.text }}>{t.item}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, fontFamily: "monospace", color: C.text, fontWeight: 700 }}>{t.qty}</td>
                <td style={{ padding: "12px 14px", fontSize: 10, color: C.textMid }}>{t.by}</td>
                <td style={{ padding: "12px 14px", fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{t.date}</td>
                <td style={{ padding: "12px 14px", fontSize: 10, color: C.textMid }}>{t.customer}</td>
                <td style={{ padding: "12px 14px" }}>{statusBadge(t.status)}</td>
                <td style={{ padding: "12px 14px" }}>
                  <button style={{ fontSize: 10, color: C.accent, background: "transparent", border: "none", cursor: "pointer" }}>Details →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Reports View ──────────────────────────────────────────────────────────────
function ReportsView() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const stockIn = [32, 45, 28, 60, 42];
  const stockOut = [25, 38, 20, 52, 35];
  const maxVal = 70;

  return (
    <div style={{ padding: 28, overflowY: "auto", flex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Bar chart */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 4 }}>Stock Movement (Last 5 Months)</div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", marginBottom: 20 }}>Stock In vs Stock Out</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
            {months.map((m, i) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", width: "100%" }}>
                  <div style={{ flex: 1, height: `${(stockIn[i] / maxVal) * 120}px`, background: `linear-gradient(to top, ${C.green}, ${C.green}80)`, borderRadius: "3px 3px 0 0" }} />
                  <div style={{ flex: 1, height: `${(stockOut[i] / maxVal) * 120}px`, background: `linear-gradient(to top, ${C.red}, ${C.red}80)`, borderRadius: "3px 3px 0 0" }} />
                </div>
                <span style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>{m}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: C.green }} /><span style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>Stock In</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: C.red }} /><span style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>Stock Out</span></div>
          </div>
        </div>

        {/* Top items by value */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 4 }}>Top Items by Value</div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", marginBottom: 20 }}>Current stock × purchase price</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {INVENTORY.sort((a,b) => (b.stock * b.price) - (a.stock * a.price)).slice(0, 5).map((item, i) => {
              const val = item.stock * item.price;
              const maxV = 89 * 6500;
              return (
                <div key={item.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: C.textMid }}>{item.name}</span>
                    <span style={{ fontSize: 10, color: C.text, fontFamily: "monospace" }}>₹{(val / 100000).toFixed(1)}L</span>
                  </div>
                  <div style={{ height: 4, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${(val / maxV) * 100}%`, height: "100%", background: [C.accent, C.green, C.amber, "#a78bfa", C.red][i], borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Report links */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 16 }}>Generate Reports</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {["Inventory Valuation", "Stock Movement", "Purchase Summary", "Item-wise Usage", "Customer Allocation", "Technician Report", "GST Report", "Monthly Summary", "Audit Logs"].map(r => (
            <button key={r} style={{ padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.surfaceAlt, color: C.textMid, fontSize: 11, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {r} <span style={{ color: C.textDim, fontSize: 12 }}>↓</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Vendors View ──────────────────────────────────────────────────────────────
function VendorsView() {
  return (
    <div style={{ padding: 28, overflowY: "auto", flex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {VENDORS.map(v => (
          <div key={v.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}30, ${C.accent}10)`, border: `1px solid ${C.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: C.accent }}>◇</div>
              {statusBadge(v.status)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 4 }}>{v.name}</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", marginBottom: 12 }}>{v.contact}</div>
            <div style={{ fontSize: 10, color: C.textMid }}><strong style={{ color: C.text }}>{v.items}</strong> items linked</div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "7px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.textMid, fontSize: 10, cursor: "pointer" }}>View Items</button>
              <button style={{ flex: 1, padding: "7px", borderRadius: 6, border: `1px solid ${C.accent}30`, background: `${C.accent}10`, color: C.accent, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Purchase</button>
            </div>
          </div>
        ))}
        <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160, cursor: "pointer", color: C.textDim, fontSize: 11, fontFamily: "monospace" }}>
          + Add Vendor
        </div>
      </div>
    </div>
  );
}

// ── Placeholder ───────────────────────────────────────────────────────────────
function Placeholder({ title }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: C.textDim }}>
      <div style={{ fontSize: 40, opacity: 0.3 }}>⊞</div>
      <div style={{ fontFamily: "monospace", fontSize: 12 }}>{title} module — coming soon</div>
    </div>
  );
}

// ── View config ───────────────────────────────────────────────────────────────
const PAGE_META = {
  dashboard: { title: "Dashboard", sub: "Tuesday, 19 May 2025 · Satcop India IMS" },
  inventory: { title: "Inventory Master", sub: "All items · 248 SKUs across 2 warehouses" },
  transactions: { title: "Transactions", sub: "Stock movements, returns, replacements" },
  approvals: { title: "Approval Engine", sub: "4 items pending your review" },
  purchase: { title: "Purchase Management", sub: "Requests, orders, and vendor invoices" },
  reports: { title: "Reports & Analytics", sub: "Export and visualize inventory data" },
  vendors: { title: "Vendor Master", sub: "Manage suppliers and purchase contacts" },
  users: { title: "User Management", sub: "Roles, permissions, and access control" },
  settings: { title: "Settings", sub: "System configuration and preferences" },
};

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("dashboard");
  const meta = PAGE_META[active];

  const renderView = () => {
    switch (active) {
      case "dashboard": return <Dashboard />;
      case "inventory": return <InventoryView />;
      case "transactions": return <TransactionsView />;
      case "approvals": return <ApprovalsView />;
      case "reports": return <ReportsView />;
      case "vendors": return <VendorsView />;
      default: return <Placeholder title={meta?.title} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <Sidebar active={active} setActive={setActive} role="DIRECTOR" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={meta?.title} sub={meta?.sub} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
}