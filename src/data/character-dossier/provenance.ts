/**
 * 字档案数据来源与许可声明（契约 v3.2 §5 / 决策 23）
 * 版本 pin：Unihan 15.1（Unicode 许可）、OpenCC 1.1.9（MIT）、《康熙字典》通行影印本
 * 说明：样例数据由本地可获取的字形/读音数据包推导，D2 阶段须与 Unihan 15.1 kTotalStrokes
 * 及《康熙字典》影印本逐字人工校准；未校准前 confidence 一律为 probable。
 */
export interface ProvenanceItem {
  id: string;
  name: string;
  version: string;
  license: string;
  usage: string;
  note?: string;
}

export const CHARACTER_DOSSIER_PROVENANCE: ProvenanceItem[] = [
  {
    id: 'unihan',
    name: 'Unihan Database',
    version: '15.1',
    license: 'Unicode License',
    usage: 'kTotalStrokes / kMandarin 校准基准（D2 阶段接入）',
    note: '本样例阶段未直连 Unihan，笔画为推导值，待校准',
  },
  {
    id: 'opencc',
    name: 'OpenCC',
    version: '1.1.9',
    license: 'MIT',
    usage: '简繁转换（traditional / simplified 字段）',
    note: '全量 3500 字生产阶段接入',
  },
  {
    id: 'kangxi',
    name: '《康熙字典》通行影印本',
    version: '通行本',
    license: '公有领域',
    usage: '康熙笔画最终校准基准（含部首异计）',
  },
  {
    id: 'cnchar',
    name: 'cnchar 笔画数据',
    version: '3.2.6',
    license: 'MIT',
    usage: '样例阶段传统字形笔画推导来源',
    note: '非最终权威来源，D2 校准后替换',
  },
  {
    id: 'pinyin-pro',
    name: 'pinyin-pro 读音数据',
    version: '3.29.4',
    license: 'MIT',
    usage: '拼音与声调（含姓氏读音模式）',
  },
  {
    id: 'gfhzt',
    name: '《通用规范汉字表》一级字',
    version: '2013',
    license: '国家标准',
    usage: '3500 字字集范围与常用字等级',
  },
];

export const DATASET_VERSION = 'sample-300-v1';

export function provenanceText(): string {
  return CHARACTER_DOSSIER_PROVENANCE.map((p) => `${p.name} ${p.version}（${p.license}）`).join(
    '、',
  );
}
