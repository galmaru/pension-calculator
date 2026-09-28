import { useState } from 'react';
import type { PensionResults } from '../types';
import {
  NP_A_VALUE_YEAR,
  NP_INCOME_MIN,
  NP_INCOME_MAX,
  NP_FORMULA_COEFF,
  NP_MIN_MONTHS,
} from '../constants';

interface Props {
  results: PensionResults;
  taxMode: 'withTax' | 'withoutTax'; // 개인연금 세액공제 여부
}

/**
 * 국민연금 상세 계산식 패널 (대한민국 국민연금법 및 2026년 개혁안 공식 기준)
 * 연간 연금액 = 1.29 × (A + B) × 지급률
 * 월 수령액 = 연간 연금액 ÷ 12
 */
function NationalPensionDetail({ results }: { results: PensionResults }) {
  const d = results.nationalPension.calcDetail;
  const np = results.nationalPension;

  const fmt = (n: number) => n.toFixed(1);
  const fmtPct = (r: number) => (r * 100).toFixed(1);

  const isBClamped = d.bValueRaw !== d.bValue;

  return (
    <div className="mt-3 bg-white border border-np/30 rounded-xl p-4 text-xs space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-np-dark text-sm">국민연금 상세 계산식</p>
        <span className="text-[11px] bg-np/10 text-np px-2 py-0.5 rounded-full font-medium">
          2026년 개혁안(소득대체율 43%) 기준
        </span>
      </div>

      {/* 공식 표시 */}
      <div className="bg-np-light/60 rounded-lg px-3 py-2 text-[11px] font-mono text-np-dark">
        월 수령액 = [ {NP_FORMULA_COEFF} × (A + B) × 지급률 ] ÷ 12
      </div>

      {!d.isQualified && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          ⚠️ <strong>최소 가입기간 미달:</strong> 국민연금 노령연금은 최소 10년({NP_MIN_MONTHS}개월) 이상 가입해야 연금 형태로 수령할 수 있습니다. 현재 기준 가입기간이 {NP_MIN_MONTHS}개월 미만인 경우 수급 연령 도달 시 이자를 더해 일시금(반환일시금)으로 지급됩니다.
        </div>
      )}

      {/* Step 1: A값, B값 */}
      <div className="space-y-1">
        <p className="font-medium text-gray-700">① A값 · B값 (소득월액)</p>
        <p className="text-gray-500 pl-2">
          A = <span className="font-semibold text-gray-700">{fmt(d.aValue)}만원</span>
          <span className="text-gray-400 ml-1">(전체 가입자 평균, {NP_A_VALUE_YEAR}년 기준)</span>
        </p>
        <p className="text-gray-500 pl-2">
          {d.inputMode === 'income'
            ? `B원본 = 월 소득 ${fmt(d.monthlyIncome)}만원`
            : `B원본 = 납입액/9% = ${fmt(d.bValueRaw)}만원`}
          {isBClamped && (
            <span className="text-amber-600 ml-1">
              → 기준소득월액 {d.bValueRaw < NP_INCOME_MIN ? `하한(${NP_INCOME_MIN}만원)` : `상한(${NP_INCOME_MAX}만원)`} 적용
            </span>
          )}
          {' '}= <span className="font-semibold text-gray-700">B = {fmt(d.bValue)}만원</span>
        </p>
        <p className="text-gray-500 pl-2">
          A + B = {fmt(d.aValue)} + {fmt(d.bValue)} ={' '}
          <span className="font-semibold text-gray-700">{fmt(d.aValue + d.bValue)}만원</span>
        </p>
      </div>

      {/* Step 2: 가입 기간 */}
      <div className="space-y-1">
        <p className="font-medium text-gray-700">② 가입 기간 (만 59세 의무가입 종료 기준)</p>
        <p className="text-gray-500 pl-2">
          P = 과거 <span className="font-semibold text-gray-700">{d.pastMonths}개월</span> + 미래(만59세까지){' '}
          <span className="font-semibold text-gray-700">{d.futureMonths}개월</span> ={' '}
          <span className="font-semibold text-gray-700">{d.totalMonths}개월</span> ({(d.totalMonths / 12).toFixed(1)}년)
        </p>
      </div>

      {/* Step 3: 지급률 */}
      <div className="space-y-1">
        <p className="font-medium text-gray-700">③ 지급률 (가입기간 비례)</p>
        <p className="text-gray-500 pl-2">
          • 10년(120개월): 50% 기본 적용<br />
          • 10년 초과 시 1개월마다 (5/12)%p 가산 (20년 만기 시 100%, 이후 1년당 5%p 추가)
        </p>
        <p className="text-gray-500 pl-2">
          → 최종 지급률: <span className="font-semibold text-gray-700">{fmtPct(d.paymentRate)}%</span>
          {d.excessMonths > 0 && (
            <span className="text-xs text-np ml-1">
              (20년 초과 {d.excessMonths}개월 가산 반영)
            </span>
          )}
        </p>
      </div>

      {/* Step 4: 최종 계산 */}
      <div className="space-y-1 bg-np-light/40 rounded-lg px-3 py-2">
        <p className="font-medium text-gray-700">④ 최종 월 연금액</p>
        <p className="text-gray-500">
          = [ {NP_FORMULA_COEFF} × {fmt(d.aValue + d.bValue)} × {fmtPct(d.paymentRate)}% ] ÷ 12
        </p>
        <p className="text-np font-bold text-sm mt-1">
          ≈ {fmt(np.monthlyAmount)}만원 / 월
        </p>
      </div>

      <p className="text-gray-400 leading-relaxed border-t border-gray-100 pt-2 text-[11px]">
        ※ A값은 전체 가입자 평균소득월액이며, {NP_A_VALUE_YEAR}년 공시 기준값을 사용합니다.<br />
        ※ 국민연금 의무 가입 상한은 만 59세이며, 수령 개시는 만 65세입니다.
      </p>
    </div>
  );
}

