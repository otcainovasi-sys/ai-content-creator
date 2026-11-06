"""Memotong sprite sheet maskot 4x4 menjadi satu file per pose.

File sumber tidak diubah; salinannya disimpan di mascots/_sumber/. Tiap sel dipotong ke batas alpha,
bintik kecil di luar figur (sisa render) dibuang, lalu diberi sedikit ruang.
Pakai: python scripts/slice-mascots.py [info-jerman|otca]
"""
import json, os, shutil, sys
import numpy as np
import cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BERDIRI = ['melambai', 'jempol', 'menunjuk-samping', 'menunjuk-atas', 'presentasi', 'tangan-terbuka', 'berpikir', 'semangat',
           'baca-buku', 'laptop', 'clipboard', 'ponsel', 'oke', 'lipat-tangan', 'tangan-dirapatkan', 'bendera-jerman']
AKSI = ['duduk-baca', 'laptop-bersila', 'berlari', 'melompat', 'kaca-pembesar', 'berlutut-presentasi', 'membungkuk', 'mengintip-dinding',
        'duduk-berpikir', 'tas-kerja', 'koper', 'naik-tangga', 'baca-lantai', 'menunjuk-semangat', 'bersandar-dinding', 'seimbang']
ROBOT = ['melambai', 'jempol', 'presentasi', 'berpikir-hitung', 'duduk-baca', 'laptop-bersila', 'berlari', 'melompat',
         'kaca-pembesar', 'berlutut-presentasi', 'membungkuk', 'mengintip-dinding', 'koper', 'duduk-berpikir', 'menunjuk-dua', 'seimbang']
BRANDS = {
    'info-jerman': (r'D:\KERJAAN\OTCA\MASKOT INFO JERMAN', {'maskot info jerman 1': ('cowo', BERDIRI), 'maskot info jerman 2': ('cewe', AKSI),
                                                             'maskot info jerman 3': ('cewe', BERDIRI), 'maskot info jerman 4': ('cowo', AKSI)}),
    'otca': (r'D:\KERJAAN\OTCA', {'maskot otca official': ('robot', ROBOT)}),
}


def crop(cell):
    a = cell[..., 3]
    n, lab, stats, _ = cv2.connectedComponentsWithStats((a > 20).astype(np.uint8), 8)
    keep = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 0.01 * a.size]
    mask = np.isin(lab, keep)
    cell = cell.copy(); cell[~mask] = 0
    ys, xs = np.where(mask)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    pad = int(0.02 * max(y1 - y0, x1 - x0))
    out = np.zeros((y1 - y0 + 2 * pad, x1 - x0 + 2 * pad, 4), np.uint8)
    out[pad:pad + y1 - y0, pad:pad + x1 - x0] = cell[y0:y1, x0:x1]
    return out


def main(brand='info-jerman'):
    SRC, SHEETS = BRANDS[brand]
    OUT = os.path.join(ROOT, 'assets', 'brands', brand, 'mascots')
    os.makedirs(os.path.join(OUT, '_sumber'), exist_ok=True)
    index_path = os.path.join(ROOT, 'assets', 'brands', brand, 'mascots.json')
    index = json.load(open(index_path, encoding='utf8')) if os.path.exists(index_path) else {}
    for sheet, (who, names) in SHEETS.items():
        src = os.path.join(SRC, sheet)
        shutil.copy2(src, os.path.join(OUT, '_sumber', sheet + '.png'))
        im = np.asarray(Image.open(src).convert('RGBA'))
        H, W = im.shape[:2]
        for k, name in enumerate(names):
            r, c = divmod(k, 4)
            cell = im[round(r * H / 4):round((r + 1) * H / 4), round(c * W / 4):round((c + 1) * W / 4)]
            pid = f'{who}-{name}'
            out = crop(cell)
            Image.fromarray(out).save(os.path.join(OUT, pid + '.png'))
            index[pid] = {'file': f'mascots/{pid}.png', 'transparent': True, 'sumber': f'{sheet} sel {r}{c}', 'ukuran': [int(out.shape[1]), int(out.shape[0])]}
            print(pid, out.shape[1], 'x', out.shape[0])
    json.dump(index, open(index_path, 'w', encoding='utf8'), ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main(*(sys.argv[1:2] or ['info-jerman']))
