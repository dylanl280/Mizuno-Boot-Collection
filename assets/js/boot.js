/* ============================================================
   Detail page: image gallery, specification sheet, pager.
   ============================================================ */

(function () {
  const $ = (s) => document.querySelector(s);
  mountChrome();

  const id = new URLSearchParams(location.search).get("id");
  const boot = BOOTS.find((b) => b.id === id);

  if (!boot) {
    $("#detail").innerHTML =
      '<div class="empty" style="grid-column:1/-1">' +
      "<h2>That pair is not in the collection.</h2>" +
      '<p><a href="index.html" style="color:var(--accent);text-decoration:underline">Back to the collection</a></p>' +
      "</div>";
    return;
  }

  document.title = `${fullName(boot)} — Mizuno Boot Collection`;

  /* ---------------------------------------------- breadcrumbs */

  $("#crumbs").innerHTML =
    `<a href="index.html">Collection</a><span>/</span>` +
    `<a href="index.html?view=all&line=${encodeURIComponent(boot.line)}">${esc(boot.line)}</a>` +
    `<span>/</span>${esc(fullName(boot))}`;

  /* ---------------------------------------------- specification rows */

  const rows = [
    ["Brand", boot.brand],
    ["Line", boot.line],
    ["Model", boot.model],
    ["Version", boot.tier],
    ["Colourway", boot.colorway],
    ["Released", boot.year],
    ["Weight", boot.weightG ? `${boot.weightG} g (UK 8 / 27.0 cm)` : null],
    ["Upper", boot.upper],
    ["Lining", boot.lining],
    ["Soleplate", boot.soleplate],
    ["Surfaces", (boot.surface || []).join(", ")],
    ["Collar", boot.collar],
    ["Last", boot.lastName],
    ["Made in", boot.madeIn],
    ["Retail at launch", boot.retailUsd ? `$${boot.retailUsd} USD` : null],
  ].filter(([, v]) => v !== null && v !== undefined && v !== "");

  const tags = [];
  if (boot.owned) tags.push('<span class="tag tag--k">In Collection</span>');
  if (hasKLeather(boot)) tags.push('<span class="tag tag--k">K-Leather</span>');
  if (isMIJ(boot)) tags.push('<span class="tag tag--mij">Made in Japan</span>');
  (boot.surface || []).forEach((s) => tags.push(`<span class="tag">${esc(s)}</span>`));
  if (boot.weightG) tags.push(`<span class="tag">${boot.weightG}g</span>`);

  const imgs = boot.images || [];

  /* ---------------------------------------------- render */

  $("#detail").innerHTML = `
    <div class="gallery">
      <div class="stage" id="stage">
        ${
          imgs.length
            ? `<img id="stageImg" src="${esc(imgs[0])}" alt="${esc(fullName(boot))}">
               <button class="stage__nav stage__nav--prev" id="prev" aria-label="Previous image">${ICON.left}</button>
               <button class="stage__nav stage__nav--next" id="next" aria-label="Next image">${ICON.right}</button>
               <span class="stage__counter" id="counter">1 / ${imgs.length}</span>`
            : `<div class="ph">${ICON.boot}<span class="ph__label">Photographs coming soon</span></div>`
        }
      </div>
      ${
        imgs.length > 1
          ? `<div class="thumbs" id="thumbs">${imgs
              .map(
                (src, i) =>
                  `<button class="thumb" data-i="${i}" aria-current="${i === 0}" aria-label="Image ${i + 1}">
                     <img src="${esc(src)}" alt="" loading="lazy">
                   </button>`
              )
              .join("")}</div>`
          : ""
      }
    </div>

    <div class="info">
      <p class="info__line">${esc(boot.brand)} &middot; ${esc(boot.line)}</p>
      <h1>${esc(fullName(boot))}</h1>
      <p class="info__colorway">${esc(boot.colorway || "Colourway not recorded")}</p>
      <div class="info__tags">${tags.join("")}</div>

      ${boot.description ? `<p class="info__desc">${esc(boot.description)}</p>` : ""}

      <section class="block">
        <h2>Specification</h2>
        <table class="specs">
          ${rows
            .map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`)
            .join("")}
        </table>
      </section>

      ${
        (boot.tech || []).length
          ? `<section class="block">
               <h2>Technology</h2>
               <ul class="techlist">${boot.tech.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
             </section>`
          : ""
      }

      <section class="block">
        <h2>My notes</h2>
        <div class="notes ${boot.notes ? "" : "notes--empty"}">${
          boot.notes
            ? esc(boot.notes)
            : "No notes yet. Add them in data/boots.js under this pair."
        }</div>
      </section>
    </div>`;

  /* ---------------------------------------------- pager */

  const order = BOOTS.slice().sort((a, b) => (b.year || 0) - (a.year || 0));
  const pos = order.findIndex((b) => b.id === boot.id);
  const prevBoot = order[pos - 1];
  const nextBoot = order[pos + 1];

  const pagerCell = (b, dir) => {
    if (!b) return "<span></span>";
    const thumb = primaryImage(b);
    return `<a class="${dir === "Next" ? "is-next" : ""}" href="boot.html?id=${encodeURIComponent(b.id)}">
      <span class="pager__thumb">${
        thumb ? `<img src="${esc(thumb)}" alt="">` : `<div class="ph">${ICON.boot}</div>`
      }</span>
      <span>
        <p class="pager__dir">${dir}</p>
        <p class="pager__name">${esc(fullName(b))}</p>
      </span>
    </a>`;
  };

  $("#pager").innerHTML = pagerCell(prevBoot, "Previous") + pagerCell(nextBoot, "Next");

  /* ---------------------------------------------- gallery behaviour */

  if (!imgs.length) return;

  let i = 0;
  const stageImg = $("#stageImg");
  const counter = $("#counter");
  const thumbs = document.querySelectorAll(".thumb");
  const prevBtn = $("#prev");
  const nextBtn = $("#next");

  function show(n) {
    i = (n + imgs.length) % imgs.length;
    stageImg.src = imgs[i];
    counter.textContent = `${i + 1} / ${imgs.length}`;
    thumbs.forEach((t, k) => t.setAttribute("aria-current", String(k === i)));
    if (lb.hidden === false) lbImg.src = imgs[i];
  }

  /* A single image needs no arrows. */
  if (imgs.length < 2) {
    prevBtn.hidden = nextBtn.hidden = true;
    counter.hidden = true;
  }

  prevBtn.addEventListener("click", () => show(i - 1));
  nextBtn.addEventListener("click", () => show(i + 1));

  document.querySelectorAll(".thumb").forEach((t) =>
    t.addEventListener("click", () => show(Number(t.dataset.i)))
  );

  /* ---------------------------------------------- lightbox */

  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  $("#lbClose").innerHTML = ICON.close;
  $("#lbPrev").innerHTML = ICON.left;
  $("#lbNext").innerHTML = ICON.right;

  function openLb() {
    lbImg.src = imgs[i];
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }

  stageImg.style.cursor = "zoom-in";
  stageImg.addEventListener("click", openLb);
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => show(i - 1));
  $("#lbNext").addEventListener("click", () => show(i + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

  /* ---------------------------------------------- keyboard */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lb.hidden) return closeLb();
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
})();