/**
 * 월 수령액 요약 카드 컴포넌트
 * 국민연금 / 퇴직연금 / 개인연금 3개 카드 + 합계 표시
 * 모바일 반응형(1열/3열 전환), 세전/세후 명확화
 */
export default function SummaryCards({ results, taxMode }: Props) {
  const [showNpDetail, setShowNpDetail] = useState(false);

  const np = results.nationalPension;
  const npAmount = np.monthlyAmount;
  const isNpQualified = np.calcDetail.isQualified;

  const dcAmount = results.retirementDC.monthlyAmount;
  const pp = results.personalPension;
  const ppAmount =
    taxMode === 'withTax'
      ? pp.monthlyAmountWithTax
      : pp.monthlyAmountWithoutTax;

  const totalAmount = npAmount + dcAmount + ppAmount;

  const formatAmount = (amount: number) => {
    if (amount <= 0) return '—';
    return `${amount.toFixed(1)}만원`;
  };

  return (
    <div className="space-y-4">
      {/* 3개 카드: 모바일 1열, sm(태블릿) 이상 3열 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 국민연금 카드 - 클릭 시 상세 계산식 토글 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowNpDetail((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowNpDetail((v) => !v);
            }
          }}
          className={`bg-np-light border rounded-2xl p-4 text-center cursor-pointer transition-all hover:shadow-sm ${
            showNpDetail ? 'ring-2 ring-np/50 border-np' : 'border-np/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-np"></div>
              <p className="text-xs font-semibold text-np-dark">국민연금</p>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-np/10 text-np font-medium">
              세전
            </span>
          </div>

          {!isNpQualified ? (
            <div className="py-1">
              <p className="text-sm font-bold text-amber-700">10년 미만</p>
              <p className="text-[11px] text-gray-500 mt-0.5">일시금 반환 대상</p>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-np leading-tight">
                {formatAmount(npAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">/ 월</p>
            </>
          )}

          <div className="mt-3 text-[11px] text-np font-medium bg-white/80 border border-np/20 py-1 px-2 rounded-lg flex items-center justify-center gap-1">
            <span>{showNpDetail ? '상세 산식 닫기 ▲' : '상세 산식 보기 ▼'}</span>
          </div>
        </div>

        {/* 퇴직연금 카드 */}
        <div className="bg-dc-light border border-dc/20 rounded-2xl p-4 text-center flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-dc"></div>
                <p className="text-xs font-semibold text-dc-dark">퇴직연금 (DC)</p>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-dc/10 text-dc font-medium">
                세전
              </span>
            </div>
            <p className="text-2xl font-bold text-dc leading-tight">
              {formatAmount(dcAmount)}
            </p>
            <p className="text-xs text-gray-500 mt-1">/ 월</p>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            ※ 연금 수령 시 퇴직소득세 30~40% 감면
          </p>
        </div>

        {/* 개인연금 카드 */}
        <div className="bg-pp-light border border-pp/20 rounded-2xl p-4 text-center flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-pp"></div>
                <p className="text-xs font-semibold text-pp-dark">개인연금 (IRP)</p>
              </div>
              {taxMode === 'withTax' ? (
                pp.isExceedingLimit ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                    16.5% 분리과세
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-pp/10 text-pp-dark font-medium">
                    세후 ({(pp.effectiveTaxRate * 100).toFixed(1)}%)
                  </span>
                )
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                  원금 비과세
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-pp leading-tight">
              {formatAmount(ppAmount)}
            </p>
            <p className="text-xs text-gray-500 mt-1">/ 월</p>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            {taxMode === 'withTax' ? '세액공제 적용 기준' : '세액공제 미적용 기준'}
          </p>
        </div>
      </div>

      {/* 국민연금 상세 계산식 (토글 시 표시) */}
      {showNpDetail && (
        <NationalPensionDetail results={results} />
      )}

      {/* 합계 강조 카드 */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 text-center text-white shadow-md">
        <p className="text-sm text-gray-300 mb-1">예상 월 총 수령액</p>
        <p className="text-3xl font-bold">
          {totalAmount > 0 ? (
            <>
              <span>{totalAmount.toFixed(1)}</span>
              <span className="text-xl ml-1 font-semibold">만원</span>
            </>
          ) : (
            <span className="text-xl text-gray-400">입력값을 확인하세요</span>
          )}
        </p>
        {totalAmount > 0 && (
          <p className="text-xs text-gray-400 mt-1.5">
            ※ 개인연금은 세후, 국민·퇴직연금은 세전 기준 합산액입니다.
          </p>
        )}
      </div>
    </div>
  );
}
