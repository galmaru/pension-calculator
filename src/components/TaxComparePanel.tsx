import type { PersonalPensionResult } from '../types';
import { ANNUAL_TAX_LIMIT_PP } from '../constants';

interface Props {
  result: PersonalPensionResult;
  taxMode: 'withTax' | 'withoutTax';
  onTaxModeChange: (mode: 'withTax' | 'withoutTax') => void;
}

/**
 * 개인연금 세금 비교 패널 컴포넌트
 * 세액공제 O vs X 상황에서의 세후 월 수령액 비교
 * 연 1,500만원 초과 시 16.5% 분리과세 안내 포함
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
        <div>
          <h3 className="text-base font-bold text-gray-800">
            개인연금 세액공제 비교
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            세액공제 납입 여부에 따른 은퇴 후 세후 수령액 비교
          </p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            result.isExceedingLimit
              ? 'bg-amber-100 text-amber-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {result.isExceedingLimit
            ? '16.5% 분리과세 적용'
            : `실효세율 ${(result.effectiveTaxRate * 100).toFixed(1)}%`}
        </span>
      </div>

      {/* 1,500만원 한도 초과 경고 배너 */}
      {result.isExceedingLimit && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold flex items-center gap-1 mb-0.5">
            <span>⚠️</span> 연간 사적연금 수령액 {ANNUAL_TAX_LIMIT_PP}만원(월 125만원) 초과
          </p>
          <p className="text-amber-700">
            사적연금(IRP/연금저축) 수령액이 연 {ANNUAL_TAX_LIMIT_PP}만원을 초과할 경우, 저율 연금소득세(3.3~5.5%) 대신
            <strong> 16.5% 분리과세</strong> 또는 종합소득세 과세 대상이 됩니다.
            본 시뮬레이션에서는 16.5% 분리과세를 적용하여 계산했습니다.
          </p>
        </div>
      )}

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
          <p
            className={`text-xl font-bold ${
              taxMode === 'withTax' ? 'text-pp-dark' : 'text-gray-600'
            }`}
          >
            {formatAmount(withTax)}
          </p>
          <p className="text-xs text-gray-400 mt-1">/ 월 (세후)</p>
          <p className="text-xs text-gray-500 mt-2">
            {result.isExceedingLimit
              ? '16.5% 분리과세 원천징수'
              : '연금소득세(3.3~5.5%) 원천징수'}
          </p>
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
          <p
            className={`text-xl font-bold ${
              taxMode === 'withoutTax' ? 'text-pp-dark' : 'text-gray-600'
            }`}
          >
            {formatAmount(withoutTax)}
          </p>
          <p className="text-xs text-gray-400 mt-1">/ 월 (세후)</p>
          <p className="text-xs text-gray-500 mt-2">납입 원금 비과세 적용</p>
        </div>
      </div>

      {/* 차이 강조 */}
      {withTax > 0 && withoutTax > 0 && (
        <div
          className={`p-3 rounded-xl text-center ${
            isTaxFavorable
              ? 'bg-blue-50 border border-blue-100'
              : 'bg-orange-50 border border-orange-100'
          }`}
        >
          <p className="text-sm font-semibold text-gray-700">
            {isTaxFavorable ? (
              <>
                세액공제 X가 수령 시{' '}
                <span className="text-blue-600 font-bold">
                  월 +{Math.abs(diff).toFixed(1)}만원
                </span>{' '}
                더 받음
              </>
            ) : (
              <>
                세액공제 O가 수령 시{' '}
                <span className="text-orange-600 font-bold">
                  월 +{Math.abs(diff).toFixed(1)}만원
                </span>{' '}
                더 받음
              </>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ※ 납입 기간 동안 누적된 연말정산 세액공제 혜택(13.2%~16.5%)과 종합 비교 필요
          </p>
        </div>
      )}

      {/* 세율 안내 */}
      <div className="mt-4 pt-3 border-t border-gray-100 space-y-0.5 text-xs text-gray-400">
        <p className="font-medium text-gray-500">연금소득세율 기준 (사적연금 연 1,500만원 이하 시)</p>
        <p>• 70세 미만: 5.5% / 70~80세 미만: 4.4% / 80세 이상: 3.3%</p>
        <p>• 연 1,500만원 초과 시: 16.5% 분리과세 또는 종합과세 선택</p>
      </div>
    </div>
  );
}
