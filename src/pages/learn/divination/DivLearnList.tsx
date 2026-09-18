/**
 * 占卜入门教程 · 章列表页
 */
import LessonListPage from '../shared/LessonListPage';
import { DIV_TUTORIAL } from '@/data/content/learn';

export default function DivLearnList() {
  return (
    <LessonListPage
      records={DIV_TUTORIAL}
      courseTitle="占卜入门教程"
      courseDesc="四章走进占卜文化：周易、塔罗、灵摆，以及一套通用的提问与使用守则。"
      basePath="/learn/divination"
    />
  );
}
