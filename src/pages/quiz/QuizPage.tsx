// 任务包 10.3 · 测验漏斗：趣味测试 5 题 → 结果原型 → 引导排盘
// 定位：轻量娱乐化获客漏斗，结果为四类「星盘气质原型」，最终引导至本命盘排盘。
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackPageView, trackEvent } from '@/lib/analytics';
import './quiz.css';

type Choice = { text: string; score: Partial<Record<ProtoKey, number>> };
type QuizQuestion = { q: string; choices: Choice[] };
type ProtoKey = 'pioneer' | 'builder' | 'connector' | 'seeker';

type ProtoInfo = {
  key: ProtoKey;
  name: string;
  emoji: string;
  headline: string;
  body: string;
  chartHint: string;
};

const QUESTIONS: QuizQuestion[] = [
  {
    q: '周末多出来一个完整的白天，你第一反应是？',
    choices: [
      { text: '终于能干那件想了很久的事，说走就走', score: { pioneer: 2 } },
      { text: '把手头积压的事整理清楚，踏实', score: { builder: 2 } },
      { text: '约人，聊聊最近的见闻和八卦', score: { connector: 2 } },
      { text: '留给自己，看书 / 发呆 / 研究个冷知识', score: { seeker: 2 } },
    ],
  },
  {
    q: '在一个新环境里，你通常会先做什么？',
    choices: [
      { text: '直接开干，规矩边干边看', score: { pioneer: 2 } },
      { text: '先搞清楚这里的规则和边界', score: { builder: 2 } },
      { text: '先认识一两个关键的人', score: { connector: 2 } },
      { text: '先观察，在脑子里搭一个全景图', score: { seeker: 2 } },
    ],
  },
  {
    q: '你更容易被哪类问题困住？',
    choices: [
      { text: '冲太快，之后才发现路不对', score: { pioneer: 2 } },
      { text: '太稳了，机会溜走了才反应过来', score: { builder: 2 } },
      { text: '心太软，别人的事总排在前面', score: { connector: 2 } },
      { text: '想得太远，反而迟迟不动手', score: { seeker: 2 } },
    ],
  },
  {
    q: '朋友形容你，最像哪一句？',
    choices: [
      { text: '点火就着，永远在路上', score: { pioneer: 2 } },
      { text: '靠得住，说到做到', score: { builder: 2 } },
      { text: '圈子里的黏合剂', score: { connector: 2 } },
      { text: '脑子里总装着些别的东西', score: { seeker: 2 } },
    ],
  },
  {
    q: '对「了解自己」这件事，你更想从哪切入？',
    choices: [
      { text: '我的行动力和爆发力藏在哪', score: { pioneer: 2, seeker: 1 } },
      { text: '我的长处怎么落成实在的成果', score: { builder: 2 } },
      { text: '我的关系模式为什么总是这样', score: { connector: 2 } },
      { text: '我真正的方向感来自哪里', score: { seeker: 2 } },
    ],
  },
];

const PROTOS: ProtoInfo[] = [
  {
    key: 'pioneer',
    name: '先锋开拓者',
    emoji: '🔥',
    headline: '火象气质 · 行动先于规划',
    body:
      '你的能量模式偏「点火」：看到方向就先动起来，速度是你的天赋，但也容易在岔路口烧掉自己。你的星盘里，行动、竞争与开创的通道值得认真看一眼——它既解释你的爆发力，也解释你为什么总觉得「慢下来等于死」。',
    chartHint: '在你的本命盘里，重点看行动与开创轴线如何分布。',
  },
  {
    key: 'builder',
    name: '垒土筑基者',
    emoji: '⛰️',
    headline: '土象气质 · 稳定即力量',
    body:
      '你的能量模式偏「垒砌」：把事做成、把承诺兑现，是你的自尊来源。但也容易因为求稳而错过窗口期。你的星盘里，关于结构、积累与长期价值的通道是你的底盘，值得看清它的真实形状。',
    chartHint: '在你的本命盘里，重点看结构与积累轴线如何分布。',
  },
  {
    key: 'connector',
    name: '织网连结者',
    emoji: '🌊',
    headline: '水象/风象气质 · 关系即世界',
    body:
      '你的能量模式偏「连结」：你靠关系感知世界，也靠关系定义自己。共情是你的天赋，边界是你的功课。你的星盘里，关于亲密、合作与情绪流动的通道最值得看——它解释你为什么心软，也解释你为什么强大。',
    chartHint: '在你的本命盘里，重点看关系与情绪轴线如何分布。',
  },
  {
    key: 'seeker',
    name: '观星寻路者',
    emoji: '🔭',
    headline: '风象气质 · 意义先于行动',
    body:
      '你的能量模式偏「寻路」：你要先看清「为什么」，才肯交出行动力。视野是你的天赋，悬置是你的风险。你的星盘里，关于方向感与信念系统的通道是你的主轴，值得认真排一次看全貌。',
    chartHint: '在你的本命盘里，重点看方向与信念轴线如何分布。',
  },
];

