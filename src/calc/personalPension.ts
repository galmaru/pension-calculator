import type { PersonalPensionInput, PersonalPensionResult } from '../types';
import {
  TAX_RATE_UNDER70,
  TAX_RATE_70_80,
  TAX_RATE_OVER80,
} from '../constants';
import { calcFV, calcPMT } from './utils';

/**
 * 나이 구간별 가중평균 실효세율 계산
 * 연금소득세: 70세 미만 5.5%, 70~80세 4.4%, 80세 이상 3.3%
 */
function calcEffectiveTaxRate(startAge: number, receivingYears: number): number {
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
 * 세액공제 여부에 따른 세후 수령액 비교 포함
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

  // 실효세율 계산
  const effectiveTaxRate = calcEffectiveTaxRate(input.startAge, input.receivingYears);

  // 세액공제 O: 전체 수령액에 세율 적용 (납입 시 절세 혜택을 받았으므로)
  const monthlyAmountWithTax = grossMonthlyAmount * (1 - effectiveTaxRate);

  // 세액공제 X: 원금 비율만큼 비과세, 수익 부분만 과세
  const totalPrincipal = input.monthlyPayment * remainingMonths + input.currentBalance;
  const principalRatio =
    balanceAtStart > 0 ? Math.min(totalPrincipal / balanceAtStart, 1) : 1;
  const monthlyAmountWithoutTax =
    grossMonthlyAmount *
    (principalRatio + (1 - principalRatio) * (1 - effectiveTaxRate));

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
    balanceAtStart: Math.max(0, balanceAtStart),
    growthData,
    effectiveTaxRate,
  };
}
