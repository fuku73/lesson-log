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
  snsFaceOk?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuickLog {
  id: string;
  studentId: string;
  date: string;
  talked?: string;
  mood?: Mood;
  nextTime?: string;
  tags?: string[];
  photos?: string[];
}

export interface StudentWithLatestLog {
  student: Student;
  latestLog?: QuickLog;
}
