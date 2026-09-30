import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * SiteNav — 全局功能导航（2026-09-16 补：第 4/6 轮部署的 21 项功能此前无 UI 入口）
 * 顶部悬浮胶囊，分组 <details> 下拉，无 JS 状态依赖；/sky 沉浸页由 App 控制不渲染。
 * 链接清单与「部署方案总文件 v1.1」已部署节点一一对应。
 */

interface NavGroup {
  label: string;
  items: { to: string; label: string; desc?: string }[];
}

const GROUPS: NavGroup[] = [
  {
    label: '排盘',
    items: [
      { to: '/', label: '八字排盘', desc: '四柱/十神/大运流年' },
      { to: '/bazi/dayun', label: '大运详批', desc: '十年一步大运' },
      { to: '/bazi/liunian', label: '流年详批', desc: '逐年逐月引动' },
      { to: '/bazi/compatibility', label: '八字合婚', desc: '双盘合参' },
      { to: '/bazi/topics/career', label: '八字主题解读', desc: '事业/财运/感情/健康' },
      { to: '/bazi/five-elements', label: '五行缺失查询', desc: '四柱五行分布' },
      { to: '/bazi/daily', label: '八字日运', desc: '每日干支主题' },
      { to: '/bazi/marriage', label: '婚姻配对', desc: '配偶宫/桃花/合婚' },
      { to: '/ziwei/palaces', label: '紫微十二宫', desc: '逐宫详解' },
      { to: '/ziwei/stars', label: '紫微星曜详解', desc: '十四主星' },
    ],
  },
  {
    label: '进阶排盘',
    items: [
      { to: '/bazi/shishen', label: '十神详解', desc: '十神百科' },
      { to: '/bazi/shensha', label: '神煞专题', desc: '神煞起法查询' },
      { to: '/ziwei/sihua', label: '紫微四化', desc: '禄权科忌' },
      { to: '/ziwei/patterns', label: '紫微格局', desc: '杀破狼等格局' },
      { to: '/ziwei/limits', label: '紫微限运', desc: '大限小限解析' },
      { to: '/ziwei/palace-star', label: '宫星组合', desc: '宫位×星曜' },
      { to: '/astrolabe/natal', label: '西占本命盘', desc: '行星/相位/宫位' },
      { to: '/astrolabe/transits', label: '西占行运盘', desc: '行运/返照' },
      { to: '/astrolabe/ephemeris', label: '西占星历', desc: '星历表' },
      { to: '/astrolabe/retrograde', label: '西占逆行', desc: '水逆/土星回归' },
    ],
  },
  {
    label: '运势',
    items: [
      { to: '/daily-fortune', label: '每日一签', desc: '日更灵签' },
      { to: '/lingsign/guanyin', label: '灵签五套', desc: '观音/关帝/黄大仙/月老/吕祖' },
      { to: '/lingsign/mazu', label: '妈祖灵签', desc: '六十甲子签' },
      { to: '/fortune/daily', label: '星座日运', desc: '12 星座每日运势' },
      { to: '/zodiac/fortune', label: '生肖运势', desc: '今日/本周/本月/年运' },
      { to: '/zodiac/compatibility', label: '星座配对', desc: '多维契合度' },
      { to: '/compatibility/birthday', label: '生日配对', desc: '生日三缘分配对' },
      { to: '/fortune/rhythm', label: '每日节律', desc: '身体节律提醒' },
      { to: '/astro/events', label: '星象日历', desc: '新月/满月/水逆' },
      { to: '/fortune/zodiac-profile', label: '星座命盘', desc: '性格/爱情/事业' },
      { to: '/zodiac/buddha', label: '生肖本命佛', desc: '八大守护神' },
      { to: '/zodiac/tai-sui', label: '太岁查询', desc: '本命年/犯太岁' },
      { to: '/fortune/crystals', label: '水晶开运', desc: '宝石开运' },
      { to: '/gems', label: '水晶宝石图鉴', desc: '12 种晶石文化寓意' },
      { to: '/insights', label: '运势资讯', desc: '节气/水逆/食相文章' },
      { to: '/podcast', label: '民俗轻谈播客', desc: '30 集播客节目' },
    ],
  },
  {
    label: '占卜',
    items: [
      { to: '/divination/zhuge', label: '诸葛神数', desc: '384 签文库' },
      { to: '/tarot/spreads', label: '塔罗牌阵', desc: '16 种牌阵' },
      { to: '/tarot/daily', label: '塔罗日运', desc: '每日抽牌' },
      { to: '/tarot/lexicon', label: '塔罗辞典', desc: '78 张牌义' },
      { to: '/tarot/learn', label: '塔罗学习', desc: '互动课程' },
      { to: '/runes', label: '卢恩符文', desc: '如尼符文占卜' },
      { to: '/tools/palmistry', label: '手相', desc: '三大主线文化辞典' },
      { to: '/divination/gufa', label: '古法论命', desc: '三流派语料' },
      { to: '/divination/fengshui-test', label: '阳宅风水测试', desc: '8 题自测' },
      { to: '/divination/superstition', label: '眼跳喷嚏', desc: '测吉凶民俗' },
      { to: '/yijing/hexagrams', label: '易经六十四卦', desc: '卦辞爻辞详解' },
    ],
  },
  {
    label: '趣味测',
    items: [
      { to: '/lightfun', label: '轻娱乐大全', desc: '十二款趣味工具总览' },
      { to: '/tools/cezi', label: '测字', desc: '单字文化拆解' },
      { to: '/tools/fingerprint-fun', label: '指纹趣味', desc: '九种指纹形态' },
      { to: '/tools/life-number', label: '生命灵数', desc: '1-9 主命数' },
      { to: '/tools/birthday-code', label: '生日密码', desc: '366 档日期解读' },
      { to: '/tools/birth-flower', label: '生日花语', desc: '十二月生辰花' },
      { to: '/tools/fun-psych-tests', label: '心理趣味小测', desc: '三套自我觉察' },
      { to: '/tools/blood-type-fun', label: '血型趣味说', desc: 'ABO 文化印象' },
      { to: '/tools/eye-twitch-sneeze-fun', label: '眼跳喷嚏', desc: '十二时辰民俗' },
      { to: '/topics/celebrity-astrology', label: '名人星盘', desc: '历史人物侧写' },
      { to: '/knowledge/xiu-degree', label: '二十八宿', desc: '星宿象征参考' },
      { to: '/tools/yangzhai-fengshui-test', label: '阳宅趣味测', desc: '整理倾向自测' },
    ],
  },
  {
    label: '姓名',
    items: [
      { to: '/name-test', label: '姓名测试', desc: '三才五格打分' },
      { to: '/name/compatibility', label: '姓名配对', desc: '双名契合分析' },
      { to: '/names', label: '智能起名', desc: '八字补益起名' },
      { to: '/name-report', label: '名字报告', desc: '深度测名报告' },
      { to: '/kangxi', label: '康熙字典', desc: '3500 字笔画五行' },
      { to: '/share/birth-chart', label: '生辰卡分享', desc: '生成可分享卡片' },
      { to: '/name/english', label: '英文名测试', desc: '英文名/网名' },
      { to: '/tools/english-name-persona', label: '英文名人格测试', desc: '社交面具与内在驱动' },
      { to: '/tools/brand-naming-engine', label: '公司起名引擎', desc: '品牌定位方法论' },
      { to: '/tools/artisanal-naming', label: '手工起名', desc: '50 汉字心理意象' },
      { to: '/services/senior-name-consultant', label: '顾问测名', desc: '多维度解读' },
      { to: '/tools/life-rhythm-calendar', label: '节律月历', desc: '2026 节气能量' },
      { to: '/names/dictionary', label: '起名百科', desc: '五行用字库' },
      { to: '/names/catalog', label: '名字大全', desc: '海量名字' },
      { to: '/names/ranking', label: '名字热度榜', desc: '名字排行' },
      { to: '/insights/name-popularity-trends', label: '名字热度趋势', desc: 'Top50 热力区间' },
      { to: '/names/manual', label: '手工起名服务', desc: '大师手工起名' },
      { to: '/names/expert', label: '大师测名', desc: '专家点评' },
      { to: '/names/business', label: '公司起名', desc: '店铺/商名' },
      { to: '/partners/creator-syndicate', label: '创作者联盟', desc: '分佣与合规' },
    ],
  },
  {
    label: '黄历·星座',
    items: [
      { to: '/almanac', label: '今日黄历', desc: '每日宜忌/冲煞' },
      { to: '/almanac/select', label: '择日工具', desc: '搬家/结婚/开业吉日' },
      { to: '/almanac/calendar', label: '万年历', desc: '农历公历对照' },
      { to: '/almanac/is-lucky/marriage', label: '婚嫁吉日', desc: '今日吉凶判定' },
      { to: '/almanac/directions', label: '吉位煞向', desc: '每日吉时方位' },
      { to: '/astrology/zodiac', label: '星座百科', desc: '四元素×三特质' },
      { to: '/astrology/celebrities', label: '星座名人', desc: '名人星盘资料' },
      { to: '/astrology/parenting', label: '育儿占星', desc: '亲子关系参考' },
      { to: '/wiki/astrology', label: '占星 Wiki', desc: '行星/宫位/相位' },
      { to: '/knowledge/astrology-terms', label: '占星百科', desc: '27 词条（B 域）' },
      { to: '/knowledge/astrology/terms', label: '行星星座百科', desc: '27 词条（C 域）' },
      { to: '/learn/tarot/curriculum', label: '塔罗三阶学习', desc: '19 课从愚者到世界' },
      { to: '/knowledge/ziwei/pattern-extended', label: '格局详解库', desc: '紫微 10 大主格局' },
      { to: '/knowledge/parenting', label: '育儿占星指南', desc: '12 星座养育参考' },
      { to: '/tools/ephemeris', label: '星历表速览', desc: '2026 天象节点' },
    ],
  },
  {
    label: '平台',
    items: [
      { to: '/search', label: '站内搜索', desc: '全站功能/文章' },
      { to: '/knowledge', label: '知识库', desc: '干支/五行/神煞/文章' },
      { to: '/faq', label: '常见问题', desc: 'FAQ' },
      { to: '/favorites', label: '我的收藏', desc: '收藏功能' },
      { to: '/profile', label: '个人中心', desc: '资料与偏好' },
      { to: '/pricing', label: '订阅定价', desc: '会员与报告' },
      { to: '/membership', label: '会员中心', desc: '订阅与会员权益' },
      { to: '/reports/ten-dim', label: 'AI 十维报告', desc: '付费深度报告' },
      { to: '/refund', label: '退款申诉', desc: '一键取消/退款' },
      { to: '/reminders', label: '提醒', desc: '每日节律提醒' },
      { to: '/records', label: '历史记录', desc: '排盘占卜历史' },
      { to: '/lexicon', label: '词库', desc: '1180+ 命理术语' },
      { to: '/compliance', label: '合规中心', desc: '条款/隐私/投诉' },
    ],
  },
  {
    label: '知识·内容',
    items: [
      { to: '/knowledge/ganzhi', label: '干支知识', desc: '天干地支专题' },
      { to: '/knowledge/fengshui', label: '风水知识', desc: '阳宅风水文章' },
      { to: '/knowledge/blood-type', label: '血型知识', desc: '血型性格' },
      { to: '/knowledge/planets', label: '行星百科', desc: '行星/星座词条' },
      { to: '/knowledge/classics', label: '经典典籍', desc: '国学原典选读' },
      { to: '/knowledge/ziwei-stars', label: '紫微星曜库', desc: '十四主星百科' },
      { to: '/knowledge/ziwei-palaces', label: '紫微宫位库', desc: '十二宫百科' },
      { to: '/video', label: '视频频道', desc: '命理视频' },
      { to: '/news', label: '新闻资讯', desc: '运势文化资讯' },
    ],
  },
  {
    label: '社区·商业',
    items: [
      { to: '/community', label: '社区论坛', desc: '版块/帖子/互动' },
      { to: '/community/bounty', label: '悬赏任务', desc: '征集与打赏' },
      { to: '/community/wall', label: '分享墙', desc: '用户成果墙' },
      { to: '/vip', label: '会员权益', desc: 'VIP 会员权益' },
      { to: '/consult', label: '在线咨询', desc: '咨询师列表/匹配' },
      { to: '/experts', label: '专家团队', desc: '专家展示' },
      { to: '/account/credits', label: '积分充值', desc: '充值档位' },
      { to: '/account/rewards', label: '奖励中心', desc: '任务/流水' },
      { to: '/account/points', label: '积分中心', desc: '积分展示与任务' },
      { to: '/calendar/pick', label: '择时工具', desc: '选日子/选时辰' },
      { to: '/daily/energy', label: '每日能量', desc: '财神方位/幸运色/避忌' },
      { to: '/shop', label: '商城', desc: '民俗文创商品' },
      { to: '/affiliate', label: '联盟营销', desc: '分佣层级' },
    ],
  },
];

