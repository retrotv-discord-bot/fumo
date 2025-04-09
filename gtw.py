from PIL import Image
im = Image.open('images/fumo_smoke_01.gif')
im.info.pop('background', None)
im.save('images/fumo_smoke_01.webp', 'webp', save_all=True)