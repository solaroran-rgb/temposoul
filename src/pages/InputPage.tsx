import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SegmentedControl } from '@/components/SegmentedControl';
import { PrivacyHint } from '@/components/PrivacyHint';
import { TrustBanner } from '@/components/TrustEngine/TrustBanner';
import { getPersonReferenceLabel, type PersonRole } from '@/lib/input-labels';
import { upsertCompatibilityHistory, upsertPersonalHistory } from '@/lib/history-records';
import {
  buildResultSearch,
  defaultInputState,
  defaultPromptState,
  type QueryInputState,
} from '@/lib/query-state';
import { clampNumericField, validateBirthInput } from '@/lib/input-validation';
import { useBirthPlace } from '@/hooks/useBirthPlace';
import { BirthPlaceModal } from './InputPage.BirthPlaceModal';
import { PersonForm } from './InputPage.PersonForm';
import { getFieldKey, type SELF_FIELD_MAP } from './InputPage.field-helpers';
import { AiSettingsModal } from '@/components/AiSettingsModal';
import { useAiSettings } from '@/hooks/useAiSettings';
import { EmailCapture } from '@/components/EmailCapture';
import { trackChartSubmit } from '@/lib/analytics';
import DailyRhythmCard from '@/components/DailyRhythmCard';
import AlmanacShareCard from '@/components/AlmanacShareCard';
import { AlmanacCard } from '@/components/almanac/AlmanacCard';
import { RhythmCard } from '@/components/fortune/RhythmCard';
import { HomeShortcuts } from '@/components/home/HomeShortcuts';
import { DualEntryGate } from '@/components/home/DualEntryGate';
import { StarfieldBackground } from '@/components/StarfieldBackground';
import { SeoHead } from '@/components/SeoHead';
import { FeatureHighlights } from './InputPage.FeatureHighlights';
import { SubmitProgress } from './InputPage.SubmitProgress';
import { useAlmanacData } from '@/hooks/useAlmanacData';
import { useProfiles } from '@/contexts/ProfilesContext';
import {
  formatProfileSummary,
  hasCompleteBirthData,
  inputStateToProfile,
  profileToInputState,
} from '@/lib/user-profile';

type InputEntryMode = 'single' | 'compatibility' | 'divination' | 'almanac';

const DONATION_URL = 'https://lk.sydf.cc/';
const isDonationBoxEnabled = import.meta.env.VITE_ENABLE_DONATION_BOX === 'true';

const LazyDivinationPanel = lazy(async () => {
  const module = await import('@/components/DivinationPanel');
  return { default: module.DivinationPanel };
});

