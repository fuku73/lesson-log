export type Mood = "good" | "normal" | "tired" | "excited" | "other";

export interface Student {
  id: string;
  name: string;
  nickname?: string;
  photo?: string;
  location?: string;
  favoriteDrink?: string;
  familyWork?: string;
  allergies?: string;
  favorites?: string;
  availableDays?: string;
  favoriteStyle?: string;
  snsFaceOk?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Memo {
  id: string;
  studentId: string;
  date: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuickLog {
  id: string;
  studentId: string;
  date: string;
  talked?: string;
  nextTime?: string;
  lessonAttended?: string; // 参加したレッスン
  photos?: string[]; // 作品の写真
  tags?: string[]; // 旧データ用（非表示）
}

export interface StudentWithLatestLog {
  student: Student;
  latestLog?: QuickLog;
}

export interface LessonLog {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  attendees: string;
  revenue?: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}