const RESULT_TITLE = '你的星盘气质原型';

export default function QuizPage() {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1 = 题目；QUESTIONS.length = 结果
  const [scores, setScores] = useState<Record<ProtoKey, number>>({
    pioneer: 0,
    builder: 0,
    connector: 0,
    seeker: 0,
  });

  useEffect(() => {
    trackPageView('/quiz/western');
  }, []);

  const pick = useCallback(
    (choice: Choice) => {
      setScores((prev) => {
        const next = { ...prev };
        for (const [k, v] of Object.entries(choice.score)) {
          next[k as ProtoKey] += v ?? 0;
        }
        return next;
      });
      trackEvent('quiz_answer', { step });
      setStep((s) => s + 1);
    },
    [step],
  );

  const winner = useMemo<ProtoInfo>(() => {
    const entries = Object.entries(scores) as [ProtoKey, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const top = entries[0][1];
    // 平分时按固定优先级取第一个，保证结果确定性
    return PROTOS.find((p) => scores[p.key] === top) ?? PROTOS[0];
  }, [scores]);

  const total = QUESTIONS.length;
  const inQuiz = step < total;
  const done = step >= total;

  return (
    <div className="quiz-page">
      <header className="quiz-page__hero">
        <h1 className="quiz-page__title">五题测出你的星盘气质</h1>
        <p className="quiz-page__subtitle">1 分钟，看看你的能量模式更像哪种原型。</p>
      </header>

      {inQuiz && (
        <section className="quiz-page__quiz" aria-label={`第 ${step + 1} 题`}>
          <div className="quiz-page__progress">
            <div
              className="quiz-page__progress-bar"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
          <p className="quiz-page__progress-text">
            {step + 1} / {total}
          </p>
          <h2 className="quiz-page__question">{QUESTIONS[step].q}</h2>
          <ul className="quiz-page__choices">
            {QUESTIONS[step].choices.map((c) => (
              <li key={c.text}>
                <button type="button" onClick={() => pick(c)}>
                  {c.text}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {done && (
        <section className="quiz-page__result" aria-label={RESULT_TITLE}>
          <p className="quiz-page__result-label">{RESULT_TITLE}</p>
          <h2 className="quiz-page__result-name">
            <span aria-hidden="true">{winner.emoji}</span> {winner.name}
          </h2>
          <p className="quiz-page__result-headline">{winner.headline}</p>
          <p className="quiz-page__result-body">{winner.body}</p>
          <p className="quiz-page__result-hint">{winner.chartHint}</p>

          <div className="quiz-page__cta">
            <p>想看完整的本命盘？输入出生信息，30 秒生成。</p>
            <Link
              to="/astrolabe/natal"
              className="quiz-page__cta-button"
              onClick={() => trackEvent('quiz_cta_chart', { proto: winner.key })}
            >
              排我的本命盘 →
            </Link>
            <button
              type="button"
              className="quiz-page__retry"
              onClick={() => {
                setScores({ pioneer: 0, builder: 0, connector: 0, seeker: 0 });
                setStep(0);
                trackEvent('quiz_retry', { proto: winner.key });
              }}
            >
              再测一次
            </button>
          </div>

          <nav className="quiz-page__related" aria-label="相关专题">
            <Link to="/astrolabe/moon-phase">今晚的月亮在什么相位？看月相盘 →</Link>
            <Link to="/astrolabe/saturn-return">29 岁 / 58 岁的人生结构检修：土星回归 →</Link>
          </nav>
        </section>
      )}

      <p className="quiz-page__disclaimer">
        说明：本测验为娱乐化自我觉察工具，结果基于选项计分的简化映射，与真实星盘无关，
        不构成任何人格、命运或心理判断。
      </p>
    </div>
  );
}
