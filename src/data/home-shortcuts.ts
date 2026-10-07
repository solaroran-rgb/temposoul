// D9-4
// src/data/home-shortcuts.ts
export interface ShortcutItem {
  id: string;
  label: string;
  icon: string;
  target: string;
}

export interface ShortcutGroup {
  groupId: 'chart' | 'divination' | 'almanac' | 'name' | 'westastro' | 'mystic';
  title: string;
  items: ShortcutItem[];
}

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    groupId: 'chart',
    title: '命理排盘',
    items: [
      { id: 'bazi', label: '八字', icon: 'icon-bazi', target: '/?mode=single&system=bazi' },
      { id: 'ziwei', label: '紫微', icon: 'icon-ziwei', target: '/?mode=single&system=ziwei' },
      {
        id: 'astrolabe',
        label: '西占',
        icon: 'icon-astro',
        target: '/?mode=single&system=astrolabe',
      },
    ],
  },
  {
    groupId: 'divination',
    title: '占卜起卦',
    items: [
      {
        id: 'liuyao',
        label: '六爻',
        icon: 'icon-liuyao',
        target: '/?mode=divination&system=liuyao',
      },
      { id: 'tarot', label: '塔罗', icon: 'icon-tarot', target: '/?mode=divination&system=tarot' },
      { id: 'qimen', label: '奇门', icon: 'icon-qimen', target: '/?mode=divination&system=qimen' },
    ],
  },
  {
    groupId: 'almanac',
    title: '黄历择日',
    items: [
      { id: 'almanac', label: '今日黄历', icon: 'icon-almanac', target: '/almanac' },
      { id: 'select', label: '择日', icon: 'icon-select', target: '/almanac/select' },
    ],
  },
  {
    groupId: 'name',
    title: '姓名起名',
    items: [
      { id: 'nametest', label: '测名', icon: 'icon-name', target: '/name-test' },
      { id: 'names', label: '起名', icon: 'icon-names', target: '/names' },
    ],
  },
  {
    groupId: 'westastro',
    title: '西占专题',
    items: [
      { id: 'moon-phase', label: '月相盘', icon: 'icon-moon', target: '/astrolabe/moon-phase' },
      {
        id: 'saturn-return',
        label: '土星回归',
        icon: 'icon-saturn',
        target: '/astrolabe/saturn-return',
      },
      { id: 'quiz-western', label: '星盘气质测验', icon: 'icon-quiz', target: '/quiz/western' },
    ],
  },
  {
    groupId: 'mystic',
    title: '术数·风水·牌阵',
    items: [
      { id: 'taiyi', label: '太乙神数', icon: 'icon-taiyi', target: '/metaphysics/taiyi' },
      { id: 'liuren', label: '大六壬', icon: 'icon-liuren', target: '/divination/liuren' },
      { id: 'jinkoujue', label: '金口诀', icon: 'icon-jinkoujue', target: '/divination/jinkoujue' },
      { id: 'meihua', label: '梅花易数', icon: 'icon-meihua', target: '/divination/meihua' },
      { id: 'xiaoliuren', label: '小六壬', icon: 'icon-xiaoliuren', target: '/divination/xiaoliuren' },
      { id: 'lenormand', label: '雷诺曼', icon: 'icon-lenormand', target: '/divination/lenormand' },
      { id: 'ssgw', label: '三山国王灵签', icon: 'icon-ssgw', target: '/divination/ssgw' },
      { id: 'xuankong', label: '玄空飞星', icon: 'icon-xuankong', target: '/fengshui/xuankong' },
      { id: 'residential', label: '住宅风水', icon: 'icon-residential', target: '/fengshui/residential' },
    ],
  },
];
