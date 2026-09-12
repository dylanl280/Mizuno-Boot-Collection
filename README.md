# Mizuno Boot Collection

A shoppable catalogue of the collection. Browse a grid of every pair, click
through to a detail page with a full image gallery and the complete
specification sheet.

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
change the fields, save. The grid, the filters, the counts and the detail
pages all update themselves.

```js
{
  id: "morelia-neo-iv-beta-elite",   // unique, lowercase, dashes; used in the URL
  brand: "Mizuno",
  line: "Morelia Neo",               // groups the filter chips
  model: "Morelia Neo IV Beta",
  tier: "Elite",                     // Elite | Made in Japan | Select | Standard
  colorway: "Black / White",
  year: 2024,
  surface: ["FG", "AG"],
  weightG: 200,
  upper: "35% kangaroo leather, 65% synthetic",
  lining: "Synthetic",
  soleplate: "Graded nylon",
  collar: "Low, tongueless",
  madeIn: "Vietnam",
  retailUsd: 280,                    // null if unknown
  lastName: "Engineered Fit Last NEO",
  tech: ["External heel counter", "Reconstructed studs"],
  description: "One paragraph on what the boot is.",
  notes: "",                         // your own words
  owned: true,
  images: []
}
```

## Adding photos

1. Make a folder named after the boot's `id`:

   ```
   images/morelia-neo-iv-beta-elite/
   ```

2. Drop the photos in. Any filenames work.

3. List them in that boot's `images` array, best shot first — it becomes the
   grid thumbnail:

   ```js
   images: [
     "images/morelia-neo-iv-beta-elite/1.jpg",
     "images/morelia-neo-iv-beta-elite/2.jpg",
     "images/morelia-neo-iv-beta-elite/3.jpg"
   ]
   ```

Leave the array empty and the site draws a clean placeholder tile instead, so
a pair with no photos yet still looks deliberate.

**Shot list that works well**, roughly the order a retailer uses: lateral
(outside) profile, medial (inside) profile, top-down on the upper, heel,
soleplate, and one detail shot of the Runbird or the stitching.

Photograph on a plain background in daylight and keep every shot the same
distance and angle. The grid crops to 4:3, so leave a little room around the
boot.

## Fields that drive the interface

| Field | What it does |
|---|---|
| `owned` | `true` shows the pair under **My Collection**, the default view. `false` files it under **Reference**. |
| `line` | Becomes a filter chip. New lines appear automatically. |
| `upper` | Containing the word *kangaroo* adds the K-Leather badge. |
| `madeIn` | Set to `Japan` to add the Made in Japan badge. |
| `weightG` | Powers the lightest-first and heaviest-first sorting. |
| `images` | First entry is the grid thumbnail. Second shows on hover. |

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

Specifications were gathered from Mizuno's own regional product listings and
from published boot reviews. Weights are the manufacturer's figure for a
single boot at UK 8 / 27.0 cm and will vary by size.
