import type { NationalPensionInput } from '../types';
import { NP_ANNUAL_RETURN, NP_RETURN_PERIOD, NP_START_AGE, SALARY_GROWTH_RATE } from '../constants';

interface Props {
  value: NationalPensionInput;
  monthlySalary: number;   // 공통 월급 (상위에서 전달)
  onChange: (value: NationalPensionInput) => void;
}

export default function NationalPensionForm({ value, monthlySalary, onChange }: Props) {
  const update = (partial: Partial<NationalPensionInput>) => {
    onChange({ ...value, ...partial });
  };

  // 모드A 자동 계산값 표시
  const autoPayment = monthlySalary > 0
    ? (monthlySalary * 0.09).toFixed(1)
    : value.monthlyIncome > 0
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

        {/* 납입액 입력 방식 토글 */}
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
              월 소득 연동
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

        {/* 모드A: 공통 월소득 연동 표시 */}
        {value.inputMode === 'income' && (
          <div className="p-3 bg-np-light rounded-lg">
            {autoPayment ? (
              <>
                <p className="text-sm text-np-dark">
                  보험료율 9% 적용 → 월 납입액:{' '}
                  <strong className="text-base">{autoPayment}만원</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  직장인 본인부담 4.5% (사업주 4.5% 추가)
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  매년 {(SALARY_GROWTH_RATE * 100).toFixed(0)}% 소득 상승 반영
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-500">
                상단 기본 정보에서 월 소득을 입력하면 자동 계산됩니다
              </p>
            )}
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
          ※ 적용 수익률: {NP_RETURN_PERIOD} 국민연금 기금운용 연평균{' '}
          {(NP_ANNUAL_RETURN * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
