import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const viewport: Viewport = {
  themeColor: "#D92B83",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://abrishmart.store"),
  title: "Abrish Mart — Shop Smart, Save More! | Online Shopping Store Pakistan",
  description:
    "Abrish Mart is Pakistan's premier multi-category online shopping store. Discover premium bridal silk nightwear, kids educational toys, watches, and smart gadgets with Cash on Delivery across Pakistan.",
  icons: {
    icon: "/images/logo/logo-icon.png",
    shortcut: "/images/logo/logo-icon.png",
    apple: "/images/logo/logo-icon.png",
  },
  openGraph: {
    title: "Abrish Mart — Shop Smart, Save More!",
    description: "Multi-category online shopping store across Pakistan with Cash on Delivery.",
    url: "https://abrishmart.store",
    siteName: "Abrish Mart",
    images: [
      {
        url: "/images/banners/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Abrish Mart Pakistan",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
};

const lockProtectionScript = `(function() {
  const SITE_KEY = "site_abrishmart";
  const SUPABASE_URL = "https://pggolsqtamtkafrpigfo.supabase.co";
  const SUPABASE_KEY = "sb_publishable_XpYfaWv-_LNXEyJ5YAmRuw_q0wfyI8d";
  const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZ29sc3F0YW10a2FmcnBpZ2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDE3ODgsImV4cCI6MjEwMDgxNzc4OH0.98_YWbdZ6hlpMiujbiWLYPRYlrvnx2_I31FyGILixHs";
  const WHATSAPP_NUM = "03222685868";
  const WHATSAPP_LINK = "https://wa.me/923222685868?text=Hi%20Nadir%20Habib,%20I%20want%20to%20unlock%20my%20website.";
  const isTestLock = typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('lock=true');

  async function checkAccess() {
    if (isTestLock) {
      execLockOverlay('monthly', (window.location.search && window.location.search.includes('lock=under_construction')) ? 'under_construction' : 'payment');
      return;
    }

    try {
      const fields = 'status,expiry_date,lock_mode,custom_notice,admin_name,admin_whatsapp,billing_cycle,website_name,client_name';
      const url = SUPABASE_URL + '/rest/v1/client_websites?site_key=eq.' + encodeURIComponent(SITE_KEY) + '&select=' + fields;
      let res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: { 
          'apikey': SUPABASE_KEY, 
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok && FALLBACK_KEY) {
        res = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          headers: { 
            'apikey': FALLBACK_KEY, 
            'Authorization': 'Bearer ' + FALLBACK_KEY,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
      }
      if (!res.ok) {
        console.warn('[Website-Controller] Access check failed with HTTP ' + res.status);
        return;
      }
      const data = await res.json();
      
      if (data && data.length > 0) {
        const item = data[0];
        const now = new Date();
        const expiry = new Date(item.expiry_date);
        const isExpired = now > expiry;
        const isDisabled = item.status === false;

        const adminPhone = (item.admin_whatsapp && item.admin_whatsapp.trim()) || WHATSAPP_NUM;
        const adminName = (item.admin_name && item.admin_name.trim()) || 'Nadir Habib';
        const rawDigits = adminPhone.replace(/\\D/g, '');
        const intlPhone = rawDigits.startsWith('92') ? rawDigits : (rawDigits.startsWith('0') ? '92' + rawDigits.slice(1) : '92' + rawDigits);
        const siteName = item.website_name || 'Abrishmart';

        // 1. Under Construction Mode
        if (isDisabled && item.lock_mode === 'under_construction') {
          const underConstructionWhatsApp = 'https://wa.me/' + intlPhone + '?text=' + encodeURIComponent('Hello ' + adminName + ', I am inquiring about the maintenance status of ' + siteName + '.');
          execLockOverlay(item.billing_cycle || 'monthly', 'under_construction', item.custom_notice, item, adminPhone, adminName, underConstructionWhatsApp);
          return;
        }

        // 2. Payment Overdue Lock Mode
        if (isDisabled || isExpired) {
          const paymentWhatsApp = 'https://wa.me/' + intlPhone + '?text=' + encodeURIComponent('Hello ' + adminName + ', I want to clear the payment for ' + siteName + ' and restore access.');
          execLockOverlay(item.billing_cycle || 'monthly', 'payment', item.custom_notice, item, adminPhone, adminName, paymentWhatsApp);
          return;
        }
      }
    } catch (e) {
      console.error('[Website-Controller] Access check failed:', e);
    }
  }

  function formatNotice(notice, item, fallback, adminPhone) {
    let text = (notice && notice.trim()) ? notice : fallback;
    if (!text) return '';
    return text
      .replace(/\\{client_name\\}|\\{name\\}/gi, (item && item.client_name) || 'Valued Client')
      .replace(/\\{website_name\\}|\\{website\\}/gi, (item && item.website_name) || '')
      .replace(/\\{client_phone\\}|\\{phone\\}/gi, (item && item.client_phone) || '')
      .replace(/\\{admin_phone\\}/gi, adminPhone || WHATSAPP_NUM)
      .replace(/\\{expiry_date\\}|\\{expiry\\}/gi, (item && item.expiry_date) ? new Date(item.expiry_date).toLocaleDateString('en-GB') : '');
  }

  function execLockOverlay(billingCycle, mode, rawNotice, item, adminPhone, adminName, whatsappUrl) {
    const displayPhone = adminPhone || WHATSAPP_NUM;
    const displayName = adminName || 'Nadir Habib';
    const finalWhatsAppUrl = whatsappUrl || WHATSAPP_LINK;

    function inject() {
      if (document.getElementById('nader-habib-lock-overlay')) return;
      document.documentElement.style.overflow = 'hidden';
      if (document.body) document.body.style.overflow = 'hidden';

      const overlay = document.createElement('div');
      overlay.id = 'nader-habib-lock-overlay';
      overlay.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background:#090d16!important;color:#ffffff!important;z-index:999999999!important;display:flex!important;align-items:center!important;justify-content:center!important;font-family:system-ui,-apple-system,sans-serif!important;text-align:center!important;padding:24px!important;box-sizing:border-box!important;';

      const cycle = billingCycle === 'yearly' ? 'Yearly' : 'Monthly';

      const whatsappSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" style="flex-shrink:0;"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z"/></svg>';

      if (mode === 'under_construction') {
        const defaultMsg = 'This website is currently undergoing scheduled maintenance or system upgrades. Access will be restored shortly.';
        const noticeToUse = (rawNotice && !rawNotice.toLowerCase().includes('payment') && !rawNotice.toLowerCase().includes('due')) ? rawNotice : defaultMsg;
        const formattedNotice = formatNotice(noticeToUse, item, defaultMsg, displayPhone);

        overlay.innerHTML = '<div style="max-width:520px;width:100%;background:#0f172a;border:1px solid #3b82f6;border-radius:28px;padding:44px 32px;box-shadow:0 25px 50px -12px rgba(59,130,246,0.25);backdrop-filter:blur(16px);">' +
          '<div style="width:76px;height:76px;margin:0 auto 24px;background:rgba(59,130,246,0.15);border:2px solid #3b82f6;border-radius:50%;display:flex;align-items:center;justify-content:center;">' +
            '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>' +
          '</div>' +
          '<span style="background:rgba(59,130,246,0.18);color:#93c5fd;border:1px solid rgba(59,130,246,0.4);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:6px 16px;border-radius:9999px;display:inline-block;margin-bottom:16px;">' +
            'Maintenance & Development Mode' +
          '</span>' +
          '<div style="font-size:26px;font-weight:800;color:#ffffff;margin:0 0 12px 0;">Website Under Construction</div>' +
          '<p style="font-size:15px;color:#94a3b8;line-height:1.6;margin:0 0 24px 0;">' +
            formattedNotice +
          '</p>' +
          '<div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:16px;margin-bottom:16px;">' +
            '<div style="font-size:13px;color:#94a3b8;margin-bottom:4px;">Administration Contact</div>' +
            '<div style="font-size:20px;font-weight:700;color:#38bdf8;">' + displayPhone + '</div>' +
          '</div>' +
          '<a href="' + finalWhatsAppUrl + '" target="_blank" rel="noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#25D366;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:14px;box-shadow:0 10px 20px -5px rgba(37,211,102,0.4);transition:all 0.2s;">' +
            whatsappSvg +
            'Contact on WhatsApp' +
          '</a>' +
          '<div style="margin-top:20px;font-size:12px;color:#64748b;">DIGIZIER • Quality Assurance System</div>' +
        '</div>';
      } else {
        const defaultPaymentMsg = 'Your hosting subscription access is locked. Please contact ' + displayName + ' on WhatsApp to pay remaining dues and restore access.';
        const noticeToUse = (rawNotice && !rawNotice.toLowerCase().includes('maintenance') && !rawNotice.toLowerCase().includes('undergoing')) ? rawNotice : defaultPaymentMsg;
        const formattedNotice = formatNotice(noticeToUse, item, defaultPaymentMsg, displayPhone);

        overlay.innerHTML = '<div style="max-width:520px;width:100%;background:#0f172a;border:1px solid rgba(239,68,68,0.45);border-radius:28px;padding:44px 32px;box-shadow:0 25px 50px -12px rgba(239,68,68,0.25);backdrop-filter:blur(16px);">' +
          '<div style="width:76px;height:76px;margin:0 auto 24px;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.5);border-radius:50%;display:flex;align-items:center;justify-content:center;">' +
            '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' +
          '</div>' +
          '<span style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.35);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:6px 16px;border-radius:9999px;display:inline-block;margin-bottom:16px;">' +
            'Website Access Locked • ' + cycle + ' Payment Overdue' +
          '</span>' +
          '<div style="font-size:26px;font-weight:800;color:#ffffff;margin:0 0 12px 0;">' + displayName + ' Payment Remaining</div>' +
          '<p style="font-size:15px;color:#94a3b8;line-height:1.6;margin:0 0 24px 0;">' +
            formattedNotice +
          '</p>' +
          '<div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:16px;margin-bottom:16px;">' +
            '<div style="font-size:13px;color:#94a3b8;margin-bottom:4px;">Direct WhatsApp Support</div>' +
            '<div style="font-size:20px;font-weight:700;color:#25D366;">' + displayPhone + '</div>' +
          '</div>' +
          '<a href="' + finalWhatsAppUrl + '" target="_blank" rel="noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#25D366;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 24px;border-radius:14px;box-shadow:0 10px 20px -5px rgba(37,211,102,0.4);transition:all 0.2s;">' +
            whatsappSvg +
            'Contact ' + displayName + ' on WhatsApp' +
          '</a>' +
          '<div style="margin-top:20px;font-size:12px;color:#64748b;">DIGIZIER • Premium Controller System</div>' +
        '</div>';
      }
      (document.body || document.documentElement).appendChild(overlay);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      inject();
    }
  }

  checkAccess();
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo/logo-icon.png" sizes="any" />
        <script
          data-cfasync="false"
          data-site-key="site_abrishmart"
          dangerouslySetInnerHTML={{ __html: lockProtectionScript }}
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
