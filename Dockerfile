# ---------- build stage ----------
# node:24 태그는 항상 Node.js 24.x 최신 버전을 가리킵니다.
# 빌드 시 --pull=always 옵션을 주면 매번 최신 24.x 이미지를 받아옵니다.
FROM docker.io/library/node:24-bookworm-slim AS build
WORKDIR /app

# better-sqlite3 prebuilt 바이너리를 못 받을 경우를 대비한 네이티브 빌드 도구
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Prisma Client 생성 (generated/prisma). 실제 DB 경로는 실행 시 .env 로 전달됩니다.
RUN DATABASE_URL="file:/tmp/build.db" npx prisma generate \
    && chmod +x docker-entrypoint.sh

# ---------- runtime stage ----------
FROM docker.io/library/node:24-bookworm-slim
WORKDIR /app

# BOT_TOKEN, APPLICATION_ID, GUILD_ID, DATABASE_URL 은 실행 시 .env 로 전달합니다.
# (토큰이 이미지에 남지 않도록 빌드 시에는 넣지 않음)
ENV NODE_ENV=prod \
    HOME=/tmp \
    PM2_HOME=/tmp/.pm2

COPY --from=build --chown=node:node /app /app
RUN mkdir -p /data && chown node:node /data
USER node

# DB 파일이 저장되는 폴더. 호스트 디렉터리를 여기에 연결합니다.
VOLUME ["/data"]

# 시작: prisma db push -> npm run start / 종료(SIGTERM): npm run stop
STOPSIGNAL SIGTERM
ENTRYPOINT ["/app/docker-entrypoint.sh"]
