## todohunter node-cron
#### 프로젝트 개요
`todo-hunter-cron` 프로젝트는 메인 서비스 `todo-hunter` 프로젝트에 대한 일정 주기적 DB 업데이트 스케줄을 처리하기 위하여 서버에서 Cron-Job 을 맡는 프로젝트입니다.

메인 서비스와는 다르게 순수 Cron-Job 만을 진행함으로 Next.js 가 아닌 순수 TypeScript 프로젝트로 진행하였습니다.
별도의 분리된 리포지토리 프로젝트임으로 서버에 자동으로 배포, 빌드, 실행을 위한 구성은 `Github Actions` 의 `self-hosted runner` 와 리눅스 서버의 `pm2` 로 CICD 파이프라인을 구축하였습니다.

Cron-Job 의 경우 서버 백그라운드에서 동작함으로 별도의 Nginx 를 통한 호스팅을 요구하지 않습니다.

#### 프로젝트 디렉토리
```
todo-hunter-cron/
├── .github/
│   └── workflows/
│		    └── deploy.yml
├── src/
│   ├── crons/
│		│   ├── ending-close-cron.ts
│		│   ├── ending-open-cron.ts
│		│   ├── status-reset-cron.ts
│		│   ├── test-log-cron.ts
│		│   └── index.ts
│	  ├── lib/
│	  │	  └── prisma.ts
│	  ├── types/
│	  │	  └── cron-type.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── README.md
```

#### Linux 서버 디렉토리
```
/home/todohunter/
├── todohunter-repo/
│   ├── todohunter-app
│   └── todohunter-runner
│		    └── _work/
├── todohunter-cron-repo/  <- (HERE)
│   ├── todohunter-cron-app
│   └── todohunter-cron-runner
│		    └── _work/
└── ecosystem.config.js
```