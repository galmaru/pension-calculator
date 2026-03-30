import { NP_ANNUAL_RETURN, NP_START_AGE, NP_LIFE_EXPECTANCY } from '../constants';
import type { NationalPensionInput, NationalPensionResult } from '../types';
import { calcFV, calcPMT } from './utils';

/**
 * 국민연금 예상 수령액 계산
 * 주의: 실제 국민연금은 A값(전체 가입자 평균소득)에 연동되므로
 * 본 계산은 적립금 기반 추정치입니다.
 */
export function calcNationalPension(
  input: NationalPensionInput,
  currentAge: number
): NationalPensionResult {
  const monthlyRate = NP_ANNUAL_RETURN / 12;

  // 월 납입액 결정 (모드에 따라)
  const monthlyPayment =
    input.inputMode === 'income'
      ? input.monthlyIncome * 0.09  // 소득의 9% = 국민연금 보험료율
      : input.monthlyPayment;

  // 65세까지 남은 납입 개월수
  const remainingMonths = Math.max(0, (NP_START_AGE - currentAge) * 12);

  // 은퇴(65세) 시 예상 적립금
  const balanceAtRetirement = calcFV(
    input.totalPaidAmount,
    monthlyPayment,
    monthlyRate,
    remainingMonths
  );

  // 수령 기간: 기대수명(83세) - 수령개시(65세) = 18년
  const receivingMonths = (NP_LIFE_EXPECTANCY - NP_START_AGE) * 12;

  // 월 수령액 계산 (PMT 공식)
  const monthlyAmount = calcPMT(monthlyRate, receivingMonths, balanceAtRetirement);

  // 성장 곡선 데이터 (현재 나이 ~ 65세)
  const growthData: number[] = [];
  const endAge = Math.max(currentAge, NP_START_AGE);
  for (let age = currentAge; age <= endAge; age++) {
    const months = (age - currentAge) * 12;
    growthData.push(
      Math.max(0, calcFV(input.totalPaidAmount, monthlyPayment, monthlyRate, months))
    );
  }

  return {
    monthlyAmount: Math.max(0, monthlyAmount),
    balanceAtRetirement: Math.max(0, balanceAtRetirement),
    growthData,
  };
}
