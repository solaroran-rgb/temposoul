// 女性垂直内容页 · 冥想与情绪记录（轻页）
// 纯前端轻量工具：呼吸计时 + 本地情绪随手记，不做心理评估，仅作情绪觉察参考。
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';
import './female.css';

const MOODS = [
  { emoji: '😌', label: '平静' },
  { emoji: '🙂', label: '愉悦' },
  { emoji: '😐', label: '一般' },
  { emoji: '😔', label: '低落' },
  { emoji: '😤', label: '烦躁' },
  { emoji: '😴', label: '疲惫' },
];

const STORAGE_KEY = 'ts_female_mood_note_v1';

export default function MeditationPage() {
  useEffect(() => {
    trackPageView('/female/meditation');
  }, []);

  // 呼吸计时（4 秒吸气 / 6 秒呼气，共 5 轮 = 50 秒）
  const BREATH = 4 + 6;
  const ROUNDS = 5;
  const TOTAL = BREATH * ROUNDS;
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRunning(false);
          return TOTAL;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, TOTAL]);

  const breathPhase = secondsLeft % BREATH >= 4 ? '呼气，缓缓放松' : '吸气，慢慢充盈';

  // 情绪随手记（本地保存，不上传）
  const [mood, setMood] = useState<string>('');
  const [note, setNote] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [savedAt, setSavedAt] = useState<string>('');

  const saveNote = () => {
    try {
      localStorage.setItem(STORAGE_KEY, note);
      setSavedAt(new Date().toLocaleString());
    } catch {
      setSavedAt('（本机不支持保存）');
    }
  };

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  return (
    <div className="female-page">
      <header className="female-page__hero">
        <h1 className="female-page__title">呼吸 · 冥想 · 情绪记录</h1>
        <p className="female-page__subtitle">
          一个安静的小角落：先跟着呼吸停 50 秒，再随手记下此刻的心情。所有记录只保存在你的浏览器里。
        </p>
      </header>

      <section className="female-page__timer" aria-label="呼吸计时">
        <div className="female-page__timer-hint">4 秒吸气 / 6 秒呼气 · 共 {ROUNDS} 轮</div>
        <div className="female-page__timer-count">
          {mm}:{ss.toString().padStart(2, '0')}
        </div>
        <div className="female-page__timer-hint">{running ? breathPhase : '准备好就开始'}</div>
        <button
          className="female-page__btn"
          onClick={() => setRunning((r) => !r)}
          type="button"
        >
          {running ? '暂停' : secondsLeft < TOTAL ? '继续' : '开始呼吸'}
        </button>
        {secondsLeft < TOTAL && !running && (
          <button
            className="female-page__btn female-page__btn--ghost"
            onClick={() => {
              setRunning(false);
              setSecondsLeft(TOTAL);
            }}
            type="button"
          >
            重置
          </button>
        )}
      </section>

      <section aria-label="情绪记录">
        <h2 className="female-page__section-title">此刻心情</h2>
        <div className="female-page__mood-row">
          {MOODS.map((m) => (
            <button
              key={m.label}
              type="button"
              title={m.label}
              aria-label={m.label}
              className={`female-page__mood${mood === m.label ? ' female-page__mood--active' : ''}`}
              onClick={() => setMood(m.label)}
            >
              {m.emoji}
            </button>
          ))}
        </div>
        {mood && <p className="female-page__saved">你选了：{mood}</p>}
        <textarea
          className="female-page__note"
          placeholder="想写点什么吗？比如今天让你开心或疲惫的一件小事……（仅保存在本机）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="female-page__btn" onClick={saveNote} type="button">
          保存在本机
        </button>
        {savedAt && <p className="female-page__saved">最近保存：{savedAt}</p>}
      </section>

      <nav className="female-page__related" aria-label="相关女性垂直内容">
        <Link to="/female/moon-cycle">了解月相与身心节律 →</Link>
        <Link to="/astrolabe/moon-phase">查看完整月相盘 →</Link>
      </nav>

      <p className="female-page__disclaimer">
        说明：本页为呼吸放松与情绪觉察的身心作息参考，不构成医疗、心理评估或干预建议。记录仅保存在你的浏览器本地。
        如持续感到情绪低落、焦虑或困扰，请及时联系专业心理咨询或医疗机构。
      </p>
    </div>
  );
}
