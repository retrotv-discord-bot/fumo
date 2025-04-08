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
    # 웹호스팅된 이미지 URL 목록
    # 여기에 이미지 URL을 추가하세요. 예시:
    # image_urls = [
    #     "https://example.com/image1.jpg",
    #     "https://example.com/image2.png",
    #     "https://example.com/image3.gif"
    # ]
    image_urls = [
        'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdL0THw%2FbtrWcLGFH0C%2F7Uo1urDfHWVe0Dnx7c0vlk%2Fimg.png',
        'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FqCrHm%2FbtrWefAdT3o%2F30MGokk5KdhUZnz33C28fk%2Fimg.png'
    ]
    
    if not image_urls:
        await ctx.send('이미지 URL이 설정되지 않았습니다! bot.py 파일의 image_urls 리스트에 이미지 URL을 추가해주세요.')
        return
    
    # 랜덤으로 이미지 URL 선택
    random_image_url = random.choice(image_urls)
    
    # 임베드 생성
    embed = discord.Embed(
        title="후모 이미지",
        description="랜덤으로 선택된 후모 이미지입니다!",
        color=discord.Color.blue()
    )
    
    # 임베드에 이미지 URL 설정
    embed.set_image(url=random_image_url)
    await ctx.send(embed=embed)

# 봇 실행
bot.run(TOKEN)
