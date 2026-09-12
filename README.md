# Boot Collection

A shoppable catalogue of the collection. Browse a grid of every pair, click
through to a detail page with a full image gallery and the complete
specification sheet.

Sixteen pairs: twelve Mizuno across Morelia, Morelia Neo, Alpha and Wave Cup,
plus four Nike Tiempos. Ten of them are handmade in Japan and one in Italy.

No build step, no dependencies. Open `index.html` in a browser and it works.

## Running it

**Locally** — double-click `index.html`, or serve the folder:

```
python -m http.server 8000
```

**On the web** — push to GitHub, then Settings → Pages → deploy from `main`,
root folder. The site is live at `https://<user>.github.io/<repo>/`.

## Adding a pair

Everything lives in [`data/boots.js`](data/boots.js). Copy an existing block,
change the fields, save. The grid, the filters, the brand list, the counts and
the detail pages all update themselves.

```js
{
  id: "mizuno-morelia-neo-v-japan-prism",  // unique, lowercase, dashes; used in the URL
  brand: "Mizuno",                         // becomes an option in the brand menu
  line: "Morelia Neo",                     // becomes a filter chip
  model: "Morelia Neo V Beta",
  tier: "Made in Japan",                   // Made in Japan | Elite | Select | Standard
  colorway: "Prism — White / Lava Orange",
  year: 2026,
  surface: ["FG"],
  weightG: 205,                            // null when unpublished; the row hides
  upper: "Kangaroo leather, thin-cut forefoot",
  lining: "High-density micro taffeta",
  soleplate: "Ultralight nylon",
  collar: "Low, tongueless",
  madeIn: "Japan",
  retailUsd: null,
  lastName: "Engineered Fit Last NEO",
  tech: ["Engineered Fit Last NEO", "Outrigger soleplate geometry"],
  description: "One paragraph on what the boot is.",
  notes: "",                               // your own words
  owned: true,
  stockPhoto: true,                        // manufacturer shot, not your own
  images: ["images/mizuno-morelia-neo-v-japan-prism/1.jpg"]
}
```

## Adding photos

1. Find the boot's folder under `images/`, named after its `id`.

2. Drop the photos in. Any filenames work.

3. List them in that boot's `images` array, best shot first — it becomes the
   grid thumbnail, and the second shows on hover:

   ```js
   images: [
     "images/mizuno-morelia-neo-v-japan-prism/1.jpg",
     "images/mizuno-morelia-neo-v-japan-prism/2.jpg",
     "images/mizuno-morelia-neo-v-japan-prism/3.jpg"
   ]
   ```

Leave the array empty and the site draws a clean placeholder tile instead, so
a pair with no photos yet still looks deliberate.

Every pair currently carries one manufacturer product shot and is flagged
`stockPhoto: true`, which prints a small caption under the gallery. When you
replace a boot's photos with your own, set that flag to `false` and the
caption disappears.

**Shot list that works well**, roughly the order a retailer uses: lateral
(outside) profile, medial (inside) profile, top-down on the upper, heel,
soleplate, and one detail shot of the Runbird or the stitching.

Photograph on a plain white background in daylight and keep every shot the
same distance and angle. Images are fitted rather than cropped, so mixed
aspect ratios are fine.

## Fields that drive the interface

| Field | What it does |
|---|---|
| `owned` | `true` shows the pair under **My Collection**, the default view. `false` files it under **Reference**. |
| `brand` | Populates the brand menu. A new brand needs no code change. |
| `line` | Becomes a filter chip. Chips with nothing behind them drop out. |
| `upper` | Containing the word *kangaroo* adds the K-Leather badge. |
| `madeIn` | Set to `Japan` to add the Made in Japan badge. |
| `weightG` | Powers lightest-first and heaviest-first sorting. `null` hides the row. |
| `images` | First entry is the grid thumbnail. Second shows on hover. |
| `stockPhoto` | `true` prints the product-photography caption under the gallery. |

Filter state is written to the URL, so any view you land on is a link you can
send to someone.

## Layout

```
index.html          the grid
boot.html           the detail page, reads ?id= from the URL
data/boots.js       all collection data — the only file you need to edit
assets/css/         styles
assets/js/          common helpers, grid logic, detail-page gallery
images/<id>/        photographs, one folder per pair
```

## Sources

Specifications were gathered from Mizuno's and Nike's own regional product
listings and from published boot reviews, including SoccerBible, Footy
Headlines, Unisport, Pro:Direct, Lockhart Boot Blog and Boothype. Weights are
the manufacturer's figure for a single boot at UK 8 / 27.0 cm and vary by size.
Where no weight has been published, the field is `null` and the row is hidden
rather than guessed at.
