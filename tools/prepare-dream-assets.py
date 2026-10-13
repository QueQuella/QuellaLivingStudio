"""Make a web copy of the supplied GLB. Geometry and source files stay intact."""
import argparse
import io
import json
import struct
from pathlib import Path

from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("computer", type=Path)
parser.add_argument("reference", type=Path)
parser.add_argument("output", type=Path)
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
raw = args.computer.read_bytes()
magic, version, total = struct.unpack_from("<III", raw)
assert magic == 0x46546C67 and version == 2 and total == len(raw)
length = struct.unpack_from("<I", raw, 12)[0]
document = json.loads(raw[20:20 + length])
binary = raw[28 + length:]
image_views = {image["bufferView"]: image for image in document.get("images", [])}
packed = bytearray()
for index, view in enumerate(document["bufferViews"]):
    start = view.get("byteOffset", 0)
    chunk = binary[start:start + view["byteLength"]]
    if index in image_views:
        image = Image.open(io.BytesIO(chunk)).convert("RGB")
        image.thumbnail((512, 512), Image.Resampling.LANCZOS)
        output = io.BytesIO()
        # Normal/roughness maps are linear data: keep PNG to avoid JPEG artifacts.
        is_color = index == document["images"][1]["bufferView"]
        image.save(output, "JPEG" if is_color else "PNG", **({"quality": 88} if is_color else {"optimize": True}))
        chunk = output.getvalue()
        image_views[index]["mimeType"] = "image/jpeg" if is_color else "image/png"
    packed.extend(b"\0" * (-len(packed) % 4))
    view["byteOffset"] = len(packed)
    view["byteLength"] = len(chunk)
    packed.extend(chunk)
document["buffers"][0]["byteLength"] = len(packed)
packed.extend(b"\0" * (-len(packed) % 4))
header = json.dumps(document, separators=(",", ":")).encode()
header += b" " * (-len(header) % 4)
glb = struct.pack("<III", magic, 2, 28 + len(header) + len(packed))
glb += struct.pack("<II", len(header), 0x4E4F534A) + header
glb += struct.pack("<II", len(packed), 0x004E4942) + packed
(args.output / "computer.glb").write_bytes(glb)
image = Image.open(args.reference).convert("RGB")
image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
image.save(args.output / "scene-reference.webp", quality=88)
print(f"Computer: {len(raw):,} → {len(glb):,} bytes; geometry unchanged")
