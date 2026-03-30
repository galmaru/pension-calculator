import { useState, useMemo } from 'react';
import type { PensionInputs } from './types';
import InputTab from './components/InputTab';
import ResultTab from './components/ResultTab';
import { calcNationalPension } from './calc/nationalPension';
import { calcRetirementDC } from './calc/retirementDC';
import { calcPersonalPension } from './calc/personalPension';
import {
  DC_DEFAULT_RETIREMENT_AGE,
  DC_DEFAULT_RECEIVING_YEARS,
  PP_DEFAULT_START_AGE,
  PP_DEFAULT_RECEIVING_YEARS,
  RETURN_DEFAULT,
} from './constants';

// 초기 입력값
const DEFAULT_INPUTS: PensionInputs = {
  currentAge: 35,
  nationalPension: {
    currentAge: 35,
    paidMonths: 60,
    totalPaidAmount: 500,
    inputMode: 'income',
    monthlyIncome: 300,
    monthlyPayment: 27,
  },
  retirementDC: {
    currentBalance: 1000,
    monthlyPayment: 30,
    annualReturn: RETURN_DEFAULT,
    retirementAge: DC_DEFAULT_RETIREMENT_AGE,
    receivingYears: DC_DEFAULT_RECEIVING_YEARS,
  },
  personalPension: {
    currentBalance: 500,
    monthlyPayment: 30,
    annualReturn: RETURN_DEFAULT,
    startAge: PP_DEFAULT_START_AGE,
    receivingYears: PP_DEFAULT_RECEIVING_YEARS,
  },
};

type TabType = 'input' | 'result';

/**
 * 내 연금 계산기 메인 앱 컴포넌트
 * 탭 레이아웃으로 입력/결과 화면 전환
 */
export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('input');
  const [inputs, setInputs] = useState<PensionInputs>(DEFAULT_INPUTS);

  // 입력값이 바뀔 때마다 실시간으로 결과 계산
  const results = useMemo(() => {
    const currentAge = inputs.currentAge || 35;
    return {
      nationalPension: calcNationalPension(inputs.nationalPension, currentAge),
      retirementDC: calcRetirementDC(inputs.retirementDC, currentAge),
      personalPension: calcPersonalPension(inputs.personalPension, currentAge),
    };
  }, [inputs]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 text-center">
            내 연금 계산기
          </h1>
          <p className="text-xs text-gray-400 text-center mt-0.5">
            국민연금 · 퇴직연금 · 개인연금
          </p>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('input')}
            className={`tab-btn ${
              activeTab === 'input' ? 'tab-btn-active' : 'tab-btn-inactive'
            }`}
            aria-selected={activeTab === 'input'}
            role="tab"
          >
            입력
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('result')}
            className={`tab-btn ${
              activeTab === 'result' ? 'tab-btn-active' : 'tab-btn-inactive'
            }`}
            aria-selected={activeTab === 'result'}
            role="tab"
          >
            결과
          </button>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {activeTab === 'input' ? (
          <InputTab
            inputs={inputs}
            onInputChange={setInputs}
            onShowResult={() => setActiveTab('result')}
          />
        ) : (
          <ResultTab results={results} inputs={inputs} />
        )}
      </main>
    </div>
  );
}
