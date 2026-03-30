import type { PersonalPensionResult } from '../types';

interface Props {
  result: PersonalPensionResult;
  taxMode: 'withTax' | 'withoutTax';
  onTaxModeChange: (mode: 'withTax' | 'withoutTax') => void;
}

/**
 * 개인연금 세금 비교 패널 컴포넌트
 * 세액공제 O vs X 상황에서의 세후 월 수령액 비교
 */
export default function TaxComparePanel({ result, taxMode, onTaxModeChange }: Props) {
  const withTax = result.monthlyAmountWithTax;
  const withoutTax = result.monthlyAmountWithoutTax;
  const diff = withoutTax - withTax;
  const isTaxFavorable = diff > 0; // 세액공제X가 유리한 경우

  const formatAmount = (amount: number) => {
    if (amount <= 0) return '—';
    return `${amount.toFixed(1)}만원`;
  };

  return (
    <div className="section-card">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">
          개인연금 세액공제 비교
        </h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          실효세율 {(result.effectiveTaxRate * 100).toFixed(1)}%
        </span>
      </div>

      {/* 토글 */}
      <div className="flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => onTaxModeChange('withTax')}
          className={`flex-1 py-2.5 text-sm rounded-xl border-2 font-medium transition-all ${
            taxMode === 'withTax'
              ? 'bg-pp text-white border-pp shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-pp/50'
          }`}
          aria-pressed={taxMode === 'withTax'}
        >
          세액공제 받은 경우
        </button>
        <button
          type="button"
          onClick={() => onTaxModeChange('withoutTax')}
          className={`flex-1 py-2.5 text-sm rounded-xl border-2 font-medium transition-all ${
            taxMode === 'withoutTax'
              ? 'bg-pp text-white border-pp shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-pp/50'
          }`}
          aria-pressed={taxMode === 'withoutTax'}
        >
          세액공제 안 받은 경우
        </button>
      </div>

      {/* 비교 내용 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* 세액공제 O */}
        <div
          className={`p-4 rounded-xl border-2 transition-all ${
            taxMode === 'withTax'
              ? 'border-pp bg-pp-light'
              : 'border-gray-100 bg-gray-50'
          }`}
        >
          <p className="text-xs font-semibold text-gray-500 mb-1">세액공제 O</p>
          <p className={`text-xl font-bold ${taxMode === 'withTax' ? 'text-pp-dark' : 'text-gray-600'}`}>
            {formatAmount(withTax)}
          </p>
          <p className="text-xs text-gray-400 mt-1">/ 월</p>
          <p className="text-xs text-gray-500 mt-2">연금소득세 원천징수</p>
        </div>

        {/* 세액공제 X */}
        <div
          className={`p-4 rounded-xl border-2 transition-all ${
            taxMode === 'withoutTax'
              ? 'border-pp bg-pp-light'
              : 'border-gray-100 bg-gray-50'
          }`}
        >
          <p className="text-xs font-semibold text-gray-500 mb-1">세액공제 X</p>
          <p className={`text-xl font-bold ${taxMode === 'withoutTax' ? 'text-pp-dark' : 'text-gray-600'}`}>
            {formatAmount(withoutTax)}
          </p>
          <p className="text-xs text-gray-400 mt-1">/ 월</p>
          <p className="text-xs text-gray-500 mt-2">원금 비과세 적용</p>
        </div>
      </div>

      {/* 차이 강조 */}
      {withTax > 0 && withoutTax > 0 && (
        <div
          className={`p-3 rounded-xl text-center ${
            isTaxFavorable ? 'bg-blue-50 border border-blue-100' : 'bg-orange-50 border border-orange-100'
          }`}
        >
          <p className="text-sm font-semibold text-gray-700">
            {isTaxFavorable ? (
              <>
                세액공제 X가{' '}
                <span className="text-blue-600 font-bold">
                  월 +{Math.abs(diff).toFixed(1)}만원
                </span>{' '}
                유리
              </>
            ) : (
              <>
                세액공제 O가{' '}
                <span className="text-orange-600 font-bold">
                  월 +{Math.abs(diff).toFixed(1)}만원
                </span>{' '}
                유리
              </>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ※ 납입 시 세액공제 절세 효과는 별도 고려 필요
          </p>
        </div>
      )}

      {/* 세율 안내 */}
      <div className="mt-4 pt-3 border-t border-gray-100 space-y-0.5">
        <p className="text-xs text-gray-400">연금소득세 (세액공제 O 기준)</p>
        <p className="text-xs text-gray-400">• 70세 미만: 5.5% / 70~80세: 4.4% / 80세 이상: 3.3%</p>
      </div>
    </div>
  );
}
