import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import { CronJob } from "../types/cron-type.js";
import EndingCloseCron from "./ending-close-cron.js";
import EndingOpenCron from "./ending-open-cron.js";
import StatusResetCron from "./status-reset-cron.js";
import TestLogCron from "./test-log-cron.js";
import TestPrismaCron from "./test-prisma-cron.js";

// 모든 크론잡 목록
const cronJobs: CronJob[] = [
  // ...(process.env.NODE_ENV === "development" ? [TestLogCron, TestPrismaCron] : []),
  EndingOpenCron, // 일요일 자정
  EndingCloseCron, // 월요일 자정 (먼저 실행)
  StatusResetCron, // 월요일 자정 (나중에 실행)
  TestLogCron,
  TestPrismaCron,
];

// 크론잡 초기화 함수
const InitCron = (prisma: PrismaClient) => {
  cronJobs.forEach((job) => {
    if (!cron.validate(job.schedule)) {
      console.error(`[${job.name}] 잘못된 크론 스케줄: ${job.schedule}`);
      return;
    }

    cron.schedule(job.schedule, async () => {
      console.log(`[${job.name}] 작업 시작`);
      const startTime = new Date();

      try {
        await job.task(prisma);
        const duration = new Date().getTime() - startTime.getTime();
        console.log(`[${job.name}] 작업 완료 (소요시간: ${duration}ms)`);
      } catch (error) {
        console.error(`[${job.name}] 작업 실패:`, error);
      }
    });

    console.log(`[${job.name}] 등록 완료 (스케줄: ${job.schedule})`);
  });
};

export default InitCron;
