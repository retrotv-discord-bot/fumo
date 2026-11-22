#!/bin/sh
# 컨테이너 시작/종료 처리
#   시작: 필수 환경변수 확인 -> prisma db push -> npm run start
#   종료: SIGTERM/SIGINT 수신 시 npm run stop
set -e

# .env 로 전달되어야 하는 필수 값 확인
for key in FILE_API_KEY BOT_TOKEN APPLICATION_ID GUILD_ID DATABASE_URL; do
    eval "value=\${$key:-}"
    if [ -z "$value" ]; then
        echo "환경변수 $key 가 설정되지 않았습니다. .env 를 확인하세요." >&2
        exit 1
    fi
done

# 스키마를 DB에 반영 (DB 파일이 없으면 생성)
npx prisma db push

LOGS_PID=""
stopped=0
# $1: 종료 사유, $2: 종료 코드
shutdown() {
    [ "$stopped" -eq 1 ] && return
    stopped=1
    echo "$1: npm run stop 실행"
    npm run stop || true
    if [ -n "$LOGS_PID" ]; then
        kill "$LOGS_PID" 2>/dev/null || true
    fi
    exit "$2"
}
trap 'shutdown "종료 신호(SIGTERM) 수신" 0' TERM
trap 'shutdown "종료 신호(SIGINT) 수신" 0' INT

# pm2 로 봇 실행 (pm2 는 백그라운드 데몬으로 동작)
npm run start

# 컨테이너가 바로 종료되지 않도록 pm2 로그 파일을 포그라운드로 출력하며 대기
#   -n 0: 이전 실행의 로그는 출력하지 않고 새 로그만 출력
#   -F  : 파일이 교체/재생성되어도 계속 추적 (스스로 종료되지 않음)
tail -n 0 -F "$PM2_HOME"/logs/*.log &
LOGS_PID=$!
wait "$LOGS_PID" || true

# 여기까지 왔다면 신호 없이 로그 출력 프로세스가 끝난 것 (비정상 종료)
shutdown "로그 출력 프로세스가 예기치 않게 종료됨" 1
