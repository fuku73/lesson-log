import type { QuickLog, Student } from "./types";
import {
  getAllStudents,
  getQuickLogsByStudent,
  createStudent,
  createQuickLog,
  deleteStudent
} from "./db";

export interface BackupData {
  version: 1;
  exportedAt: string;
  students: Student[];
  quickLogs: QuickLog[];
}

export async function exportAllData(): Promise<Blob> {
  const students = await getAllStudents();
  const quickLogs: QuickLog[] = [];
  for (const s of students) {
    const logs = await getQuickLogsByStudent(s.id);
    quickLogs.push(...logs);
  }
  const data: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    students,
    quickLogs
  };
  return new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
}

export function downloadBackup(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `レッスンログ_バックアップ_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importAllData(file: File): Promise<{ ok: boolean; message: string }> {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as BackupData;
    if (!data.version || !Array.isArray(data.students) || !Array.isArray(data.quickLogs)) {
      return { ok: false, message: "ファイルの形式が正しくありません。" };
    }

    const existing = await getAllStudents();
    for (const s of existing) {
      await deleteStudent(s.id);
    }

    const idMap: Record<string, string> = {};
    for (const old of data.students) {
      const { id: _id, ...rest } = old;
      const student = await createStudent(rest);
      idMap[old.id] = student.id;
    }
    for (const log of data.quickLogs) {
      const newStudentId = idMap[log.studentId];
      if (!newStudentId) continue;
      const { id: _id, studentId: _, ...rest } = log;
      await createQuickLog({ ...rest, studentId: newStudentId }, log.date);
    }
    return { ok: true, message: `復元しました（生徒${data.students.length}人、記録${data.quickLogs.length}件）` };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "インポート中にエラーが発生しました。" };
  }
}
