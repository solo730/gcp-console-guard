// ─── URLs ────────────────────────────────────────────────────────────────────

const WORKER_URL   = "https://lemonsqueezy-license-worker.cloudleakguard.workers.dev";
const MONTHLY_URL  = "https://solo730.lemonsqueezy.com/checkout/buy/7ce0691f-7d4b-4eb3-ae0b-74f4281582e1";
const LIFETIME_URL = "https://solo730.lemonsqueezy.com/checkout/buy/cac31da6-94e1-4661-b998-548341c0cd32";
const FEEDBACK_URL = "https://www.solo730.com";

// ─── Constants ───────────────────────────────────────────────────────────────

const PANEL_ID     = "gcp-console-guard-panel";
const KEY_PRO      = "gcpg_pro";
const KEY_LICENSE  = "gcpg_license";
const KEY_INSTANCE = "gcpg_instance";
const KEY_VARIANT  = "gcpg_variant";

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode       = "navigate" | "upgrade";
type ValidateResult = "valid" | "invalid" | "unreachable";

type ProState = {
  isPro:      boolean;
  licenseKey: string | null;
  instanceId: string | null;
  variant:    "monthly" | "lifetime" | null;
};

// ─── Module state ────────────────────────────────────────────────────────────

let viewMode: ViewMode = "navigate";
let proState: ProState = { isPro: false, licenseKey: null, instanceId: null, variant: null };

// ─── Utilities ───────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ─── GCP DOM readers (read-only) ─────────────────────────────────────────────

function readGcpProjectId(): string {
  // GCP puts the project ID in the URL
  const urlMatch = window.location.href.match(/project=([a-z0-9-]+)/i);
  if (urlMatch) return urlMatch[1];

  // Try the project selector in the nav bar
  const selectors = [
    "[data-project-id]",
    ".cfc-breadcrumb-section span",
    "[aria-label*='project']",
    ".cloud-shell-topbar-project",
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    const text = el?.getAttribute("data-project-id") || el?.textContent?.trim() || "";
    if (text && text.length > 3) return text;
  }

  // Scan for project ID pattern in page text
  const allEls = document.querySelectorAll("span, div");
  for (const el of Array.from(allEls)) {
    const text = el.children.length === 0 ? el.textContent?.trim() || "" : "";
    if (/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(text)) return text;
  }

  return "Unknown";
}

// ─── GCP ACE aligned service data ────────────────────────────────────────────

