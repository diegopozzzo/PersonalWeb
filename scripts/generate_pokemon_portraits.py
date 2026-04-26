import json
import os
from pathlib import Path

from PIL import Image


def pick_idle_frame(frames: list[dict]) -> dict | None:
    # Prefer: Normal/Idle/Anim/<orientation>/0000
    preferred = []
    fallback = []
    for fr in frames:
        name = fr.get("filename") or ""
        parts = name.split("/")
        if len(parts) != 5:
            continue
        tint, action, mode, orientation, frame_no = parts
        if tint != "Normal" or mode != "Anim":
            continue
        if action == "Idle" and frame_no == "0000":
            preferred.append(fr)
        elif frame_no == "0000":
            fallback.append(fr)

    return (preferred[0] if preferred else (fallback[0] if fallback else None))


def render_portrait(sprite_png: Path, sprite_json: Path, out_png: Path) -> bool:
    data = json.loads(sprite_json.read_text(encoding="utf-8"))
    textures = data.get("textures") or []
    if not textures:
        return False

    frames = textures[0].get("frames") or []
    frame_entry = pick_idle_frame(frames)
    if not frame_entry:
        return False

    rect = frame_entry.get("frame") or {}
    source_size = frame_entry.get("sourceSize") or {}
    sprite_source = frame_entry.get("spriteSourceSize") or {}

    sx, sy = int(rect.get("x", 0)), int(rect.get("y", 0))
    sw, sh = int(rect.get("w", 0)), int(rect.get("h", 0))
    if sw <= 0 or sh <= 0:
        return False

    sheet = Image.open(sprite_png).convert("RGBA")
    crop = sheet.crop((sx, sy, sx + sw, sy + sh))

    canvas_w = int(source_size.get("w", sw)) or sw
    canvas_h = int(source_size.get("h", sh)) or sh
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))

    dx = int(sprite_source.get("x", 0))
    dy = int(sprite_source.get("y", 0))
    canvas.alpha_composite(crop, (dx, dy))

    # Normalize to square portrait (keep aspect, centered)
    size = max(canvas_w, canvas_h)
    portrait = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    portrait.alpha_composite(canvas, ((size - canvas_w) // 2, (size - canvas_h) // 2))

    out_png.parent.mkdir(parents=True, exist_ok=True)
    portrait.save(out_png)
    return True


def generate_for_kit(kit_dir: Path) -> int:
    sprites_dir = kit_dir / "assets" / "sprites"
    portraits_dir = kit_dir / "assets" / "portraits"
    if not sprites_dir.exists():
        raise SystemExit(f"Missing sprites dir: {sprites_dir}")

    count = 0
    for sprite_json in sorted(sprites_dir.glob("*.json")):
        sprite_png = sprite_json.with_suffix(".png")
        if not sprite_png.exists():
            continue

        out_png = portraits_dir / sprite_png.name
        ok = render_portrait(sprite_png, sprite_json, out_png)
        if ok:
            count += 1
    return count


if __name__ == "__main__":
    root = Path(os.getcwd())
    kits = [
        root / "public" / "pokemon-overlay-kit",
        root / "public" / "pokemon-overlay-kit-expanded",
    ]
    total = 0
    for kit in kits:
        total += generate_for_kit(kit)
    print(f"Generated portraits: {total}")

