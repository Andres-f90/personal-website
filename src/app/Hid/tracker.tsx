'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import RadarChart from './radarChart';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Skill {
  name: string;
  value: number;
  locked?: boolean;
}

interface Section {
  id: string;
  index: string;
  category: string;
  title: string;
  icon: string;
  color: string;
  glow: string;
  bg: string;
  skills: Skill[];
  note: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INITIAL_SECTIONS: Section[] = [
  {
    id: 'economics',
    index: '01',
    category: 'career',
    title: 'Economics',
    icon: '◈',
    color: '#c8a96e',
    glow: 'rgba(200,169,110,0.15)',
    bg: 'rgba(200,169,110,0.08)',
    skills: [
      { name: 'Econometrics', value: 72 },
      { name: 'Microeconomics', value: 65 },
      { name: 'Macroeconomics', value: 58 },
      { name: 'Research Methods', value: 70 },
      { name: 'Policy Analysis', value: 45, locked: true },
    ],
    note: 'Working through IV/2SLS methodologies and binary choice models. Deepening theoretical foundations.',
  },
  {
    id: 'coding',
    index: '02',
    category: 'technical',
    title: 'Programming',
    icon: '⌬',
    color: '#7eb8a4',
    glow: 'rgba(126,184,164,0.15)',
    bg: 'rgba(126,184,164,0.08)',
    skills: [
      { name: 'R / Econometrics', value: 68 },
      { name: 'TypeScript / Next.js', value: 42 },
      { name: 'Python', value: 50 },
      { name: 'Data Visualization', value: 55 },
      { name: 'SQL / Data Mgmt', value: 38, locked: true },
    ],
    note: 'Strengthening R workflows. Building this site in Next.js + TypeScript as a live exercise.',
  },
  {
    id: 'languages',
    index: '03',
    category: 'communication',
    title: 'Languages',
    icon: '◎',
    color: '#9b7fbd',
    glow: 'rgba(155,127,189,0.15)',
    bg: 'rgba(155,127,189,0.08)',
    skills: [
      { name: 'Spanish (native)', value: 95 },
      { name: 'English', value: 80 },
      { name: 'Academic Writing', value: 62 },
      { name: 'Third Language', value: 10, locked: true },
    ],
    note: 'Refining academic English for papers. Considering a third language in the next cycle.',
  },
  {
    id: 'personal',
    index: '04',
    category: 'personal',
    title: 'Habits & Self',
    icon: '⊕',
    color: '#c47a6b',
    glow: 'rgba(196,122,107,0.15)',
    bg: 'rgba(196,122,107,0.08)',
    skills: [
      { name: 'Deep Work', value: 60 },
      { name: 'Physical Health', value: 55 },
      { name: 'Sleep Consistency', value: 48 },
      { name: 'Reading', value: 70 },
      { name: 'Reflection / Journal', value: 40 },
    ],
    note: 'Building deeper focus blocks. Sleep and recovery still inconsistent — flagged for next iteration.',
  },
];

const SECRET_SEQUENCE = ['a', 'd', 'e', 'v'];

function levelLabel(avg: number): string {
  if (avg < 20) return 'Initiate';
  if (avg < 35) return 'Novice';
  if (avg < 50) return 'Developing';
  if (avg < 65) return 'Proficient';
  if (avg < 80) return 'Advanced';
  if (avg < 92) return 'Expert';
  return 'Master';
}

function sectionAvg(skills: Skill[]): number {
  return Math.round(skills.reduce((a, s) => a + s.value, 0) / skills.length);
}

// ─── SKILL ROW ────────────────────────────────────────────────────────────────
function SkillRow({
  skill,
  color,
  editMode,
  onUpdate,
  animate,
}: {
  skill: Skill;
  color: string;
  editMode: boolean;
  onUpdate: (val: number) => void;
  animate: boolean;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(skill.value), 80);
      return () => clearTimeout(t);
    }
  }, [animate, skill.value]);

  useEffect(() => {
    if (!animate) setWidth(0);
  }, [animate]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr 56px',
        alignItems: 'center',
        gap: '16px',
        padding: '10px 0',
        borderBottom: '1px solid #1a1a1a',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          color: skill.locked ? '#3a3a3a' : '#d8d4cc',
          fontStyle: skill.locked ? 'italic' : 'normal',
          fontFamily: 'JetBrains Mono, monospace',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {skill.name}
        {skill.locked && (
          <span style={{ marginLeft: 6, fontSize: 9, opacity: 0.5 }}>locked</span>
        )}
      </span>

      <div
        style={{
          height: 2,
          background: '#1e1e1e',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${width}%`,
            background: color,
            borderRadius: 2,
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
          }}
        />
      </div>

      {editMode ? (
        <input
          type="number"
          min={0}
          max={100}
          defaultValue={skill.value}
          onChange={(e) => onUpdate(Math.min(100, Math.max(0, Number(e.target.value))))}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: `1px dashed ${color}`,
            color: '#d8d4cc',
            fontSize: 11,
            fontFamily: 'JetBrains Mono, monospace',
            textAlign: 'right',
            width: '100%',
            outline: 'none',
            padding: '2px 0',
          }}
        />
      ) : (
        <span
          style={{
            fontSize: 11,
            color: '#3a3a3a',
            textAlign: 'right',
            fontFamily: 'JetBrains Mono, monospace',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {skill.value}
        </span>
      )}
    </div>
  );
}

// ─── SECTION BLOCK ────────────────────────────────────────────────────────────
function SectionBlock({
  section,
  editMode,
  onSkillUpdate,
  onNoteUpdate,
  animate,
}: {
  section: Section;
  editMode: boolean;
  onSkillUpdate: (sectionId: string, skillIdx: number, val: number) => void;
  onNoteUpdate: (sectionId: string, note: string) => void;
  animate: boolean;
}) {
  const avg = sectionAvg(section.skills);

  return (
    <div style={{ marginBottom: 56 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: section.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: section.color,
            flexShrink: 0,
          }}
        >
          {section.icon}
        </div>
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#3a3a3a',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {section.index} · {section.category}
          </div>
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 22,
              fontWeight: 300,
              color: '#e8e4dc',
            }}
          >
            {section.title}
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span
            style={{
              fontSize: 10,
              padding: '3px 12px',
              borderRadius: 20,
              border: `1px solid ${section.color}`,
              color: section.color,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.08em',
            }}
          >
            {levelLabel(avg)}
          </span>
        </div>
      </div>

      {/* Skills */}
      {section.skills.map((skill, i) => (
        <SkillRow
          key={skill.name}
          skill={skill}
          color={section.color}
          editMode={editMode}
          onUpdate={(val) => onSkillUpdate(section.id, i, val)}
          animate={animate}
        />
      ))}

      {/* Note */}
      <div
        style={{
          marginTop: 16,
          background: '#111',
          border: '1px solid #1a1a1a',
          borderRadius: 8,
          padding: '14px 16px',
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#3a3a3a',
            marginBottom: 8,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          current focus
        </div>
        {editMode ? (
          <textarea
            defaultValue={section.note}
            onChange={(e) => onNoteUpdate(section.id, e.target.value)}
            rows={2}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: `1px dashed ${section.color}`,
              color: '#5a5a5a',
              fontSize: 13,
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              lineHeight: 1.7,
              width: '100%',
              resize: 'none',
              outline: 'none',
            }}
          />
        ) : (
          <p
            style={{
              color: '#4a4a4a',
              fontSize: 13,
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {section.note}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── LOCK OVERLAY ─────────────────────────────────────────────────────────────
function LockOverlay({
  progress,
  wrongFlash,
}: {
  progress: number;
  wrongFlash: boolean;
}) {
  const ghostColor = '#161616';
  const ghostDim = '#121212';
  const ghostBar = '#141414';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        zIndex: 100,
        overflowY: 'auto',
        userSelect: 'none',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '64px 32px 120px' }}>

        {/* Ghost header */}
        <div style={{ marginBottom: 64, paddingBottom: 24, borderBottom: `1px solid ${ghostColor}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 38, fontWeight: 300, color: ghostColor }}>
              <em style={{ fontStyle: 'italic' }}>development</em> log
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: ghostColor, fontFamily: 'JetBrains Mono, monospace' }}>
              last updated —
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: ghostColor, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em' }}>
            session <span>001</span> · press e to edit scores
          </div>
        </div>

        {/* Ghost summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 48 }}>
          {['Economics', 'Programming', 'Languages', 'Habits', 'Overall'].map((label) => (
            <div key={label} style={{ background: ghostColor, border: `1px solid ${ghostColor}`, borderRadius: 10, padding: '18px 14px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: ghostDim }} />
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 300, color: ghostDim, marginBottom: 4 }}>—%</div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: ghostDim, fontFamily: 'JetBrains Mono, monospace' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Ghost radar placeholder */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{ width: 280, height: 280, borderRadius: '50%', border: `1px solid ${ghostColor}`, opacity: 0.5 }} />
        </div>

        {/* Ghost sections */}
        {['Economics', 'Programming', 'Languages', 'Habits & Self'].map((title, si) => (
          <div key={title} style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: ghostColor }} />
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: ghostDim, fontFamily: 'JetBrains Mono, monospace' }}>
                  0{si + 1} · —
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 300, color: ghostColor }}>
                  {title}
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{ fontSize: 10, padding: '3px 12px', borderRadius: 20, border: `1px solid ${ghostColor}`, color: ghostColor, fontFamily: 'JetBrains Mono, monospace' }}>
                  ———
                </span>
              </div>
            </div>
            {[0.6, 0.45, 0.72, 0.38, 0.55].map((w, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 56px', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: `1px solid ${ghostColor}` }}>
                <div style={{ height: 8, width: `${40 + i * 15}%`, background: ghostColor, borderRadius: 2 }} />
                <div style={{ height: 2, background: ghostColor, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${w * 100}%`, background: ghostBar, borderRadius: 2 }} />
                </div>
                <div style={{ height: 8, width: '60%', background: ghostColor, borderRadius: 2, marginLeft: 'auto' }} />
              </div>
            ))}
            <div style={{ marginTop: 16, background: ghostColor, border: `1px solid ${ghostColor}`, borderRadius: 8, padding: '14px 16px', height: 60 }} />
          </div>
        ))}
      </div>

      {/* Key dots — the ONLY real interactive element */}
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
        }}
      >
        {SECRET_SEQUENCE.map((_, i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: wrongFlash
                ? '#c47a6b'
                : i < progress
                ? '#c8a96e'
                : '#1c1c1c',
              transform: wrongFlash
                ? `translateX(${i % 2 === 0 ? -3 : 3}px)`
                : i < progress
                ? 'scale(1.5)'
                : 'scale(1)',
              transition: 'background 0.15s, transform 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DevTracker() {
  const [unlocked, setUnlocked] = useState(false);
  const [keyProgress, setKeyProgress] = useState(0);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [animate, setAnimate] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const bufferRef = useRef<string[]>([]);

  // Load persisted state
  useEffect(() => {
    const raw = localStorage.getItem('devlog_v2');
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      setSections(saved.sections ?? INITIAL_SECTIONS);
      setSessionCount((saved.sessions ?? 0) + 1);
      setLastUpdated(saved.updated ?? null);
    } catch {}
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in textarea/input
      if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'INPUT') return;

      if (!unlocked) {
        const k = e.key.toLowerCase();
        const next = SECRET_SEQUENCE[bufferRef.current.length];
        if (k === next) {
          bufferRef.current = [...bufferRef.current, k];
          setKeyProgress(bufferRef.current.length);
          if (bufferRef.current.length === SECRET_SEQUENCE.length) {
            setTimeout(() => {
              setUnlocked(true);
              setAnimate(true);
              const saved = localStorage.getItem('devlog_v2');
              const n = saved ? (JSON.parse(saved).sessions ?? 0) + 1 : 1;
              setSessionCount(n);
            }, 300);
          }
        } else if (bufferRef.current.length > 0) {
          bufferRef.current = [];
          setKeyProgress(0);
          setWrongFlash(true);
          setTimeout(() => setWrongFlash(false), 400);
        }
        return;
      }

      if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
        setEditMode((prev) => {
          if (prev) {
            // save on exit
            saveState();
          }
          setAnimate(false);
          setTimeout(() => setAnimate(true), 100);
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [unlocked, sections]);

  const saveState = useCallback(() => {
    const now = new Date().toISOString();
    setLastUpdated(now);
    localStorage.setItem(
      'devlog_v2',
      JSON.stringify({ sections, updated: now, sessions: sessionCount })
    );
  }, [sections, sessionCount]);

  const updateSkill = useCallback((sectionId: string, skillIdx: number, val: number) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, skills: s.skills.map((sk, i) => (i === skillIdx ? { ...sk, value: val } : sk)) }
          : s
      )
    );
  }, []);

  const updateNote = useCallback((sectionId: string, note: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, note } : s))
    );
  }, []);

  const avgs = sections.map((s) => sectionAvg(s.skills));
  const overall = Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length);

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  if (!unlocked) {
    return <LockOverlay progress={keyProgress} wrongFlash={wrongFlash} />;
  }

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=JetBrains+Mono:wght@300;400&display=swap');
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
      `}</style>

      {/* Edit mode bar */}
      {editMode && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #c8a96e, #7eb8a4, #9b7fbd)',
            zIndex: 200,
          }}
        />
      )}
      {editMode && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            right: 20,
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#3a3a3a',
            fontFamily: 'JetBrains Mono, monospace',
            zIndex: 200,
          }}
        >
          edit mode — press e to save
        </div>
      )}

      <div
        style={{
          background: '#0a0a0a',
          minHeight: '100vh',
          color: '#e8e4dc',
        }}
      >
        <div
          style={{
            maxWidth: 880,
            margin: '0 auto',
            padding: '64px 32px 120px',
          }}
        >
          {/* Header */}
          <header
            style={{
              marginBottom: 64,
              paddingBottom: 24,
              borderBottom: '1px solid #181818',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 38,
                  fontWeight: 300,
                  letterSpacing: '-0.01em',
                }}
              >
                <em style={{ fontStyle: 'italic', color: '#c8a96e' }}>development</em> log
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#2a2a2a',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {formattedDate ? `last updated ${formattedDate}` : 'first session'}
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 10,
                color: '#2a2a2a',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.15em',
              }}
            >
              session{' '}
              <span style={{ color: '#c8a96e' }}>
                {String(sessionCount).padStart(3, '0')}
              </span>{' '}
              · press <span style={{ color: '#c8a96e' }}>e</span> to edit scores
            </div>
          </header>

          {/* Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 12,
              marginBottom: 48,
            }}
          >
            {[...sections, null].map((s, i) => {
              const val = s ? avgs[i] : overall;
              const color = s ? s.color : '#6b8fc4';
              const label = s ? s.title : 'Overall';
              return (
                <div
                  key={label}
                  style={{
                    background: '#111',
                    border: '1px solid #181818',
                    borderRadius: 10,
                    padding: '18px 14px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: color,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 28,
                      fontWeight: 300,
                      color,
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    {val}%
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#3a3a3a',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Radar */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 48px' }}>
            <RadarChart
              data={sections.map((s, i) => ({ label: s.title, value: avgs[i], color: s.color }))}
            />
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              editMode={editMode}
              onSkillUpdate={updateSkill}
              onNoteUpdate={updateNote}
              animate={animate}
            />
          ))}
        </div>
      </div>
    </>
  );
}
