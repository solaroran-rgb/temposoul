// D9-4
// src/data/home-shortcuts.ts
export interface ShortcutItem {
  id: string;
  label: string;
  icon: string;
  target: string;
}

export interface ShortcutGroup {
  groupId: 'chart' | 'divination' | 'almanac' | 'name';
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
];
