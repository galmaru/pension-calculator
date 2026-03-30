import type { NationalPensionInput } from '../types';
import { NP_ANNUAL_RETURN, NP_RETURN_PERIOD, NP_START_AGE } from '../constants';

interface Props {
  value: NationalPensionInput;
  onChange: (value: NationalPensionInput) => void;
}

/**
 * 국민연금 입력 폼 컴포넌트
 */
export default function NationalPensionForm({ value, onChange }: Props) {
  const update = (partial: Partial<NationalPensionInput>) => {
    onChange({ ...value, ...partial });
  };

  // 월 납입액 표시 계산 (모드A일 때 자동 계산값 표시)
  const displayMonthlyPayment =
    value.inputMode === 'income'
      ? (value.monthlyIncome * 0.09).toFixed(1)
      : null;

  return (
    <div className="section-card">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-3 h-3 rounded-full bg-np"></div>
        <h2 className="text-lg font-bold text-gray-800">국민연금</h2>
      </div>

      <div className="space-y-4">
        {/* 현재 나이 - App.tsx에서 공통 관리하므로 표시만 */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <span className="text-xs text-gray-500">
            ※ 현재 나이는 상단 공통 입력에서 설정합니다
          </span>
        </div>

        {/* 총 납입 기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            현재까지 납입 기간
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="480"
              value={value.paidMonths || ''}
              onChange={(e) => update({ paidMonths: Number(e.target.value) })}
              className="input-field"
              placeholder="0"
              aria-label="납입 기간 (개월)"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">개월</span>
          </div>
        </div>

        {/* 현재까지 납입 총액 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            현재까지 납입 총액
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={value.totalPaidAmount || ''}
              onChange={(e) => update({ totalPaidAmount: Number(e.target.value) })}
              className="input-field"
              placeholder="0"
              aria-label="납입 총액 (만원)"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">만원</span>
          </div>
        </div>

        {/* 입력 모드 토글 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            납입액 입력 방식
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => update({ inputMode: 'income' })}
              className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                value.inputMode === 'income'
                  ? 'bg-np text-white border-np font-semibold'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-np'
              }`}
            >
              월 소득으로 입력
            </button>
            <button
              type="button"
              onClick={() => update({ inputMode: 'direct' })}
              className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                value.inputMode === 'direct'
                  ? 'bg-np text-white border-np font-semibold'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-np'
              }`}
            >
              납입액 직접 입력
            </button>
          </div>
        </div>

        {/* 모드A: 월 소득 입력 */}
        {value.inputMode === 'income' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              월 소득
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={value.monthlyIncome || ''}
                onChange={(e) => update({ monthlyIncome: Number(e.target.value) })}
                className="input-field"
                placeholder="0"
                aria-label="월 소득 (만원)"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">만원</span>
            </div>
            {/* 자동 계산된 납입액 안내 */}
            <div className="mt-2 p-2 bg-np-light rounded-lg">
              <p className="text-xs text-np-dark">
                보험료율 9% 적용 → 월 납입액:{' '}
                <strong>{displayMonthlyPayment}만원</strong>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                직장인은 본인부담 4.5% (사업주 4.5% 추가 납부)
              </p>
            </div>
          </div>
        )}

        {/* 모드B: 월 납입액 직접 입력 */}
        {value.inputMode === 'direct' && (
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
        )}
      </div>

      {/* 고정값 안내 */}
      <div className="mt-5 pt-4 border-t border-gray-100 space-y-1">
        <p className="text-xs text-gray-400">
          ※ 수령 개시 나이: {NP_START_AGE}세 고정 (1969년생 이후 기준)
        </p>
        <p className="text-xs text-gray-400">
          ※ 적용 수익률: {NP_RETURN_PERIOD} 국민연금 기금운용 연평균 수익률{' '}
          {(NP_ANNUAL_RETURN * 100).toFixed(2)}% 적용
        </p>
      </div>
    </div>
  );
}
