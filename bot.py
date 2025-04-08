import discord
from discord.ext import commands
import random
import os
from dotenv import load_dotenv

# .env 파일에서 토큰 로드
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

# 봇 설정
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'{bot.user} 봇이 시작되었습니다!')

@bot.command(name='후모')
async def fumo(ctx):
    
    # images 디렉토리에서 모든 이미지 파일 목록 가져오기
    image_files = [f for f in os.listdir('images') if f.endswith(('.png', '.jpg', '.jpeg', '.gif'))]
    
    if not image_files:
        await ctx.send('이미지가 없습니다! images 폴더에 이미지를 추가해주세요.')
        return
    
    # 랜덤으로 이미지 선택
    random_image = random.choice(image_files)
    
    # 이미지 파일 경로 생성
    image_path = os.path.join('images', random_image)
    file = discord.File(image_path, filename=random_image)
    
    # 임베드 생성
    embed = discord.Embed(
        title="후모 이미지",
        description="랜덤으로 선택된 후모 이미지입니다!",
        color=discord.Color.blue()
    )
    
    embed.set_image(url=f"attachment://{random_image}")
    await ctx.send(embed=embed, file=file)

# 봇 실행
bot.run(TOKEN)
