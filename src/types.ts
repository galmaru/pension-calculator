// 국민연금 입력 타입
export interface NationalPensionInput {
  currentAge: number;
  paidMonths: number;          // 현재까지 납입 개월수
  totalPaidAmount: number;     // 현재까지 납입 총액 (만원)
  inputMode: 'income' | 'direct'; // 월소득 입력 vs 직접 입력
  monthlyIncome: number;       // 월 소득 (만원) - 모드A
  monthlyPayment: number;      // 월 납입액 (만원) - 모드B
}

// 퇴직연금(DC형) 입력 타입
export interface RetirementDCInput {
  currentBalance: number;      // 현재 적립금 (만원)
  monthlySalary: number;       // 월급 (만원) — 입력 시 monthlyPayment 자동 계산
  monthlyPayment: number;      // 월 납입액 (만원) — monthlySalary 입력 시 자동값
  annualReturn: number;        // 예상 연 수익률 (0.01~0.15)
  retirementAge: number;       // 은퇴 나이
  receivingYears: number;      // 수령 기간 (년), 기본 20
}

// 개인연금(IRP/연금저축) 입력 타입
export interface PersonalPensionInput {
  currentBalance: number;      // 현재 적립금 (만원)
  monthlyPayment: number;      // 월 납입액 (만원)
  annualReturn: number;        // 예상 연 수익률
  startAge: number;            // 연금 개시 나이 (기본 65, 최소 55)
  receivingYears: number;      // 수령 기간 (년), 기본 20
}

// 전체 입력 타입
export interface PensionInputs {
  nationalPension: NationalPensionInput;
  retirementDC: RetirementDCInput;
  personalPension: PersonalPensionInput;
  currentAge: number;          // 공통 현재 나이
}

// 국민연금 계산 결과
export interface NationalPensionResult {
  monthlyAmount: number;       // 월 수령액 (만원)
  balanceAtRetirement: number; // 은퇴 시 적립금 (만원)
  growthData: number[];        // 나이별 적립금 배열
}

// 퇴직연금 계산 결과
export interface RetirementDCResult {
  monthlyAmount: number;
  balanceAtRetirement: number;
  growthData: number[];
}

// 개인연금 계산 결과
export interface PersonalPensionResult {
  monthlyAmountWithTax: number;    // 세액공제 O 월 수령액
  monthlyAmountWithoutTax: number; // 세액공제 X 월 수령액
  balanceAtStart: number;          // 연금 개시 시 적립금
  growthData: number[];
  effectiveTaxRate: number;        // 실효세율
}

// 전체 계산 결과
export interface PensionResults {
  nationalPension: NationalPensionResult;
  retirementDC: RetirementDCResult;
  personalPension: PersonalPensionResult;
}
