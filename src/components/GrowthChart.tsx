import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { PensionResults, PensionInputs } from '../types';
import { NP_START_AGE } from '../constants';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  results: PensionResults;
  inputs: PensionInputs;
}

/**
 * 적립금 성장 곡선 꺾은선 그래프 컴포넌트
 * X축: 현재 나이 ~ 각 연금 종료 나이
 * Y축: 적립금 (만원)
 */
export default function GrowthChart({ results, inputs }: Props) {
  const currentAge = inputs.currentAge;
  const npEndAge = NP_START_AGE;
  const dcEndAge = inputs.retirementDC.retirementAge;
  const ppEndAge = inputs.personalPension.startAge;
  const maxAge = Math.max(npEndAge, dcEndAge, ppEndAge);

  // X축 레이블 (나이 배열)
  const labels: string[] = [];
  for (let age = currentAge; age <= maxAge; age++) {
    labels.push(`${age}세`);
  }

  // 각 연금의 성장 데이터를 maxAge 기준으로 정렬
  const alignData = (growthData: number[], endAge: number): (number | null)[] => {
    return labels.map((_, i) => {
      const age = currentAge + i;
      if (age > endAge) return null;
      const idx = age - currentAge;
      return idx < growthData.length ? growthData[idx] : null;
    });
  };

  const npData = alignData(results.nationalPension.growthData, npEndAge);
  const dcData = alignData(results.retirementDC.growthData, dcEndAge);
  const ppData = alignData(results.personalPension.growthData, ppEndAge);

  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: '국민연금',
        data: npData as number[],
        borderColor: '#1D9E75',
        backgroundColor: 'rgba(29, 158, 117, 0.1)',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: false,
        spanGaps: false,
      },
      {
        label: '퇴직연금',
        data: dcData as number[],
        borderColor: '#378ADD',
        backgroundColor: 'rgba(55, 138, 221, 0.1)',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: false,
        spanGaps: false,
      },
      {
        label: '개인연금',
        data: ppData as number[],
        borderColor: '#EF9F27',
        backgroundColor: 'rgba(239, 159, 39, 0.1)',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
        fill: false,
        spanGaps: false,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
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
          pointStyle: 'circle',
          padding: 16,
          font: { size: 12, family: 'Pretendard' },
        },
      },
      title: {
        display: true,
        text: '적립금 성장 곡선',
        font: { size: 14, weight: 'bold', family: 'Pretendard' },
        color: '#374151',
        padding: { bottom: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.parsed.y === null) return '';
            return ` ${context.dataset.label}: ${context.parsed.y.toFixed(0)}만원`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11, family: 'Pretendard' },
          maxTicksLimit: 10,
          color: '#6B7280',
        },
      },
      y: {
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
        <Line data={data} options={options} />
      </div>
      <p className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100 leading-relaxed">
        ※ 국민연금은 국가가 평생 지급을 보장하는 공적 연금(사회보험 DB형)입니다. 위 그래프의 국민연금 곡선은 가입자 및 사업주 납입 총액에 기금운용 수익률(5.92%)을 가상 복리 적용한 시각화 참고치입니다.
      </p>
    </div>
  );
}