export function InputPage() {
  const navigate = useNavigate();
  const [, startSubmitTransition] = useTransition();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState<QueryInputState>(defaultInputState);
  const [entryMode, setEntryMode] = useState<InputEntryMode>('single');
  const [error, setError] = useState('');
  const [aiSettings, setAiSettings] = useAiSettings();
  const [isAiSettingsModalOpen, setIsAiSettingsModalOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const tutorialEntryRef = useRef<HTMLDivElement | null>(null);
  const [tutorialEntryPinned, setTutorialEntryPinned] = useState(false);
  const [bottomToolsHeight, setBottomToolsHeight] = useState(0);
  // 8.1 排盘加载科学性展示：提交后、跳转结果页前的步骤指示器。
  const [submitBusy, setSubmitBusy] = useState(false);

  // H02 · 档案一次录入：档案系统接入（自动预填 + 提交自动保存）
  const { currentProfile, add, update, setCurrent } = useProfiles();
  const didAutoFillProfileRef = useRef(false);

  const birthPlace = useBirthPlace({ form, setForm });

  // B4 挂载：今日节律卡 + 黄历分享卡（专家 B 交付）
  const { data: almanacData } = useAlmanacData();

  // P1-2 Trust Engine: 输入页横幅判定用——表单是否已填入任一实质字段。
  const inputHasContent =
    form.year.trim() !== '' ||
    form.month.trim() !== '' ||
    form.day.trim() !== '' ||
    form.timeIndex !== '';

  useEffect(() => {
    const nextEntryMode =
      searchParams.get('mode') === 'compatibility'
        ? 'compatibility'
        : searchParams.get('mode') === 'divination'
          ? 'divination'
          : searchParams.get('mode') === 'almanac'
            ? 'almanac'
            : 'single';
    setEntryMode(nextEntryMode);

    if (nextEntryMode === 'divination' || nextEntryMode === 'almanac') {
      return;
    }

    setForm((current) => {
      const nextAnalysisMode = nextEntryMode === 'compatibility' ? 'compatibility' : 'single';
      return current.analysisMode === nextAnalysisMode
        ? current
        : {
            ...current,
            analysisMode: nextAnalysisMode,
            chartType: 'bazi',
          };
    });
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      upsertPersonalHistory(form);
    }, 500);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.name,
    form.gender,
    form.dateType,
    form.year,
    form.month,
    form.day,
    form.timeIndex,
    form.isLeapMonth,
    form.useTrueSolarTime,
    form.birthHour,
    form.birthMinute,
    form.birthPlace,
    form.birthLongitude,
    form.birthLatitude,
  ]);

  // H02 · 档案一次录入：进入输入页自动复用当前档案。
  // 仅当表单尚未填写任何生辰字段时预填（didAutoFillProfileRef 保证只生效一次，
  // 且不覆盖用户正在编辑的内容）。
  useEffect(() => {
    if (didAutoFillProfileRef.current) {
      return;
    }
    if (!currentProfile) {
      return;
    }
    if (form.year !== '' || form.month !== '' || form.day !== '') {
      return;
    }
    didAutoFillProfileRef.current = true;
    setForm((current) => ({ ...current, ...profileToInputState(currentProfile) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  useEffect(() => {
    if (form.analysisMode !== 'compatibility') {
      return;
    }

    const timer = window.setTimeout(() => {
      upsertCompatibilityHistory(form);
    }, 500);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.analysisMode,
    form.name,
    form.gender,
    form.dateType,
    form.year,
    form.month,
    form.day,
    form.timeIndex,
    form.isLeapMonth,
    form.useTrueSolarTime,
    form.birthHour,
    form.birthMinute,
    form.birthPlace,
    form.birthLongitude,
    form.birthLatitude,
    form.partnerName,
    form.partnerGender,
    form.partnerDateType,
    form.partnerYear,
    form.partnerMonth,
    form.partnerDay,
    form.partnerTimeIndex,
    form.partnerIsLeapMonth,
    form.partnerUseTrueSolarTime,
    form.partnerBirthHour,
    form.partnerBirthMinute,
    form.partnerBirthPlace,
    form.partnerBirthLongitude,
    form.partnerBirthLatitude,
  ]);

  useEffect(() => {
    const mainContentNode = mainContentRef.current;
    const tutorialEntryNode = tutorialEntryRef.current;
    if (!mainContentNode || !tutorialEntryNode) {
      return;
    }

    let frameId = 0;

    function updateTutorialEntryMode() {
      frameId = 0;
      if (!mainContentNode || !tutorialEntryNode) {
        return;
      }
      const mainContentHeight = mainContentNode.getBoundingClientRect().height;
      const tutorialEntryHeight = tutorialEntryNode.getBoundingClientRect().height;
      setBottomToolsHeight((current) =>
        current === Math.ceil(tutorialEntryHeight) ? current : Math.ceil(tutorialEntryHeight),
      );
      const shouldPin = mainContentHeight + tutorialEntryHeight + 56 <= window.innerHeight;
      setTutorialEntryPinned((current) => (current === shouldPin ? current : shouldPin));
    }

    function scheduleUpdate() {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(updateTutorialEntryMode);
    }

    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate);

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.removeEventListener('resize', scheduleUpdate);
        if (frameId) {
          window.cancelAnimationFrame(frameId);
        }
      };
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(mainContentNode);
    resizeObserver.observe(tutorialEntryNode);

    return () => {
      window.removeEventListener('resize', scheduleUpdate);
      resizeObserver.disconnect();
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [entryMode]);

  function updateField<K extends keyof QueryInputState>(key: K, value: QueryInputState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updatePersonField(
    role: PersonRole,
    key: keyof typeof SELF_FIELD_MAP,
    value: QueryInputState[keyof QueryInputState],
  ) {
    const fieldKey = getFieldKey(role, key) as keyof QueryInputState;
    updateField(fieldKey, value as QueryInputState[keyof QueryInputState]);
  }

  function updateNumericField(
    role: PersonRole,
    key: 'year' | 'month' | 'day' | 'birthHour' | 'birthMinute',
    value: string,
  ) {
    if (value === '' || /^\d*$/.test(value)) {
      updatePersonField(role, key, clampNumericField(key, value));
    }
  }

  // H02 · 档案一次录入：提交排盘时自动保存/更新档案，保证"一次录入、自动复用"。
  // 语义：名称未变（或未填写）→ 更新当前档案；无档案或名称变更（视为新的人）→ 新建并设为当前。
  function saveProfileFromForm() {
    if (!hasCompleteBirthData(form)) {
      return;
    }
    const name = form.name.trim();
    if (currentProfile && (!name || name === currentProfile.name)) {
      update({ ...inputStateToProfile(form, currentProfile), id: currentProfile.id });
      return;
    }
    const created = add({
      ...inputStateToProfile(form),
      isDefault: currentProfile ? false : true,
    });
    if (created) {
      setCurrent(created.id);
    }
  }

  function handleSubmit() {
    setError('');
    const selfLabel = getPersonReferenceLabel(form.analysisMode, 'self');

    if (!form.year || !form.month || !form.day) {
      setError(`请填写完整的${selfLabel}信息`);
      return;
    }

    if (!form.useTrueSolarTime && form.timeIndex === '') {
      setError(`请选择${selfLabel}的出生时辰`);
      return;
    }

    if (form.useTrueSolarTime && (form.birthHour === '' || form.birthMinute === '')) {
      setError(`请填写${selfLabel}的精准出生时间`);
      return;
    }

    if (form.useTrueSolarTime && (!form.birthPlace.trim() || !form.birthLongitude.trim())) {
      setError(`请先为${selfLabel}选择出生地`);
      return;
    }

    const selfCheck = validateBirthInput(
      {
        year: form.year,
        month: form.month,
        day: form.day,
        dateType: form.dateType,
        useTrueSolarTime: form.useTrueSolarTime,
        birthHour: form.birthHour,
        birthMinute: form.birthMinute,
        birthLongitude: form.birthLongitude,
      },
      selfLabel,
    );
    if (!selfCheck.ok) {
      setError(selfCheck.message);
      return;
    }

    if (form.analysisMode === 'compatibility') {
      if (!form.partnerYear || !form.partnerMonth || !form.partnerDay) {
        setError('请填写完整的第二人信息');
        return;
      }

      if (!form.partnerUseTrueSolarTime && form.partnerTimeIndex === '') {
        setError('请选择第二人的出生时辰');
        return;
      }

      if (
        form.partnerUseTrueSolarTime &&
        (form.partnerBirthHour === '' || form.partnerBirthMinute === '')
      ) {
        setError('请填写第二人的精准出生时间');
        return;
      }

      if (
        form.partnerUseTrueSolarTime &&
        (!form.partnerBirthPlace.trim() || !form.partnerBirthLongitude.trim())
      ) {
        setError('请先为第二人选择出生地');
        return;
      }

      const partnerCheck = validateBirthInput(
        {
          year: form.partnerYear,
          month: form.partnerMonth,
          day: form.partnerDay,
          dateType: form.partnerDateType,
          useTrueSolarTime: form.partnerUseTrueSolarTime,
          birthHour: form.partnerBirthHour,
          birthMinute: form.partnerBirthMinute,
          birthLongitude: form.partnerBirthLongitude,
        },
        '第二人',
      );
      if (!partnerCheck.ok) {
        setError(partnerCheck.message);
        return;
      }
    }

    // H02 · 档案一次录入：所有校验通过后自动保存/更新档案，保证"一次录入、自动复用"
    saveProfileFromForm();

    // T0 漏斗：排盘提交（所有校验通过、即将跳转结果页）
    trackChartSubmit({ mode: form.analysisMode, trueSolarTime: form.useTrueSolarTime });

    // 8.1 排盘加载科学性展示：先展示有序步骤指示器，步骤走完再跳转结果页。
    setSubmitBusy(true);
  }

  // 真正跳转结果页（由 SubmitProgress 步骤走完后回调触发）。
  function runResultNavigation() {
    startSubmitTransition(() => {
      navigate({
        pathname: '/result',
        search: `?${buildResultSearch(form, {
          ...defaultPromptState,
          tab: 'bazi',
          promptSource: 'bazi',
          baziShortcutMode:
            form.analysisMode === 'compatibility' ? '合婚' : defaultPromptState.baziShortcutMode,
          baziPresetId:
            form.analysisMode === 'compatibility'
              ? 'ai-compat-marriage'
              : defaultPromptState.baziPresetId,
        })}`,
      });
    });
  }

  function updateBirthTime(role: PersonRole, value: string) {
    if (!value) {
      updatePersonField(role, 'birthHour', '');
      updatePersonField(role, 'birthMinute', '');
      return;
    }

    const [hour, minute] = value.split(':');
    updatePersonField(role, 'birthHour', hour);
    updatePersonField(role, 'birthMinute', minute);
  }

  function updateEntryMode(value: InputEntryMode) {
    setEntryMode(value);

    if (value === 'single' || value === 'compatibility') {
      updateField('analysisMode', value);
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('mode', value);
    if (value !== 'single') {
      nextSearchParams.delete('chart');
    }
    setSearchParams(nextSearchParams, { replace: true });
  }

  const divinationPanelFallback = (
    <div className="divination-panel-shell input-mode-loading" aria-hidden="true">
      <section className="person-section divination-form-card input-mode-loading-card">
        <div className="person-section-head input-mode-loading-head">
          <span className="skeleton-block input-mode-loading-title" />
          <span className="skeleton-block input-mode-loading-line" />
        </div>
        <div className="input-mode-loading-methods">
          {Array.from({ length: 8 }, (_, index) => (
            <span className="skeleton-block input-mode-loading-method" key={`method-${index}`} />
          ))}
        </div>
        <span className="skeleton-block input-mode-loading-textarea" />
        <div className="input-mode-loading-controls">
          <span className="skeleton-block input-mode-loading-control" />
          <span className="skeleton-block input-mode-loading-control" />
          <span className="skeleton-block input-mode-loading-chip" />
        </div>
        <div className="input-mode-loading-meta">
          <span className="skeleton-block input-mode-loading-field" />
          <span className="skeleton-block input-mode-loading-field" />
        </div>
      </section>
      <div className="form-actions page-submit-actions" aria-hidden="true">
        <span className="skeleton-block input-mode-loading-action" />
        <span className="skeleton-block input-mode-loading-action" />
      </div>
    </div>
  );

  return (
    <div
      className={`page-shell input-page-shell ${tutorialEntryPinned ? 'has-floating-tutorial-entry' : ''}`}
      style={{ '--input-bottom-tools-height': `${bottomToolsHeight}px` } as CSSProperties}
    >
      <SeoHead
        title="命律 TempoSoul · 八字排盘与命理分析"
        description="免费在线八字排盘、紫微斗数、西洋星盘与每日运势，输入出生信息即可获得 AI 深度命理解读。"
      />
      <div className="bazi-view-container">
        <div className="input-page-main-content" ref={mainContentRef}>
          <PrivacyHint />
          {/* P1-2 Trust Engine: 输入页挂载 — 覆盖 T0/T3（空表单）/ T5（已填）/ T4（占卜·择日）。 */}
          <TrustBanner inputMode={entryMode} inputHasContent={inputHasContent} />

          {/* H02 · 档案一次录入：当前档案快捷条（自动复用 + 管理入口） */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              maxWidth: 600,
              margin: '0 auto 14px',
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15,23,42,0.45)',
              fontSize: 13,
              color: '#94a3b8',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 600, color: '#cbd5e1' }}>个人档案</span>
            {currentProfile ? (
              <span style={{ flex: '1 1 auto', minWidth: 160 }}>
                {currentProfile.name}
                <span style={{ color: '#64748b' }}>
                  （{formatProfileSummary(currentProfile)}）
                </span>
                <span style={{ color: '#64748b' }}> · 已自动带入</span>
              </span>
            ) : (
              <span style={{ flex: '1 1 auto', minWidth: 160, color: '#64748b' }}>
                首次排盘将自动保存为档案，下次自动复用
              </span>
            )}
            <button
              type="button"
              className="top-ai-settings-icon-button"
              onClick={() => navigate('/profile')}
              style={{
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 12,
                whiteSpace: 'nowrap',
              }}
              aria-label="管理档案"
              title="管理档案"
            >
              管理档案
            </button>
          </div>

          <div className="analysis-mode-strip">
            <div className="top-switch-control">
              <SegmentedControl
                value={entryMode}
                options={[
                  { label: '排盘', value: 'single' as const },
                  { label: '合盘', value: 'compatibility' as const },
                  { label: '占卜', value: 'divination' as const },
                  { label: '择日', value: 'almanac' as const },
                ]}
                onChange={updateEntryMode}
              />
              <button
                type="button"
                className="top-ai-settings-icon-button"
                onClick={() => setIsAiSettingsModalOpen(true)}
                aria-label="AI 设置"
                title="AI 设置"
              >
                <span aria-hidden="true">⚙</span>
              </button>
            </div>
          </div>

          {almanacData && (
            <section
              className="input-page__almanac-section"
              style={{ marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}
            >
              <DailyRhythmCard />
              <AlmanacShareCard data={almanacData} />
              {/* 批1 R3 接线：1.2 今日黄历卡 / 1.3 节律卡（B'11 新版） */}
              <AlmanacCard />
              <RhythmCard />
            </section>
          )}

          {/* 7.1 情绪增长：星空情感锚点（首页默认星空背景 + 情绪文案） */}
          <section
            className="sky-emotion-hero"
            style={{
              textAlign: 'center',
              padding: '18px 12px 14px',
              marginBottom: 16,
              background: 'linear-gradient(180deg, rgba(10,14,26,0) 0%, rgba(15,23,42,0.55) 100%)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <StarfieldBackground />
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, letterSpacing: '0.03em' }}>
              ☽ 这是你出生时的真太阳时星空
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              每一颗星星，都是那一刻宇宙给你的第一份礼物
            </div>
          </section>

          {/* F03 · 首页双分流门：先选普通 / 专业入口，再进入下方排盘区 */}
          <DualEntryGate />

          <HomeShortcuts />

          {/* 7.2 十二项特色功能清单：每个排盘项目一句"本项特色" */}
          <FeatureHighlights />

          <div className="analysis-view">
            {entryMode === 'divination' || entryMode === 'almanac' ? (
              <Suspense fallback={divinationPanelFallback}>
                <LazyDivinationPanel
                  initialMethod={entryMode === 'almanac' ? 'almanac' : undefined}
                  lockedMethod={entryMode === 'almanac' ? 'almanac' : undefined}
                />
              </Suspense>
            ) : (
              <div className="form-wrapper">
                <>
                  <PersonForm
                    role="self"
                    form={form}
                    updatePersonField={updatePersonField}
                    updateNumericField={updateNumericField}
                    updateBirthTime={updateBirthTime}
                    openBirthPlaceModal={birthPlace.openBirthPlaceModal}
                    historyHint={
                      form.analysisMode === 'single'
                        ? '填写一份个人信息，自动生成八字、紫微和住宅风水入口；填写精准时间与出生地后，同时生成星盘和七政四余。'
                        : undefined
                    }
                  />
                  {entryMode === 'compatibility' ? (
                    <PersonForm
                      role="partner"
                      form={form}
                      updatePersonField={updatePersonField}
                      updateNumericField={updateNumericField}
                      updateBirthTime={updateBirthTime}
                      openBirthPlaceModal={birthPlace.openBirthPlaceModal}
                    />
                  ) : null}

                  {error ? (
                    <div className="form-error-text global-form-error" role="alert" aria-live="polite">
                      {error}
                    </div>
                  ) : null}

                  <div
                    className="form-actions page-submit-actions"
                    style={{
                      width: '100%',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      justifyItems: 'stretch',
                    }}
                  >
                    <button
                      className="secondary-page-button"
                      type="button"
                      style={{ width: '100%' }}
                      onClick={() =>
                        navigate(
                          `/records?tab=${entryMode === 'compatibility' ? 'compatibility' : 'personal'}`,
                        )
                      }
                    >
                      历史记录
                    </button>
                    <button
                      className="primary-button start-submit-button"
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitBusy}
                      style={{ width: '100%' }}
                    >
                      开始排盘
                    </button>
                  </div>
                </>
              </div>
            )}
          </div>
        </div>

        <div
          className={`input-page-bottom-tools ${tutorialEntryPinned ? 'is-floating' : 'is-inline'}`}
          ref={tutorialEntryRef}
        >
          {isDonationBoxEnabled ? (
            <div className="donation-entry-strip">
              <a
                className="donation-entry-button"
                href={DONATION_URL}
                target="_blank"
                rel="noreferrer"
              >
                <span className="donation-entry-title">功德箱</span>
                <span className="donation-entry-note">支持项目继续维护</span>
              </a>
            </div>
          ) : null}
          <div className="tutorial-entry-card">
            <div className="tutorial-entry-copy">
              <strong>第一次使用？先看教程</strong>
              <p>里面会说明不同模式分别怎么用，以及从录入到查看结果的完整步骤。</p>
            </div>
            <div className="tutorial-entry-actions">
              <button
                type="button"
                className="tutorial-entry-button"
                onClick={() => navigate('/tutorial')}
              >
                查看教程
              </button>
            </div>
          </div>
        </div>

        <div style={{ margin: '28px auto 40px', maxWidth: 420, padding: '0 16px' }}>
          <EmailCapture source="home" />
        </div>
      </div>

      {birthPlace.isBirthPlaceModalOpen ? <BirthPlaceModal birthPlace={birthPlace} /> : null}
      {isAiSettingsModalOpen ? (
        <AiSettingsModal
          settings={aiSettings}
          onApply={setAiSettings}
          onClose={() => setIsAiSettingsModalOpen(false)}
        />
      ) : null}
      {submitBusy ? <SubmitProgress onDone={runResultNavigation} /> : null}
    </div>
  );
}
