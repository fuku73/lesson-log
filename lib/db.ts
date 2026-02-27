import type { QuickLog, Student, StudentWithLatestLog } from "./types";

const DB_NAME = "student-notes-db";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("students")) {
        const store = db.createObjectStore("students", { keyPath: "id" });
        store.createIndex("by-updatedAt", "updatedAt");
      }
      if (!db.objectStoreNames.contains("quickLogs")) {
        const store = db.createObjectStore("quickLogs", { keyPath: "id" });
        store.createIndex("by-studentId", "studentId");
        store.createIndex("by-studentId-date", ["studentId", "date"]);
      }
    };
  });
}

function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function createStudent(
  input: Omit<Student, "id" | "createdAt" | "updatedAt">
) {
  const now = new Date().toISOString();
  const student: Student = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now
  };
  const db = await openDB();
  await promisify(db.transaction("students", "readwrite").objectStore("students").put(student));
  db.close();
  return student;
}

export async function updateStudent(id: string, patch: Partial<Student>) {
  const db = await openDB();
  const tx = db.transaction("students", "readwrite");
  const store = tx.objectStore("students");
  const existing = await promisify(store.get(id));
  db.close();
  if (!existing) return null;
  const updated: Student = {
    ...existing,
    ...patch,
    id,
    updatedAt: new Date().toISOString()
  };
  const db2 = await openDB();
  await promisify(db2.transaction("students", "readwrite").objectStore("students").put(updated));
  db2.close();
  return updated;
}

export async function deleteStudent(id: string) {
  const db = await openDB();
  const tx = db.transaction(["students", "quickLogs"], "readwrite");
  const studentsStore = tx.objectStore("students");
  const quickLogsStore = tx.objectStore("quickLogs");

  studentsStore.delete(id);

  await new Promise<void>((resolve, reject) => {
    const idx = quickLogsStore.index("by-studentId");
    const req = idx.openCursor(IDBKeyRange.only(id));
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };
    req.onerror = () => reject(req.error);
  });

  await new Promise<void>((res, rej) => {
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
}

export async function getStudent(id: string) {
  const db = await openDB();
  const result = await promisify(db.transaction("students").objectStore("students").get(id));
  db.close();
  return result;
}

export async function getAllStudents(): Promise<Student[]> {
  const db = await openDB();
  const store = db.transaction("students").objectStore("students");
  const idx = store.index("by-updatedAt");
  const all = await promisify(idx.getAll());
  db.close();
  return all.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
}

export async function createQuickLog(
  input: Omit<QuickLog, "id" | "date">,
  date?: string
): Promise<QuickLog> {
  const log: QuickLog = {
    id: crypto.randomUUID(),
    date: date ?? new Date().toISOString(),
    ...input
  };
  const db = await openDB();
  await promisify(db.transaction("quickLogs", "readwrite").objectStore("quickLogs").add(log));
  db.close();
  await updateStudent(input.studentId, {});
  return log;
}

export async function getQuickLogsByStudent(studentId: string) {
  const db = await openDB();
  const store = db.transaction("quickLogs").objectStore("quickLogs");
  const idx = store.index("by-studentId");
  const all = await promisify(idx.getAll(studentId));
  db.close();
  return all.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getLatestQuickLog(studentId: string) {
  const logs = await getQuickLogsByStudent(studentId);
  return logs[0];
}

export async function getAllStudentsWithLatestLog(): Promise<StudentWithLatestLog[]> {
  const students = await getAllStudents();
  const result: StudentWithLatestLog[] = [];
  for (const student of students) {
    const logs = await getQuickLogsByStudent(student.id);
    result.push({ student, latestLog: logs[0] });
  }
  return result;
}
