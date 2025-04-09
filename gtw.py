
# pip install Pillow 입력해서 먼저 PIL 라이브러리 설치해야 함
from PIL import Image


im = Image.open('images/fumo_smoke_01.gif')
im.info.pop('background', None)
im.save('images/fumo_smoke_01.webp', 'webp', save_all=True)
