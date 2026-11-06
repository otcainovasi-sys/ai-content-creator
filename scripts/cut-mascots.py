"""Memotong latar maskot OTCA dan Info Jerman, lalu membuat varian (bust, cermin, duo).
Pakai: python scripts/cut-mascots.py <robot.jpg> <info-jerman.jpg>
File sumber tidak diubah. Hasil: assets/brands/<brand>/mascots/*.png + mascots.json"""
import json, os, sys
import cv2
import numpy as np
from PIL import Image

def cutout(path, tol):
    bgr = cv2.imread(path)
    h, w = bgr.shape[:2]
    mask = np.zeros((h + 2, w + 2), np.uint8)
    flags = 4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE
    for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        cv2.floodFill(bgr.copy(), mask, p, 0, (tol,) * 3, (tol,) * 3, flags)
    bg = mask[1:-1, 1:-1] > 0
    # Latar yang terkurung tubuh (sela kaki, sela lengan) tidak terjangkau flood fill. Kemeja putih dikecualikan:
    # ia berada di tengah atas dan area kecil seperti manset diabaikan.
    near = (np.abs(bgr.astype(int) - bgr[2, 2].astype(int)).max(axis=2) <= tol) & ~bg
    n, lab, st, cen = cv2.connectedComponentsWithStats(near.astype(np.uint8))
    ys, xs = np.where(~bg)
    top, bot = ys.min(), ys.max()
    for i in range(1, n):
        cy = (cen[i][1] - top) / (bot - top)
        if st[i, cv2.CC_STAT_AREA] > 250 and cy > 0.5:
            bg |= lab == i
    # Sisa bayangan terang di lantai dekat sepatu.
    floor = np.zeros_like(bg); floor[top + int((bot - top) * 0.9):, :] = True
    bg |= floor & (bgr.min(axis=2) > 205)
    fg = (~bg).astype(np.uint8) * 255
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    fg = cv2.erode(fg, np.ones((3, 3), np.uint8), iterations=2)  # buang halo terang di tepi
    alpha = cv2.GaussianBlur(fg, (0, 0), 1.2)
    rgba = np.dstack([cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB), alpha])
    return Image.fromarray(rgba), fg

def trim(img):
    return img.crop(img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())

def bust(img, frac):
    return img.crop((0, 0, img.width, int(img.height * frac)))

def save(brand, items):
    d = f'assets/brands/{brand}/mascots'
    os.makedirs(d, exist_ok=True)
    reg = {}
    for name, im in items.items():
        im.save(f'{d}/{name}.png')
        reg[name] = {'file': f'mascots/{name}.png', 'transparent': True}
    with open(f'assets/brands/{brand}/mascots.json', 'w', encoding='utf8') as f:
        json.dump(reg, f, indent=2)
    print(brand, list(reg), [im.size for im in items.values()])

robot, _ = cutout(sys.argv[1], 10)
robot = trim(robot)
save('otca', {'robot-berpikir': robot, 'robot-berpikir-cermin': robot.transpose(Image.FLIP_LEFT_RIGHT), 'robot-bust': trim(bust(robot, .62))})

duo, fg = cutout(sys.argv[2], 16)
n, lab, stats, _ = cv2.connectedComponentsWithStats((fg > 0).astype(np.uint8))
big = sorted([i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 20000], key=lambda i: stats[i, cv2.CC_STAT_LEFT])
print('komponen', [(stats[i, cv2.CC_STAT_LEFT], stats[i, cv2.CC_STAT_WIDTH]) for i in big])
parts = []
for i in big[:2]:
    a = np.array(duo)
    a[..., 3] = np.where(cv2.dilate((lab == i).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0, a[..., 3], 0)
    parts.append(trim(Image.fromarray(a)))
cowo, cewe = parts
save('info-jerman', {'cowo-berdiri': cowo, 'cewe-berdiri': cewe, 'duo': trim(duo), 'cowo-bust': trim(bust(cowo, .5)), 'cewe-bust': trim(bust(cewe, .5)),
                     'cowo-cermin': cowo.transpose(Image.FLIP_LEFT_RIGHT), 'cewe-cermin': cewe.transpose(Image.FLIP_LEFT_RIGHT)})
