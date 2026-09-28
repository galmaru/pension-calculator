import { useState } from 'react';
import type { PensionResults, PensionInputs } from '../types';
import SummaryCards from './SummaryCards';
import GrowthChart from './GrowthChart';
import AnnualBarChart from './AnnualBarChart';
import TaxComparePanel from './TaxComparePanel';
import { NP_ANNUAL_RETURN, NP_RETURN_PERIOD } from '../constants';

interface Props {
  results: PensionResults;
  inputs: PensionInputs;
  onSaveHistory?: (inputs: PensionInputs, label?: string) => Promise<void>;
}

/**
 * 결과 탭 컴포넌트
 * 요약 카드, 성장 곡선 차트, 연간 수령액 막대 차트, 세금 비교 패널 포함
 */
export default function ResultTab({ results, inputs, onSaveHistory }: Props) {
  // 세액공제 여부 (개인연금 차트 및 합계에 반영)
  const [taxMode, setTaxMode] = useState<'withTax' | 'withoutTax'>('withTax');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleQuickSave = async () => {
    if (!onSaveHistory) return;
    setSaving(true);
    await onSaveHistory(inputs);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const hasData =
    results.nationalPension.monthlyAmount > 0 ||
    results.retirementDC.monthlyAmount > 0 ||
    results.personalPension.monthlyAmountWithTax > 0;

  return (
    <div className="space-y-5">
      {!hasData && (
        <div className="section-card text-center py-12">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-base font-semibold text-gray-600">
            입력 탭에서 정보를 입력하면
          </p>
          <p className="text-sm text-gray-400 mt-1">
            예상 연금 수령액이 실시간으로 계산됩니다
          </p>
        </div>
      )}

      {hasData && (
        <>
          {/* 빠른 저장 버튼 */}
          {onSaveHistory && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleQuickSave}
                disabled={saving || saved}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>{saved ? '✓ 저장 완료!' : saving ? '저장 중...' : '💾 현재 결과 저장하기'}</span>
              </button>
            </div>
          )}

          {/* 월 수령액 요약 카드 */}
          <SummaryCards results={results} taxMode={taxMode} />

          {/* 적립금 성장 곡선 */}
          <GrowthChart results={results} inputs={inputs} />

          {/* 연간 수령액 막대 그래프 */}
          <AnnualBarChart results={results} inputs={inputs} taxMode={taxMode} />

          {/* 개인연금 세금 비교 */}
          <TaxComparePanel
            result={results.personalPension}
            taxMode={taxMode}
            onTaxModeChange={setTaxMode}
          />
        </>
      )}

      {/* 하단 주석 */}
      <div className="section-card bg-gray-50 border-gray-100">
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500">
            ※ 국민연금: 2026년 개혁안(소득대체율 43% 기준 기본연금액 공식) 적용 추정치입니다.
          </p>
          <p className="text-xs text-gray-500">
            ※ 국민연금 가상 적립금 수익률: {NP_RETURN_PERIOD} 기금운용 연평균 수익률{' '}
            {(NP_ANNUAL_RETURN * 100).toFixed(2)}% 적용
          </p>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            본 계산기는 참고용 시뮬레이션이며, 실제 연금 수령액은 가입 이력, 소득 변동,
            제도 변경 등에 따라 달라질 수 있습니다. 정확한 수령액은 국민연금공단 또는
            각 금융기관에 문의하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
