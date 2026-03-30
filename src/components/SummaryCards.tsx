import type { PensionResults } from '../types';

interface Props {
  results: PensionResults;
  taxMode: 'withTax' | 'withoutTax'; // 개인연금 세액공제 여부
}

/**
 * 월 수령액 요약 카드 컴포넌트
 * 국민연금 / 퇴직연금 / 개인연금 3개 카드 + 합계 표시
 */
export default function SummaryCards({ results, taxMode }: Props) {
  const npAmount = results.nationalPension.monthlyAmount;
  const dcAmount = results.retirementDC.monthlyAmount;
  const ppAmount =
    taxMode === 'withTax'
      ? results.personalPension.monthlyAmountWithTax
      : results.personalPension.monthlyAmountWithoutTax;
  const totalAmount = npAmount + dcAmount + ppAmount;

  const formatAmount = (amount: number) => {
    if (amount <= 0) return '—';
    return `${amount.toFixed(1)}만원`;
  };

  return (
    <div className="space-y-4">
      {/* 3개 카드 */}
      <div className="grid grid-cols-3 gap-3">
        {/* 국민연금 카드 */}
        <div className="bg-np-light border border-np/20 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-np"></div>
            <p className="text-xs font-semibold text-np-dark">국민연금</p>
          </div>
          <p className="text-lg font-bold text-np leading-tight">
            {formatAmount(npAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">/ 월</p>
        </div>

        {/* 퇴직연금 카드 */}
        <div className="bg-dc-light border border-dc/20 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-dc"></div>
            <p className="text-xs font-semibold text-dc-dark">퇴직연금</p>
          </div>
          <p className="text-lg font-bold text-dc leading-tight">
            {formatAmount(dcAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">/ 월</p>
        </div>

        {/* 개인연금 카드 */}
        <div className="bg-pp-light border border-pp/20 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-pp"></div>
            <p className="text-xs font-semibold text-pp-dark">개인연금</p>
          </div>
          <p className="text-lg font-bold text-pp leading-tight">
            {formatAmount(ppAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">/ 월</p>
        </div>
      </div>

      {/* 합계 강조 카드 */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 text-center text-white">
        <p className="text-sm text-gray-300 mb-1">예상 월 총 수령액</p>
        <p className="text-3xl font-bold">
          {totalAmount > 0 ? (
            <>
              <span>{totalAmount.toFixed(1)}</span>
              <span className="text-xl ml-1">만원</span>
            </>
          ) : (
            <span className="text-xl text-gray-400">입력값을 확인하세요</span>
          )}
        </p>
        {totalAmount > 0 && (
          <p className="text-xs text-gray-400 mt-1">/ 월 (세후 기준)</p>
        )}
      </div>
    </div>
  );
}
