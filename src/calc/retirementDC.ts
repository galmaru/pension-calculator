import { SALARY_GROWTH_RATE } from '../constants';
import type { RetirementDCInput, RetirementDCResult } from '../types';
import { buildGrowthDataWithSalaryGrowth, calcPMT } from './utils';

/**
 * 퇴직연금(DC형) 예상 수령액 계산
 * - 월급 입력 시: 법정 기여율(연봉의 1/12) 자동 적용, 매년 4% 상승 반영
 * - 월 납입액 직접 입력 시: 고정 납입액 사용
 */
export function calcRetirementDC(
  input: RetirementDCInput,
  currentAge: number
): RetirementDCResult {
  const monthlyRate = input.annualReturn / 12;
  const yearsToRetirement = Math.max(0, input.retirementAge - currentAge);

  // 월 납입액 결정:
  // 월급 입력 시 → 법정 퇴직연금 기여율 = 연봉 / 12 = 월급 / 12 × 12 / 12 = 월급 / 12
  const useSalary = input.monthlySalary > 0;
  const initialMonthlyPayment = useSalary
    ? input.monthlySalary / 12
    : input.monthlyPayment;

  // 월급 입력 시 매년 4% 상승 반영
  const salaryGrowth = useSalary ? SALARY_GROWTH_RATE : 0;

  // 나이별 적립금 성장 데이터 (현재 나이 ~ 은퇴 나이)
  const growthData = buildGrowthDataWithSalaryGrowth(
    input.currentBalance,
    initialMonthlyPayment,
    monthlyRate,
    yearsToRetirement,
    salaryGrowth
  );

  const balanceAtRetirement = growthData[growthData.length - 1];

  const receivingMonths = input.receivingYears * 12;
  const monthlyAmount = calcPMT(monthlyRate, receivingMonths, balanceAtRetirement);

  return {
    monthlyAmount: Math.max(0, monthlyAmount),
    balanceAtRetirement: Math.max(0, balanceAtRetirement),
    growthData,
  };
}
