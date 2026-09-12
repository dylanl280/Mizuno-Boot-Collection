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

**On the web (GitHub Pages)**

1. Create an empty repository on GitHub named `Mizuno-Boot-Collection`. Do
   not let GitHub add a README, licence or `.gitignore`; this repo already
   has its own history.

2. Push:

   ```
   git push -u origin main
   ```

   The `origin` remote is already set to
   `https://github.com/dylanl280/Mizuno-Boot-Collection.git`. If you name the
   repository something else, point it there first:

   ```
   git remote set-url origin https://github.com/<user>/<repo>.git
   ```

3. In the repository, open **Settings → Pages**, set **Source** to
   *Deploy from a branch*, pick branch `main` and folder `/ (root)`, and
   save. The first build takes a minute or two.

The site then lives at `https://<user>.github.io/<repo>/`.

Pages serves a project site from a subdirectory rather than the domain root,
so every path in this repo is relative and none begin with a slash. The
empty `.nojekyll` file tells Pages to publish the files as they are instead
of running them through Jekyll.

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

Every pair is currently flagged `stockPhoto: true`, which prints a small
caption under the gallery. When you replace a boot's photos with your own,
set that flag to `false` and the caption disappears.

Every pair now carries a multi-angle set of manufacturer or retailer
cut-outs on white. Sources were Mizuno's own CDN for the current Morelia,
Morelia Neo and Alpha models, nike.com for the Ligera Pro, Unisport for the
Tiempos and the Wave Cup Legend, and the Japanese and Singaporean
specialists for the Japan-market releases the western retailers never
carried.

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

## Colour

Mizuno's brand palette is a single colour: blue **#001489**, unchanged since
1993 and chosen to stand for confidence. The site holds to that. Every blue
on the page is either that exact value or a tint of it, declared once at the
top of [`assets/css/styles.css`](assets/css/styles.css):

| Token | Value | Used for |
|---|---|---|
| `--mizuno` | `#001489` | Hero, Runbird mark, active filters, links, badges |
| `--mizuno-deep` | `#000b4d` | Pressed chips, the lightbox ground |
| `--mizuno-lift` | `#2b44b5` | Hover, one step up from the brand blue |
| `--mizuno-glow` | `#3d5ce0` | The hero's light source, nothing else |
| `--mizuno-soft` | `#e8eaf6` | Focus rings and the K-Leather badge |
| `--hinomaru` | `#bc002d` | Made in Japan badge only |

`--hinomaru` is the one colour that is not Mizuno's. It is the red of the
Japanese flag, and it marks the pairs actually built in Japan. Everything
else on the page is ink, rule and paper greys.

Change `--mizuno` and the whole site follows.

## Layout

```
index.html          the grid
boot.html           the detail page, reads ?id= from the URL
data/boots.js       all collection data — the only file you need to edit
assets/css/         styles, with the colour tokens at the top
assets/js/          common helpers, grid logic, detail-page gallery
assets/favicon.svg  the Runbird on a Mizuno-blue tile
images/<id>/        photographs, one folder per pair
.nojekyll           tells GitHub Pages to publish the files untouched
```

## Sources

Specifications were gathered from Mizuno's and Nike's own regional product
listings and from published boot reviews, including SoccerBible, Footy
Headlines, Unisport, Pro:Direct, Lockhart Boot Blog and Boothype. Weights are
the manufacturer's figure for a single boot at UK 8 / 27.0 cm and vary by size.
Where no weight has been published, the field is `null` and the row is hidden
rather than guessed at.
