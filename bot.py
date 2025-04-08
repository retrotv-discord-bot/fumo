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

@bot.command(name='동전')
async def coin(ctx):
    # 0 또는 1을 랜덤으로 선택
    result = random.choice(['앞면', '뒷면'])
    await ctx.send(f'동전을 던진 결과: {result}')

# 봇 실행
bot.run(TOKEN)