const NAV_SERVICES = [
  {
    domain: "💻 Compute",
    services: [
      { label: "Compute Engine",   emoji: "🖥️", url: "https://console.cloud.google.com/compute/instances" },
      { label: "Cloud Run",        emoji: "🏃", url: "https://console.cloud.google.com/run" },
      { label: "App Engine",       emoji: "🌐", url: "https://console.cloud.google.com/appengine" },
      { label: "Cloud Functions",  emoji: "⚡", url: "https://console.cloud.google.com/functions" },
      { label: "GKE",              emoji: "⎈",  url: "https://console.cloud.google.com/kubernetes/list" },
      { label: "VM Instance Groups",emoji: "📈", url: "https://console.cloud.google.com/compute/instanceGroups/list" },
    ],
  },
  {
    domain: "🗄️ Storage",
    services: [
      { label: "Cloud Storage",    emoji: "🪣", url: "https://console.cloud.google.com/storage/browser" },
      { label: "Persistent Disks", emoji: "💾", url: "https://console.cloud.google.com/compute/disks" },
      { label: "Filestore",        emoji: "📁", url: "https://console.cloud.google.com/filestore/instances" },
      { label: "Cloud Backup",     emoji: "🔄", url: "https://console.cloud.google.com/compute/snapshots" },
    ],
  },
  {
    domain: "🗃️ Database",
    services: [
      { label: "Cloud SQL",        emoji: "🐘", url: "https://console.cloud.google.com/sql/instances" },
      { label: "Firestore",        emoji: "🔥", url: "https://console.cloud.google.com/firestore/data" },
      { label: "Bigtable",         emoji: "📊", url: "https://console.cloud.google.com/bigtable/instances" },
      { label: "Spanner",          emoji: "🌍", url: "https://console.cloud.google.com/spanner/instances" },
      { label: "Memorystore",      emoji: "⚡", url: "https://console.cloud.google.com/memorystore/redis/instances" },
    ],
  },
  {
    domain: "🌐 Networking",
    services: [
      { label: "VPC Networks",     emoji: "🔗", url: "https://console.cloud.google.com/networking/networks/list" },
      { label: "Cloud DNS",        emoji: "🌍", url: "https://console.cloud.google.com/net-services/dns/zones" },
      { label: "Cloud CDN",        emoji: "🚀", url: "https://console.cloud.google.com/net-services/cdn/list" },
      { label: "Load Balancing",   emoji: "⚖️", url: "https://console.cloud.google.com/net-services/loadbalancing/list" },
      { label: "Cloud Armor",      emoji: "🛡️", url: "https://console.cloud.google.com/net-security/securitypolicies/list" },
      { label: "Firewall Rules",   emoji: "🧱", url: "https://console.cloud.google.com/networking/firewalls/list" },
    ],
  },
  {
    domain: "🔒 Security & Identity",
    services: [
      { label: "IAM",              emoji: "👤", url: "https://console.cloud.google.com/iam-admin/iam" },
      { label: "Service Accounts", emoji: "🎭", url: "https://console.cloud.google.com/iam-admin/serviceaccounts" },
      { label: "Secret Manager",   emoji: "🗝️", url: "https://console.cloud.google.com/security/secret-manager" },
      { label: "Cloud KMS",        emoji: "🔑", url: "https://console.cloud.google.com/security/kms/keyrings" },
      { label: "Security Command", emoji: "🕵️", url: "https://console.cloud.google.com/security/command-center/overview" },
      { label: "Audit Logs",       emoji: "📜", url: "https://console.cloud.google.com/logs/query" },
      { label: "Org Policy",       emoji: "📋", url: "https://console.cloud.google.com/iam-admin/orgpolicies/list" },
      { label: "VPC Service Ctrl", emoji: "🏛️", url: "https://console.cloud.google.com/iam-admin/vpc-service-controls" },
    ],
  },
  {
    domain: "📊 Monitoring & Management",
    services: [
      { label: "Cloud Monitoring", emoji: "📡", url: "https://console.cloud.google.com/monitoring" },
      { label: "Cloud Logging",    emoji: "📋", url: "https://console.cloud.google.com/logs/query" },
      { label: "Cloud Trace",      emoji: "🔍", url: "https://console.cloud.google.com/traces/list" },
      { label: "Cloud Deployment", emoji: "🏗️", url: "https://console.cloud.google.com/dm/deployments" },
      { label: "Recommender",      emoji: "💡", url: "https://console.cloud.google.com/recommender/overview" },
      { label: "Asset Inventory",  emoji: "📦", url: "https://console.cloud.google.com/asset-inventory/overview" },
    ],
  },
  {
    domain: "💰 Billing & Cost",
    services: [
      { label: "Billing",          emoji: "🧾", url: "https://console.cloud.google.com/billing" },
      { label: "Cost Table",       emoji: "📉", url: "https://console.cloud.google.com/billing/reports" },
      { label: "Budgets & Alerts", emoji: "🎯", url: "https://console.cloud.google.com/billing/budgets" },
      { label: "Committed Use",    emoji: "💳", url: "https://console.cloud.google.com/compute/commitments" },
      { label: "Pricing Calc",     emoji: "🧮", url: "https://cloud.google.com/products/calculator" },
    ],
  },
  {
    domain: "🤖 AI & ML",
    services: [
      { label: "Vertex AI",        emoji: "🧠", url: "https://console.cloud.google.com/vertex-ai" },
      { label: "Gemini API",       emoji: "♊", url: "https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" },
      { label: "AutoML",           emoji: "🤖", url: "https://console.cloud.google.com/automl" },
      { label: "Vision API",       emoji: "👁️", url: "https://console.cloud.google.com/apis/library/vision.googleapis.com" },
      { label: "BigQuery",         emoji: "📊", url: "https://console.cloud.google.com/bigquery" },
      { label: "Pub/Sub",          emoji: "📨", url: "https://console.cloud.google.com/cloudpubsub/topic/list" },
    ],
  },
];

// ─── Theme ───────────────────────────────────────────────────────────────────

