"""Text-free stock photos (sourced from pilesbatteries.com, used with the owner's permission) and a cropper
that produces varied 'zoomed' crops so the same photo can serve many entries."""
import os

from PIL import Image

DIR = os.path.join(os.path.dirname(__file__), "photos")
# Ordered so neighbouring posts get different subjects.
PHOTOS = ["mea_pile", "mea_voiture", "alim", "mea_outillage", "mea_moto", "mea_solaire", "controle", "bat_moto", "mea_chargeur"]


def crop(name, size, variant, out):
    """Crops photo `name` to `size` (w, h). `variant` shifts zoom and pan for visual variety."""
    im = Image.open(os.path.join(DIR, f"{name}.jpg")).convert("RGB")
    W, H = im.size
    tw, th = size
    target = tw / th
    cw, ch = (int(H * target), H) if W / H > target else (W, int(W / target))
    zoom = 1 + 0.14 * (variant % 3)
    cw, ch = int(cw / zoom), int(ch / zoom)
    fx = (0.5, 0.15, 0.85)[variant % 3]
    fy = (0.5, 0.25, 0.75)[(variant // 3) % 3]
    x, y = int((W - cw) * fx), int((H - ch) * fy)
    im.crop((x, y, x + cw, y + ch)).resize(size, Image.LANCZOS).save(out, quality=88)
    return out
