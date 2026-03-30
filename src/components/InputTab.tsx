import type { PensionInputs } from '../types';
import NationalPensionForm from './NationalPensionForm';
import RetirementDCForm from './RetirementDCForm';
import PersonalPensionForm from './PersonalPensionForm';

interface Props {
  inputs: PensionInputs;
  onInputChange: (inputs: PensionInputs) => void;
  onShowResult: () => void;
}

/**
 * 입력 탭 컴포넌트
 * 3개 연금 섹션 폼 + 공통 현재 나이 입력 + 결과 보기 버튼
 */
export default function InputTab({ inputs, onInputChange, onShowResult }: Props) {
  const updateCurrentAge = (age: number) => {
    onInputChange({
      ...inputs,
      currentAge: age,
      nationalPension: { ...inputs.nationalPension, currentAge: age },
    });
  };

  return (
    <div className="space-y-5">
      {/* 공통 현재 나이 입력 */}
      <div className="section-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">현재 나이 <span className="text-sm font-normal text-gray-500">(만 나이)</span></h2>
              <p className="text-xs text-gray-500">세 가지 연금 계산에 공통 적용됩니다</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="20"
              max="64"
              value={inputs.currentAge || ''}
              onChange={(e) => updateCurrentAge(Number(e.target.value))}
              className="w-20 text-right border border-gray-300 rounded-lg px-3 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="35"
              aria-label="현재 나이"
            />
            <span className="text-sm text-gray-500 font-medium">세</span>
          </div>
        </div>
      </div>

      {/* 국민연금 섹션 */}
      <NationalPensionForm
        value={inputs.nationalPension}
        onChange={(np) => onInputChange({ ...inputs, nationalPension: np })}
      />

      {/* 퇴직연금(DC형) 섹션 */}
      <RetirementDCForm
        value={inputs.retirementDC}
        onChange={(dc) => onInputChange({ ...inputs, retirementDC: dc })}
      />

      {/* 개인연금(IRP/연금저축) 섹션 */}
      <PersonalPensionForm
        value={inputs.personalPension}
        onChange={(pp) => onInputChange({ ...inputs, personalPension: pp })}
      />

      {/* 결과 보기 버튼 */}
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
