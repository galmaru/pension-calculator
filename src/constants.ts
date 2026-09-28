// 국민연금 관련 상수
export const NP_ANNUAL_RETURN = 0.0592; // 2000~2023년 국민연금 기금운용 연평균 수익률 (차트용)
export const NP_RETURN_PERIOD = "2000~2023년";
export const NP_MAX_CONTRIBUTION_AGE = 60; // 국민연금 의무 가입 종료 나이 (만 59세까지 납입)
export const NP_START_AGE = 65; // 국민연금 수령 개시 나이 (1969년생 이후)
export const NP_LIFE_EXPECTANCY = 83; // 기대수명 (수령 기간 산출 기준)

// 국민연금 급여 산정 공식 상수 (2026년 이후 적용)
// 연금액(월) = [ 1.29 × (A + B) × 지급률 ] ÷ 12
export const NP_FORMULA_COEFF = 1.29;   // 급여 산정 계수 (소득대체율 43% 기준 개혁 계수)
export const NP_REFORM_YEAR = 2026;     // 새 공식 기준연도
export const NP_A_VALUE = 309;          // A값: 연금 수급 전 3년간 전체 가입자 평균소득월액 (만원, 2025년 기준)
export const NP_A_VALUE_YEAR = 2025;    // A값 기준연도
export const NP_INCOME_MIN = 40;        // 기준소득월액 하한 (만원, 2025.7~2026.6)
export const NP_INCOME_MAX = 637;       // 기준소득월액 상한 (만원, 2025.7~2026.6)
export const NP_MIN_MONTHS = 120;       // 노령연금 최소 가입 기간 (10년 = 120개월)
export const NP_BASE_PAYMENT_RATE = 0.50; // 10년 가입 기준 지급률 50%
export const NP_EXCESS_OVER_20Y = 240;  // 20년(지급률 100% 기준) = 240개월

// 개인연금 세율 (연금소득세)
export const TAX_RATE_UNDER70 = 0.055;  // 70세 미만: 5.5%
export const TAX_RATE_70_80 = 0.044;    // 70세 이상 80세 미만: 4.4%
export const TAX_RATE_OVER80 = 0.033;   // 80세 이상: 3.3%
export const ANNUAL_TAX_LIMIT_PP = 1500; // 사적연금 저율과세 한도 (연 1,500만원, 만원 단위)
export const TAX_RATE_SEPARATE_HIGH = 0.165; // 사적연금 연 1,500만원 초과 시 분리과세율 (16.5%)

// 퇴직연금 기본값
export const DC_DEFAULT_RETIREMENT_AGE = 60;
export const DC_DEFAULT_RECEIVING_YEARS = 20;

// 개인연금 기본값
export const PP_DEFAULT_START_AGE = 65;
export const PP_MIN_START_AGE = 55;
export const PP_DEFAULT_RECEIVING_YEARS = 20;

// 연봉 상승률 (국민연금/퇴직연금 계산에 적용)
export const SALARY_GROWTH_RATE = 0.04; // 매년 4%

// 수익률 슬라이더 범위
export const RETURN_MIN = 0.01;  // 1%
export const RETURN_MAX = 0.15;  // 15%
export const RETURN_DEFAULT = 0.05; // 5%
export const RETURN_STEP = 0.001;   // 0.1%

// 은퇴 나이 슬라이더 (5세 단위)
export const RETIREMENT_AGE_MIN = 55;
export const RETIREMENT_AGE_MAX = 75;
export const RETIREMENT_AGE_STEP = 5;
export const RETIREMENT_AGE_DEFAULT = 60;

// 수령 기간 슬라이더 (5년 단위)
export const RECEIVING_YEARS_MIN = 20;
export const RECEIVING_YEARS_MAX = 40;
export const RECEIVING_YEARS_STEP = 5;
export const RECEIVING_YEARS_DEFAULT = 20;
