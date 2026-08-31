/* HG Customs — GA4 + Microsoft Clarity
   1. Replace G-XXXXXXXXXX with your GA4 Measurement ID
   2. Replace CLARITY_PROJECT_ID with your Clarity project ID
   Then upload this file to the repo root (same place as index.html).
*/
(function () {
  var GA4_ID = 'G-XXXXXXXXXX';
  var CLARITY_ID = 'CLARITY_PROJECT_ID';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  if (GA4_ID && GA4_ID.indexOf('XXXXXXXX') === -1) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true });
  }

  if (CLARITY_ID && CLARITY_ID.indexOf('CLARITY_') === -1) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  window.hgTrack = function (name, params) {
    try {
      if (typeof gtag === 'function') gtag('event', name, params || {});
    } catch (e) {}
  };

  window.hgTrackAddToCart = function (product) {
    if (!product) return;
    var price = Number(product.price || 0);
    var qty = Number(product.qty || 1);
    hgTrack('add_to_cart', {
      currency: 'GBP',
      value: price * qty,
      items: [{
        item_id: product.sku || product.id || '',
        item_name: product.title || 'Item',
        price: price,
        quantity: qty
      }]
    });
  };

  window.hgTrackBeginCheckout = function (cart, total) {
    var items = (cart || []).map(function (p) {
      return {
        item_id: p.sku || p.id || '',
        item_name: p.title || 'Item',
        price: Number(p.price || 0),
        quantity: Number(p.qty || 1)
      };
    });
    hgTrack('begin_checkout', {
      currency: 'GBP',
      value: Number(total || 0),
      items: items
    });
  };

  window.hgTrackPurchase = function (params) {
    if (!params) return;
    var items = [];
    try {
      var cart = JSON.parse(params.order_json || '[]');
      items = (cart || []).map(function (p) {
        return {
          item_id: p.sku || p.id || '',
          item_name: p.title || 'Item',
          price: Number(p.price || 0),
          quantity: Number(p.qty || 1)
        };
      });
    } catch (e) {}
    hgTrack('purchase', {
      transaction_id: params.order_ref || '',
      currency: 'GBP',
      value: Number(params.total || 0),
      shipping: String(params.delivery || '').indexOf('Free') !== -1 ? 0 : Number(String(params.delivery || '').replace(/[^\d.]/g, '') || 0),
      items: items
    });
  };
})();
