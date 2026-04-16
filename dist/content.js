var e=`https://lemonsqueezy-license-worker.cloudleakguard.workers.dev`,t=`gcp-console-guard-panel`,n=`gcpg_pro`,r=`gcpg_license`,i=`gcpg_instance`,a=`gcpg_variant`,o={isPro:!1,licenseKey:null,instanceId:null,variant:null};function s(e){return(e||``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function c(){let e=window.location.href.match(/project=([a-z0-9-]+)/i);if(e)return e[1];for(let e of[`[data-project-id]`,`.cfc-breadcrumb-section span`,`[aria-label*='project']`,`.cloud-shell-topbar-project`]){let t=document.querySelector(e),n=t?.getAttribute(`data-project-id`)||t?.textContent?.trim()||``;if(n&&n.length>3)return n}let t=document.querySelectorAll(`span, div`);for(let e of Array.from(t)){let t=e.children.length===0&&e.textContent?.trim()||``;if(/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(t))return t}return`Unknown`}var l=[{domain:`💻 Compute`,services:[{label:`Compute Engine`,emoji:`🖥️`,url:`https://console.cloud.google.com/compute/instances`},{label:`Cloud Run`,emoji:`🏃`,url:`https://console.cloud.google.com/run`},{label:`App Engine`,emoji:`🌐`,url:`https://console.cloud.google.com/appengine`},{label:`Cloud Functions`,emoji:`⚡`,url:`https://console.cloud.google.com/functions`},{label:`GKE`,emoji:`⎈`,url:`https://console.cloud.google.com/kubernetes/list`},{label:`VM Instance Groups`,emoji:`📈`,url:`https://console.cloud.google.com/compute/instanceGroups/list`}]},{domain:`🗄️ Storage`,services:[{label:`Cloud Storage`,emoji:`🪣`,url:`https://console.cloud.google.com/storage/browser`},{label:`Persistent Disks`,emoji:`💾`,url:`https://console.cloud.google.com/compute/disks`},{label:`Filestore`,emoji:`📁`,url:`https://console.cloud.google.com/filestore/instances`},{label:`Cloud Backup`,emoji:`🔄`,url:`https://console.cloud.google.com/compute/snapshots`}]},{domain:`🗃️ Database`,services:[{label:`Cloud SQL`,emoji:`🐘`,url:`https://console.cloud.google.com/sql/instances`},{label:`Firestore`,emoji:`🔥`,url:`https://console.cloud.google.com/firestore/data`},{label:`Bigtable`,emoji:`📊`,url:`https://console.cloud.google.com/bigtable/instances`},{label:`Spanner`,emoji:`🌍`,url:`https://console.cloud.google.com/spanner/instances`},{label:`Memorystore`,emoji:`⚡`,url:`https://console.cloud.google.com/memorystore/redis/instances`}]},{domain:`🌐 Networking`,services:[{label:`VPC Networks`,emoji:`🔗`,url:`https://console.cloud.google.com/networking/networks/list`},{label:`Cloud DNS`,emoji:`🌍`,url:`https://console.cloud.google.com/net-services/dns/zones`},{label:`Cloud CDN`,emoji:`🚀`,url:`https://console.cloud.google.com/net-services/cdn/list`},{label:`Load Balancing`,emoji:`⚖️`,url:`https://console.cloud.google.com/net-services/loadbalancing/list`},{label:`Cloud Armor`,emoji:`🛡️`,url:`https://console.cloud.google.com/net-security/securitypolicies/list`},{label:`Firewall Rules`,emoji:`🧱`,url:`https://console.cloud.google.com/networking/firewalls/list`}]},{domain:`🔒 Security & Identity`,services:[{label:`IAM`,emoji:`👤`,url:`https://console.cloud.google.com/iam-admin/iam`},{label:`Service Accounts`,emoji:`🎭`,url:`https://console.cloud.google.com/iam-admin/serviceaccounts`},{label:`Secret Manager`,emoji:`🗝️`,url:`https://console.cloud.google.com/security/secret-manager`},{label:`Cloud KMS`,emoji:`🔑`,url:`https://console.cloud.google.com/security/kms/keyrings`},{label:`Security Command`,emoji:`🕵️`,url:`https://console.cloud.google.com/security/command-center/overview`},{label:`Audit Logs`,emoji:`📜`,url:`https://console.cloud.google.com/logs/query`},{label:`Org Policy`,emoji:`📋`,url:`https://console.cloud.google.com/iam-admin/orgpolicies/list`},{label:`VPC Service Ctrl`,emoji:`🏛️`,url:`https://console.cloud.google.com/iam-admin/vpc-service-controls`}]},{domain:`📊 Monitoring & Management`,services:[{label:`Cloud Monitoring`,emoji:`📡`,url:`https://console.cloud.google.com/monitoring`},{label:`Cloud Logging`,emoji:`📋`,url:`https://console.cloud.google.com/logs/query`},{label:`Cloud Trace`,emoji:`🔍`,url:`https://console.cloud.google.com/traces/list`},{label:`Cloud Deployment`,emoji:`🏗️`,url:`https://console.cloud.google.com/dm/deployments`},{label:`Recommender`,emoji:`💡`,url:`https://console.cloud.google.com/recommender/overview`},{label:`Asset Inventory`,emoji:`📦`,url:`https://console.cloud.google.com/asset-inventory/overview`}]},{domain:`💰 Billing & Cost`,services:[{label:`Billing`,emoji:`🧾`,url:`https://console.cloud.google.com/billing`},{label:`Cost Table`,emoji:`📉`,url:`https://console.cloud.google.com/billing/reports`},{label:`Budgets & Alerts`,emoji:`🎯`,url:`https://console.cloud.google.com/billing/budgets`},{label:`Committed Use`,emoji:`💳`,url:`https://console.cloud.google.com/compute/commitments`},{label:`Pricing Calc`,emoji:`🧮`,url:`https://cloud.google.com/products/calculator`}]},{domain:`🤖 AI & ML`,services:[{label:`Vertex AI`,emoji:`🧠`,url:`https://console.cloud.google.com/vertex-ai`},{label:`Gemini API`,emoji:`♊`,url:`https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com`},{label:`AutoML`,emoji:`🤖`,url:`https://console.cloud.google.com/automl`},{label:`Vision API`,emoji:`👁️`,url:`https://console.cloud.google.com/apis/library/vision.googleapis.com`},{label:`BigQuery`,emoji:`📊`,url:`https://console.cloud.google.com/bigquery`},{label:`Pub/Sub`,emoji:`📨`,url:`https://console.cloud.google.com/cloudpubsub/topic/list`}]}];function u(){let e=document.documentElement,t=e.getAttribute(`data-g-theme`)||e.getAttribute(`data-theme`)||``;if(t===`dark`)return`dark`;if(t===`light`)return`light`;let n=window.getComputedStyle(document.body).backgroundColor.match(/\d+/g);return n&&n.length>=3&&(parseInt(n[0])+parseInt(n[1])+parseInt(n[2]))/3<128?`dark`:`light`}function d(e){let t=u()===`dark`,n=t?`#0b1220`:`#ffffff`,r=t?`#f1f5f9`:`#111111`,i=t?`rgba(255,255,255,0.14)`:`rgba(0,0,0,0.15)`,a=t?`0 10px 28px rgba(0,0,0,0.45)`:`0 8px 24px rgba(0,0,0,0.18)`;e.style.background=n,e.style.color=r,e.style.border=`1px solid ${i}`,e.style.boxShadow=a;for(let n of Array.from(e.querySelectorAll(`button`))){let e=n.getAttribute(`data-variant`)||`secondary`;e===`primary`?(n.style.background=t?`#e2e8f0`:`#111`,n.style.color=t?`#0b1220`:`#fff`,n.style.border=`1px solid ${t?`rgba(255,255,255,0.18)`:`rgba(0,0,0,0.15)`}`):e===`ghost`?(n.style.background=`transparent`,n.style.color=r,n.style.border=`none`,n.style.opacity=`0.7`):e===`accent`?(n.style.background=t?`rgba(66,133,244,0.15)`:`rgba(66,133,244,0.08)`,n.style.color=t?`#93c5fd`:`#1a73e8`,n.style.border=`1px solid ${t?`rgba(66,133,244,0.4)`:`rgba(66,133,244,0.3)`}`):(n.style.background=t?`rgba(255,255,255,0.06)`:`#fff`,n.style.color=r,n.style.border=`1px solid ${i}`)}for(let n of Array.from(e.querySelectorAll(`[data-card='1']`)))n.style.background=t?`rgba(255,255,255,0.04)`:`rgba(0,0,0,0.02)`,n.style.border=`1px solid ${i}`}async function f(){try{let e=await chrome.storage.local.get([n,r,i,a]),t=e[a];return{isPro:e[n]===!0,licenseKey:typeof e[r]==`string`&&e[r]?e[r]:null,instanceId:typeof e[i]==`string`&&e[i]?e[i]:null,variant:t===`lifetime`?`lifetime`:t===`monthly`?`monthly`:null}}catch{return{isPro:!1,licenseKey:null,instanceId:null,variant:null}}}async function p(e){await chrome.storage.local.set({[n]:e.isPro,[r]:e.licenseKey??``,[i]:e.instanceId??``,[a]:e.variant??``}),o=e}async function m(){await chrome.storage.local.remove([n,r,i,a]),o={isPro:!1,licenseKey:null,instanceId:null,variant:null}}async function h(t){try{let n=await fetch(`${e}/activate`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({license_key:t,instance_name:`GCP Console Guard - ${navigator.userAgent.slice(0,60)}`})});if(!n.ok)return{success:!1,instanceId:null,error:`Server error: ${n.status}`};let r=await n.json();return r.activated&&r.instance_id?{success:!0,instanceId:r.instance_id,error:null}:{success:!1,instanceId:null,error:r.error??`Activation failed. Please check your license key.`}}catch(e){return{success:!1,instanceId:null,error:`Could not reach activation server. (${e instanceof Error?e.message:String(e)})`}}}async function g(t,n){try{let r=await fetch(`${e}/validate`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({license_key:t,instance_id:n})});if(!r.ok)return{result:`unreachable`,variant:null};let i=await r.json(),a=((i.product_name||``)+` `+(i.variant_name||``)).toLowerCase().includes(`lifetime`)?`lifetime`:`monthly`;return{result:i.valid===!0?`valid`:`invalid`,variant:a}}catch{return{result:`unreachable`,variant:null}}}function _(e){let t=e.querySelector(`#gcpg-navigate-content`);if(!t)return;let n=c(),r=u()===`dark`,i=r?`rgba(255,255,255,0.07)`:`rgba(0,0,0,0.05)`;t.innerHTML=`
    <div style="display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
      <div style="font-size:13px; padding:6px 12px; border-radius:20px;
                  background:${i}; opacity:.9; display:flex; align-items:center; gap:5px;">
        ☁️ <span style="font-weight:700; color:${r?`#93c5fd`:`#1a73e8`};">Google Cloud</span>
      </div>
      <div style="font-size:13px; padding:6px 12px; border-radius:20px;
                  background:${i}; opacity:.9; display:flex; align-items:center; gap:5px;">
        📁 <span style="font-weight:700; font-family:monospace; font-size:11px;">${s(n)}</span>
      </div>
    </div>
    <div style="font-size:10px; opacity:.4; margin-bottom:14px; line-height:1.4;">
      Read-only • Values detected from GCP Console DOM
    </div>`+l.map(e=>{let t=e.services.map(e=>`<button id="${`gcpg-nav-${e.label.replace(/[\s\/]+/g,`-`).toLowerCase()}`}" data-variant="secondary"
        style="padding:8px 6px; border-radius:10px; cursor:pointer; font-size:11px;
               text-align:center; line-height:1.3; display:flex; flex-direction:column;
               align-items:center; gap:3px; width:100%;">
        <span style="font-size:16px;">${e.emoji}</span>
        <span>${s(e.label)}</span>
      </button>`).join(``);return`
      <div style="margin-bottom:14px;">
        <div style="font-size:11px; font-weight:800; opacity:.55; text-transform:uppercase;
                    letter-spacing:.5px; margin-bottom:8px;">${e.domain}</div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px;">
          ${t}
        </div>
      </div>`}).join(``),l.forEach(t=>{t.services.forEach(t=>{let n=`gcpg-nav-${t.label.replace(/[\s\/]+/g,`-`).toLowerCase()}`,r=e.querySelector(`#${n}`);r&&(r.onclick=()=>{window.location.href=t.url})})}),d(e)}function v(e){let t=e.querySelector(`#gcpg-upgrade-content`);if(t){if(o.isPro){t.innerHTML=`
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <div style="font-weight:900; font-size:15px;">GCP Console Guard</div>
          <div style="font-size:11px; padding:3px 10px; border-radius:20px;
                      background:linear-gradient(135deg,#1a73e8,#0d47a1); color:#fff; font-weight:800;">
            ${s(o.variant===`lifetime`?`Pro • Lifetime`:`Pro • Monthly`)}
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
      </div>`;let n=e.querySelector(`#gcpg-manage-btn`),r=e.querySelector(`#gcpg-manage-confirm`),i=e.querySelector(`#gcpg-confirm-deactivate`),a=e.querySelector(`#gcpg-cancel-deactivate`);n.onclick=()=>{r.style.display=r.style.display===`none`?`block`:`none`,d(e)},a.onclick=()=>{r.style.display=`none`},i.onclick=async()=>{await m(),v(e),d(e)}}else{t.innerHTML=`
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
      </div>`,e.querySelector(`#gcpg-monthly-btn`).onclick=()=>{},e.querySelector(`#gcpg-lifetime-btn`).onclick=()=>{};let n=e.querySelector(`#gcpg-activate-btn`),r=e.querySelector(`#gcpg-license-input`),i=e.querySelector(`#gcpg-activate-status`);n.onclick=async()=>{let t=r.value.trim();if(!t){i.textContent=`Please enter your license key.`,i.style.color=`#fc8181`;return}n.disabled=!0,n.textContent=`Activating...`,i.textContent=``;let a=await h(t);if(a.success&&a.instanceId){let{result:n,variant:r}=await g(t,a.instanceId),i=n===`valid`?r??`monthly`:`monthly`;await p({isPro:!0,licenseKey:t,instanceId:a.instanceId,variant:i}),v(e),d(e)}else i.textContent=a.error??`Activation failed.`,i.style.color=`#fc8181`,n.disabled=!1,n.textContent=`Activate Pro`}}d(e)}}function y(){if(document.getElementById(t))return;let e=document.createElement(`div`);e.id=t,e.style.position=`fixed`,e.style.top=`60px`,e.style.right=`16px`,e.style.width=`360px`,e.style.maxHeight=`75vh`,e.style.overflow=`auto`,e.style.zIndex=`2147483647`,e.style.borderRadius=`16px`,e.style.fontFamily=`system-ui, -apple-system, Segoe UI, Roboto, Arial`,e.style.fontSize=`13px`,e.innerHTML=`
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
  `,document.documentElement.appendChild(e),d(e),window.matchMedia?.(`(prefers-color-scheme: dark)`)?.addEventListener?.(`change`,()=>d(e));let n=e.querySelector(`#gcpg-tab-navigate`),r=e.querySelector(`#gcpg-tab-upgrade`),i=e.querySelector(`#gcpg-view-navigate`),a=e.querySelector(`#gcpg-view-upgrade`),s=t=>{i.style.display=`none`,a.style.display=`none`,n.setAttribute(`data-variant`,`ghost`),r.setAttribute(`data-variant`,`ghost`),t===`navigate`?(i.style.display=`block`,n.setAttribute(`data-variant`,`primary`),_(e)):(a.style.display=`block`,r.setAttribute(`data-variant`,`primary`),v(e)),d(e)};n.onclick=()=>s(`navigate`),r.onclick=()=>s(`upgrade`),e.querySelector(`#gcpg-close`).onclick=()=>e.remove(),(async()=>{try{o=await f(),o.isPro&&o.licenseKey&&o.instanceId&&g(o.licenseKey,o.instanceId).then(async({result:t,variant:n})=>{t===`invalid`?(await m(),v(e),d(e)):t===`valid`&&n&&o.variant!==n&&await p({...o,variant:n})}),_(e),d(e)}catch{}})()}console.log(`GCP Console Guard loaded (read-only)`),y();