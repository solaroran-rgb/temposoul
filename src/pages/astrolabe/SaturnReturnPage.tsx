// 任务包 10.2 · 土星回归专题：29 岁 / 58 岁两次回归 + 共同课题
// 内容定位：西方占星的成长叙事框架，用于自我梳理与规划反思，非命运断言。
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackPageView, trackEvent } from '@/lib/analytics';
import './saturn-return.css';

type ReturnStage = {
  age: string;
  title: string;
  theme: string;
  advice: string[];
};

const RETURNS: ReturnStage[] = [
  {
    age: '第一次回归 · 约 29 岁',
    title: '从「别人期待的我」到「我自己选的我」',
    theme:
      '土星绕黄道一周回到出生时的位置，常见于 28–30 岁。这一阶段的典型体验是：过去几年勉强维系的职业、关系或生活方式开始感到「不合身」——不是失败，而是尺码变了。压力集中在：责任归属、长期承诺、舍弃成本。',
    advice: [
      '把「我必须」清单和「我选择」清单分开写，只对后者投入',
      '给正在拖延的那个重大决定设一个截止日，哪怕结论是「维持现状」',
      '允许自己结束已经过季的承诺——这是本阶段的功课，不是失败',
    ],
  },
  {
    age: '第二次回归 · 约 58 岁',
    title: '从「我建成了什么」到「我想留下什么」',
    theme:
      '约 57–60 岁的第二次回归，主题从「确立」转向「整合与传承」。常见课题：角色转变（职场淡出、家庭角色重排）、身体节奏变化带来的优先级重估、以及把经验转化为可传递的东西——带人、写作、公益，都是同一种动作。',
    advice: [
      '列出你想「传下去」的三样东西：技能、关系、或一句话',
      '给健康与精力做一次诚实的盘点，按现状而非十年前的状态排日程',
      '把「还想试一次」的事写下来，挑最小的一件，今年就启动',
    ],
  },
];

const COMMON_TASKS = [
  {
    title: '责任的真实结算',
    body: '两次回归共同的第一课题：分清哪些责任是你的，哪些是你替别人背的。回归期常以「不得不承担」的形式出现，但真正的功课是把责任收归自己——承认选择权在你手里。',
  },
  {
    title: '结构与边界的重建',
    body: '土星与「骨架」有关。回归期适合重排生活的承重结构：作息、财务底盘、核心关系。结构搭对了，压力会变成支撑；结构错了，同样的压力会反复压垮你。',
  },
  {
    title: '时间的严肃化',
    body: '回归提醒你时间有限且在加速。共同动作是：把「等以后」清单摊开，逐条判断——现在做、明确放弃、或降级为小步试点。悬而不决最耗人。',
  },
];

function ageToReturnWindow(age: number): string {
  if (age >= 27 && age <= 31) return '你正处于第一次土星回归的窗口期（约 27–31 岁）。';
  if (age >= 56 && age <= 61) return '你正处于第二次土星回归的窗口期（约 56–61 岁）。';
  if (age < 27) return `距离你的第一次土星回归窗口（27–31 岁）还有约 ${27 - age} 年，可以先熟悉这套成长框架。`;
  if (age < 56) return `两次回归窗口之间（31–56 岁），土星的功课以「维持与修正」为主。`;
  return `已过第二次回归窗口，这一框架可用于回望与帮后来人梳理。`;
}

export default function SaturnReturnPage() {
  useEffect(() => {
    trackPageView('/astrolabe/saturn-return');
    trackEvent('saturn_return_view', {});
  }, []);

  const thisYear = new Date().getFullYear();
  const birthYearParam = new URLSearchParams(window.location.search).get('birthYear');
  const birthYear = birthYearParam ? Number(birthYearParam) : null;
  const age = birthYear && birthYear > 1900 && birthYear <= thisYear ? thisYear - birthYear : null;

  return (
    <div className="saturn-return-page">
      <header className="saturn-return-page__hero">
        <h1 className="saturn-return-page__title">土星回归</h1>
        <p className="saturn-return-page__subtitle">
          每 29.5 年，土星回到你出生时的位置。人生两次大的「结构检修」，一次约 29 岁，一次约 58 岁。
        </p>
      </header>

      {age !== null && (
        <p className="saturn-return-page__age-note">
          以出生年 {birthYear} 估算，今年约 {age} 岁。{ageToReturnWindow(age)}
        </p>
      )}

      <section className="saturn-return-page__what" aria-label="什么是土星回归">
        <h2 className="saturn-return-page__section-title">它是什么</h2>
        <p>
          土星公转周期约 29.5 年。在西方占星的叙事里，「土星回归」指行运土星回到本命盘土星位置的阶段，
          传统上被视作成人礼式的转折期：旧结构承压、新秩序成型。它常伴随明显的疲惫与动摇——
          但事后回看，多数人把这几次动荡标记为人生真正定型的节点。
        </p>
      </section>

      <section className="saturn-return-page__returns" aria-label="两次回归">
        <h2 className="saturn-return-page__section-title">两次回归</h2>
        {RETURNS.map((r) => (
          <article key={r.age} className="saturn-return-page__stage">
            <h3>{r.age}</h3>
            <p className="saturn-return-page__stage-title">{r.title}</p>
            <p className="saturn-return-page__stage-theme">{r.theme}</p>
            <ul>
              {r.advice.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="saturn-return-page__common" aria-label="共同课题">
        <h2 className="saturn-return-page__section-title">两次回归的共同课题</h2>
        {COMMON_TASKS.map((c) => (
          <article key={c.title} className="saturn-return-page__task">
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </article>
        ))}
      </section>

      <nav className="saturn-return-page__related" aria-label="相关链接">
        <Link to="/astrolabe/moon-phase">← 月相盘</Link>
        <Link to="/quiz/western">做个趣味测验，看看你的星盘原型 →</Link>
        <Link to="/astrolabe/natal">直接排本命盘 →</Link>
      </nav>

      <p className="saturn-return-page__disclaimer">
        说明：「土星回归」是西方占星传统中的成长叙事框架，用于自我梳理与规划反思，
        不构成任何命运断言、医疗或心理建议。重大人生决策请基于实际情况并咨询专业人士。
      </p>
    </div>
  );
}
