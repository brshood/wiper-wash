/**
 * Generate favicon set from pic_ref/wiperclear.png
 * Run: node scripts/generate-favicons.mjs
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "public", "pic_ref", "wiperclear.png");

const py = `
from PIL import Image
import os

SOURCE = r"${source.replace(/\\/g, "\\\\")}"
ROOT = r"${root.replace(/\\/g, "\\\\")}"

def trim_to_logo(im):
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    mask = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 16:
                continue
            if r + g + b > 60:
                mask.append((x, y))
    if not mask:
        return im
    xs = [p[0] for p in mask]
    ys = [p[1] for p in mask]
    pad = 24
    left = max(0, min(xs) - pad)
    top = max(0, min(ys) - pad)
    right = min(w, max(xs) + pad + 1)
    bottom = min(h, max(ys) + pad + 1)
    cropped = im.crop((left, top, right, bottom))
    out = Image.new("RGBA", cropped.size, (255, 255, 255, 255))
    for y in range(cropped.height):
        for x in range(cropped.width):
            r, g, b, a = cropped.getpixel((x, y))
            if r + g + b < 40:
                continue
            out.putpixel((x, y), (r, g, b, a if a else 255))
    return out

def square_icon(im, size, bg=(255, 255, 255, 255)):
    im = trim_to_logo(im)
    w, h = im.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), bg)
    ox = (side - w) // 2
    oy = (side - h) // 2
    canvas.paste(im, (ox, oy), im)
    return canvas.resize((size, size), Image.Resampling.LANCZOS)

def save_png(im, dest):
    im.convert("RGB").save(dest, format="PNG", optimize=True)

def save_ico(im, dest, sizes=(16, 32, 48)):
    frames = [square_icon(im, s) for s in sizes]
    frames[0].save(
        dest,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=frames[1:],
    )

src = Image.open(SOURCE)
public = os.path.join(ROOT, "public")
app = os.path.join(ROOT, "src", "app")

outputs = [
    (os.path.join(public, "favicon-16x16.png"), 16),
    (os.path.join(public, "favicon-32x32.png"), 32),
    (os.path.join(public, "favicon.png"), 32),
    (os.path.join(public, "apple-touch-icon.png"), 180),
    (os.path.join(public, "icon-192.png"), 192),
    (os.path.join(public, "icon-512.png"), 512),
    (os.path.join(app, "icon.png"), 512),
    (os.path.join(app, "apple-icon.png"), 180),
]

for dest, size in outputs:
    save_png(square_icon(src, size), dest)

save_ico(src, os.path.join(public, "favicon.ico"))
save_ico(src, os.path.join(app, "favicon.ico"))

print("Generated favicons in public/ and src/app/")
`;

const result = spawnSync("python", ["-c", py], { stdio: "inherit", cwd: root });
if (result.status !== 0) process.exit(result.status ?? 1);
