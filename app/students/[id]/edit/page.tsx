"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { getStudent, updateStudent } from "../../../../lib/db";
import type { Student } from "../../../../lib/types";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState("");
  const [favoriteDrink, setFavoriteDrink] = useState("");
  const [familyWork, setFamilyWork] = useState("");
  const [allergies, setAllergies] = useState("");
  const [favorites, setFavorites] = useState("");
  const [availableDays, setAvailableDays] = useState("");
  const [favoriteStyle, setFavoriteStyle] = useState("");
  const [snsFaceOk, setSnsFaceOk] = useState<boolean | undefined>(undefined);
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const s = await getStudent(id);
    setStudent(s ?? null);
    if (s) {
      setName(s.name);
      setNickname(s.nickname ?? "");
      setLocation(s.location ?? "");
      setFavoriteDrink(s.favoriteDrink ?? "");
      setFamilyWork(s.familyWork ?? "");
      setAllergies(s.allergies ?? "");
      setFavorites(s.favorites ?? "");
      setAvailableDays(s.availableDays ?? "");
      setFavoriteStyle(s.favoriteStyle ?? "");
      setSnsFaceOk(s.snsFaceOk);
      setPhoto(s.photo ?? "");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhoto(dataUrl);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !name.trim()) return;
    setSaving(true);
    try {
      await updateStudent(id, {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        location: location.trim() || undefined,
        favoriteDrink: favoriteDrink.trim() || undefined,
        familyWork: familyWork.trim() || undefined,
        allergies: allergies.trim() || undefined,
        favorites: favorites.trim() || undefined,
        availableDays: availableDays.trim() || undefined,
        favoriteStyle: favoriteStyle.trim() || undefined,
        snsFaceOk,
        photo: photo || undefined
      });
      router.push(`/students/${id}`);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  }

  if (!student) {
    return (
      <main className="px-4 pt-6 pb-24">
        <p className="text-muted">読み込み中…</p>
      </main>
    );
  }

  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <Link href={`/students/${id}`} className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← {student.name}さんの詳細
        </Link>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          生徒さん情報を編集
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text mb-1">写真（任意）</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full bg-sub flex items-center justify-center text-2xl text-muted overflow-hidden focus:ring-2 focus:ring-primary"
            >
              {photo ? (
                <img src={photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <FiCamera className="text-2xl text-muted" aria-hidden />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <span className="text-sm text-muted">{photo ? "タップで変更" : "タップで選択"}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">名前 <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：鈴木 こはる"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">ニックネーム（任意）</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="例：こはさん"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">居住地</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例：森林公園のふもと"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">好きな食べもの・飲みもの</label>
          <input
            type="text"
            value={favoriteDrink}
            onChange={(e) => setFavoriteDrink(e.target.value)}
            placeholder="例：紅茶、チョコレート"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">家族/仕事（自由記述）</label>
          <textarea
            value={familyWork}
            onChange={(e) => setFamilyWork(e.target.value)}
            placeholder="例：ご主人、ヨガ講師"
            rows={2}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">アレルギー/注意事項</label>
          <textarea
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="例：アレルギーはないけど、牛乳が苦手"
            rows={2}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">好きなこと、もの</label>
          <input
            type="text"
            value={favorites}
            onChange={(e) => setFavorites(e.target.value)}
            placeholder="例：森林浴、カフェ巡り"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">参加しやすい曜日や時間帯</label>
          <textarea
            value={availableDays}
            onChange={(e) => setAvailableDays(e.target.value)}
            placeholder="例：火曜午前、金曜夕方"
            rows={2}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">好きな色やテイスト</label>
          <textarea
            value={favoriteStyle}
            onChange={(e) => setFavoriteStyle(e.target.value)}
            placeholder="例：パステルカラー、ナチュラル系"
            rows={2}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">SNS顔出し</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="snsFaceOk" checked={snsFaceOk === true} onChange={() => setSnsFaceOk(true)} />
              <span className="text-sm">OK</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="snsFaceOk" checked={snsFaceOk === false} onChange={() => setSnsFaceOk(false)} />
              <span className="text-sm">NG</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="snsFaceOk" checked={snsFaceOk === undefined} onChange={() => setSnsFaceOk(undefined)} />
              <span className="text-sm">未設定</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Link href={`/students/${id}`} className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm text-muted">
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="flex-1 rounded-2xl bg-primary text-white px-4 py-3 text-sm font-medium disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存する"}
          </button>
        </div>
      </form>
    </main>
  );
}
