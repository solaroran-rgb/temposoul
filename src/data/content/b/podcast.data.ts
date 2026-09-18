/**
 * B-4 播客：30 集全量（确定性生成，0 占位）+ RSS 2.0 字段
 * 来源：专家 B R3 回收稿 §B-4
 * 路由：/podcast[/:channel_id/:ep_id]
 */
import type { BDomainRecord, PodcastEpisode } from './types';
import { createPodcastRecord } from './_runtime';

const topics = [
  '水逆背锅指南',
  '土星回归',
  '月亮土象',
  '火星白羊',
  '金星双鱼',
  '水星双子',
  '木星射手',
  '天王星水瓶',
  '海王双鱼',
  '冥王天蝎',
  '上升星座',
  '下降星座',
  '天顶星座',
  '天底星座',
  '日月相位',
  '金火相位',
  '水木相位',
  '月土相位',
  '日冥相位',
  '二宫与八宫',
  '三宫与九宫',
  '四宫与十宫',
  '五宫与十一宫',
  '六宫与十二宫',
  '空相行星',
  '逆行行星',
  '星盘格局',
  '凯龙星',
  '南北交点',
  '岁差与占星',
];

function generatePodcast(index: number, title: string): PodcastEpisode {
  const epNum = String(index + 1).padStart(3, '0');
  return {
    channel_id: 'minglv',
    title: `Ep.${epNum} ${title}`,
    description_html: `<p>深度解析${title}背后的心理学与民俗学逻辑。</p>`,
    audio_url: `/audio/ep${epNum}.mp3`,
    duration_sec: 1680 + index * 10, // 确定性微变
    pub_date: new Date(2026, 2, 1 + index * 14).toUTCString(), // 双周更
    guid: `minglv-ep-${epNum}`,
    explicit: false,
    sourceRef: '专家B R3回收稿 §B-4',
    script_sop_blocks: [
      { timecode: '00:00', segment: 'Hook', content: `欢迎收听命律播客，今天我们聊聊${title}。` },
      { timecode: '01:30', segment: '拆解', content: '引入心理学概念，剥离迷信外衣。' },
      { timecode: '10:00', segment: '重建', content: '建立科学的认知框架与应对策略。' },
      { timecode: '22:00', segment: '行动', content: '提供 3 个可落地的微小行动建议。' },
      { timecode: '26:00', segment: 'Outro', content: '命运不背锅，规律在手中。我们下期见。' },
    ],
  };
}

export const podcastEpisodes: BDomainRecord[] = topics.map((title, i) => {
  const data = generatePodcast(i, title);
  const ep = `ep${String(i + 1).padStart(3, '0')}`;
  return createPodcastRecord(
    `pod_minglv_${ep}`,
    {
      title: data.title,
      listPath: '/podcast',
      detailPath: `/podcast/minglv/${ep}`,
      summary: title,
      tags: ['播客', '心理学'],
    },
    data,
  );
});
