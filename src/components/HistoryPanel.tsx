import { useState } from 'react';
import type { HistoryRecord } from '../hooks/useHistory';
import type { PensionInputs } from '../types';

interface Props {
  history: HistoryRecord[];
  loading: boolean;
  onSave: (inputs: PensionInputs, label?: string) => Promise<void>;
  onRestore: (inputs: PensionInputs) => void;
  onDelete: (id: string) => Promise<void>;
  currentInputs: PensionInputs;
}

/** 날짜 문자열을 읽기 좋은 형식으로 변환 */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryPanel({
  history,
  loading,
  onSave,
  onRestore,
  onDelete,
  currentInputs,
}: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    await onSave(currentInputs);
    setSaving(false);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🕒</span>
          <div>
            <h2 className="text-base font-bold text-gray-800">히스토리</h2>
            <p className="text-xs text-gray-500">입력값을 저장하고 불러올 수 있습니다</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all"
          >
            {saving ? '저장 중...' : '현재 저장'}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
          >
            {open ? '닫기' : `목록 (${history.length})`}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4">
          {loading && (
            <p className="text-sm text-gray-400 text-center py-4">불러오는 중...</p>
          )}
          {!loading && history.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              저장된 히스토리가 없습니다
            </p>
          )}
          {!loading && history.length > 0 && (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {record.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      나이 {record.inputs.currentAge}세 · 월급{' '}
                      {record.inputs.monthlySalary}만원 · 은퇴{' '}
                      {record.inputs.retirementAge}세
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {formatDate(record.created_at)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRestore(record.inputs)}
                    className="flex-shrink-0 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    복원
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(record.id)}
                    disabled={deletingId === record.id}
                    className="flex-shrink-0 px-2.5 py-1 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-all"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
