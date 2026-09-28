import { useState, useMemo, useEffect, useCallback } from 'react';
import type { PensionInputs } from './types';
import InputTab from './components/InputTab';
import ResultTab from './components/ResultTab';
import { calcNationalPension } from './calc/nationalPension';
import { calcRetirementDC } from './calc/retirementDC';
import { calcPersonalPension } from './calc/personalPension';
import {
  DC_DEFAULT_RECEIVING_YEARS,
  PP_DEFAULT_START_AGE,
  PP_DEFAULT_RECEIVING_YEARS,
  RETURN_DEFAULT,
  RETIREMENT_AGE_DEFAULT,
  RECEIVING_YEARS_DEFAULT,
} from './constants';
import { useHistory, saveLastInputs, loadLastInputs } from './hooks/useHistory';

// 기본 입력값
const BASE_INPUTS: PensionInputs = {
  currentAge: 35,
  monthlySalary: 0,
  retirementAge: RETIREMENT_AGE_DEFAULT,
  nationalPension: {
    currentAge: 35,
    paidMonths: 60,
    totalPaidAmount: 500,
    inputMode: 'income',
    monthlyIncome: 0,
    monthlyPayment: 27,
  },
  retirementDC: {
    currentBalance: 1000,
    monthlySalary: 0,
    monthlyPayment: 30,
    annualReturn: RETURN_DEFAULT,
    retirementAge: RETIREMENT_AGE_DEFAULT,
    receivingYears: RECEIVING_YEARS_DEFAULT,
  },
  personalPension: {
    currentBalance: 500,
    monthlyPayment: 30,
    annualReturn: RETURN_DEFAULT,
    startAge: PP_DEFAULT_START_AGE,
    receivingYears: PP_DEFAULT_RECEIVING_YEARS,
  },
};

// DC_DEFAULT_RECEIVING_YEARS 사용 (lint 경고 방지)
void DC_DEFAULT_RECEIVING_YEARS;

type TabType = 'input' | 'result';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('input');

  // 마지막 저장값 또는 기본값으로 초기화 (재접속 시 복원)
  const [inputs, setInputs] = useState<PensionInputs>(() => {
    const last = loadLastInputs();
    return last ?? BASE_INPUTS;
  });

  // 입력값 변경 시 자동으로 localStorage에 저장 (세션 복원용)
  const handleInputChange = useCallback((next: PensionInputs) => {
    setInputs(next);
    saveLastInputs(next);
  }, []);

  // 히스토리 훅
  const { history, loading: historyLoading, saveHistory, deleteHistory } = useHistory();

  // 실시간 결과 계산
  const results = useMemo(() => {
    const currentAge = inputs.currentAge || 35;
    return {
      nationalPension: calcNationalPension(inputs.nationalPension, currentAge),
      retirementDC: calcRetirementDC(inputs.retirementDC, currentAge),
      personalPension: calcPersonalPension(inputs.personalPension, currentAge),
    };
  }, [inputs]);

  // 페이지 로드 시 타이틀 설정
  useEffect(() => {
    document.title = '내 연금 계산기';
  }, []);

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
            onInputChange={handleInputChange}
            onShowResult={() => setActiveTab('result')}
            history={history}
            historyLoading={historyLoading}
            onSaveHistory={saveHistory}
            onDeleteHistory={deleteHistory}
          />
        ) : (
          <ResultTab
            results={results}
            inputs={inputs}
            onSaveHistory={saveHistory}
          />
        )}
      </main>
    </div>
  );
}
