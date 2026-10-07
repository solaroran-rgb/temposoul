/**
 * SynthesisPage —— 八字紫微合参真实排盘页（波4 · 组B 板块3）
 *
 * 七语 i18n 接入位：本页文案暂以中文硬编码，待后续抽取为 i18n key 后接入 @/i18n。
 *
 * 引擎：@temposoul/core/synthesis → calculateBaziZiweiCombinedReading(profile, { ziwei })
 *   内部同时调八字（@temposoul/core/bazi）与紫微（@temposoul/core/ziwei）出双盘后组装。
 *
 * 可视化对照 A6 分册01 §6②：
 *   1) 双盘并置：左八字四柱纵排卡 + 右紫微十二宫 4×4 方盘（按地支落格，中格基本信息）；
 *   2) themes[10] 主题对照：切主题时左右两体系证据条目化并列；
 *   3) evidenceCount 双色对比条 + missingFacts 缺口提示卡。
 *
 * 合规：双盘资料仅供文化/娱乐参考；不编造合参结论——conflicts/synergies 字段为 P2，
 *   引擎未输出则不展示；空/异常时显示「排盘数据待补」。
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { calculateBaziZiweiCombinedReading } from '@temposoul/core/synthesis';

type CombinedReading = Awaited<ReturnType<typeof calculateBaziZiweiCombinedReading>>;

const SHICHEN_OPTIONS = [
  { value: 0, label: '早子时' },
  { value: 1, label: '丑时' },
  { value: 2, label: '寅时' },
  { value: 3, label: '卯时' },
  { value: 4, label: '辰时' },
  { value: 5, label: '巳时' },
  { value: 6, label: '午时' },
  { value: 7, label: '未时' },
  { value: 8, label: '申时' },
  { value: 9, label: '酉时' },
  { value: 10, label: '戌时' },
  { value: 11, label: '亥时' },
  { value: 12, label: '晚子时' },
];

// 紫微 4×4 方盘地支落格（文墨/iztro 范式：中格放基本信息）
const BRANCH_GRID: Record<string, [number, number]> = {
  巳: [0, 0], 午: [0, 1], 未: [0, 2], 申: [0, 3],
  辰: [1, 0], 酉: [1, 3],
  卯: [2, 0], 戌: [2, 3],
  寅: [3, 0], 丑: [3, 1], 子: [3, 2], 亥: [3, 3],
};

const PILLAR_LABELS = [
  { key: 'year', label: '年柱' },
  { key: 'month', label: '月柱' },
  { key: 'day', label: '日柱' },
  { key: 'hour', label: '时柱' },
] as const;

type PageState = 'idle' | 'loading' | 'ok' | 'error';

function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function SynthesisPage() {
  const nav = useNavigate();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [timeIndex, setTimeIndex] = useState(8);
  const [horoscopeDate, setHoroscopeDate] = useState(todayStr());
  const [horoscopeHour, setHoroscopeHour] = useState(8);

  const [state, setState] = useState<PageState>('idle');
  const [result, setResult] = useState<CombinedReading | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTheme, setActiveTheme] = useState(0);

  const themes = result?.synthesis.themes ?? [];
  const currentTheme = themes[activeTheme];

  const baziPillars = result?.bundle.bazi?.pillars;
  const dayMaster = result?.bundle.bazi?.dayMaster;
  const originPalaces = result?.bundle.ziwei?.payloadByScope.origin?.palaces ?? [];
  const basicInfo = result?.bundle.ziwei?.payloadByScope.origin?.basic_info;

  async function handleSubmit() {
    setState('loading');
    setErrorMsg('');
    try {
      const reading = await calculateBaziZiweiCombinedReading(
        {
          name: name.trim() || undefined,
          gender,
          calendarType: 'solar',
          year,
          month,
          day,
          timeIndex,
          useTrueSolarTime: false,
        },
        {
          ziwei: {
            horoscopeContext: {
              dateStr: horoscopeDate,
              hourIndex: horoscopeHour,
            },
          },
        },
      );
      setResult(reading);
      setActiveTheme(0);
      setState('ok');
    } catch (e) {
      setResult(null);
      setErrorMsg(e instanceof Error ? e.message : '排盘数据待补');
      setState('error');
    }
  }

  const evidenceTotal = result
    ? result.synthesis.evidenceCount.bazi + result.synthesis.evidenceCount.ziwei
    : 1;

  return (
    <main className="syn-page">
      <style>{`
        .syn-page { max-width: 1200px; margin: 0 auto; padding: 0 16px 64px; color: inherit; }
        .syn-lead { font-size: 14px; line-height: 1.8; opacity: .8; margin: 0 0 16px; }
        .syn-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px; border: 1px solid rgba(140,150,180,.25); border-radius: 12px; padding: 16px; }
        .syn-form label { font-size: 12px; opacity: .7; display: flex; flex-direction: column; gap: 4px; }
        .syn-form input, .syn-form select { min-height: 40px; padding: 6px 8px; border-radius: 8px;
          border: 1px solid rgba(140,150,180,.4); background: transparent; color: inherit; }
        .syn-submit { grid-column: 1 / -1; min-height: 44px; border: none; border-radius: 10px;
          background: #E24E4C; color: #fff; font-size: 15px; cursor: pointer; }
        .syn-status { display: inline-block; font-size: 12px; padding: 3px 12px; border-radius: 999px;
          border: 1px solid rgba(102,201,195,.6); color: #4cafa9; }
        .syn-dual { display: grid; grid-template-columns: 320px 1fr; gap: 16px; margin: 20px 0; }
        @media (max-width: 860px) { .syn-dual { grid-template-columns: 1fr; } }
        .syn-panel { border: 1px solid rgba(187,152,99,.4); border-radius: 12px; padding: 14px; }
        .syn-panel h2 { font-size: 16px; margin: 0 0 10px; }
        .syn-pillars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .syn-pillar { text-align: center; border: 1px solid rgba(187,152,99,.35); border-radius: 8px; padding: 8px 4px; }
        .syn-pillar__label { font-size: 11px; opacity: .6; }
        .syn-pillar__gz { font-size: 18px; font-weight: 700; margin: 4px 0; }
        .syn-pillar--day .syn-pillar__gz { color: #BB9863; }
        .syn-zgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
        .syn-pal { border: 1px solid rgba(140,150,180,.3); border-radius: 6px; padding: 6px; min-height: 84px; font-size: 11px; }
        .syn-pal__name { font-weight: 700; font-size: 12px; }
        .syn-pal__stem { opacity: .6; }
        .syn-pal__stars { color: #BB9863; margin-top: 2px; line-height: 1.5; }
        .syn-pal__mut { color: #E24E4C; }
        .syn-center { grid-row: 2 / 4; grid-column: 2 / 4; border: 1px dashed rgba(187,152,99,.5);
          border-radius: 6px; padding: 8px; font-size: 11px; line-height: 1.7; }
        .syn-counts { display: flex; height: 14px; border-radius: 999px; overflow: hidden; margin: 6px 0; }
        .syn-counts__bazi { background: #4A7BA6; }
        .syn-counts__ziwei { background: #BB9863; }
        .syn-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin: 16px 0; }
        .syn-tab { padding: 5px 10px; border-radius: 999px; border: 1px solid rgba(140,150,180,.35);
          background: transparent; color: inherit; font-size: 12px; cursor: pointer; min-height: 32px; }
        .syn-tab.is-active { background: #BB9863; color: #fff; border-color: #BB9863; }
        .syn-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 720px) { .syn-compare { grid-template-columns: 1fr; } }
        .syn-col { border-radius: 10px; padding: 12px; }
        .syn-col--bazi { background: rgba(74,123,166,.08); }
        .syn-col--ziwei { background: rgba(187,152,99,.1); }
        .syn-col h3 { font-size: 14px; margin: 0 0 8px; }
        .syn-fact { font-size: 13px; line-height: 1.7; margin-bottom: 8px; }
        .syn-fact__title { font-weight: 600; }
        .syn-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .syn-chip { font-size: 12px; padding: 3px 10px; border-radius: 999px;
          border: 1px solid rgba(226,78,76,.4); color: rgba(200,80,70,.9); }
        .syn-method { font-size: 13px; line-height: 1.8; opacity: .8; padding-left: 18px; }
        .syn-note { font-size: 12px; opacity: .55; line-height: 1.7; margin-top: 24px; }
        .syn-empty { border: 1px dashed rgba(140,150,180,.45); border-radius: 12px; padding: 28px;
          text-align: center; opacity: .7; }
      `}</style>

      <PageTopbar title="八字紫微合参" onBack={() => nav(-1)} />

      <h1 style={{ fontSize: 26, margin: '16px 0 8px' }}>八字紫微合参</h1>
      <p className="syn-lead">
        同一出生信息同时起八字四柱与紫微十二宫，按人生主题逐条并列两套资料，供相互对照、补充与参考。
      </p>

      <div className="syn-form">
        <label>
          称呼（可选）
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：时月" />
        </label>
        <label>
          性别
          <select value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
            <option value="female">女</option>
            <option value="male">男</option>
          </select>
        </label>
        <label>
          出生年
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </label>
        <label>
          出生月
          <input type="number" value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        </label>
        <label>
          出生日
          <input type="number" value={day} onChange={(e) => setDay(Number(e.target.value))} />
        </label>
        <label>
          出生时辰
          <select value={timeIndex} onChange={(e) => setTimeIndex(Number(e.target.value))}>
            {SHICHEN_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          运限基准日期
          <input type="date" value={horoscopeDate} onChange={(e) => setHoroscopeDate(e.target.value)} />
        </label>
        <label>
          运限基准时辰
          <select value={horoscopeHour} onChange={(e) => setHoroscopeHour(Number(e.target.value))}>
            {SHICHEN_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="syn-submit" onClick={handleSubmit}>
          {state === 'loading' ? '双盘排盘中…' : '并排八字与紫微双盘'}
        </button>
      </div>

      {state === 'error' && (
        <div className="syn-empty" role="alert">
          排盘数据待补。{errorMsg || '引擎暂未返回有效合参结果。'}
        </div>
      )}

      {state === 'ok' && result && (
        <>
          <p style={{ margin: '16px 0 0' }}>
            <span className="syn-status">{result.synthesis.status}</span>
            <span style={{ fontSize: 13, opacity: .65, marginLeft: 10 }}>
              {result.synthesis.subjectName ? `${result.synthesis.subjectName} ｜ ` : ''}
              运限基准 {result.synthesis.timingReference.dateStr}{' '}
              {result.synthesis.timingReference.shichen}
            </span>
          </p>

          <div className="syn-dual">
            <section className="syn-panel">
              <h2>八字 · 四柱</h2>
              {dayMaster && (
                <p style={{ fontSize: 12, opacity: .7, margin: '0 0 8px' }}>
                  日主 {dayMaster.gan}（{dayMaster.element}·{dayMaster.yinYang}）
                </p>
              )}
              {baziPillars && (
                <div className="syn-pillars">
                  {PILLAR_LABELS.map(({ key, label }) => (
                    <div className={`syn-pillar${key === 'day' ? ' syn-pillar--day' : ''}`} key={key}>
                      <div className="syn-pillar__label">{label}</div>
                      <div className="syn-pillar__gz">{baziPillars[key].ganZhi}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="syn-panel">
              <h2>紫微 · 十二宫（本命）</h2>
              <div className="syn-zgrid">
                {originPalaces.map((palace) => {
                  const pos = BRANCH_GRID[palace.earthly_branch];
                  if (!pos) return null;
                  const major = palace.major_stars.map((s) => s.name).join('、');
                  const muts = Array.from(
                    new Set(
                      palace.major_stars
                        .filter((s) => s.birth_mutagen)
                        .map((s) => `${s.name}化${s.birth_mutagen}`),
                    ),
                  ).join(' ');
                  return (
                    <div
                      className="syn-pal"
                      key={palace.index}
                      style={{ gridRow: pos[0] + 1, gridColumn: pos[1] + 1 }}
                    >
                      <div className="syn-pal__name">
                        {palace.name}
                        {palace.is_body_palace ? '·身' : ''}
                        {palace.empty_state ? '·空' : ''}
                      </div>
                      <div className="syn-pal__stem">
                        {palace.heavenly_stem}
                        {palace.earthly_branch}
                      </div>
                      <div className="syn-pal__stars">{major || '无主星'}</div>
                      {muts && <div className="syn-pal__mut">{muts}</div>}
                    </div>
                  );
                })}
                <div className="syn-center" style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}>
                  {basicInfo ? (
                    <>
                      <div>
                        {basicInfo.gender} ｜ 公历 {basicInfo.solar_date}
                      </div>
                      <div>农历 {basicInfo.lunar_date}</div>
                      <div>生肖 {basicInfo.zodiac} ｜ {basicInfo.five_elements_class}</div>
                      <div>
                        命宫 {basicInfo.soul_palace_branch} ｜ 身宫 {basicInfo.body_palace_branch}
                      </div>
                    </>
                  ) : (
                    '基本信息'
                  )}
                </div>
              </div>
            </section>
          </div>

          <section className="syn-panel">
            <h2>证据条数对比</h2>
            <div className="syn-counts" role="img" aria-label="八字与紫微证据条数对比">
              <div
                className="syn-counts__bazi"
                style={{ width: `${(result.synthesis.evidenceCount.bazi / evidenceTotal) * 100}%` }}
              />
              <div
                className="syn-counts__ziwei"
                style={{ width: `${(result.synthesis.evidenceCount.ziwei / evidenceTotal) * 100}%` }}
              />
            </div>
            <p style={{ fontSize: 12, opacity: .7, margin: 0 }}>
              八字证据 {result.synthesis.evidenceCount.bazi} 条 ｜ 紫微证据{' '}
              {result.synthesis.evidenceCount.ziwei} 条
            </p>
            {result.synthesis.missingFacts.length > 0 && (
              <div className="syn-chips" style={{ marginTop: 8 }}>
                {result.synthesis.missingFacts.map((m) => (
                  <span className="syn-chip" key={m}>
                    {m}
                  </span>
                ))}
              </div>
            )}
          </section>

          <div className="syn-tabs" role="tablist" aria-label="合参主题">
            {themes.map((theme, i) => (
              <button
                key={theme.id}
                type="button"
                role="tab"
                aria-selected={activeTheme === i}
                className={`syn-tab${activeTheme === i ? ' is-active' : ''}`}
                onClick={() => setActiveTheme(i)}
              >
                {theme.label}
              </button>
            ))}
          </div>

          {currentTheme && (
            <section className="syn-panel">
              <h2>{currentTheme.label}</h2>
              <p style={{ fontSize: 13, opacity: .75, margin: '0 0 12px' }}>{currentTheme.focus}</p>
              <div className="syn-compare">
                <div className="syn-col syn-col--bazi">
                  <h3>八字资料（{currentTheme.baziEvidence.length}）</h3>
                  {currentTheme.baziEvidence.length === 0 && (
                    <p style={{ fontSize: 13, opacity: .6 }}>本主题八字资料未提供。</p>
                  )}
                  {currentTheme.baziEvidence.map((fact) => (
                    <div className="syn-fact" key={fact.key}>
                      <div className="syn-fact__title">{fact.title}</div>
                      <div>{fact.detail}</div>
                    </div>
                  ))}
                </div>
                <div className="syn-col syn-col--ziwei">
                  <h3>紫微资料（{currentTheme.ziweiEvidence.length}）</h3>
                  {currentTheme.ziweiEvidence.length === 0 && (
                    <p style={{ fontSize: 13, opacity: .6 }}>本主题紫微资料未提供。</p>
                  )}
                  {currentTheme.ziweiEvidence.map((fact) => (
                    <div className="syn-fact" key={fact.key}>
                      <div className="syn-fact__title">{fact.title}</div>
                      <div>{fact.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="syn-panel" style={{ marginTop: 16 }}>
            <h2>合参方法说明</h2>
            <ul className="syn-method">
              {result.synthesis.methodology.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      <p className="syn-note">
        八字与紫微为两套传统命理模型，本页仅并列其结构化资料供文化对照与娱乐参考，不压缩为分数或概率，
        不构成医疗、法律、金融等任何决策建议。跨体系冲突/协同结论（conflicts/synergies）为后续能力，引擎未输出时本页不展示。
      </p>
      <PrivacyHint />
    </main>
  );
}

export default SynthesisPage;
