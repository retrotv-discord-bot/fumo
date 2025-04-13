import discord
from discord.ext import commands

import random
import os
import json
from dotenv import load_dotenv

# .env 파일에서 토큰 로드
load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")

# 봇 설정
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)


# 이미지 정보 로드
def __load_fumo_image_data():
    try:
        with open("images.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("fumo", [])
    except FileNotFoundError:
        print("images.json 파일을 찾을 수 없습니다.")
        return []
    except json.JSONDecodeError:
        print("images.json 파일 형식이 올바르지 않습니다.")
        return []
    

# 이미지 정보 로드
def __load_homo_image_data():
    try:
        with open("images.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("fumo", [])
    except FileNotFoundError:
        print("images.json 파일을 찾을 수 없습니다.")
        return []
    except json.JSONDecodeError:
        print("images.json 파일 형식이 올바르지 않습니다.")
        return []


@bot.event
async def on_ready():
    print(f"{bot.user} 봇이 시작되었습니다!")


@bot.command(name="후모")
async def fumo(ctx):

    # 이미지 데이터 로드
    image_data = __load_fumo_image_data()
    print(f"총 {len(image_data)}개의 이미지 정보가 로드되었습니다.")

    if not image_data:
        embed = discord.Embed(
            title="후모! 이미지가 없어요!", color=discord.Color.purple()
        )

        await ctx.send(embed=embed)
        return

    # 랜덤으로 이미지 선택
    image_info = random.choice(image_data)

    # 임베드 생성
    embed = discord.Embed(
        title=image_info["title"],
        description=image_info["description"],
        color=discord.Color.purple(),
    )

    # 이미지 파일 경로가 있는 경우
    file_name = image_info.get("file_name")
    url = image_info.get("url")

    if file_name:
        print("file: " + file_name)
        image_path = os.path.join("images", file_name)
        if os.path.exists(image_path):
            with open(image_path, "rb") as f:
                file = discord.File(f, filename=file_name)
                embed.set_image(url=f"attachment://{file_name}")
                await ctx.send(embed=embed, file=file)

                return

    # 이미지 URL이 있는 경우
    elif url:
        print("url: " + url)
        embed.set_image(url=url)
        await ctx.send(embed=embed)

        return

    # 파일 경로와 URL이 모두 없는 경우
    embed = discord.Embed(title="후모! 이미지가 없어요!", color=discord.Color.purple())

    await ctx.send(embed=embed)


@bot.command(name="호모")
async def homo(ctx):

    # 이미지 데이터 로드
    image_data = __load_image_data()
    print(f"총 {len(image_data)}개의 이미지 정보가 로드되었습니다.")

    if not image_data:
        embed = discord.Embed(
            title="후모! 이미지가 없어요!", color=discord.Color.purple()
        )

        await ctx.send(embed=embed)
        return

    # 랜덤으로 이미지 선택
    image_info = random.choice(image_data)

    # 임베드 생성
    embed = discord.Embed(
        title=image_info["title"],
        description=image_info["description"],
        color=discord.Color.purple(),
    )

    # 이미지 파일 경로가 있는 경우
    file_name = image_info.get("file_name")
    url = image_info.get("url")

    if file_name:
        print("file: " + file_name)
        image_path = os.path.join("images", file_name)
        if os.path.exists(image_path):
            with open(image_path, "rb") as f:
                file = discord.File(f, filename=file_name)
                embed.set_image(url=f"attachment://{file_name}")
                await ctx.send(embed=embed, file=file)

                return

    # 이미지 URL이 있는 경우
    elif url:
        print("url: " + url)
        embed.set_image(url=url)
        await ctx.send(embed=embed)

        return

    # 파일 경로와 URL이 모두 없는 경우
    embed = discord.Embed(title="후모! 이미지가 없어요!", color=discord.Color.purple())

    await ctx.send(embed=embed)


# 봇 실행
bot.run(TOKEN)