function resolveTheme(): "dark" | "light" {
  // GCP Console uses data-g-theme attribute on html element
  const html = document.documentElement;
  const theme = html.getAttribute("data-g-theme") || html.getAttribute("data-theme") || "";
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";

  // Fallback: check background brightness
  const bg = window.getComputedStyle(document.body).backgroundColor;
  const match = bg.match(/\d+/g);
  if (match && match.length >= 3) {
    const brightness = (parseInt(match[0]) + parseInt(match[1]) + parseInt(match[2])) / 3;
    return brightness < 128 ? "dark" : "light";
  }
  return "light";
}

function applyTheme(panel: HTMLElement): void {
  const isDark = resolveTheme() === "dark";
  const bg     = isDark ? "#0b1220" : "#ffffff";
  const fg     = isDark ? "#f1f5f9" : "#111111";
  const border = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.15)";
  const shadow = isDark ? "0 10px 28px rgba(0,0,0,0.45)" : "0 8px 24px rgba(0,0,0,0.18)";

  panel.style.background = bg;
  panel.style.color      = fg;
  panel.style.border     = `1px solid ${border}`;
  panel.style.boxShadow  = shadow;

  for (const b of Array.from(panel.querySelectorAll("button")) as HTMLButtonElement[]) {
    const variant = b.getAttribute("data-variant") || "secondary";
    if (variant === "primary") {
      b.style.background = isDark ? "#e2e8f0" : "#111";
      b.style.color      = isDark ? "#0b1220"  : "#fff";
      b.style.border     = `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"}`;
    } else if (variant === "ghost") {
      b.style.background = "transparent";
      b.style.color      = fg;
      b.style.border     = "none";
      b.style.opacity    = "0.7";
    } else if (variant === "accent") {
      b.style.background = isDark ? "rgba(66,133,244,0.15)" : "rgba(66,133,244,0.08)";
      b.style.color      = isDark ? "#93c5fd" : "#1a73e8";
      b.style.border     = `1px solid ${isDark ? "rgba(66,133,244,0.4)" : "rgba(66,133,244,0.3)"}`;
    } else {
      b.style.background = isDark ? "rgba(255,255,255,0.06)" : "#fff";
      b.style.color      = fg;
      b.style.border     = `1px solid ${border}`;
    }
  }

  for (const c of Array.from(panel.querySelectorAll("[data-card='1']")) as HTMLElement[]) {
    c.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
    c.style.border     = `1px solid ${border}`;
  }
}

// ─── Pro state ───────────────────────────────────────────────────────────────

async function loadProState(): Promise<ProState> {
  try {
    const stored = await chrome.storage.local.get([KEY_PRO, KEY_LICENSE, KEY_INSTANCE, KEY_VARIANT]);
    const v = stored[KEY_VARIANT];
    return {
      isPro:      stored[KEY_PRO] === true,
      licenseKey: typeof stored[KEY_LICENSE]  === "string" && stored[KEY_LICENSE]  ? stored[KEY_LICENSE]  : null,
      instanceId: typeof stored[KEY_INSTANCE] === "string" && stored[KEY_INSTANCE] ? stored[KEY_INSTANCE] : null,
      variant:    v === "lifetime" ? "lifetime" : v === "monthly" ? "monthly" : null,
    };
  } catch {
    return { isPro: false, licenseKey: null, instanceId: null, variant: null };
  }
}

async function saveProState(state: ProState): Promise<void> {
  await chrome.storage.local.set({
    [KEY_PRO]:      state.isPro,
    [KEY_LICENSE]:  state.licenseKey ?? "",
    [KEY_INSTANCE]: state.instanceId ?? "",
    [KEY_VARIANT]:  state.variant    ?? "",
  });
  proState = state;
}

async function clearProState(): Promise<void> {
  await chrome.storage.local.remove([KEY_PRO, KEY_LICENSE, KEY_INSTANCE, KEY_VARIANT]);
  proState = { isPro: false, licenseKey: null, instanceId: null, variant: null };
}

// ─── LemonSqueezy ────────────────────────────────────────────────────────────

