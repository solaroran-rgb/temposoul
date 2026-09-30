/**
 * 周公解梦词典（首批 50 条）
 * 诚实标注：释义为民间流传的《周公解梦》类说法，版本众多、表述各异；
 * 只收录通行度高、表述稳妥的条目，不复述具体古籍原文；
 * caution 字段强制非空（心理/医学边界）。
 */
export const DREAM_SOURCE = '民间流传《周公解梦》类说法（民俗文化参考）';

export const DREAM_CAUTION =
  '本内容为民俗文化参考，不构成医学或心理方面的判断；如相关困扰持续存在，请咨询专业机构。';

export interface DreamEntry {
  id: string;
  keyword: string;
  aliases: string[];
  category: string;
  traditionalText: string;
  modernText: string;
  caution: string;
}

export const DREAM_ENTRIES: DreamEntry[] = [
  { id: 'water', keyword: '水', aliases: ['河水', '清水', '大水'], category: '自然', traditionalText: '梦见清水，主顺遂；水势平稳多被解为心境安宁。', modernText: '水在梦中常映射情绪状态，平静的水面通常对应内心较为安稳的阶段。', caution: DREAM_CAUTION },
  { id: 'fire', keyword: '火', aliases: ['大火', '火焰'], category: '自然', traditionalText: '梦见火，主旺相，也提示情绪激动。', modernText: '火常与强烈的情绪或紧迫感相关，可留意近期是否处于高消耗状态。', caution: DREAM_CAUTION },
  { id: 'fly', keyword: '飞翔', aliases: ['飞', '飞行'], category: '身体', traditionalText: '梦见飞翔，主心愿得展。', modernText: '飞翔常与对自由的向往或对现状的超越感有关。', caution: DREAM_CAUTION },
  { id: 'fall', keyword: '坠落', aliases: ['掉落', '下坠'], category: '身体', traditionalText: '梦见坠落，主心神不定。', modernText: '坠落多与失控感或对某件事缺乏把握有关。', caution: DREAM_CAUTION },
  { id: 'snake', keyword: '蛇', aliases: ['大蛇', '小蛇'], category: '动物', traditionalText: '梦见蛇，传统说法多与隐忧相关，需看情境。', modernText: '蛇的象征较为复杂，常与潜藏的顾虑或被忽略的细节有关。', caution: DREAM_CAUTION },
  { id: 'fish', keyword: '鱼', aliases: ['钓鱼', '抓鱼'], category: '动物', traditionalText: '梦见鱼，主有余庆。', modernText: '鱼常与收获、机会的意象相连，也与「余」的谐音文化有关。', caution: DREAM_CAUTION },
  { id: 'house', keyword: '房屋', aliases: ['房子', '老宅'], category: '居所', traditionalText: '梦见房屋，主家宅安宁；房屋破损则提示留意家中事务。', modernText: '房屋常象征自我空间与安全感，破损多对应边界被扰动。', caution: DREAM_CAUTION },
  { id: 'road', keyword: '道路', aliases: ['马路', '小路'], category: '行旅', traditionalText: '梦见坦途，主顺遂；路阻则提示谋事宜缓。', modernText: '道路常映射方向与进程，阻塞多对应决策未定。', caution: DREAM_CAUTION },
  { id: 'exam', keyword: '考试', aliases: ['考场', '试题'], category: '事务', traditionalText: '梦见考试，主心有挂碍。', modernText: '考试梦常与被评价、被检验的压力有关，不限于学生时期。', caution: DREAM_CAUTION },
  { id: 'money', keyword: '钱', aliases: ['钞票', '金币'], category: '事务', traditionalText: '梦见得钱，主有进益；失钱则提示留意开支。', modernText: '金钱梦多与安全感与资源感有关，可回顾近期的实际压力源。', caution: DREAM_CAUTION },
  { id: 'rain', keyword: '雨', aliases: ['下雨', '暴雨'], category: '自然', traditionalText: '梦见雨，主有润泽，也提示情绪宣泄。', modernText: '雨常对应情绪的释放或外部环境的变动。', caution: DREAM_CAUTION },
  { id: 'snow', keyword: '雪', aliases: ['下雪', '积雪'], category: '自然', traditionalText: '梦见雪，主清白宁静。', modernText: '雪多与冷静、沉淀或暂时的停滞有关。', caution: DREAM_CAUTION },
  { id: 'mountain', keyword: '山', aliases: ['爬山', '高山'], category: '自然', traditionalText: '梦见登山，主步步高升；山阻则提示事有阻滞。', modernText: '山常对应目标与难度，攀登过程反映投入与阻力。', caution: DREAM_CAUTION },
  { id: 'sea', keyword: '海', aliases: ['大海', '海洋'], category: '自然', traditionalText: '梦见大海，主胸怀开阔，也提示心事浩茫。', modernText: '海常与广阔但难以掌控的感受相关。', caution: DREAM_CAUTION },
  { id: 'river', keyword: '河流', aliases: ['江水', '溪流'], category: '自然', traditionalText: '梦见河流，主事务流转不停。', modernText: '河流常对应时间感与事情的连续推进。', caution: DREAM_CAUTION },
  { id: 'tree', keyword: '树', aliases: ['大树', '树木'], category: '自然', traditionalText: '梦见树木繁茂，主家业兴旺。', modernText: '树常与成长、支撑与长期积累有关。', caution: DREAM_CAUTION },
  { id: 'flower', keyword: '花', aliases: ['开花', '鲜花'], category: '自然', traditionalText: '梦见花开，主喜事将至。', modernText: '花多与阶段性成果或情感表达有关。', caution: DREAM_CAUTION },
  { id: 'dog', keyword: '狗', aliases: ['小狗', '犬'], category: '动物', traditionalText: '梦见狗，主有友相助。', modernText: '狗常与忠诚、陪伴与信任关系有关。', caution: DREAM_CAUTION },
  { id: 'cat', keyword: '猫', aliases: ['小猫'], category: '动物', traditionalText: '梦见猫，主需留意身边细微之事。', modernText: '猫常与独立、敏感或未被言明的直觉有关。', caution: DREAM_CAUTION },
  { id: 'bird', keyword: '鸟', aliases: ['飞鸟', '小鸟'], category: '动物', traditionalText: '梦见飞鸟，主音信将至。', modernText: '鸟常与消息、自由或视角的提升有关。', caution: DREAM_CAUTION },
  { id: 'horse', keyword: '马', aliases: ['骏马'], category: '动物', traditionalText: '梦见马，主奔波进取。', modernText: '马常与行动力、推进节奏有关。', caution: DREAM_CAUTION },
  { id: 'tiger', keyword: '虎', aliases: ['老虎'], category: '动物', traditionalText: '梦见虎，主有强劲对手。', modernText: '虎常对应压力源或需要正视的强势力量。', caution: DREAM_CAUTION },
  { id: 'dragon', keyword: '龙', aliases: ['飞龙'], category: '神兽', traditionalText: '梦见龙，主贵显之象。', modernText: '龙在传统文化中属祥瑞意象，多与宏大期待有关。', caution: DREAM_CAUTION },
  { id: 'phoenix', keyword: '凤凰', aliases: ['凤'], category: '神兽', traditionalText: '梦见凤凰，主祥瑞和合。', modernText: '凤凰常与转机与新阶段的意象相连。', caution: DREAM_CAUTION },
  { id: 'deceased', keyword: '已故之人', aliases: ['故人', '逝者'], category: '人物', traditionalText: '梦见故人，多被解为思念所结。', modernText: '这类梦多与未完成的情感联结有关，通常反映思念而非其他。', caution: DREAM_CAUTION },
  { id: 'child', keyword: '小孩', aliases: ['婴儿', '孩童'], category: '人物', traditionalText: '梦见孩童，主新生之象。', modernText: '孩童常与新的开始、脆弱或需要照顾的部分有关。', caution: DREAM_CAUTION },
  { id: 'wedding', keyword: '婚礼', aliases: ['结婚', '喜宴'], category: '事务', traditionalText: '梦见婚嫁，主有合和之喜；亦有解释为事务将定。', modernText: '婚礼梦多与承诺、结合或对关系阶段的思考有关。', caution: DREAM_CAUTION },
  { id: 'funeral', keyword: '丧事', aliases: ['葬礼', '出殡'], category: '事务', traditionalText: '梦见丧事，传统说法中反主有喜，需结合情境。', modernText: '这类梦常与结束、告别或对变化的心理准备有关。', caution: DREAM_CAUTION },
  { id: 'lost', keyword: '迷路', aliases: ['走失', '找不到路'], category: '行旅', traditionalText: '梦见迷路，主方向未明。', modernText: '迷路常对应目标不清或选择困难。', caution: DREAM_CAUTION },
  { id: 'chase', keyword: '被追赶', aliases: ['追', '逃跑'], category: '身体', traditionalText: '梦见被追，主心有压力。', modernText: '被追赶多与现实中回避的问题有关。', caution: DREAM_CAUTION },
  { id: 'fall-teeth', keyword: '掉牙', aliases: ['牙齿脱落'], category: '身体', traditionalText: '梦见掉牙，传统说法多与亲族或口舌相关。', modernText: '这类梦常与失控感、形象焦虑或对变化的担忧有关。', caution: DREAM_CAUTION },
  { id: 'hair', keyword: '头发', aliases: ['掉发', '剪发'], category: '身体', traditionalText: '梦见理发，主去旧迎新。', modernText: '头发常与自我形象与状态的改变有关。', caution: DREAM_CAUTION },
  { id: 'clothes', keyword: '衣服', aliases: ['新衣', '衣衫'], category: '日用', traditionalText: '梦见新衣，主有更新之象。', modernText: '衣服常对应社会角色与自我呈现。', caution: DREAM_CAUTION },
  { id: 'shoes', keyword: '鞋', aliases: ['鞋子', '丢鞋'], category: '日用', traditionalText: '梦见鞋，主行进之事；失鞋则提示行事宜慎。', modernText: '鞋常对应所处的路径与立足点。', caution: DREAM_CAUTION },
  { id: 'mirror', keyword: '镜子', aliases: ['照镜'], category: '日用', traditionalText: '梦见照镜，主自省之象。', modernText: '镜子常对应自我审视与身份认同。', caution: DREAM_CAUTION },
  { id: 'food', keyword: '吃饭', aliases: ['进食', '宴席'], category: '日用', traditionalText: '梦见饮食，主有供养之象。', modernText: '进食梦常与需求满足、社交或安全感有关。', caution: DREAM_CAUTION },
  { id: 'fruit', keyword: '果实', aliases: ['水果', '摘果'], category: '自然', traditionalText: '梦见硕果，主所劳有获。', modernText: '果实常对应付出后的阶段成果。', caution: DREAM_CAUTION },
  { id: 'star', keyword: '星星', aliases: ['星辰', '星空'], category: '天象', traditionalText: '梦见星辰，主心愿高远。', modernText: '星辰常与远景、希望与方向感有关。', caution: DREAM_CAUTION },
  { id: 'moon', keyword: '月亮', aliases: ['明月', '月食'], category: '天象', traditionalText: '梦见明月，主心境澄明。', modernText: '月亮常与情绪周期、内在感受有关。', caution: DREAM_CAUTION },
  { id: 'sun', keyword: '太阳', aliases: ['日出', '阳光'], category: '天象', traditionalText: '梦见日出，主运势转明。', modernText: '太阳常与清晰、能量与新的开始有关。', caution: DREAM_CAUTION },
  { id: 'car', keyword: '车', aliases: ['汽车', '开车'], category: '行旅', traditionalText: '梦见行车，主事务推进；车阻则提示宜缓。', modernText: '车常对应对生活的掌控感与推进节奏。', caution: DREAM_CAUTION },
  { id: 'boat', keyword: '船', aliases: ['乘船', '渡河'], category: '行旅', traditionalText: '梦见渡船，主过渡之象。', modernText: '船常对应阶段转换与跨越。', caution: DREAM_CAUTION },
  { id: 'bridge', keyword: '桥', aliases: ['过桥', '断桥'], category: '行旅', traditionalText: '梦见过桥，主过渡得济。', modernText: '桥常对应连接与过渡，断桥多对应中断感。', caution: DREAM_CAUTION },
  { id: 'stairs', keyword: '楼梯', aliases: ['爬楼', '阶梯'], category: '居所', traditionalText: '梦见登阶，主步步而上。', modernText: '阶梯常对应逐步推进的过程与进度感。', caution: DREAM_CAUTION },
  { id: 'door', keyword: '门', aliases: ['开门', '关门'], category: '居所', traditionalText: '梦见开门，主有新机；闭门则提示宜守。', modernText: '门常对应机会与边界的开启或关闭。', caution: DREAM_CAUTION },
  { id: 'key', keyword: '钥匙', aliases: ['找钥匙'], category: '日用', traditionalText: '梦见钥匙，主得解法。', modernText: '钥匙常对应解决问题的方法或突破口。', caution: DREAM_CAUTION },
  { id: 'book', keyword: '书', aliases: ['读书', '书籍'], category: '事务', traditionalText: '梦见读书，主增益见闻。', modernText: '书常对应学习、求知与信息整理。', caution: DREAM_CAUTION },
  { id: 'clock', keyword: '钟表', aliases: ['时钟', '手表'], category: '日用', traditionalText: '梦见钟表，主时宜之思。', modernText: '钟表常对应时间压力与节奏安排。', caution: DREAM_CAUTION },
  { id: 'gift', keyword: '礼物', aliases: ['收礼', '送礼'], category: '事务', traditionalText: '梦见受礼，主有外助。', modernText: '礼物常对应被认可、被在意或关系往来。', caution: DREAM_CAUTION },
  { id: 'mouse', keyword: '老鼠', aliases: ['耗子', '小鼠'], category: '动物', traditionalText: '梦见鼠，传统说法多与细微损耗相关。', modernText: '老鼠常与被忽略的小困扰或资源流失感有关。', caution: DREAM_CAUTION },
  { id: 'ant', keyword: '蚂蚁', aliases: ['蚁群'], category: '动物', traditionalText: '梦见蚁群，主小事积累。', modernText: '蚂蚁常对应忙碌、协作或被琐事缠身的感受。', caution: DREAM_CAUTION },
  { id: 'spider', keyword: '蜘蛛', aliases: ['蛛网'], category: '动物', traditionalText: '梦见蜘蛛，主经营织网之象。', modernText: '蜘蛛常与耐心经营、人际网络或被缠绕感有关。', caution: DREAM_CAUTION },
  { id: 'pig', keyword: '猪', aliases: ['肥猪', '小猪'], category: '动物', traditionalText: '梦见猪，传统说法多与财禄福泽相关。', modernText: '猪常与富足、慵懒或未被约束的需求感相连。', caution: DREAM_CAUTION },
  { id: 'ox', keyword: '牛', aliases: ['黄牛', '水牛'], category: '动物', traditionalText: '梦见牛，主勤恳得助。', modernText: '牛常对应踏实付出、耐力或承担感。', caution: DREAM_CAUTION },
  { id: 'sheep', keyword: '羊', aliases: ['绵羊', '山羊'], category: '动物', traditionalText: '梦见羊，主和顺之象。', modernText: '羊常与温顺、从众或安全感的需求有关。', caution: DREAM_CAUTION },
  { id: 'rabbit', keyword: '兔', aliases: ['兔子'], category: '动物', traditionalText: '梦见兔，主敏捷避险。', modernText: '兔常与敏感、避险或对舒适感的追求有关。', caution: DREAM_CAUTION },
  { id: 'blood', keyword: '血', aliases: ['流血', '出血'], category: '身体', traditionalText: '梦见见血，传统说法不一，需看情境。', modernText: '血常与生命力、消耗感或情绪冲击相关。', caution: DREAM_CAUTION },
  { id: 'naked', keyword: '裸体', aliases: ['光身', '赤身'], category: '身体', traditionalText: '梦见裸体，传统说法多与羞惧相关。', modernText: '裸体梦常与暴露感、自我形象焦虑或缺乏安全感有关。', caution: DREAM_CAUTION },
  { id: 'late', keyword: '迟到', aliases: ['赶不上', '误点'], category: '事务', traditionalText: '梦见迟到，主心有急迫。', modernText: '迟到梦常与时间压力、害怕辜负期待有关。', caution: DREAM_CAUTION },
  { id: 'plane', keyword: '飞机', aliases: ['坐飞机', '航班'], category: '行旅', traditionalText: '梦见飞行远行，主志向高远。', modernText: '飞机常与远行、跨越或对更高视野的向往有关。', caution: DREAM_CAUTION },
  { id: 'train', keyword: '火车', aliases: ['列车', '坐火车'], category: '行旅', traditionalText: '梦见乘车，主随轨而行。', modernText: '火车常与既定节奏、集体进程或身不由己感有关。', caution: DREAM_CAUTION },
  { id: 'phone', keyword: '电话', aliases: ['手机', '来电'], category: '日用', traditionalText: '梦见通话，主有信息至。', modernText: '电话常与沟通、联系或未被回应的期待有关。', caution: DREAM_CAUTION },
  { id: 'wallet', keyword: '钱包', aliases: ['皮夹', '丢钱包'], category: '日用', traditionalText: '梦见失包，主留意财物。', modernText: '钱包常与安全感、价值感或自我边界有关。', caution: DREAM_CAUTION },
  { id: 'ring', keyword: '戒指', aliases: ['指环', '钻戒'], category: '日用', traditionalText: '梦见戴戒，主有承诺。', modernText: '戒指常与承诺、联结或契约感有关。', caution: DREAM_CAUTION },
  { id: 'candle', keyword: '蜡烛', aliases: ['烛火'], category: '日用', traditionalText: '梦见烛明，主有明烛之象。', modernText: '蜡烛常与温暖、希望或有限而珍贵的能量有关。', caution: DREAM_CAUTION },
  { id: 'hospital', keyword: '医院', aliases: ['看病', '病房'], category: '居所', traditionalText: '梦见就医，传统说法多与调养相关。', modernText: '医院常与修复、照料或对健康状态的关注有关。', caution: DREAM_CAUTION },
  { id: 'school', keyword: '学校', aliases: ['上课', '校园'], category: '事务', traditionalText: '梦见学堂，主温习旧学。', modernText: '学校常与学习、评价或对成长阶段的回看有关。', caution: DREAM_CAUTION },
  { id: 'elevator', keyword: '电梯', aliases: ['升降梯'], category: '居所', traditionalText: '梦见升降，主运有起伏。', modernText: '电梯常与阶段升降、节奏被他人带动的感受有关。', caution: DREAM_CAUTION },
  { id: 'forest', keyword: '森林', aliases: ['树林', '丛林'], category: '自然', traditionalText: '梦见入林，主幽深未测。', modernText: '森林常与未知、潜意识或需要探索的内心领域有关。', caution: DREAM_CAUTION },
  { id: 'cloud', keyword: '云', aliases: ['乌云', '白云'], category: '天象', traditionalText: '梦见云聚，主事有端倪。', modernText: '云常与思绪、心境变化或情绪的浮动有关。', caution: DREAM_CAUTION },
  { id: 'thunder', keyword: '雷', aliases: ['打雷', '雷鸣'], category: '天象', traditionalText: '梦见雷声，主警醒之象。', modernText: '雷常与突发信息、警醒或情绪的骤然波动有关。', caution: DREAM_CAUTION },
  { id: 'shower', keyword: '洗澡', aliases: ['沐浴', '冲澡'], category: '身体', traditionalText: '梦见沐浴，主去垢更新。', modernText: '洗澡常与卸下负担、净化或重新出发的意愿有关。', caution: DREAM_CAUTION },
  { id: 'cry', keyword: '哭泣', aliases: ['大哭', '流泪'], category: '身体', traditionalText: '梦见哭泣，传统说法多主情绪宣泄。', modernText: '梦中哭泣常对应未在白天表达的情绪释放。', caution: DREAM_CAUTION },
];

function score(entry: DreamEntry, keyword: string): number {
  const k = keyword.trim();
  if (!k) return 0;
  if (entry.keyword === k) return 100;
  if (entry.aliases.includes(k)) return 80;
  if (entry.keyword.includes(k)) return 50;
  if (entry.aliases.some((a) => a.includes(k))) return 30;
  return 0;
}

/** 确定性匹配：无随机成分，同输入恒定同序 */
export function searchDream(keyword: string): DreamEntry[] {
  const k = keyword.trim();
  if (!k) return [];
  return DREAM_ENTRIES.map((e) => ({ e, s: score(e, k) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || (a.e.id < b.e.id ? -1 : 1))
    .map((x) => x.e);
}
