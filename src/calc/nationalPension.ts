import {
  NP_ANNUAL_RETURN,
  NP_START_AGE,
  NP_MAX_CONTRIBUTION_AGE,
  NP_FORMULA_COEFF,
  NP_A_VALUE,
  NP_INCOME_MIN,
  NP_INCOME_MAX,
  NP_MIN_MONTHS,
  NP_BASE_PAYMENT_RATE,
  NP_EXCESS_OVER_20Y,
  SALARY_GROWTH_RATE,
} from '../constants';
import type { NationalPensionInput, NationalPensionResult } from '../types';
import { buildGrowthDataWithSalaryGrowth } from './utils';

/**
 * 국민연금 지급률 계산
 * - 가입기간 10년(120개월): 50%
 * - 1개월마다 (5/12)%씩 증가 (20년 100%, 30년 150%, 40년 200%)
 * @param totalMonths 전체 가입월수 (P)
 */
function calcPaymentRate(totalMonths: number): number {
  if (totalMonths < NP_MIN_MONTHS) return 0;
  return NP_BASE_PAYMENT_RATE + (totalMonths - NP_MIN_MONTHS) * (5 / 12 / 100);
}

/**
 * 국민연금 예상 수령액 계산 (대한민국 국민연금법 및 2026년 개혁안 기준)
 *
 * 연간 연금액 = 1.29 × (A + B) × 지급률
 * 월 수령액   = 연간 연금액 ÷ 12
 *   A  : 연금 수급 전 3년간 전체 가입자 평균소득월액 (2025년 기준 309만원)
 *   B  : 가입자 개인 가입기간 중 기준소득월액 평균 (하한 40만원 ~ 상한 637만원)
 *   P  : 전체 가입월수 (만 59세 의무가입 종료 시점까지의 가입월수)
 *   지급률: 10년(120개월)=50%, 매 1개월마다 (5/12)% 증가 (20년=100%, 40년=200%)
 *
 * ※ 최소 가입기간 10년(120개월) 미만 시에는 노령연금 수급 자격이 없으며 반환일시금 대상입니다.
 */
export function calcNationalPension(
  input: NationalPensionInput,
  currentAge: number
): NationalPensionResult {
  const monthlyRate = NP_ANNUAL_RETURN / 12;

  // B값 산출: 소득 모드면 monthlyIncome, 직접 입력이면 납입액 / 9%
  const bValueRaw =
    input.inputMode === 'income'
      ? input.monthlyIncome
      : input.monthlyPayment / 0.09;

  // 기준소득월액 상·하한 적용 (2025.7~2026.6 기준: 40~637만원)
  const bValue = Math.min(Math.max(bValueRaw, NP_INCOME_MIN), NP_INCOME_MAX);
  const aValue = NP_A_VALUE;

  // 가입 기간 계산: 국민연금 의무 가입은 만 59세(60세 생일 전)까지
  const pastMonths = input.paidMonths;
  const futureMonths = Math.max(0, (NP_MAX_CONTRIBUTION_AGE - currentAge) * 12);
  const totalMonths = pastMonths + futureMonths;

  // 20년(240개월) 초과 가입월수
  const excessMonths = Math.max(0, totalMonths - NP_EXCESS_OVER_20Y);

  // 10년(120개월) 이상 여부 및 지급률
  const isQualified = totalMonths >= NP_MIN_MONTHS;
  const paymentRate = calcPaymentRate(totalMonths);

  // 최종 연금액 계산 (법정 기본연금액은 연간 금액이므로 12로 나누어 월 수령액 환산)
  let monthlyAmount = 0;
  if (isQualified && paymentRate > 0) {
    const annualAmount = NP_FORMULA_COEFF * (aValue + bValue) * paymentRate;
    monthlyAmount = annualAmount / 12;
  }

  // 차트용 적립금 성장 데이터 (참고용 시각화)
  const initialMonthlyPayment =
    input.inputMode === 'income'
      ? input.monthlyIncome * 0.09
      : input.monthlyPayment;
  const salaryGrowth = input.inputMode === 'income' ? SALARY_GROWTH_RATE : 0;
  const yearsToRetirement = Math.max(0, NP_START_AGE - currentAge);

  const growthData = buildGrowthDataWithSalaryGrowth(
    input.totalPaidAmount,
    initialMonthlyPayment,
    monthlyRate,
    yearsToRetirement,
    salaryGrowth
  );
  const balanceAtRetirement = growthData[growthData.length - 1];

  return {
    monthlyAmount: Math.max(0, monthlyAmount),
    balanceAtRetirement: Math.max(0, balanceAtRetirement),
    growthData,
    calcDetail: {
      aValue,
      bValue,
      bValueRaw,
      totalMonths,
      pastMonths,
      futureMonths,
      excessMonths,
      paymentRate,
      isQualified,
      inputMode: input.inputMode,
      monthlyIncome: input.monthlyIncome,
    },
  };
}