async function activateLicense(licenseKey: string): Promise<{
  success:    boolean;
  instanceId: string | null;
  error:      string | null;
}> {
  try {
    const res = await fetch(`${WORKER_URL}/activate`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        license_key:   licenseKey,
        instance_name: `GCP Console Guard - ${navigator.userAgent.slice(0, 60)}`,
      }),
    });
    if (!res.ok) return { success: false, instanceId: null, error: `Server error: ${res.status}` };
    const data = await res.json() as { activated?: boolean; instance_id?: string; error?: string };
    if (data.activated && data.instance_id) {
      return { success: true, instanceId: data.instance_id, error: null };
    }
    return { success: false, instanceId: null, error: data.error ?? "Activation failed. Please check your license key." };
  } catch (err) {
    return { success: false, instanceId: null, error: `Could not reach activation server. (${err instanceof Error ? err.message : String(err)})` };
  }
}

async function validateLicense(licenseKey: string, instanceId: string): Promise<{ result: ValidateResult; variant: "monthly" | "lifetime" | null }> {
  try {
    const res = await fetch(`${WORKER_URL}/validate`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ license_key: licenseKey, instance_id: instanceId }),
    });
    if (!res.ok) return { result: "unreachable", variant: null };
    const data    = await res.json() as { valid?: boolean; product_name?: string; variant_name?: string };
    const nameStr = ((data.product_name || "") + " " + (data.variant_name || "")).toLowerCase();
    const variant = nameStr.includes("lifetime") ? "lifetime" : "monthly";
    return { result: data.valid === true ? "valid" : "invalid", variant };
  } catch {
    return { result: "unreachable", variant: null };
  }
}

// ─── Navigate view ───────────────────────────────────────────────────────────

function renderNavigateView(panel: HTMLElement): void {
  const container = panel.querySelector<HTMLElement>("#gcpg-navigate-content");
  if (!container) return;

  const projectId = readGcpProjectId();
  const isDark    = resolveTheme() === "dark";
  const pillBg    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)";
  const pillFg    = isDark ? "#93c5fd" : "#1a73e8";

  const infoBar = `
    <div style="display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
      <div style="font-size:13px; padding:6px 12px; border-radius:20px;
                  background:${pillBg}; opacity:.9; display:flex; align-items:center; gap:5px;">
        ☁️ <span style="font-weight:700; color:${pillFg};">Google Cloud</span>
      </div>
      <div style="font-size:13px; padding:6px 12px; border-radius:20px;
                  background:${pillBg}; opacity:.9; display:flex; align-items:center; gap:5px;">
        📁 <span style="font-weight:700; font-family:monospace; font-size:11px;">${escapeHtml(projectId)}</span>
      </div>
    </div>
    <div style="font-size:10px; opacity:.4; margin-bottom:14px; line-height:1.4;">
      Read-only • Values detected from GCP Console DOM
    </div>`;

  const groups = NAV_SERVICES.map((group) => {
    const buttons = group.services.map((svc) => {
      const id = `gcpg-nav-${svc.label.replace(/[\s\/]+/g, "-").toLowerCase()}`;
      return `<button id="${id}" data-variant="secondary"
        style="padding:8px 6px; border-radius:10px; cursor:pointer; font-size:11px;
               text-align:center; line-height:1.3; display:flex; flex-direction:column;
               align-items:center; gap:3px; width:100%;">
        <span style="font-size:16px;">${svc.emoji}</span>
        <span>${escapeHtml(svc.label)}</span>
      </button>`;
    }).join("");
    return `
      <div style="margin-bottom:14px;">
        <div style="font-size:11px; font-weight:800; opacity:.55; text-transform:uppercase;
                    letter-spacing:.5px; margin-bottom:8px;">${group.domain}</div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px;">
          ${buttons}
        </div>
      </div>`;
  }).join("");

  container.innerHTML = infoBar + groups;

  NAV_SERVICES.forEach((group) => {
    group.services.forEach((svc) => {
      const id  = `gcpg-nav-${svc.label.replace(/[\s\/]+/g, "-").toLowerCase()}`;
      const btn = panel.querySelector<HTMLButtonElement>(`#${id}`);
      if (!btn) return;
      btn.onclick = () => { window.location.href = svc.url; };
    });
  });

  applyTheme(panel);
}

// ─── Upgrade view ────────────────────────────────────────────────────────────

