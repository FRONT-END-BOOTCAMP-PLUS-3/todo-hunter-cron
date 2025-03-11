import { PrismaClient } from "@prisma/client";
import { CronJob } from "../types/cron-type.js";

// 테스트용 prisma 크론잡
const TestPrismaCron: CronJob = {
  name: "테스트 Prisma 크론잡",
  schedule: "*/10 * * * * *",
  task: async (prisma: PrismaClient) => {
    try {
      const now = new Date();
      const result = await prisma.status.updateMany({
        where: {
          characterId: 1,
        },
        data: {
          str: { increment: 1 },
        },
      });
      console.log(
        `[${TestPrismaCron.name}] 크론잡 정상 동작 중 - ${now.toLocaleString()}`
      );
    } catch (error) {
      console.error(`[${TestPrismaCron.name}] 실패:`, error);
    }
  },
};

export default TestPrismaCron;