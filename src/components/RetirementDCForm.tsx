import type { RetirementDCInput } from '../types';
import { RETURN_MIN, RETURN_MAX, RETURN_STEP, SALARY_GROWTH_RATE } from '../constants';

interface Props {
  value: RetirementDCInput;
  onChange: (value: RetirementDCInput) => void;
}

/**
 * 퇴직연금(DC형) 입력 폼 컴포넌트
 */
export default function RetirementDCForm({ value, onChange }: Props) {
  const update = (partial: Partial<RetirementDCInput>) => {
    onChange({ ...value, ...partial });
  };

  const returnPercent = (value.annualReturn * 100).toFixed(1);

  // 월급 입력 시 자동 계산되는 납입액 (연봉의 1/12 = 월급 / 12)
  const autoMonthlyPayment = value.monthlySalary > 0
    ? (value.monthlySalary / 12).toFixed(1)
    : null;

  const handleSalaryChange = (salary: number) => {
    update({
      monthlySalary: salary,
      // 월급 입력 시 monthlyPayment도 함께 업데이트 (직접 입력 모드 폴백용)
      monthlyPayment: salary > 0 ? salary / 12 : value.monthlyPayment,
    });
  };

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

        {/* 월급 입력 (자동 납입액 계산) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            월급
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={value.monthlySalary || ''}
              onChange={(e) => handleSalaryChange(Number(e.target.value))}
              className="input-field"
              placeholder="0"
              aria-label="월급 (만원)"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">만원</span>
          </div>
          {autoMonthlyPayment && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                법정 기여율(연봉의 1/12) 적용 → 월 납입액:{' '}
                <strong>{autoMonthlyPayment}만원</strong>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                매년 {(SALARY_GROWTH_RATE * 100).toFixed(0)}% 연봉 상승 반영
              </p>
            </div>
          )}
        </div>

        {/* 월 납입액 (월급 미입력 시 직접 입력) */}
        {!value.monthlySalary && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              월 납입액 <span className="text-xs text-gray-400">(월급 미입력 시 직접 입력)</span>
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

        {/* 예상 연 수익률 (슬라이더 + 숫자 입력) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            예상 연 수익률
          </label>
          <div className="flex items-center gap-2 mb-2">
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

        {/* 은퇴 나이 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            은퇴 나이
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="40"
              max="80"
              value={value.retirementAge || ''}
              onChange={(e) => update({ retirementAge: Number(e.target.value) })}
              className="input-field"
              placeholder="60"
              aria-label="은퇴 나이"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">세</span>
          </div>
        </div>

        {/* 수령 기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            수령 기간
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="40"
              value={value.receivingYears || ''}
              onChange={(e) => update({ receivingYears: Number(e.target.value) })}
              className="input-field"
              placeholder="20"
              aria-label="수령 기간 (년)"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">년</span>
          </div>
        </div>
      </div>

      {/* 고정값 안내 */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          ※ 수령 방식: 연금형 고정 (일시금 미지원)
        </p>
      </div>
    </div>
  );
}
