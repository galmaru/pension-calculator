---
name: pension-calculator 프로젝트 개요
description: 국민연금/퇴직연금/개인연금 3종 시뮬레이터 웹앱 기술 스택 및 구조
type: project
---

Vite + React 19 + TypeScript 기반 연금 계산기 단일 페이지 앱. Vercel 배포 대상 (base: '/').

**Why:** 사용자가 은퇴 후 세 가지 연금의 월 수령액을 한 화면에서 비교하기 위해 구축.

**How to apply:** 새 기능 추가 시 calc/ 계산 로직과 components/ UI를 분리해 작업. 상태관리는 외부 라이브러리 없이 useState/useMemo만 사용.

**기술 스택**
- Vite 8 + React 19 + TypeScript (tsconfig.app.json)
- Tailwind CSS 3 (tailwind.config.js, postcss.config.js)
- Chart.js 4 + react-chartjs-2 5 (Line, Bar 차트)

**디자인 시스템 컬러**
- 국민연금: #1D9E75 (np), bg: #E8F7F2 (np-light)
- 퇴직연금: #378ADD (dc), bg: #EAF2FC (dc-light)
- 개인연금: #EF9F27 (pp), bg: #FEF6E8 (pp-light)

**핵심 계산 상수**
- NP_ANNUAL_RETURN = 0.0592 (2000~2023년 국민연금 기금 연평균 수익률)
- NP_START_AGE = 65, NP_LIFE_EXPECTANCY = 83
- 개인연금 세율: <70세 5.5%, 70~80세 4.4%, 80세~ 3.3%
