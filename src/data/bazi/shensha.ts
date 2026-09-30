// src/data/bazi/shensha.ts
import type { ContentEntryBase, ContentPack, ContentBlockParagraph } from '@/data/content/entry-types';

export interface ShenshaEntry extends ContentEntryBase {
  rule: string;
  ruleSource: string;
  imagery: string[];
  boundary: string;
}

const U = '2026-09-16';
const P = (text: string): ContentBlockParagraph => ({ kind: 'paragraph', text });
const B = {
  citations: [] as string[], confidence: 'legendary' as const,
  completeness: 'stub' as const, ready: false, status: 'published' as const,
  updatedAt: U, ruleSource: '',
};

export const shenshaPack: ContentPack<ShenshaEntry> = {
  version: '1.0.0', ready: false,
  entries: [
    { ...B, key: 'taohua', title: '桃花', summary: '主人际吸引与情感互动的传统神煞。', blocks: [P('桃花为传统神煞之一，以年支或日支所属三合局的特定位置起法，命理中用以描述人际吸引与情感互动倾向。')], rule: '以年支或日支三合局为基础，取对应位置起桃花。', imagery: ['吸引', '情感', '社交'], boundary: '桃花仅为传统神煞描述，不代表行为评价。' },
    { ...B, key: 'yima', title: '驿马', summary: '主变动、迁移与远行的传统神煞。', blocks: [P('驿马为传统神煞之一，以三合局的冲位起法，命理中用以描述迁移、变动与远行倾向。')], rule: '以年支或日支三合局为基础，取冲位起驿马。', imagery: ['变动', '迁移', '远行'], boundary: '驿马描述变动倾向，不代表必然发生迁移事件。' },
    { ...B, key: 'tianyi', title: '天乙贵人', summary: '传统神煞中的吉助象征。', blocks: [P('天乙贵人为传统神煞之一，以日干或年干起法，命理中用以象征助力与善缘。')], rule: '以日干或年干对应起法。', imagery: ['助力', '善缘', '庇护'], boundary: '贵人象征善缘，不代表具体事件或决策建议。' },
    { ...B, key: 'yangren', title: '羊刃', summary: '传统神煞中的刚烈象征。', blocks: [P('羊刃为传统神煞之一，以日干所对应地支起法，命理中用以描述刚烈、果断与锋芒。')], rule: '以日干对应地支起法。', imagery: ['刚烈', '果断', '锋芒'], boundary: '羊刃描述性格倾向，不构成行动建议或行为评价。' },
    { ...B, key: 'huagai', title: '华盖', summary: '主孤高、艺术与宗教倾向的传统神煞。', blocks: [P('华盖为传统神煞之一，以年支或日支三合局取墓位起法，命理中用以描述孤高、艺术与宗教倾向。')], rule: '以年支或日支三合局取墓位起华盖。', imagery: ['孤高', '艺术', '宗教'], boundary: '华盖描述倾向性，不构成对个人生活方式的价值判断。' },
    { ...B, key: 'wenchang', title: '文昌', summary: '主文才、学业与文书倾向的传统神煞。', blocks: [P('文昌为传统神煞之一，以日干起法，命理中用以描述文才、学业与文书倾向。')], rule: '以日干对应起法。', imagery: ['文才', '学业', '文书'], boundary: '文昌描述倾向性，不代表必然的学业或职业结果。' },
    { ...B, key: 'guchen', title: '孤辰', summary: '传统神煞中与独处倾向相关的象征。', blocks: [P('孤辰为传统神煞之一，以年支所属季节起法，命理中用以描述独处与内省倾向。')], rule: '以年支所属季节起法。', imagery: ['独处', '内省'], boundary: '孤辰描述倾向，不构成对人际关系状况的断言。' },
    { ...B, key: 'guasu', title: '寡宿', summary: '传统神煞中与内敛倾向相关的象征。', blocks: [P('寡宿为传统神煞之一，与孤辰常并列，命理中用以描述内敛与自守倾向。')], rule: '以年支所属季节起法。', imagery: ['内敛', '自守'], boundary: '寡宿描述倾向，不构成对人际或婚姻状况的断言。' },
    { ...B, key: 'tiande', title: '天德', summary: '传统神煞中的逢凶化吉象征。', blocks: [P('天德为传统神煞之一，以月支起法，命理中用以象征上天庇佑、逢凶化吉的善缘。')], rule: '以月支对应天德贵人起法。', imagery: ['庇佑', '化解', '善缘'], boundary: '天德为传统象征描述，不代表具体事件的必然结果。' },
    { ...B, key: 'yuede', title: '月德', summary: '传统神煞中的阴德贵人象征。', blocks: [P('月德为传统神煞之一，以月支三合五行起法，命理中用以象征温润、化戾为祥的助力。')], rule: '以月支三合五行起月德贵人。', imagery: ['温润', '化戾', '助力'], boundary: '月德为传统象征描述，不构成对现实境遇的断言。' },
    { ...B, key: 'tianshe', title: '天赦', summary: '传统神煞中的赦免宽恕象征。', blocks: [P('天赦为传统神煞之一，以四时特定干支日起法，命理中用以象征宽赦、解脱与改过自新。')], rule: '以春戊寅、夏甲午、秋戊申、冬甲子等特定日起法。', imagery: ['宽赦', '解脱', '改过'], boundary: '天赦为传统象征，不构成对过错或后果的现实判断。' },
    { ...B, key: 'jiangxing', title: '将星', summary: '传统神煞中与领导组织相关的象征。', blocks: [P('将星为传统神煞之一，以年支或日支三合局中位起法，命理中用以描述组织、领导与统筹倾向。')], rule: '以年支或日支三合局中位起将星。', imagery: ['领导', '组织', '统筹'], boundary: '将星描述倾向，不代表必然获得职位或权力。' },
    { ...B, key: 'jiesha', title: '劫煞', summary: '传统神煞中的突袭损耗象征。', blocks: [P('劫煞为传统神煞之一，以年支或日支三合局冲前一位起法，命理中用以描述突发、竞争与损耗的提醒。')], rule: '以年支或日支三合局冲前一位起劫煞。', imagery: ['突袭', '竞争', '损耗'], boundary: '劫煞为传统警示符号，不构成对意外事件的预测。' },
    { ...B, key: 'zaisha', title: '灾煞', summary: '传统神煞中的突发灾厄提醒象征。', blocks: [P('灾煞为传统神煞之一，与劫煞相邻取冲位起法，命理中用以提示注意突发状况、谨慎行事。')], rule: '以年支或日支三合局冲位起灾煞。', imagery: ['突发', '谨慎', '警示'], boundary: '灾煞为传统警示符号，不构成对灾祸的预言。' },
    { ...B, key: 'kongwang', title: '空亡', summary: '传统神煞中的虚耗落空象征。', blocks: [P('空亡为传统神煞之一，以日柱旬空起法，命理中用以描述落空、虚耗或需要务实之处。')], rule: '以日柱所属旬中空亡起法。', imagery: ['落空', '虚耗', '务实'], boundary: '空亡为传统符号，不代表事情必然失败或落空。' },
    { ...B, key: 'hongluan', title: '红鸾', summary: '传统神煞中的婚恋喜庆象征。', blocks: [P('红鸾为传统神煞之一，以年支起法，命理中用以描述情感、婚恋与喜事的传统意象。')], rule: '以年支对照红鸾方位起法。', imagery: ['婚恋', '喜庆', '情感'], boundary: '红鸾为传统情感符号，不构成对婚恋结果的承诺。' },
    { ...B, key: 'tianxi', title: '天喜', summary: '传统神煞中的喜乐庆祝象征。', blocks: [P('天喜为传统神煞之一，与红鸾对宫起法，命理中用以描述喜事、庆祝与愉悦氛围。')], rule: '以年支对照天喜方位起法。', imagery: ['喜事', '庆祝', '愉悦'], boundary: '天喜为传统符号，不构成对具体喜事的预测。' },
    { ...B, key: 'feiren', title: '飞刃', summary: '传统神煞中的刚烈伤损提醒象征。', blocks: [P('飞刃为传统神煞之一，与羊刃对冲起法，命理中用以描述锋芒外泄、需防冲动的提醒。')], rule: '以羊刃对冲之位起飞刃。', imagery: ['锋芒', '冲动', '警示'], boundary: '飞刃为传统警示符号，不构成对意外伤害的预测。' },
    { ...B, key: 'liuxia', title: '流霞', summary: '传统神煞中的血气柔伤提醒象征。', blocks: [P('流霞为传统神煞之一，以日干起法，命理中传统上与血气、柔伤相联系，属需谨慎的符号。')], rule: '以日干对照流霞起法。', imagery: ['血气', '谨慎', '柔伤'], boundary: '流霞为传统符号，不构成对健康或意外的判断。' },
    { ...B, key: 'xuetang', title: '学堂', summary: '传统神煞中与学业文思相关的象征。', blocks: [P('学堂为传统神煞之一，以日干长生位起法，命理中用以描述好学、文思与学业倾向。')], rule: '以日干长生位起学堂。', imagery: ['好学', '文思', '学业'], boundary: '学堂描述倾向，不代表必然的学业成就。' },
    { ...B, key: 'ciguan', title: '词馆', summary: '传统神煞中与文章辞令相关的象征。', blocks: [P('词馆为传统神煞之一，与学堂相邻起法，命理中用以描述辞章、表达与文书能力倾向。')], rule: '以日干临官、帝旺等位起词馆。', imagery: ['辞章', '表达', '文书'], boundary: '词馆描述倾向，不代表必然的职业或考试结果。' },
    { ...B, key: 'fuxing', title: '福星', summary: '传统神煞中的福禄吉祥象征。', blocks: [P('福星为传统神煞之一，以日干起法，命理中用以描述福气、安逸与随和的传统意象。')], rule: '以日干对照福星起法。', imagery: ['福气', '安逸', '随和'], boundary: '福星为传统吉祥符号，不构成对福运的承诺。' },
    { ...B, key: 'lushen', title: '禄神', summary: '传统神煞中与俸禄养命相关的象征。', blocks: [P('禄神为传统神煞之一，以日干临官位起法，命理中用以描述生计、俸禄与自我支撑。')], rule: '以日干临官位起禄。', imagery: ['生计', '俸禄', '自足'], boundary: '禄神描述养命资源倾向，不代表具体的财富数额。' },
    { ...B, key: 'kuigang', title: '魁罡', summary: '传统神煞中与刚断聪慧相关的象征。', blocks: [P('魁罡为传统神煞之一，以特定日柱（庚辰、庚戌、壬辰、戊戌）起法，命理中用以描述刚断、聪慧与主见。')], rule: '以日柱为庚辰、庚戌、壬辰、戊戌起魁罡。', imagery: ['刚断', '聪慧', '主见'], boundary: '魁罡描述性格倾向，不构成对刚柔利弊的价值判断。' },
    { ...B, key: 'jinyu', title: '金舆', summary: '传统神煞中的车马安享象征。', blocks: [P('金舆为传统神煞之一，以日干起法，命理中用以描述安逸、车马与生活待遇的传统意象。')], rule: '以日干对照金舆起法。', imagery: ['安逸', '车马', '待遇'], boundary: '金舆为传统符号，不构成对物质生活的承诺。' },
    { ...B, key: 'guoyin', title: '国印', summary: '传统神煞中与权印诚信相关的象征。', blocks: [P('国印为传统神煞之一，以日干或年干起法，命理中用以描述诚信、权责与印信的传统意象。')], rule: '以日干或年干对照国印起法。', imagery: ['诚信', '权责', '印信'], boundary: '国印描述倾向，不代表必然获得权位。' },
    { ...B, key: 'tianchu', title: '天厨', summary: '传统神煞中的衣食俸禄象征。', blocks: [P('天厨为传统神煞之一，以日干起法，命理中用以描述衣食丰足、饮食口福的传统意象。')], rule: '以日干对照天厨起法。', imagery: ['衣食', '口福', '丰足'], boundary: '天厨为传统符号，不构成对物质丰歉的判断。' },
    { ...B, key: 'tianyi-yi', title: '天医', summary: '传统神煞中与医药调养相关的象征。', blocks: [P('天医为传统神煞之一，以月支起法，命理中传统上与医药、调养和关注健康相联系。')], rule: '以月支对照天医起法。', imagery: ['医药', '调养', '健康'], boundary: '天医为传统符号，不构成医疗建议或健康判断。' },
    { ...B, key: 'sangmen', title: '丧门', summary: '传统神煞中的忧丧警示象征。', blocks: [P('丧门为传统神煞之一，以年支对冲前二位起法，命理中传统上与忧丧、谨慎相关，属警示符号。')], rule: '以年支对冲前二位起丧门。', imagery: ['忧丧', '谨慎', '警示'], boundary: '丧门为传统警示符号，不构成对丧事或健康的预测。' },
    { ...B, key: 'baihu', title: '白虎', summary: '传统神煞中的血光刚煞警示象征。', blocks: [P('白虎为传统神煞之一，以年支三合局冲位起法，命理中传统上与刚猛、血光相关，属需谨慎的符号。')], rule: '以年支三合局冲位起白虎。', imagery: ['刚猛', '血光', '警示'], boundary: '白虎为传统警示符号，不构成对血光或意外的预测。' },
  ],
};
