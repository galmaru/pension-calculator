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
  currentAge: number;          // 공통 현재 나이 (만 나이)
  monthlySalary: number;       // 공통 월급 (국민연금 + 퇴직연금 자동 연동)
  retirementAge: number;       // 공통 은퇴 나이 (퇴직연금 연동)
  nationalPension: NationalPensionInput;
  retirementDC: RetirementDCInput;
  personalPension: PersonalPensionInput;
}

// 국민연금 상세 계산 내역 (2026년 개혁안 공식 기준)
// 연금액(월) = [ 1.29 × (A + B) × 지급률 ] ÷ 12
export interface NationalPensionCalcDetail {
  aValue: number;             // A값: 전체 가입자 평균소득월액 (만원)
  bValue: number;             // B값: 본인 가입기간 중 기준소득월액 평균 (만원, 상하한 적용)
  bValueRaw: number;          // B값 원본 (클램프 전)
  totalMonths: number;        // P: 전체 가입월수 (과거 + 미래, 최대 만59세까지 납입)
  pastMonths: number;         // 현재까지 납입 개월수
  futureMonths: number;       // 앞으로 납입할 개월수 (현재나이~만59세)
  excessMonths: number;       // 20년(240개월) 초과 가입월수
  paymentRate: number;        // 지급률 (10년=0.5, 20년=1.0, 이후 매년 5%p 증가)
  isQualified: boolean;       // 최소 가입기간 10년(120개월) 충족 여부
  inputMode: 'income' | 'direct';
  monthlyIncome: number;      // 월 소득 입력값 (만원)
}

// 국민연금 계산 결과
export interface NationalPensionResult {
  monthlyAmount: number;       // 월 수령액 (만원)
  balanceAtRetirement: number; // 은퇴 시 적립금 (만원)
  growthData: number[];        // 나이별 적립금 배열 (참고용)
  calcDetail: NationalPensionCalcDetail; // 상세 계산 내역
}

// 퇴직연금 계산 결과
export interface RetirementDCResult {
  monthlyAmount: number;
  balanceAtRetirement: number;
  growthData: number[];
}

// 개인연금 계산 결과
export interface PersonalPensionResult {
  monthlyAmountWithTax: number;    // 세액공제 O 월 수령액 (세후)
  monthlyAmountWithoutTax: number; // 세액공제 X 월 수령액 (세후)
  grossMonthlyAmount: number;      // 세전 월 수령액
  balanceAtStart: number;          // 연금 개시 시 적립금
  growthData: number[];
  effectiveTaxRate: number;        // 실효세율
  isExceedingLimit: boolean;       // 연 1,500만원(월 125만원) 초과 여부 (16.5% 분리과세 적용)
}

// 전체 계산 결과
export interface PensionResults {
  nationalPension: NationalPensionResult;
  retirementDC: RetirementDCResult;
  personalPension: PersonalPensionResult;
}