export function SiteNav() {
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const closeAll = () => {
      navRef.current?.querySelectorAll('details[open]').forEach((el) => el.removeAttribute('open'));
    };
    const onDocClick = (e: MouseEvent) => {
      if (!navRef.current || !navRef.current.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    const onNavClick = (e: MouseEvent) => {
      const summary = (e.target as HTMLElement).closest('.site-nav__trigger');
      if (!summary) return;
      const mine = summary.parentElement;
      navRef.current?.querySelectorAll('details[open]').forEach((el) => {
        if (el !== mine) el.removeAttribute('open');
      });
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    navRef.current?.addEventListener('click', onNavClick);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
      navRef.current?.removeEventListener('click', onNavClick);
    };
  }, []);
  return (
    <nav className="site-nav" aria-label="全站功能导航" ref={navRef}>
      {GROUPS.map((group) => (
        <details key={group.label} className="site-nav__group">
          <summary className="site-nav__trigger" title={`${group.label}（点击展开）`}>
            {group.label}
          </summary>
          <div className="site-nav__panel">
            {group.items[0] && (
              <Link
                to={group.items[0].to}
                className="site-nav__item site-nav__item-home"
                aria-label={`进入${group.label}分类`}
              >
                <span className="site-nav__item-label">进入{group.label} ›</span>
              </Link>
            )}
            <div className="site-nav__divider" />
            {group.items.map((item) => (
              <Link key={item.to} to={item.to} className="site-nav__item">
                <span className="site-nav__item-label">{item.label}</span>
                {item.desc && <span className="site-nav__item-desc">{item.desc}</span>}
              </Link>
            ))}
          </div>
        </details>
      ))}
      <style>{`
        .site-nav {
          position: fixed;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 55;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(19, 16, 25, 0.66);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
          max-width: calc(100vw - 40px);
          overflow: visible;
          scrollbar-width: none;
          white-space: nowrap;
        }
        .site-nav::-webkit-scrollbar { display: none; }
        .site-nav__group { position: relative; flex-shrink: 0; }
        .site-nav__trigger {
          list-style: none;
          display: inline-block;
          padding: 6px 14px;
          border-radius: 999px;
          color: var(--text-secondary, #8b9bb4);
          font-size: 13px;
          cursor: pointer;
          user-select: none;
          transition: color 0.18s ease, background 0.18s ease;
          white-space: nowrap;
        }
        .site-nav__trigger::-webkit-details-marker { display: none; }
        .site-nav__trigger:hover,
        .site-nav__group[open] .site-nav__trigger {
          color: var(--neon-pink, #ff4d6d);
          background: rgba(255, 77, 109, 0.1);
        }
        .site-nav__panel {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 190px;
          padding: 8px;
          border-radius: 12px;
          background: rgba(19, 16, 25, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: min(72vh, 620px);
          overflow-y: auto;
          scrollbar-width: thin;
          z-index: 60;
        }
        .site-nav__item {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding: 7px 10px;
          border-radius: 8px;
          color: var(--text-primary, #e0e6ed);
          text-decoration: none;
          transition: background 0.16s ease;
        }
        .site-nav__item:hover {
          background: rgba(77, 195, 255, 0.12);
          color: var(--neon-cyan, #4dc3ff);
        }
        .site-nav__item-home {
          color: var(--neon-pink, #ff4d6d);
          font-weight: 600;
        }
        .site-nav__item-home:hover {
          background: rgba(255, 77, 109, 0.12);
          color: var(--neon-pink, #ff4d6d);
        }
        .site-nav__divider {
          height: 1px;
          margin: 4px 8px;
          background: rgba(255, 255, 255, 0.1);
        }
        .site-nav__item-label { font-size: 13px; font-weight: 500; }
        .site-nav__item-desc { font-size: 11px; color: var(--text-secondary, #8b9bb4); }
        @media (max-width: 900px) {
          .site-nav { top: 8px; max-width: calc(100vw - 20px); left: 8px; right: 8px; transform: none; }
          .site-nav__trigger { padding: 6px 10px; font-size: 12px; }
          .site-nav__panel { left: auto; right: 0; transform: none; min-width: 200px; }
        }
        @media (max-width: 480px) {
          .site-nav { top: 6px; padding: 3px 6px; gap: 1px; border-radius: 14px; }
          .site-nav__trigger { padding: 5px 8px; font-size: 11px; }
        }
      `}</style>
    </nav>
  );
}
