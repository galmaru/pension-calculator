// 국민연금 관련 상수
export const NP_ANNUAL_RETURN = 0.0592; // 2000~2023년 국민연금 기금운용 연평균 수익률
export const NP_RETURN_PERIOD = "2000~2023년";
export const NP_START_AGE = 65; // 국민연금 수령 개시 나이 (1969년생 이후)
export const NP_LIFE_EXPECTANCY = 83; // 기대수명 (수령 기간 산출 기준)

// 개인연금 세율 (연금소득세)
export const TAX_RATE_UNDER70 = 0.055;  // 70세 미만: 5.5%
export const TAX_RATE_70_80 = 0.044;    // 70세 이상 80세 미만: 4.4%
export const TAX_RATE_OVER80 = 0.033;   // 80세 이상: 3.3%

// 퇴직연금 기본값
export const DC_DEFAULT_RETIREMENT_AGE = 60;
export const DC_DEFAULT_RECEIVING_YEARS = 20;

// 개인연금 기본값
export const PP_DEFAULT_START_AGE = 65;
export const PP_MIN_START_AGE = 55;
export const PP_DEFAULT_RECEIVING_YEARS = 20;

// 수익률 슬라이더 범위
export const RETURN_MIN = 0.01;  // 1%
export const RETURN_MAX = 0.15;  // 15%
export const RETURN_DEFAULT = 0.05; // 5%
export const RETURN_STEP = 0.001;   // 0.1%
