// Google Analytics 4 (gtag.js). The Measurement ID here is the single
// source of truth — every page loads GA by referencing this one file.
(function () {
  var MEASUREMENT_ID = 'G-GH4TDQ277N';

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
})();
