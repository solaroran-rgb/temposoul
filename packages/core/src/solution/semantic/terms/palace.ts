/**
 * GW 宫位组 · 6 条
 * 年柱宫 / 月柱宫 / 日支宫 / 时柱宫 / 命宫 / 身宫
 *
 * 字段绑定（R3 核验）：
 * - 四柱 pillars.{year,month,day,hour}.{gan,zhi,ganZhi}
 * - 藏干 hiddenStems.{year,month,day,hour}
 * - 大运 luckInfo.cycles / 流年 liunian
 */
import type { TermSchema } from '../types';

export const PALACE_REGISTRY: Record<string, TermSchema> = {
  NPG: {
    id: 'NPG',
    name: '年柱宫',
    group: 'GW',
    factors: [
      { id: 'NPG-1', name: '祖辈根基', trigger: [{ op: 'in_pillar', args: ['year', 'gan'] }], fieldBinding: ['pillars.year.ganZhi'], defaultWeight: 0.3, schools: { ziping: 0.32, mangpai: 0.28, xinpai: 0.30 } },
      { id: 'NPG-2', name: '童限早年', trigger: [{ op: 'in_pillar', args: ['year', 'zhi'] }], fieldBinding: ['pillars.year.zhi', 'luckInfo.cycles'], defaultWeight: 0.28, schools: { ziping: 0.26, mangpai: 0.30, xinpai: 0.28 } },
      { id: 'NPG-3', name: '家族荫庇', trigger: [{ op: 'contains', args: ['hiddenStems.year', '干'] }], fieldBinding: ['hiddenStems.year'], defaultWeight: 0.22, schools: { ziping: 0.22, mangpai: 0.24, xinpai: 0.22 } },
      { id: 'NPG-4', name: '早年环境', trigger: [{ op: 'in_pillar', args: ['year', 'gan'] }], fieldBinding: ['pillars.year.ganZhi', 'tenGods'], defaultWeight: 0.20, schools: { ziping: 0.20, mangpai: 0.18, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-NPG-YP', name: '年柱得印', trigger: [{ op: 'in_pillar', args: ['year', 'gan'] }, { op: 'has', args: ['tenGods', '正印'] }], priority: 10, mutex: ['COMBO-NPG-JK'] },
      { id: 'COMBO-NPG-JK', name: '年柱见克', trigger: [{ op: 'in_pillar', args: ['year', 'zhi'] }, { op: 'has', args: ['pillarRelations.xingChong', '冲'] }], priority: 20, mutex: ['COMBO-NPG-YP'] },
    ],
    templates: [
      { comboId: 'COMBO-NPG-YP', pro: '年柱坐印星，祖辈根基厚，早年得家族荫庇', mix: '你早年环境较好，家族与长辈对你多有照拂', lay: '你小时候家里条件不错，长辈很疼你', polarity: '+', modality: 'likely', atomicId: 'ATOM-NPG-YP-001' },
      { comboId: 'COMBO-NPG-JK', pro: '年柱逢冲，早年根基动荡，环境多变迁', mix: '你早年环境变动较多，家庭或居所可能多次搬动', lay: '你小时候家里可能比较折腾，换过住的地方', polarity: '-', modality: 'tend', atomicId: 'ATOM-NPG-JK-001' },
    ],
    dimTags: ['DIM_01'],
  },
  YCG: {
    id: 'YCG',
    name: '月柱宫',
    group: 'GW',
    factors: [
      { id: 'YCG-1', name: '父母关系', trigger: [{ op: 'in_pillar', args: ['month', 'gan'] }], fieldBinding: ['pillars.month.ganZhi'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.28, xinpai: 0.30 } },
      { id: 'YCG-2', name: '兄弟同辈', trigger: [{ op: 'contains', args: ['hiddenStems.month', '干'] }], fieldBinding: ['hiddenStems.month'], defaultWeight: 0.25, schools: { ziping: 0.24, mangpai: 0.28, xinpai: 0.25 } },
      { id: 'YCG-3', name: '青年事业场', trigger: [{ op: 'in_pillar', args: ['month', 'zhi'] }], fieldBinding: ['pillars.month.zhi', 'luckInfo.cycles'], defaultWeight: 0.25, schools: { ziping: 0.26, mangpai: 0.22, xinpai: 0.25 } },
      { id: 'YCG-4', name: '父母助力', trigger: [{ op: 'has', args: ['tenGods', '正印'] }], fieldBinding: ['tenGods', 'pillars.month.ganZhi'], defaultWeight: 0.20, schools: { ziping: 0.20, mangpai: 0.22, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-YCG-FC', name: '月柱财印', trigger: [{ op: 'in_pillar', args: ['month', 'gan'] }, { op: 'has', args: ['tenGods', '正财'] }], priority: 10, mutex: ['COMBO-YCG-ZC'] },
      { id: 'COMBO-YCG-ZC', name: '月柱助力', trigger: [{ op: 'in_pillar', args: ['month', 'gan'] }, { op: 'has', args: ['tenGods', '正印'] }], priority: 20, mutex: ['COMBO-YCG-FC'] },
    ],
    templates: [
      { comboId: 'COMBO-YCG-ZC', pro: '月柱印星得力，父母助力强，青年得长辈提携', mix: '青年时期你较易得到父母或长辈的实质支持', lay: '你年轻时家里人和长辈帮了你不少忙', polarity: '+', modality: 'likely', atomicId: 'ATOM-YCG-ZC-001' },
      { comboId: 'COMBO-YCG-FC', pro: '月柱财星当令，青年事业场活跃，同辈竞争显', mix: '你年轻时事业环境活跃，同辈之间竞争也明显', lay: '你年轻时在外打拼的劲头足，身边竞争也不少', polarity: '0', modality: 'tend', atomicId: 'ATOM-YCG-FC-001' },
    ],
    dimTags: ['DIM_01', 'DIM_02'],
  },
  RZG: {
    id: 'RZG',
    name: '日支宫',
    group: 'GW',
    factors: [
      { id: 'RZG-1', name: '配偶特质', trigger: [{ op: 'in_pillar', args: ['day', 'zhi'] }], fieldBinding: ['pillars.day.zhi'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.28, xinpai: 0.30 } },
      { id: 'RZG-2', name: '婚姻宫位', trigger: [{ op: 'contains', args: ['hiddenStems.day', '干'] }], fieldBinding: ['hiddenStems.day', 'pillarRelations.fuxin'], defaultWeight: 0.27, schools: { ziping: 0.26, mangpai: 0.30, xinpai: 0.27 } },
      { id: 'RZG-3', name: '夫妻关系', trigger: [{ op: 'has', args: ['pillarRelations.fuxin', '合'] }], fieldBinding: ['pillarRelations.fuxin'], defaultWeight: 0.23, schools: { ziping: 0.24, mangpai: 0.22, xinpai: 0.23 } },
      { id: 'RZG-4', name: '中年运程', trigger: [{ op: 'in_pillar', args: ['day', 'zhi'] }], fieldBinding: ['pillars.day.zhi', 'luckInfo.cycles'], defaultWeight: 0.20, schools: { ziping: 0.20, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-RZG-HX', name: '日支合配偶', trigger: [{ op: 'in_pillar', args: ['day', 'zhi'] }, { op: 'has', args: ['pillarRelations.fuxin', '合'] }], priority: 10, mutex: ['COMBO-RZG-CG'] },
      { id: 'COMBO-RZG-CG', name: '日支逢冲', trigger: [{ op: 'in_pillar', args: ['day', 'zhi'] }, { op: 'has', args: ['pillarRelations.xingChong', '冲'] }], priority: 20, mutex: ['COMBO-RZG-HX'] },
    ],
    templates: [
      { comboId: 'COMBO-RZG-HX', pro: '日支坐合，婚姻宫得合，夫妻关系稳，中年运顺', mix: '你与伴侣关系较和睦，中年阶段家庭氛围稳定', lay: '你和另一半关系不错，中年日子过得安稳', polarity: '+', modality: 'likely', atomicId: 'ATOM-RZG-HX-001' },
      { comboId: 'COMBO-RZG-CG', pro: '日支逢冲，婚姻宫动荡，夫妻关系多摩擦', mix: '你与伴侣之间容易有分歧，相处需多沟通包容', lay: '你和另一半偶尔会闹别扭，需要多体谅对方', polarity: '-', modality: 'tend', atomicId: 'ATOM-RZG-CG-001' },
    ],
    dimTags: ['DIM_01', 'DIM_03'],
  },
  SGG: {
    id: 'SGG',
    name: '时柱宫',
    group: 'GW',
    factors: [
      { id: 'SGG-1', name: '子女缘', trigger: [{ op: 'in_pillar', args: ['hour', 'gan'] }], fieldBinding: ['pillars.hour.ganZhi'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.28, xinpai: 0.30 } },
      { id: 'SGG-2', name: '晚年运程', trigger: [{ op: 'in_pillar', args: ['hour', 'zhi'] }], fieldBinding: ['pillars.hour.zhi', 'luckInfo.cycles'], defaultWeight: 0.26, schools: { ziping: 0.24, mangpai: 0.28, xinpai: 0.26 } },
      { id: 'SGG-3', name: '子女星位', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods', 'pillars.hour.ganZhi'], defaultWeight: 0.24, schools: { ziping: 0.26, mangpai: 0.22, xinpai: 0.24 } },
      { id: 'SGG-4', name: '下属晚辈', trigger: [{ op: 'contains', args: ['hiddenStems.hour', '干'] }], fieldBinding: ['hiddenStems.hour'], defaultWeight: 0.20, schools: { ziping: 0.20, mangpai: 0.22, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-SGG-ZY', name: '时柱得食', trigger: [{ op: 'in_pillar', args: ['hour', 'gan'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 10, mutex: ['COMBO-SGG-YS'] },
      { id: 'COMBO-SGG-YS', name: '时柱压力', trigger: [{ op: 'in_pillar', args: ['hour', 'zhi'] }, { op: 'has', args: ['tenGods', '七杀'] }], priority: 20, mutex: ['COMBO-SGG-ZY'] },
    ],
    templates: [
      { comboId: 'COMBO-SGG-ZY', pro: '时柱坐食神，子女缘厚，晚辈得力，晚年安乐', mix: '你与子女缘分较深，晚年家庭氛围轻松安乐', lay: '你和子女关系好，晚年会过得很舒心', polarity: '+', modality: 'likely', atomicId: 'ATOM-SGG-ZY-001' },
      { comboId: 'COMBO-SGG-YS', pro: '时柱见杀，晚辈事多压力重，晚年需防劳累', mix: '你在晚辈或下属身上投入较多，晚年可能偏忙碌', lay: '你对晚辈管得多，晚年可能比较操劳', polarity: '-', modality: 'tend', atomicId: 'ATOM-SGG-YS-001' },
    ],
    dimTags: ['DIM_01', 'DIM_03'],
  },
  MG: {
    id: 'MG',
    name: '命宫',
    group: 'GW',
    factors: [
      { id: 'MG-1', name: '本命核心', trigger: [{ op: 'has', args: ['pillars.day.gan', '干'] }], fieldBinding: ['pillars.day.ganZhi'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.28, xinpai: 0.30 } },
      { id: 'MG-2', name: '主星特质', trigger: [{ op: 'has', args: ['tenGods', '日主'] }], fieldBinding: ['tenGods'], defaultWeight: 0.26, schools: { ziping: 0.24, mangpai: 0.30, xinpai: 0.26 } },
      { id: 'MG-3', name: '先天格局', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', 'rule'] }], fieldBinding: ['wuxingStrength.dominantByRule', 'wuxingStrength.ruleBasis'], defaultWeight: 0.24, schools: { ziping: 0.26, mangpai: 0.22, xinpai: 0.24 } },
      { id: 'MG-4', name: '一生主轴', trigger: [{ op: 'has', args: ['luckInfo.cycles', 'year'] }], fieldBinding: ['luckInfo.cycles'], defaultWeight: 0.20, schools: { ziping: 0.20, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-MG-QG', name: '命宫格正', trigger: [{ op: 'has', args: ['tenGods', '日主'] }, { op: 'has', args: ['wuxingStrength.dominantByRule', 'rule'] }], priority: 10, mutex: ['COMBO-MG-HJ'] },
      { id: 'COMBO-MG-HJ', name: '命宫失衡', trigger: [{ op: 'has', args: ['tenGods', '日主'] }, { op: 'has', args: ['pillarRelations.xingChong', '冲'] }], priority: 20, mutex: ['COMBO-MG-QG'] },
    ],
    templates: [
      { comboId: 'COMBO-MG-QG', pro: '命宫格局清正，日主得势，一生主轴稳定', mix: '你的人生主线较清晰，做事有方向感，格局较正', lay: '你心里有数，做事比较有条理，人生方向不乱', polarity: '+', modality: 'likely', atomicId: 'ATOM-MG-QG-001' },
      { comboId: 'COMBO-MG-HJ', pro: '命宫逢冲，格局失衡，人生主轴多变动', mix: '你的人生方向较易受外力扰动，需要自我定力', lay: '你的人生路上变数多，需要自己拿定主意', polarity: '-', modality: 'tend', atomicId: 'ATOM-MG-HJ-001' },
    ],
    dimTags: ['DIM_01'],
  },
  SGS: {
    id: 'SGS',
    name: '身宫',
    group: 'GW',
    factors: [
      { id: 'SGS-1', name: '身位载体', trigger: [{ op: 'in_pillar', args: ['hour', 'gan'] }], fieldBinding: ['pillars.hour.ganZhi'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'SGS-2', name: '后半生走向', trigger: [{ op: 'has', args: ['luckInfo.cycles', 'year'] }], fieldBinding: ['luckInfo.cycles'], defaultWeight: 0.26, schools: { ziping: 0.24, mangpai: 0.30, xinpai: 0.26 } },
      { id: 'SGS-3', name: '行动力', trigger: [{ op: 'has', args: ['tenGods', '日主'] }], fieldBinding: ['tenGods'], defaultWeight: 0.24, schools: { ziping: 0.26, mangpai: 0.22, xinpai: 0.24 } },
      { id: 'SGS-4', name: '身心状态', trigger: [{ op: 'has', args: ['wuxingStrength.present', '干'] }], fieldBinding: ['wuxingStrength.present'], defaultWeight: 0.20, schools: { ziping: 0.22, mangpai: 0.16, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-SGS-QD', name: '身宫气足', trigger: [{ op: 'has', args: ['tenGods', '日主'] }, { op: 'has', args: ['wuxingStrength.present', '干'] }], priority: 10, mutex: ['COMBO-SGS-QR'] },
      { id: 'COMBO-SGS-QR', name: '身宫气弱', trigger: [{ op: 'has', args: ['tenGods', '日主'] }, { op: 'has', args: ['wuxingStrength.missing', '干'] }], priority: 20, mutex: ['COMBO-SGS-QD'] },
    ],
    templates: [
      { comboId: 'COMBO-SGS-QD', pro: '身宫气足，行动力强，后半生身心状态稳', mix: '你行动力较足，后半生身心状态较稳定，能持续发力', lay: '你做事有干劲，后半辈子身体和精神都比较稳', polarity: '+', modality: 'likely', atomicId: 'ATOM-SGS-QD-001' },
      { comboId: 'COMBO-SGS-QR', pro: '身宫气弱，行动力不足，后半生需补养身心', mix: '你后半生行动力偏缓，身心需要更多调养与休息', lay: '你后半辈子节奏偏慢，要多注意养精蓄锐', polarity: '-', modality: 'tend', atomicId: 'ATOM-SGS-QR-001' },
    ],
    dimTags: ['DIM_01', 'DIM_03'],
  },
};
