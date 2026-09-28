import type { PersonalPensionInput, PersonalPensionResult } from '../types';
import {
  TAX_RATE_UNDER70,
  TAX_RATE_70_80,
  TAX_RATE_OVER80,
  ANNUAL_TAX_LIMIT_PP,
  TAX_RATE_SEPARATE_HIGH,
} from '../constants';
import { calcFV, calcPMT } from './utils';

/**
 * 나이 구간별 가중평균 기본 연금소득세율 계산
 * 기본 연금소득세: 70세 미만 5.5%, 70~80세 4.4%, 80세 이상 3.3%
 */
function calcBaseTaxRate(startAge: number, receivingYears: number): number {
  const endAge = startAge + receivingYears;
  let totalTax = 0;
  let totalYears = 0;

  for (let age = startAge; age < endAge; age++) {
    let rate: number;
    if (age < 70) rate = TAX_RATE_UNDER70;
    else if (age < 80) rate = TAX_RATE_70_80;
    else rate = TAX_RATE_OVER80;
    totalTax += rate;
    totalYears++;
  }

  return totalYears > 0 ? totalTax / totalYears : TAX_RATE_UNDER70;
}

/**
 * 개인연금(IRP/연금저축) 예상 수령액 계산
 * - 세액공제 여부 비교
 * - 연 1,500만원(월 125만원) 초과 시 16.5% 분리과세 적용
 */
export function calcPersonalPension(
  input: PersonalPensionInput,
  currentAge: number
): PersonalPensionResult {
  const monthlyRate = input.annualReturn / 12;

  // 연금 개시까지 남은 개월수
  const remainingMonths = Math.max(0, (input.startAge - currentAge) * 12);

  // 연금 개시 시 적립금
  const balanceAtStart = calcFV(
    input.currentBalance,
    input.monthlyPayment,
    monthlyRate,
    remainingMonths
  );

  // 세전 월 수령액
  const receivingMonths = input.receivingYears * 12;
  const grossMonthlyAmount = calcPMT(monthlyRate, receivingMonths, balanceAtStart);

  // 연간 세전 수령액
  const grossAnnualAmount = grossMonthlyAmount * 12;

  // 사적연금 연 1,500만원(월 125만원) 초과 여부
  const isExceedingLimit = grossAnnualAmount > ANNUAL_TAX_LIMIT_PP;

  // 기본 연령별 연금소득세율 (3.3~5.5%)
  const baseTaxRate = calcBaseTaxRate(input.startAge, input.receivingYears);

  // 세액공제 O 적용 세율: 연 1,500만원 초과 시 16.5% 분리과세, 이하 시 기본 저율과세(3.3~5.5%)
  const effectiveTaxRate = isExceedingLimit ? TAX_RATE_SEPARATE_HIGH : baseTaxRate;
  const monthlyAmountWithTax = grossMonthlyAmount * (1 - effectiveTaxRate);

  // 세액공제 X: 원금 부분 비과세, 운용수익 부분만 과세
  const totalPrincipal = input.monthlyPayment * remainingMonths + input.currentBalance;
  const principalRatio =
    balanceAtStart > 0 ? Math.min(totalPrincipal / balanceAtStart, 1) : 1;

  // 세액공제 X 운용수익 부분 연간 과세액이 1,500만원 초과하는지 여부
  const taxableAnnualGain = grossAnnualAmount * (1 - principalRatio);
  const taxRateOnGains = taxableAnnualGain > ANNUAL_TAX_LIMIT_PP ? TAX_RATE_SEPARATE_HIGH : baseTaxRate;

  const monthlyAmountWithoutTax =
    grossMonthlyAmount *
    (principalRatio + (1 - principalRatio) * (1 - taxRateOnGains));

  // 성장 곡선 데이터 (현재 나이 ~ 연금 개시 나이)
  const growthData: number[] = [];
  const endAge = Math.max(currentAge, input.startAge);
  for (let age = currentAge; age <= endAge; age++) {
    const months = (age - currentAge) * 12;
    growthData.push(
      Math.max(0, calcFV(input.currentBalance, input.monthlyPayment, monthlyRate, months))
    );
  }

  return {
    monthlyAmountWithTax: Math.max(0, monthlyAmountWithTax),
    monthlyAmountWithoutTax: Math.max(0, monthlyAmountWithoutTax),
    grossMonthlyAmount: Math.max(0, grossMonthlyAmount),
    balanceAtStart: Math.max(0, balanceAtStart),
    growthData,
    effectiveTaxRate,
    isExceedingLimit,
  };
}
