from pathlib import Path
from PIL import Image

asset_dir = Path('/home/ubuntu/unified-mail-mobile/assets/images')
for name in ('icon.png', 'splash-icon.png', 'favicon.png', 'android-icon-foreground.png'):
    path = asset_dir / name
    image = Image.open(path).convert('RGBA')
    image.thumbnail((512, 512), Image.Resampling.LANCZOS)
    image.save(path, format='PNG', optimize=True, compress_level=9)
    print(name, path.stat().st_size)
