/**
 * 미래가치(Future Value) 계산
 * @param currentBalance 현재 잔액 (만원)
 * @param monthlyPayment 월 납입액 (만원)
 * @param monthlyRate 월 이율
 * @param months 기간 (개월)
 */
export function calcFV(
  currentBalance: number,
  monthlyPayment: number,
  monthlyRate: number,
  months: number
): number {
  if (months <= 0) return currentBalance;
  if (monthlyRate === 0) {
    return currentBalance + monthlyPayment * months;
  }
  const fvCurrent = currentBalance * Math.pow(1 + monthlyRate, months);
  const fvPayments =
    monthlyPayment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return fvCurrent + fvPayments;
}

/**
 * 연봉 성장률을 반영한 적립금 성장 데이터 생성 (나이별 배열)
 * @param currentBalance 현재 잔액 (만원)
 * @param initialMonthlyPayment 최초 월 납입액 (만원)
 * @param monthlyRate 월 투자 수익률
 * @param years 계산 기간 (년)
 * @param annualSalaryGrowth 연봉 연간 상승률 (예: 0.04 = 4%)
 * @returns 현재 나이부터 매 1년씩의 잔액 배열 (length = years + 1)
 */
export function buildGrowthDataWithSalaryGrowth(
  currentBalance: number,
  initialMonthlyPayment: number,
  monthlyRate: number,
  years: number,
  annualSalaryGrowth: number
): number[] {
  const data: number[] = [Math.max(0, currentBalance)];
  let balance = currentBalance;
  let monthly = initialMonthlyPayment;

  for (let year = 0; year < years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }
    data.push(Math.max(0, balance));
    monthly *= (1 + annualSalaryGrowth);
  }

  return data;
}

/**
 * 연금 월 수령액 계산 (PMT 공식)
 * @param monthlyRate 월 이율
 * @param totalMonths 총 수령 개월수
 * @param presentValue 현재가치 (은퇴 시 적립금)
 */
export function calcPMT(
  monthlyRate: number,
  totalMonths: number,
  presentValue: number
): number {
  if (totalMonths <= 0 || presentValue <= 0) return 0;
  if (monthlyRate === 0) return presentValue / totalMonths;
  return (
    (presentValue * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
}
