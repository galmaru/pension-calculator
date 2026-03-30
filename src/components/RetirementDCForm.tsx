import type { RetirementDCInput } from '../types';
import {
  RETURN_MIN,
  RETURN_MAX,
  RETURN_STEP,
  SALARY_GROWTH_RATE,
  RECEIVING_YEARS_MIN,
  RECEIVING_YEARS_MAX,
  RECEIVING_YEARS_STEP,
} from '../constants';

interface Props {
  value: RetirementDCInput;
  monthlySalary: number;   // 공통 월급 (상위에서 전달)
  retirementAge: number;   // 공통 은퇴 나이 (상위에서 전달)
  onChange: (value: RetirementDCInput) => void;
}

const receivingYearsLabels = Array.from(
  { length: (RECEIVING_YEARS_MAX - RECEIVING_YEARS_MIN) / RECEIVING_YEARS_STEP + 1 },
  (_, i) => RECEIVING_YEARS_MIN + i * RECEIVING_YEARS_STEP
);

export default function RetirementDCForm({
  value,
  monthlySalary,
  retirementAge,
  onChange,
}: Props) {
  const update = (partial: Partial<RetirementDCInput>) => {
    onChange({ ...value, ...partial });
  };

  const returnPercent = (value.annualReturn * 100).toFixed(1);

  // 공통 월급에서 자동 계산된 납입액
  const autoMonthlyPayment = monthlySalary > 0
    ? (monthlySalary / 12).toFixed(1)
    : null;

  return (
    <div className="section-card">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-3 h-3 rounded-full bg-dc"></div>
        <h2 className="text-lg font-bold text-gray-800">퇴직연금 (DC형)</h2>
      </div>

      <div className="space-y-4">
        {/* 현재 적립금 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            현재 적립금
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={value.currentBalance || ''}
              onChange={(e) => update({ currentBalance: Number(e.target.value) })}
              className="input-field"
              placeholder="0"
              aria-label="현재 적립금 (만원)"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">만원</span>
          </div>
        </div>

        {/* 월 납입액: 공통 월급 연동 또는 직접 입력 */}
        <div>
          {autoMonthlyPayment ? (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                법정 기여율 (연봉의 1/12) 자동 적용 →{' '}
                <strong className="text-base">{autoMonthlyPayment}만원/월</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                매년 {(SALARY_GROWTH_RATE * 100).toFixed(0)}% 연봉 상승 반영
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                월 납입액{' '}
                <span className="text-xs font-normal text-gray-400">
                  (상단 월 소득 입력 시 자동 계산)
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={value.monthlyPayment || ''}
                  onChange={(e) => update({ monthlyPayment: Number(e.target.value) })}
                  className="input-field"
                  placeholder="0"
                  aria-label="월 납입액 (만원)"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">만원</span>
              </div>
            </div>
          )}
        </div>

        {/* 은퇴 나이 (공통에서 연동) */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">은퇴 나이</span>
          <span className="text-sm font-bold text-dc">{retirementAge}세</span>
        </div>

        {/* 예상 연 수익률 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            예상 연 수익률
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={RETURN_MIN}
              max={RETURN_MAX}
              step={RETURN_STEP}
              value={value.annualReturn}
              onChange={(e) => update({ annualReturn: Number(e.target.value) })}
              className="range-slider flex-1 accent-dc"
              aria-label="연 수익률 슬라이더"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={RETURN_MIN * 100}
                max={RETURN_MAX * 100}
                step="0.1"
                value={returnPercent}
                onChange={(e) =>
                  update({ annualReturn: Number(e.target.value) / 100 })
                }
                className="w-16 text-right border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="연 수익률 직접 입력"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>
        </div>

        {/* 수령 기간 슬라이더 (20~40년, 5년 단위) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">수령 기간</label>
            <span className="text-base font-bold text-dc">{value.receivingYears}년</span>
          </div>
          <input
            type="range"
            min={RECEIVING_YEARS_MIN}
            max={RECEIVING_YEARS_MAX}
            step={RECEIVING_YEARS_STEP}
            value={value.receivingYears}
            onChange={(e) => update({ receivingYears: Number(e.target.value) })}
            className="range-slider w-full accent-dc"
            aria-label="수령 기간 슬라이더"
          />
          <div
            className="flex justify-between text-xs text-gray-400 mt-1"
            aria-hidden="true"
          >
            {receivingYearsLabels.map((y) => (
              <span key={y}>{y}년</span>
            ))}
          </div>
        </div>
      </div>

      {/* 고정값 안내 */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          ※ 수령 방식: 연금형 고정 (일시금 미지원)
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          ※ 은퇴 나이는 상단 기본 정보에서 설정합니다
        </p>
      </div>
    </div>
  );
}
