import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import InitCron from "./crons/index.js";

// 애플리케이션 종료 시 정리 작업을 수행하는 함수
async function cleanup() {
  console.log("[크론 워커] 정리 작업 시작...");
  try {
    await prisma.$disconnect();
    console.log("[크론 워커] DB 연결 해제 완료");
  } catch (error) {
    console.error("[크론 워커] 정리 작업 중 오류:", error);
    process.exit(1); // 오류 발생 시 프로세스 종료 (1: 비정상 종료)
  }
}

// 애플리케이션의 메인 함수
async function main() {
  try {
    console.log("[크론 워커] 시작됨");
    console.log("[크론 워커] 환경:", process.env.NODE_ENV);

    await InitCron(prisma);
    console.log("[크론 워커] 크론 작업 초기화 완료");
  } catch (error) {
    console.error("[크론 워커] 애플리케이션 시작 실패:", error);
    await cleanup();
    process.exit(1);
  }
}

// SIGTERM (종료 요청) 시그널 처리
process.on("SIGTERM", async () => {
  console.log("[크론 워커] SIGTERM 신호 수신");
  await cleanup();
  process.exit(0); // 정상 종료 (0: 정상 종료)
});

// SIGINT (인터럽트) 시그널 처리
process.on("SIGINT", async () => {
  console.log("[크론 워커] SIGINT 신호 수신");
  await cleanup();
  process.exit(0);
});

// 처리되지 않은 예외 처리
process.on("uncaughtException", async (error) => {
  console.error("[크론 워커] 처리되지 않은 예외:", error);
  await cleanup();
  process.exit(1);
});

// 처리되지 않은 Promise 거부 처리
process.on("unhandledRejection", async (reason) => {
  console.error("[크론 워커] 처리되지 않은 Promise 거부:", reason);
});

main();
