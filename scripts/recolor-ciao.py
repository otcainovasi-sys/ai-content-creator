"""Mewarnai ulang baju maskot dan logo Ciao Manda ke palet guideline (deep red #79202A, aksen krem keemasan).

File asli disalin dulu ke folder _asli dan tidak pernah ditimpa. Bayangan dan kilap dipertahankan
karena warna baru dikalikan dengan kecerahan relatif tiap piksel.
Pakai: python scripts/recolor-ciao.py
"""
import os, shutil
import numpy as np
import cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAS = os.path.join(ROOT, 'assets', 'brands', 'ciao-manda', 'mascots')
LOGO = os.path.join(ROOT, 'assets', 'brands', 'ciao-manda', 'logo')
MAROON = np.array([121, 32, 42], float)   # #79202A
CREAM = np.array([212, 178, 128], float)  # krem keemasan untuk aksen dan hijab


def backup(folder, name):
    src = os.path.join(folder, name)
    dst_dir = os.path.join(folder, '_asli'); os.makedirs(dst_dir, exist_ok=True)
    dst = os.path.join(dst_dir, name)
    if not os.path.exists(dst): shutil.copy2(src, dst)
    return dst  # selalu baca dari salinan asli supaya skrip aman dijalankan ulang


def tint(rgb, mask, target, ref_v):
    hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(float)
    v = hsv[..., 2] / 255.0
    k = np.clip(v / ref_v, 0.25, 1.6)[..., None]
    out = np.clip(target * k, 0, 255)
    rgb[mask] = out[mask]
    return rgb


def recolor_mascot(name):
    src = backup(MAS, name)
    im = np.asarray(Image.open(src).convert('RGBA')).copy()
    rgb = im[..., :3].astype(float); a = im[..., 3]
    hsv = cv2.cvtColor(im[..., :3], cv2.COLOR_RGB2HSV)
    h, s, v = hsv[..., 0].astype(int), hsv[..., 1].astype(int), hsv[..., 2].astype(int)
    vis = a > 10
    red = vis & ((h <= 8) | (h >= 170)) & (s > 110) & (v > 50)
    # Aksen emas (hue 14-22, sangat jenuh) dan hijab kuning (hue 19-34). Kulit punya saturasi lebih rendah, jadi aman.
    yellow = vis & (((h >= 19) & (h <= 34) & (s > 120)) | ((h >= 14) & (h <= 22) & (s >= 232))) & (v > 120)
    if red.any(): rgb = tint(rgb, red, MAROON * 1.12, np.median(v[red]) / 255.0)
    if yellow.any(): rgb = tint(rgb, yellow, CREAM, np.median(v[yellow]) / 255.0)
    im[..., :3] = rgb.astype(np.uint8)
    Image.fromarray(im).save(os.path.join(MAS, name))
    return int(red.sum()), int(yellow.sum())


def recolor_logo(name):
    src = backup(LOGO, name)
    im = np.asarray(Image.open(src).convert('RGBA')).copy()
    hsv = cv2.cvtColor(im[..., :3], cv2.COLOR_RGB2HSV)
    h, s = hsv[..., 0].astype(int), hsv[..., 1].astype(int)
    red = (im[..., 3] > 0) & ((h <= 8) | (h >= 170)) & (s > 90)
    im[..., :3][red] = MAROON.astype(np.uint8)
    Image.fromarray(im).save(os.path.join(LOGO, name))
    return int(red.sum())


if __name__ == '__main__':
    for f in sorted(os.listdir(MAS)):
        if f.endswith('.png'): print(f, recolor_mascot(f))
    for f in ('primary.png', 'ciao-manda-logo-primary.png'):
        if os.path.exists(os.path.join(LOGO, f)): print(f, recolor_logo(f))
