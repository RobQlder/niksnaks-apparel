# NiksNaks Apparel

Static gallery site: plain HTML, Bootstrap 5.3, GLightbox. Shirts are listed in `shirts.json`.

## Preview locally

```bash
python3 -m http.server 8795
```

Then open http://localhost:8795

## Add new shirts

1. Put the new photos in a folder.
2. Run `scripts/add-photos.sh ~/Desktop/new-shirts`
3. Paste the printed lines into the `shirts` list in `shirts.json`, then fill in `caption`
   and `category` (`uk`, `anime` or `pop`, or add a new one under `categories`).
4. `"new": true` shows the NEW sticker. Remove it from older shirts when it no longer applies.

Order in `shirts.json` is the order on the page.
