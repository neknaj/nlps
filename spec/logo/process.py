# MIT LICENSE, bem130, 2024
# 画像の透明度を反転
import numpy as np
from PIL import Image


path = "npl-bdebt.png"
print(path)
print()

img = Image.open(path)
print([img.mode,img.size])

npa = np.array(img)

X = npa.shape[1]
Y = npa.shape[0]
for x in range(X):
    for y in range(Y):
        npa[y][x][3] = 255
        if (npa[y][x][0]<128):
            npa[y][x][0] = 0
            npa[y][x][1] = 0
            npa[y][x][2] = 0
        else:
            npa[y][x][0] = 255
            npa[y][x][1] = 255
            npa[y][x][2] = 255

out = Image.fromarray(npa)
print([img.mode,img.size])
print()

out.save(path)