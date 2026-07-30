// Guitar Guides — shared renderer.
// Expects data.js to define window.GUIDE_ERAS (required) and
// window.GUIDE_RUNDOWNS (optional) before this script runs, and the page
// to contain empty #gg-timeline / #gg-rundowns containers.

(function () {
  'use strict';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Escapes everything, then re-enables "**bold**" spans as <strong>.
  function renderInline(str) {
    return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function youTubeEmbedUrl(url) {
    var match = String(url).match(/[?&]v=([^&]+)/);
    return match ? 'https://www.youtube.com/embed/' + match[1] : null;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function elHtml(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderVideoEmbed(url, title) {
    var embedUrl = youTubeEmbedUrl(url);
    if (!embedUrl) return null;
    var wrap = el('div', 'gg-video');
    var iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.title = title || 'Video';
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);
    return wrap;
  }

  function renderVideoCard(video, fallbackTitle) {
    var videoObj = typeof video === 'string' ? { url: video } : video;
    var card = el('div', 'gg-rundown-card');
    if (videoObj.title) card.appendChild(el('div', 'gg-rundown-title', videoObj.title));
    if (videoObj.source) card.appendChild(el('div', 'gg-rundown-source', videoObj.source));

    var embed = renderVideoEmbed(videoObj.url, videoObj.title || fallbackTitle);
    if (embed) card.appendChild(embed);

    if (videoObj.note) {
      card.appendChild(elHtml('p', 'gg-rundown-note', renderInline(videoObj.note)));
    }

    return card;
  }

  function renderEra(era) {
    var card = el('div', 'gg-era-card');
    card.appendChild(el('span', 'gg-era-kicker', era.kicker));
    card.appendChild(el('span', 'gg-era-years', era.years));
    card.appendChild(el('h3', 'gg-era-title', era.title));
    card.appendChild(el('p', 'gg-era-dek', era.dek));

    var body = el('div', 'gg-era-body');
    var paragraphs = Array.isArray(era.body) ? era.body : (era.body ? [era.body] : []);
    paragraphs.forEach(function (paragraph) {
      body.appendChild(elHtml('p', null, renderInline(paragraph)));
    });
    card.appendChild(body);

    if (era.quote && era.quote.text) {
      var quote = elHtml('blockquote', 'gg-quote', '&ldquo;' + renderInline(era.quote.text) + '&rdquo;');
      if (era.quote.attribution) {
        quote.appendChild(el('cite', null, era.quote.attribution));
      }
      card.appendChild(quote);
    }

    if (Array.isArray(era.specs) && era.specs.length) {
      var specs = el('div', 'gg-specs');
      era.specs.forEach(function (spec) {
        var item = el('div', 'gg-spec');
        item.appendChild(el('div', 'gg-spec-label', spec.label));
        item.appendChild(el('div', 'gg-spec-value', spec.value));
        specs.appendChild(item);
      });
      card.appendChild(specs);
    }

    if (era.media && Array.isArray(era.media.videos)) {
      era.media.videos.forEach(function (video) {
        card.appendChild(renderVideoCard(video, era.title));
      });
    }

    if (Array.isArray(era.sources) && era.sources.length) {
      var details = document.createElement('details');
      details.className = 'gg-sources';
      var summary = document.createElement('summary');
      summary.textContent = 'Sources (' + era.sources.length + ')';
      details.appendChild(summary);
      var list = document.createElement('ul');
      era.sources.forEach(function (source) {
        list.appendChild(el('li', null, source));
      });
      details.appendChild(list);
      card.appendChild(details);
    }

    var item = el('div', 'gg-era');
    item.appendChild(card);
    return item;
  }

  function init() {
    var timelineEl = document.getElementById('gg-timeline');
    if (timelineEl && Array.isArray(window.GUIDE_ERAS)) {
      window.GUIDE_ERAS.forEach(function (era) {
        timelineEl.appendChild(renderEra(era));
      });
    }

    var rundownsEl = document.getElementById('gg-rundowns');
    if (rundownsEl && Array.isArray(window.GUIDE_RUNDOWNS)) {
      window.GUIDE_RUNDOWNS.forEach(function (video) {
        rundownsEl.appendChild(renderVideoCard(video));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
