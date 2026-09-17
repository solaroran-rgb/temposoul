/**
 * C12-知识库文章：十神与六亲：传统对应及其边界
 * 文件路径：src/data/knowledge/content/shishen-liuqin.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shishen-liuqin',
  title: '十神与六亲：传统对应及其边界',
  metaDescription:
    '传统命理把十神比附到父母、配偶、子女等六亲关系上。本文梳理这些对应从何而来，说明它们只是古代社会结构的比附，不能当成现实家庭关系断言。',
  h1: '十神与六亲：传统对应及其边界',
  category: 'shishen',
  tags: ['十神', '六亲', '家庭关系'],
  sections: [
    {
      heading: '什么是六亲比附：为什么十神会扯上家人',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '传统命理把十神进一步比附到家庭成员，俗称"看六亲"。常见的对应是：印星象母亲，财星象父亲或配偶（男命以财为妻），官杀象女儿或丈夫（女命以官杀为夫），食伤象子女，比劫象兄弟同辈。这些对应不是从五行里"推导"出来的物理规律，而是古人把"生我、我生、克我、同我"这套关系，投射到"谁养我、我生谁、谁管我、谁和我平级"的家庭结构上得到的比喻。',
        },
        {
          kind: 'list',
          items: [
            '印（生我）→ 母亲、长辈、庇护者。',
            '财（我克）→ 父亲，男命又以财为妻。',
            '官杀（克我）→ 女命以官杀为夫，也象女儿。',
            '食伤（我生）→ 子女。',
            '比劫（同我）→ 兄弟、姐妹、同辈。',
          ],
        },
        {
          kind: 'paragraph',
          text: '要注意这些对应强依赖于古代家庭与性别秩序：男尊女卑、长子继承、一妻多妾的社会背景，决定了为什么"妻"被放在财（我所克）的位置上。一旦离开这个背景，这些比附就失去解释力，更不能反过来用八字去推断某个具体亲属的健康、命运或关系好坏。',
        },
      ],
    },
    {
      heading: '为什么不能用它断现实家庭',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '第一，对应体系本身有矛盾与例外。古书在"财为父""官为夫"等问题上流派不一，有的还区分正偏、阴阳、地支藏干，结论常常互相打架。第二，现代家庭结构——单亲、再婚、同性伴侣、丁克、跨代抚养——根本无法被"男命财为妻"这种单一投射覆盖。第三，也是最重要的：把八字里某个字说成"你克母／克夫／克子"，是对一个活生生的人的武断断言，既不科学也不伦理。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '六亲比附是古人对家庭关系的隐喻式分类，不是对真实家庭成员的诊断书。任何"你命里克某亲人"的说法都超出符号系统能说的范围，不应据此看待家人、干预关系或制造焦虑。',
        },
      ],
    },
    {
      heading: '合理的读法：当作关系模式的隐喻',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '与其追问"我八字里财星旺是不是婚姻好"，不如把六亲比附当作一面镜子：印重的人可能习惯寻求庇护、与长辈联结深；食伤重的人表达欲强、也可能为后代或创作投入很多；比劫重的人同辈关系活跃、边界感可能弱一些。这些是对自我关系模式的观察，不是对某个具体人的判决。',
        },
        {
          kind: 'paragraph',
          text: '现实中的家庭关系，由沟通、经济、健康、历史事件共同决定，远不是八个字能涵盖。把命理作为自我反思的谈资可以，作为处理家庭问题的依据则应当让位给现实沟通与必要时的专业帮助。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律在介绍十神时会提及它在传统上的六亲比喻，但明确标注为"古代社会结构下的比附"，不输出对任何具体亲属的吉凶或健康判断，也不把十神强弱与家庭关系好坏划等号。',
        },
      ],
    },
  ],
  sources: [
    {
      text: '据《渊海子平》《三命通会》六亲取象条目及传统家庭结构背景整理',
      confidence: 'legendary',
    },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shishen-overview',
    'shishen-misunderstand',
    'shishen-yinxing',
    'shishen-caixing',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer:
    '本文为传统命理民俗科普，不构成对任何家庭关系或亲属个人命运的判断，不构成现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
