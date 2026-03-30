import type { PersonalPensionInput } from '../types';
import {
  RETURN_MIN,
  RETURN_MAX,
  RETURN_STEP,
  PP_MIN_START_AGE,
  RECEIVING_YEARS_MIN,
  RECEIVING_YEARS_MAX,
  RECEIVING_YEARS_STEP,
} from '../constants';

interface Props {
  value: PersonalPensionInput;
  onChange: (value: PersonalPensionInput) => void;
}

const receivingYearsLabels = Array.from(
  { length: (RECEIVING_YEARS_MAX - RECEIVING_YEARS_MIN) / RECEIVING_YEARS_STEP + 1 },
  (_, i) => RECEIVING_YEARS_MIN + i * RECEIVING_YEARS_STEP
);

export default function PersonalPensionForm({ value, onChange }: Props) {
  const update = (partial: Partial<PersonalPensionInput>) => {
    onChange({ ...value, ...partial });
  };

  const returnPercent = (value.annualReturn * 100).toFixed(1);

  return (
    <div className="section-card">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-3 h-3 rounded-full bg-pp"></div>
        <h2 className="text-lg font-bold text-gray-800">개인연금 (IRP / 연금저축)</h2>
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

        {/* 월 납입액 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            월 납입액
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
              className="range-slider flex-1 accent-pp"
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

        {/* 연금 개시 나이 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            연금 개시 나이
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={PP_MIN_START_AGE}
              max="80"
              value={value.startAge || ''}
              onChange={(e) => update({ startAge: Number(e.target.value) })}
              className="input-field"
              placeholder="65"
              aria-label="연금 개시 나이"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">세</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">최소 {PP_MIN_START_AGE}세</p>
        </div>

        {/* 수령 기간 슬라이더 (20~40년, 5년 단위) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">수령 기간</label>
            <span className="text-base font-bold text-pp">{value.receivingYears}년</span>
          </div>
          <input
            type="range"
            min={RECEIVING_YEARS_MIN}
            max={RECEIVING_YEARS_MAX}
            step={RECEIVING_YEARS_STEP}
            value={value.receivingYears}
            onChange={(e) => update({ receivingYears: Number(e.target.value) })}
            className="range-slider w-full accent-pp"
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

      {/* 세액공제 안내 */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          ※ 세액공제 여부에 따른 세후 수령액 비교는 결과 탭에서 확인하세요
        </p>
      </div>
    </div>
  );
}
