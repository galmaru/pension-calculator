import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PensionInputs } from '../types';

const LOCAL_HISTORY_KEY = 'pension_history';
const LOCAL_DEVICE_KEY = 'pension_device_id';
const LOCAL_LAST_INPUTS_KEY = 'pension_last_inputs';

/** 기기별 고유 ID (재접속 시에도 동일 ID 사용) */
function getDeviceId(): string {
  let id = localStorage.getItem(LOCAL_DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(LOCAL_DEVICE_KEY, id);
  }
  return id;
}

export interface HistoryRecord {
  id: string;
  created_at: string;
  label: string;
  inputs: PensionInputs;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const deviceId = getDeviceId();

  /** localStorage에서 히스토리 불러오기 */
  const loadFromLocal = useCallback(() => {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  /** Supabase에서 히스토리 불러오기 */
  const fetchHistory = useCallback(async () => {
    if (!supabase) {
      loadFromLocal();
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('pension_history')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setHistory(data as HistoryRecord[]);
    setLoading(false);
  }, [deviceId, loadFromLocal]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  /** 현재 입력값을 히스토리로 저장 */
  const saveHistory = useCallback(
    async (inputs: PensionInputs, label?: string) => {
      const record: HistoryRecord = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        label: label ?? new Date().toLocaleString('ko-KR'),
        inputs,
      };

      if (!supabase) {
        const prev: HistoryRecord[] = JSON.parse(
          localStorage.getItem(LOCAL_HISTORY_KEY) ?? '[]'
        );
        const updated = [record, ...prev].slice(0, 20);
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
        setHistory(updated);
        return;
      }

      await supabase.from('pension_history').insert({
        device_id: deviceId,
        label: record.label,
        inputs,
      });
      await fetchHistory();
    },
    [deviceId, fetchHistory]
  );

  /** 히스토리 항목 삭제 */
  const deleteHistory = useCallback(
    async (id: string) => {
      if (!supabase) {
        const prev: HistoryRecord[] = JSON.parse(
          localStorage.getItem(LOCAL_HISTORY_KEY) ?? '[]'
        );
        const updated = prev.filter((r) => r.id !== id);
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
        setHistory(updated);
        return;
      }
      await supabase.from('pension_history').delete().eq('id', id);
      setHistory((prev) => prev.filter((r) => r.id !== id));
    },
    []
  );

  return { history, loading, saveHistory, deleteHistory, fetchHistory };
}

/** 마지막 입력값 자동 저장 (세션 복원용) */
export function saveLastInputs(inputs: PensionInputs) {
  localStorage.setItem(LOCAL_LAST_INPUTS_KEY, JSON.stringify(inputs));
}

/** 마지막 저장된 입력값 불러오기 */
export function loadLastInputs(): PensionInputs | null {
  const raw = localStorage.getItem(LOCAL_LAST_INPUTS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PensionInputs;
  } catch {
    return null;
  }
}