function renderUpgradeView(panel: HTMLElement): void {
  const container = panel.querySelector<HTMLElement>("#gcpg-upgrade-content");
  if (!container) return;

  if (proState.isPro) {
    const isLifetime = proState.variant === "lifetime";
    const badgeLabel = isLifetime ? "Pro • Lifetime" : "Pro • Monthly";

    container.innerHTML = `
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <div style="font-weight:900; font-size:15px;">GCP Console Guard</div>
          <div style="font-size:11px; padding:3px 10px; border-radius:20px;
                      background:linear-gradient(135deg,#1a73e8,#0d47a1); color:#fff; font-weight:800;">
            ${escapeHtml(badgeLabel)}
          </div>
        </div>
        <div style="opacity:.8; font-size:12px; margin-bottom:14px; line-height:1.5;">
          Your license is active. Thank you for supporting CloudGuard!
        </div>
        <div style="font-size:12px; opacity:.7; margin-bottom:14px; line-height:1.5;">
          💡 This same license key works in CloudLeak Guard (AWS) and Azure Portal Guard.
        </div>
        <button id="gcpg-manage-btn" data-variant="secondary"
          style="width:100%; padding:10px; border-radius:10px; cursor:pointer; font-size:12px; margin-bottom:8px;">
          Remove license
        </button>
        <div id="gcpg-manage-confirm" style="display:none; margin-bottom:8px;">
          <div data-card="1" style="padding:12px; border-radius:12px; font-size:12px; line-height:1.5;">
            ⚠️ This will remove your license from this device. Enter your key again anytime to reactivate.
            <div style="display:flex; gap:8px; margin-top:10px;">
              <button id="gcpg-confirm-deactivate" data-variant="secondary"
                style="flex:1; padding:8px; border-radius:10px; cursor:pointer; font-size:12px;">
                Yes, remove
              </button>
              <button id="gcpg-cancel-deactivate" data-variant="primary"
                style="flex:1; padding:8px; border-radius:10px; cursor:pointer; font-size:12px;">
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div style="opacity:.5; font-size:11px; margin-top:4px;">
          Need help? <a href="mailto:cloudleakguard@proton.me" style="color:inherit;">cloudleakguard@proton.me</a>
        </div>
      </div>`;

    const manageBtn  = panel.querySelector<HTMLButtonElement>("#gcpg-manage-btn")!;
    const confirmBox = panel.querySelector<HTMLElement>("#gcpg-manage-confirm")!;
    const confirmBtn = panel.querySelector<HTMLButtonElement>("#gcpg-confirm-deactivate")!;
    const cancelBtn  = panel.querySelector<HTMLButtonElement>("#gcpg-cancel-deactivate")!;

    manageBtn.onclick  = () => {
      confirmBox.style.display = confirmBox.style.display === "none" ? "block" : "none";
      applyTheme(panel);
    };
    cancelBtn.onclick  = () => { confirmBox.style.display = "none"; };
    confirmBtn.onclick = async () => {
      await clearProState();
      renderUpgradeView(panel);
      applyTheme(panel);
    };

  } else {
    container.innerHTML = `
      <div>
        <div style="font-weight:900; font-size:15px; margin-bottom:4px;">GCP Console Guard Pro</div>
        <div style="opacity:.75; font-size:12px; margin-bottom:16px; line-height:1.5;">
          One license covers AWS, Azure, and GCP. Buy once, use everywhere.
        </div>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
          <div data-card="1" style="flex:1; padding:12px; border-radius:12px; text-align:center;">
            <div style="font-size:10px; font-weight:800; opacity:.6; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px;">Monthly</div>
            <div style="font-size:24px; font-weight:900; margin-bottom:2px;">$19.99</div>
            <div style="font-size:10px; opacity:.55; margin-bottom:10px;">per month</div>
            <button id="gcpg-monthly-btn" data-variant="primary"
              style="width:100%; padding:8px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:700;">
              Get Pro
            </button>
          </div>
          <div data-card="1" style="flex:1; padding:12px; border-radius:12px; text-align:center; position:relative;
                                     border:1px solid rgba(26,115,232,0.5) !important;">
            <div style="position:absolute; top:-9px; left:50%; transform:translateX(-50%);
                        background:linear-gradient(135deg,#1a73e8,#0d47a1); color:#fff;
                        font-size:9px; font-weight:800; padding:2px 10px; border-radius:20px; white-space:nowrap;">
              BEST VALUE
            </div>
            <div style="font-size:10px; font-weight:800; opacity:.6; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px;">Lifetime</div>
            <div style="font-size:24px; font-weight:900; margin-bottom:2px;">$149</div>
            <div style="font-size:10px; opacity:.55; margin-bottom:10px;">one-time</div>
            <button id="gcpg-lifetime-btn" data-variant="primary"
              style="width:100%; padding:8px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:700;
                     background:linear-gradient(135deg,#1a73e8,#0d47a1) !important; border:none !important;">
              Get Lifetime
            </button>
          </div>
        </div>
        <div style="display:flex; gap:6px; margin-bottom:14px; flex-wrap:wrap;">
          <div style="font-size:11px; opacity:.65; padding:4px 8px; border-radius:20px; border:1px solid rgba(128,128,128,0.25);">🔐 No GCP credentials</div>
          <div style="font-size:11px; opacity:.65; padding:4px 8px; border-radius:20px; border:1px solid rgba(128,128,128,0.25);">🖥️ Runs locally</div>
          <div style="font-size:11px; opacity:.65; padding:4px 8px; border-radius:20px; border:1px solid rgba(128,128,128,0.25);">☁️ AWS + Azure + GCP</div>
        </div>
        <div data-card="1" style="padding:12px; border-radius:12px; margin-bottom:12px;">
          <div style="font-weight:800; font-size:12px; margin-bottom:4px;">Already have a license key?</div>
          <div style="font-size:11px; opacity:.65; margin-bottom:8px;">Same key works across all three CloudGuard extensions.</div>
          <input
            id="gcpg-license-input"
            type="text"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            style="width:100%; box-sizing:border-box; padding:9px 10px; border-radius:10px;
                   border:1px solid rgba(128,128,128,0.3); font-size:13px; font-family:monospace;
                   outline:none; background:transparent;"
          />
          <button id="gcpg-activate-btn" data-variant="primary"
            style="width:100%; margin-top:8px; padding:10px; border-radius:10px; cursor:pointer; font-weight:700;">
            Activate Pro
          </button>
          <div id="gcpg-activate-status" style="margin-top:6px; font-size:12px; min-height:16px;"></div>
        </div>
        <div style="margin-top:4px; opacity:.5; font-size:11px; line-height:1.4;">
          GCP Console Guard provides informational navigation only. Not affiliated with Google Cloud.
        </div>
      </div>`;

    panel.querySelector<HTMLButtonElement>("#gcpg-monthly-btn")!.onclick  = () => {};
    panel.querySelector<HTMLButtonElement>("#gcpg-lifetime-btn")!.onclick = () => {};

    const activateBtn    = panel.querySelector<HTMLButtonElement>("#gcpg-activate-btn")!;
    const keyInput       = panel.querySelector<HTMLInputElement>("#gcpg-license-input")!;
    const activateStatus = panel.querySelector<HTMLElement>("#gcpg-activate-status")!;

    activateBtn.onclick = async () => {
      const key = keyInput.value.trim();
      if (!key) {
        activateStatus.textContent = "Please enter your license key.";
        activateStatus.style.color = "#fc8181";
        return;
      }
      activateBtn.disabled    = true;
      activateBtn.textContent = "Activating...";
      activateStatus.textContent = "";

      const result = await activateLicense(key);
      if (result.success && result.instanceId) {
        const { result: vResult, variant } = await validateLicense(key, result.instanceId);
        const resolvedVariant = vResult === "valid" ? (variant ?? "monthly") : "monthly";
        await saveProState({ isPro: true, licenseKey: key, instanceId: result.instanceId, variant: resolvedVariant });
        renderUpgradeView(panel);
        applyTheme(panel);
      } else {
        activateStatus.textContent = result.error ?? "Activation failed.";
        activateStatus.style.color = "#fc8181";
        activateBtn.disabled    = false;
        activateBtn.textContent = "Activate Pro";
      }
    };
  }

  applyTheme(panel);
}

