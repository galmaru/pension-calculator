import { NP_ANNUAL_RETURN, NP_START_AGE, NP_LIFE_EXPECTANCY, SALARY_GROWTH_RATE } from '../constants';
import type { NationalPensionInput, NationalPensionResult } from '../types';
import { buildGrowthDataWithSalaryGrowth, calcPMT } from './utils';

/**
 * 국민연금 예상 수령액 계산
 * - 월 소득 입력 모드: 매년 4% 연봉 상승 반영
 * - 직접 입력 모드: 고정 납입액 사용
 * 주의: 실제 국민연금은 A값(전체 가입자 평균소득)에 연동되므로
 * 본 계산은 적립금 기반 추정치입니다.
 */
export function calcNationalPension(
  input: NationalPensionInput,
  currentAge: number
): NationalPensionResult {
  const monthlyRate = NP_ANNUAL_RETURN / 12;

  // 월 납입액 결정 (소득의 9%)
  const initialMonthlyPayment =
    input.inputMode === 'income'
      ? input.monthlyIncome * 0.09
      : input.monthlyPayment;

  const yearsToRetirement = Math.max(0, NP_START_AGE - currentAge);

  // 월 소득 모드: 매년 4% 연봉 상승 반영 / 직접 입력 모드: 성장률 0
  const salaryGrowth = input.inputMode === 'income' ? SALARY_GROWTH_RATE : 0;

  // 나이별 적립금 성장 데이터 (현재 나이 ~ 65세)
  const growthData = buildGrowthDataWithSalaryGrowth(
    input.totalPaidAmount,
    initialMonthlyPayment,
    monthlyRate,
    yearsToRetirement,
    salaryGrowth
  );

  const balanceAtRetirement = growthData[growthData.length - 1];

  // 수령 기간: 기대수명(83세) - 수령개시(65세) = 18년
  const receivingMonths = (NP_LIFE_EXPECTANCY - NP_START_AGE) * 12;
  const monthlyAmount = calcPMT(monthlyRate, receivingMonths, balanceAtRetirement);

  return {
    monthlyAmount: Math.max(0, monthlyAmount),
    balanceAtRetirement: Math.max(0, balanceAtRetirement),
    growthData,
  };
}
