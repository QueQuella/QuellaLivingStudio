"""Validate shipped assets and links without needing a browser or Blender."""
import json
import re
import struct
from pathlib import Path
from html.parser import HTMLParser

root = Path(__file__).resolve().parents[1]

class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.resources = []
        self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate id: {attrs['id']}"
            self.ids.add(attrs["id"])
        if attrs.get("src", "").startswith("./"):
            self.resources.append(attrs["src"])
        if tag == "a":
            self.links.append(attrs.get("href", ""))

document = Document()
document.feed((root / "index.html").read_text())
for component in sorted((root / "src/pages").glob("*.jsx")):
    document.feed(component.read_text())
document.feed((root / "src/components/TopNavigation.jsx").read_text())
for resource in document.resources:
    assert (root / "public" / resource).is_file(), resource
for required in ["pdTitle", "pdQuestion", "pdAbout", "pdFilmTransition", "pdShowcase", "pdFurther", "programmingDream", "pdCanvas"]:
    assert required in document.ids
for required in ["#programming-dream", "#log", "#idea"]:
    assert required in document.links
for file in ["src/runtime/programming-dream.js", "src/runtime/dream-config.js", "src/runtime/dream-sections.mjs", "public/vendor/gltf/GLTFLoader.js", "public/vendor/gltf/BufferGeometryUtils.js"]:
    source = (root / file).read_text()
    for imported in re.findall(r"(?:^import[\s\S]*?\bfrom\s*|import\()['\"]([^'\"]+)", source, re.MULTILINE):
        assert imported.startswith("."), f"Nonlocal module: {file} → {imported}"
        assert ((root / file).parent / imported).is_file(), f"Missing module: {imported}"

binary = (root / "public/assets/programming-dream/computer.glb").read_bytes()
magic, version, length = struct.unpack_from("<III", binary)
assert magic == 0x46546C67 and version == 2 and length == len(binary)
json_length, kind = struct.unpack_from("<II", binary, 12)
assert kind == 0x4E4F534A
gltf = json.loads(binary[20:20 + json_length])
bin_length, kind = struct.unpack_from("<II", binary, 20 + json_length)
assert kind == 0x004E4942
assert gltf["buffers"][0]["byteLength"] <= bin_length
assert len(gltf["nodes"]) == 9 and len(gltf["meshes"]) == 9
assert any(node["name"] == "screen" for node in gltf["nodes"])
assert not any("uri" in image for image in gltf["images"])
for view in gltf["bufferViews"]:
    assert view["byteOffset"] % 4 == 0
    assert view["byteOffset"] + view["byteLength"] <= gltf["buffers"][0]["byteLength"]
print(f"PASS: local modules/resources/routes; GLB: {len(binary):,} bytes, 9 meshes, embedded maps, screen present")
