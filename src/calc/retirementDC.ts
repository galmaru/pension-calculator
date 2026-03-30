import type { RetirementDCInput, RetirementDCResult } from '../types';
import { calcFV, calcPMT } from './utils';

/**
 * 퇴직연금(DC형) 예상 수령액 계산
 */
export function calcRetirementDC(
  input: RetirementDCInput,
  currentAge: number
): RetirementDCResult {
  const monthlyRate = input.annualReturn / 12;

  // 은퇴 나이까지 남은 개월수
  const remainingMonths = Math.max(0, (input.retirementAge - currentAge) * 12);

  // 은퇴 시 예상 적립금
  const balanceAtRetirement = calcFV(
    input.currentBalance,
    input.monthlyPayment,
    monthlyRate,
    remainingMonths
  );

  // 월 수령액 계산
  const receivingMonths = input.receivingYears * 12;
  const monthlyAmount = calcPMT(monthlyRate, receivingMonths, balanceAtRetirement);

  // 성장 곡선 데이터 (현재 나이 ~ 은퇴 나이)
  const growthData: number[] = [];
  const endAge = Math.max(currentAge, input.retirementAge);
  for (let age = currentAge; age <= endAge; age++) {
    const months = (age - currentAge) * 12;
    growthData.push(
      Math.max(0, calcFV(input.currentBalance, input.monthlyPayment, monthlyRate, months))
    );
  }

  return {
    monthlyAmount: Math.max(0, monthlyAmount),
    balanceAtRetirement: Math.max(0, balanceAtRetirement),
    growthData,
  };
}