// ─── Panel ───────────────────────────────────────────────────────────────────

function ensurePanel(): void {
  if (document.getElementById(PANEL_ID)) return;

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.style.position     = "fixed";
  panel.style.top          = "60px";
  panel.style.right        = "16px";
  panel.style.width        = "360px";
  panel.style.maxHeight    = "75vh";
  panel.style.overflow     = "auto";
  panel.style.zIndex       = "2147483647";
  panel.style.borderRadius = "16px";
  panel.style.fontFamily   = "system-ui, -apple-system, Segoe UI, Roboto, Arial";
  panel.style.fontSize     = "13px";

  panel.innerHTML = `
    <div style="padding:12px 14px; border-bottom:1px solid rgba(128,128,128,0.15);
                display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-weight:900; font-size:14px; letter-spacing:-.2px;">GCP Console Guard</div>
        <div style="opacity:.55; font-size:11px; margin-top:1px;">Read-only • Not affiliated with Google Cloud</div>
      </div>
      <button id="gcpg-close" data-variant="ghost" style="font-size:20px; cursor:pointer; line-height:1; padding:4px;">×</button>
    </div>

    <div style="padding:12px 14px;">

      <div style="display:flex; gap:4px; margin-bottom:12px; background:rgba(128,128,128,0.1); padding:3px; border-radius:12px;">
        <button id="gcpg-tab-navigate" data-variant="primary"
          style="flex:1; padding:8px 4px; border-radius:10px; cursor:pointer; font-size:12px; font-weight:700;">Navigate</button>
        <button id="gcpg-tab-upgrade" data-variant="ghost"
          style="flex:1; padding:8px 4px; border-radius:10px; cursor:pointer; font-size:12px; font-weight:700;">Pro</button>
      </div>

      <div id="gcpg-view-navigate">
        <div id="gcpg-navigate-content">Loading...</div>
      </div>

      <div id="gcpg-view-upgrade" style="display:none;">
        <div id="gcpg-upgrade-content">Loading...</div>
      </div>

    </div>
  `;

  document.documentElement.appendChild(panel);
  applyTheme(panel);

  window.matchMedia?.("(prefers-color-scheme: dark)")
    ?.addEventListener?.("change", () => applyTheme(panel));

  const tabNavigate  = panel.querySelector<HTMLButtonElement>("#gcpg-tab-navigate")!;
  const tabUpgrade   = panel.querySelector<HTMLButtonElement>("#gcpg-tab-upgrade")!;
  const viewNavigate = panel.querySelector<HTMLElement>("#gcpg-view-navigate")!;
  const viewUpgrade  = panel.querySelector<HTMLElement>("#gcpg-view-upgrade")!;

  const setView = (mode: ViewMode) => {
    viewMode = mode;
    viewNavigate.style.display = "none";
    viewUpgrade.style.display  = "none";
    tabNavigate.setAttribute("data-variant", "ghost");
    tabUpgrade.setAttribute("data-variant",  "ghost");

    if (mode === "navigate") {
      viewNavigate.style.display = "block";
      tabNavigate.setAttribute("data-variant", "primary");
      renderNavigateView(panel);
    } else {
      viewUpgrade.style.display = "block";
      tabUpgrade.setAttribute("data-variant", "primary");
      renderUpgradeView(panel);
    }
    applyTheme(panel);
  };

  tabNavigate.onclick = () => setView("navigate");
  tabUpgrade.onclick  = () => setView("upgrade");

  panel.querySelector<HTMLButtonElement>("#gcpg-close")!.onclick = () => panel.remove();

  // ── Init ──
  (async () => {
    try {
      proState = await loadProState();

      if (proState.isPro && proState.licenseKey && proState.instanceId) {
        validateLicense(proState.licenseKey, proState.instanceId).then(async ({ result, variant }) => {
          if (result === "invalid") {
            await clearProState();
            renderUpgradeView(panel);
            applyTheme(panel);
          } else if (result === "valid" && variant && proState.variant !== variant) {
            await saveProState({ ...proState, variant });
          }
        });
      }

      renderNavigateView(panel);
      applyTheme(panel);
    } catch {
      // ignore init errors
    }
  })();
}

// ─── Init ────────────────────────────────────────────────────────────────────

console.log("GCP Console Guard loaded (read-only)");
ensurePanel();