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
