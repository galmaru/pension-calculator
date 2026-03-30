import type { PensionInputs } from '../types';
import {
  RETIREMENT_AGE_MIN,
  RETIREMENT_AGE_MAX,
  RETIREMENT_AGE_STEP,
} from '../constants';
import NationalPensionForm from './NationalPensionForm';
import RetirementDCForm from './RetirementDCForm';
import PersonalPensionForm from './PersonalPensionForm';
import HistoryPanel from './HistoryPanel';
import type { HistoryRecord } from '../hooks/useHistory';

interface Props {
  inputs: PensionInputs;
  onInputChange: (inputs: PensionInputs) => void;
  onShowResult: () => void;
  history: HistoryRecord[];
  historyLoading: boolean;
  onSaveHistory: (inputs: PensionInputs) => Promise<void>;
  onDeleteHistory: (id: string) => Promise<void>;
}

/** 은퇴나이 슬라이더 눈금 레이블 */
const retirementAgeLabels = Array.from(
  { length: (RETIREMENT_AGE_MAX - RETIREMENT_AGE_MIN) / RETIREMENT_AGE_STEP + 1 },
  (_, i) => RETIREMENT_AGE_MIN + i * RETIREMENT_AGE_STEP
);

export default function InputTab({
  inputs,
  onInputChange,
  onShowResult,
  history,
  historyLoading,
  onSaveHistory,
  onDeleteHistory,
}: Props) {
  /** 공통 현재 나이 변경 */
  const updateCurrentAge = (age: number) => {
    onInputChange({
      ...inputs,
      currentAge: age,
      nationalPension: { ...inputs.nationalPension, currentAge: age },
    });
  };

  /** 공통 월급 변경 → 국민연금 월소득 + 퇴직연금 월급 동기화 */
  const updateMonthlySalary = (salary: number) => {
    onInputChange({
      ...inputs,
      monthlySalary: salary,
      nationalPension: { ...inputs.nationalPension, monthlyIncome: salary },
      retirementDC: { ...inputs.retirementDC, monthlySalary: salary },
    });
  };

  /** 공통 은퇴 나이 변경 → 퇴직연금 은퇴나이 동기화 */
  const updateRetirementAge = (age: number) => {
    onInputChange({
      ...inputs,
      retirementAge: age,
      retirementDC: { ...inputs.retirementDC, retirementAge: age },
    });
  };

  /** 히스토리에서 입력값 복원 */
  const handleRestore = (restoredInputs: PensionInputs) => {
    onInputChange(restoredInputs);
  };

  const monthlySalaryAutoPaymentNP = inputs.monthlySalary > 0
    ? (inputs.monthlySalary * 0.09).toFixed(1)
    : null;

  const monthlySalaryAutoPaymentDC = inputs.monthlySalary > 0
    ? (inputs.monthlySalary / 12).toFixed(1)
    : null;

  return (
    <div className="space-y-5">
      {/* ── 공통 입력 카드 ── */}
      <div className="section-card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">👤</span>
          <div>
            <h2 className="text-base font-bold text-gray-800">기본 정보</h2>
            <p className="text-xs text-gray-500">세 가지 연금 계산에 공통 적용됩니다</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* 현재 나이 */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              현재 나이{' '}
              <span className="text-xs font-normal text-gray-400">(만 나이)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="20"
                max="64"
                value={inputs.currentAge || ''}
                onChange={(e) => updateCurrentAge(Number(e.target.value))}
                className="w-20 text-right border border-gray-300 rounded-lg px-3 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="35"
                aria-label="현재 나이 (만 나이)"
              />
              <span className="text-sm text-gray-500 font-medium">세</span>
            </div>
          </div>

          {/* 월 소득 (월급) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              월 소득 <span className="text-xs font-normal text-gray-400">(세전 월급)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={inputs.monthlySalary || ''}
                onChange={(e) => updateMonthlySalary(Number(e.target.value))}
                className="input-field"
                placeholder="0"
                aria-label="월 소득 (만원)"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">만원</span>
            </div>
            {monthlySalaryAutoPaymentNP && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700">
                    국민연금 보험료 (9%){' '}
                    <strong>{monthlySalaryAutoPaymentNP}만원</strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">매년 4% 소득 상승 반영</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    퇴직연금 기여금 (연봉/12){' '}
                    <strong>{monthlySalaryAutoPaymentDC}만원</strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">매년 4% 연봉 상승 반영</p>
                </div>
              </div>
            )}
          </div>

          {/* 은퇴 나이 슬라이더 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">은퇴 나이</label>
              <span className="text-base font-bold text-dc">{inputs.retirementAge}세</span>
            </div>
            <input
              type="range"
              min={RETIREMENT_AGE_MIN}
              max={RETIREMENT_AGE_MAX}
              step={RETIREMENT_AGE_STEP}
              value={inputs.retirementAge}
              onChange={(e) => updateRetirementAge(Number(e.target.value))}
              className="range-slider w-full accent-dc"
              aria-label="은퇴 나이 슬라이더"
            />
            <div
              className="flex justify-between text-xs text-gray-400 mt-1"
              aria-hidden="true"
            >
              {retirementAgeLabels.map((age) => (
                <span key={age}>{age}세</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 국민연금 섹션 ── */}
      <NationalPensionForm
        value={inputs.nationalPension}
        monthlySalary={inputs.monthlySalary}
        onChange={(np) => onInputChange({ ...inputs, nationalPension: np })}
      />

      {/* ── 퇴직연금(DC형) 섹션 ── */}
      <RetirementDCForm
        value={inputs.retirementDC}
        monthlySalary={inputs.monthlySalary}
        retirementAge={inputs.retirementAge}
        onChange={(dc) => onInputChange({ ...inputs, retirementDC: dc })}
      />

      {/* ── 개인연금(IRP/연금저축) 섹션 ── */}
      <PersonalPensionForm
        value={inputs.personalPension}
        onChange={(pp) => onInputChange({ ...inputs, personalPension: pp })}
      />

      {/* ── 히스토리 패널 ── */}
      <HistoryPanel
        history={history}
        loading={historyLoading}
        onSave={onSaveHistory}
        onRestore={handleRestore}
        onDelete={onDeleteHistory}
        currentInputs={inputs}
      />

      {/* ── 결과 보기 버튼 ── */}
      <div className="sticky bottom-4">
        <button
          type="button"
          onClick={onShowResult}
          className="w-full py-4 bg-gradient-to-r from-np via-dc to-pp text-white font-bold text-base rounded-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all duration-150"
          aria-label="결과 탭으로 이동"
        >
          결과 보기 →
        </button>
      </div>
    </div>
  );
}
