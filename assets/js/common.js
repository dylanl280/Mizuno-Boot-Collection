/* ============================================================
   Shared helpers used by both the grid and the detail page.
   ============================================================ */

const BOOTS = (window.BOOTS || []).map((b, i) => ({ ...b, _i: i }));

/* ---------- small utilities ---------- */

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const fullName = (b) => `${b.model}${b.tier && b.tier !== "Standard" ? " " + b.tier : ""}`;

const hasKLeather = (b) => /kangaroo/i.test(b.upper || "");
const isMIJ = (b) => (b.madeIn || "").toLowerCase() === "japan";

/* ---------- inline icons ---------- */

const ICON = {
  runbird:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 14.2c3.6-.5 6.2-1.9 8.2-4C13.4 7.9 14.6 5.2 15 2c2.4 1.4 4.1 3.3 5 5.6.9 2.4.7 4.9-.6 7.1-1.4 2.4-3.8 4.1-6.9 4.9-2.7.7-5.6.5-8.3-.5.9-1 1.9-2.3 2.8-3.8-1.3.4-2.6.7-4 .9Z"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>',
  camera:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z"/><circle cx="12" cy="13" r="3.4"/></svg>',
  left:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
  right:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  boot:
    '<svg viewBox="0 0 200 108" fill="currentColor" aria-hidden="true">' +
    '<path d="M10 70c0-17 13-31 35-38 21-6 43-9 63-11 18-2 34 2 46 11 12 8 21 18 29 26 5 5 4 13-3 14L20 78c-6 0-10-3-10-8Z"/>' +
    '<rect x="18" y="84" width="20" height="11" rx="3"/>' +
    '<rect x="56" y="84" width="20" height="11" rx="3"/>' +
    '<rect x="112" y="84" width="20" height="11" rx="3"/>' +
    '<rect x="158" y="84" width="20" height="11" rx="3"/>' +
    "</svg>",
};

/* ---------- imagery ---------- */

/** First image for a boot, or null when the collection has no photo yet. */
function primaryImage(b) {
  return b.images && b.images.length ? b.images[0] : null;
}

/** Markup for a boot's media box: a real photo when present, else a placeholder. */
function mediaMarkup(b, { hover = false } = {}) {
  const imgs = b.images || [];
  if (!imgs.length) {
    return (
      '<div class="ph">' +
      ICON.boot +
      '<span class="ph__label">Photo coming soon</span>' +
      "</div>"
    );
  }
  let out = `<img class="is-main" src="${esc(imgs[0])}" alt="${esc(fullName(b))}" loading="lazy">`;
  if (hover && imgs[1]) {
    out += `<img class="is-alt" src="${esc(imgs[1])}" alt="" aria-hidden="true" loading="lazy">`;
  }
  return out;
}

/* ---------- card ---------- */

function cardMarkup(b) {
  const tags = [];
  if (b.weightG) tags.push(`<span class="tag">${b.weightG}g</span>`);
  if (hasKLeather(b)) tags.push('<span class="tag tag--k">K-Leather</span>');
  if (isMIJ(b)) tags.push('<span class="tag tag--mij">Made in Japan</span>');
  if (b.year) tags.push(`<span class="tag">${b.year}</span>`);

  const shots = (b.images || []).length;

  return `
    <a class="card" href="boot.html?id=${encodeURIComponent(b.id)}">
      <div class="card__media">
        ${
          b.owned
            ? '<span class="card__flag">In Collection</span>'
            : '<span class="card__flag card__flag--ref">Reference</span>'
        }
        ${mediaMarkup(b, { hover: true })}
        ${
          shots > 1
            ? `<span class="card__shots">${ICON.camera}${shots}</span>`
            : ""
        }
      </div>
      <div class="card__body">
        <p class="card__line">${esc(b.line)}</p>
        <h3 class="card__name">${esc(fullName(b))}</h3>
        <p class="card__colorway">${esc(b.colorway || "—")}</p>
        <div class="card__meta">${tags.join("")}</div>
      </div>
    </a>`;
}

/* ---------- masthead / footer ---------- */

function mountChrome() {
  const owned = BOOTS.filter((b) => b.owned).length;

  document.querySelectorAll("[data-mark]").forEach((el) => {
    el.innerHTML = ICON.runbird;
  });

  document.querySelectorAll("[data-owned-count]").forEach((el) => {
    el.textContent = owned === 1 ? "1 pair" : `${owned} pairs`;
  });

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}
