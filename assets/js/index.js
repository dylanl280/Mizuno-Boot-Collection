/* ============================================================
   Grid page: search, line filters, view mode, sorting.
   ============================================================ */

(function () {
  const $ = (s) => document.querySelector(s);

  const els = {
    q: $("#q"),
    brand: $("#brand"),
    view: $("#view"),
    sort: $("#sort"),
    chips: $("#chips"),
    grid: $("#grid"),
    count: $("#count"),
    clear: $("#clear"),
    empty: $("#empty"),
  };

  const state = { q: "", brand: "", view: "owned", sort: "year-desc", lines: new Set() };

  mountChrome();
  $("[data-search-icon]").innerHTML = ICON.search;

  /* Brand options come from the data, so a new brand needs no code change. */
  [...new Set(BOOTS.map((b) => b.brand))].sort().forEach((brand) => {
    const o = document.createElement("option");
    o.value = o.textContent = brand;
    els.brand.appendChild(o);
  });

  /* If nothing is marked owned yet, open on the full catalogue so the page
     is never blank on a fresh clone. */
  if (!BOOTS.some((b) => b.owned)) {
    state.view = "all";
    els.view.value = "all";
  }

  /* ---------- filtering ---------- */

  function byView(b) {
    if (state.view === "owned") return b.owned;
    if (state.view === "ref") return !b.owned;
    return true;
  }

  function byQuery(b) {
    if (!state.q) return true;
    const hay = [
      b.model, b.line, b.tier, b.colorway, b.upper, b.soleplate,
      b.madeIn, b.brand, b.description, b.notes, (b.tech || []).join(" "),
      b.year,
    ].join(" ").toLowerCase();
    return state.q.split(/\s+/).every((t) => hay.includes(t));
  }

  function byLine(b) {
    return state.lines.size === 0 || state.lines.has(b.line);
  }

  function byBrand(b) {
    return !state.brand || b.brand === state.brand;
  }

  function sorted(list) {
    const big = 1e9;
    const arr = list.slice();
    switch (state.sort) {
      case "year-asc":
        return arr.sort((a, b) => (a.year || big) - (b.year || big));
      case "weight-asc":
        return arr.sort((a, b) => (a.weightG || big) - (b.weightG || big));
      case "weight-desc":
        return arr.sort((a, b) => (b.weightG || 0) - (a.weightG || 0));
      case "name":
        return arr.sort((a, b) => fullName(a).localeCompare(fullName(b)));
      default:
        return arr.sort((a, b) => (b.year || 0) - (a.year || 0));
    }
  }

  /* ---------- chips ---------- */

  function renderChips() {
    /* Counts reflect the current view and brand so the numbers never lie,
       and a line with nothing behind it drops out of the row entirely. */
    const pool = BOOTS.filter(byView).filter(byBrand);
    const lines = [...new Set(pool.map((b) => b.line))].sort();

    /* A line filter left over from another brand would hide everything. */
    [...state.lines].forEach((l) => {
      if (!lines.includes(l)) state.lines.delete(l);
    });

    els.chips.innerHTML = lines
      .map((line) => {
        const n = pool.filter((b) => b.line === line).length;
        const on = state.lines.has(line);
        return `<button class="chip" type="button" data-line="${esc(line)}" aria-pressed="${on}">
                  ${esc(line)}<span class="chip__n">${n}</span>
                </button>`;
      })
      .join("");
  }

  /* ---------- render ---------- */

  function render() {
    renderChips();

    const list = sorted(
      BOOTS.filter(byView).filter(byBrand).filter(byLine).filter(byQuery)
    );

    els.grid.innerHTML = list.map(cardMarkup).join("");
    els.empty.hidden = list.length > 0;

    const label = state.view === "ref" ? "reference model" : "pair";
    els.count.textContent =
      list.length === 1 ? `1 ${label}` : `${list.length} ${label}s`;

    const dirty =
      state.q || state.brand || state.lines.size || state.sort !== "year-desc";
    els.clear.hidden = !dirty;

    /* Keep the URL shareable. */
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.brand) p.set("brand", state.brand);
    if (state.view !== "owned") p.set("view", state.view);
    if (state.lines.size) p.set("line", [...state.lines].join(","));
    if (state.sort !== "year-desc") p.set("sort", state.sort);
    const qs = p.toString();
    /* file:// origins can reject replaceState; the grid works fine without it. */
    try {
      history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
    } catch (_) {}
  }

  /* ---------- events ---------- */

  let t;
  els.q.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.q = els.q.value.trim().toLowerCase();
      render();
    }, 120);
  });

  els.brand.addEventListener("change", () => {
    state.brand = els.brand.value;
    render();
  });

  els.view.addEventListener("change", () => {
    state.view = els.view.value;
    render();
  });

  els.sort.addEventListener("change", () => {
    state.sort = els.sort.value;
    render();
  });

  els.chips.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-line]");
    if (!btn) return;
    const line = btn.dataset.line;
    state.lines.has(line) ? state.lines.delete(line) : state.lines.add(line);
    render();
  });

  els.clear.addEventListener("click", () => {
    state.q = "";
    state.brand = "";
    state.lines.clear();
    state.sort = "year-desc";
    els.q.value = "";
    els.brand.value = "";
    els.sort.value = "year-desc";
    render();
  });

  /* ---------- restore from URL ---------- */

  const p = new URLSearchParams(location.search);
  if (p.get("q")) { state.q = p.get("q").toLowerCase(); els.q.value = p.get("q"); }
  if (p.get("brand")) { state.brand = p.get("brand"); els.brand.value = state.brand; }
  if (p.get("view")) { state.view = p.get("view"); els.view.value = state.view; }
  if (p.get("sort")) { state.sort = p.get("sort"); els.sort.value = state.sort; }
  if (p.get("line")) p.get("line").split(",").filter(Boolean).forEach((l) => state.lines.add(l));

  render();
})();
