import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { PensionResults, PensionInputs } from '../types';
import { NP_START_AGE, NP_LIFE_EXPECTANCY } from '../constants';

// Chart.js 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  results: PensionResults;
  inputs: PensionInputs;
  taxMode: 'withTax' | 'withoutTax';
}

/**
 * 은퇴 후 연간 수령액 누적 막대 그래프 컴포넌트
 * X축: 은퇴 나이 ~ 수령 종료 나이 (최대 90세)
 * Y축: 연간 수령액 (만원)
 */
export default function AnnualBarChart({ results, inputs, taxMode }: Props) {
  const dcRetirementAge = inputs.retirementDC.retirementAge;
  const ppStartAge = inputs.personalPension.startAge;

  // 그래프 시작: 가장 이른 수령 개시 나이
  const startAge = Math.min(NP_START_AGE, dcRetirementAge, ppStartAge);
  // 그래프 종료: 최대 90세 또는 각 수령 종료 나이 중 큰 값
  const npEndAge = NP_LIFE_EXPECTANCY;
  const dcEndAge = dcRetirementAge + inputs.retirementDC.receivingYears;
  const ppEndAge = ppStartAge + inputs.personalPension.receivingYears;
  const endAge = Math.min(90, Math.max(npEndAge, dcEndAge, ppEndAge));

  // X축 레이블
  const labels: string[] = [];
  for (let age = startAge; age <= endAge; age++) {
    labels.push(`${age}세`);
  }

  // 각 연금 연간 수령액 계산
  const npMonthly = results.nationalPension.monthlyAmount;
  const dcMonthly = results.retirementDC.monthlyAmount;
  const ppMonthly =
    taxMode === 'withTax'
      ? results.personalPension.monthlyAmountWithTax
      : results.personalPension.monthlyAmountWithoutTax;

  const npAnnualData = labels.map((_, i) => {
    const age = startAge + i;
    return age >= NP_START_AGE && age < npEndAge ? npMonthly * 12 : 0;
  });

  const dcAnnualData = labels.map((_, i) => {
    const age = startAge + i;
    return age >= dcRetirementAge && age < dcEndAge ? dcMonthly * 12 : 0;
  });

  const ppAnnualData = labels.map((_, i) => {
    const age = startAge + i;
    return age >= ppStartAge && age < ppEndAge ? ppMonthly * 12 : 0;
  });

  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: '국민연금',
        data: npAnnualData,
        backgroundColor: 'rgba(29, 158, 117, 0.85)',
        borderColor: '#1D9E75',
        borderWidth: 0,
        borderRadius: 2,
      },
      {
        label: '퇴직연금',
        data: dcAnnualData,
        backgroundColor: 'rgba(55, 138, 221, 0.85)',
        borderColor: '#378ADD',
        borderWidth: 0,
        borderRadius: 2,
      },
      {
        label: '개인연금',
        data: ppAnnualData,
        backgroundColor: 'rgba(239, 159, 39, 0.85)',
        borderColor: '#EF9F27',
        borderWidth: 0,
        borderRadius: 2,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 16,
          font: { size: 12, family: 'Pretendard' },
        },
      },
      title: {
        display: true,
        text: '은퇴 후 연간 수령액',
        font: { size: 14, weight: 'bold', family: 'Pretendard' },
        color: '#374151',
        padding: { bottom: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (!context.parsed.y) return '';
            return ` ${context.dataset.label}: 연 ${context.parsed.y.toFixed(0)}만원 (월 ${(context.parsed.y / 12).toFixed(1)}만원)`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          font: { size: 11, family: 'Pretendard' },
          maxTicksLimit: 12,
          color: '#6B7280',
        },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { size: 11, family: 'Pretendard' },
          color: '#6B7280',
          callback: (value) => `${Number(value).toLocaleString()}만`,
        },
      },
    },
  };

  return (
    <div className="section-card">
      <div className="h-64 sm:h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
