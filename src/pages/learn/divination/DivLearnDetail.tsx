/**
 * 占卜入门教程 · 章节详情页
 */
import LessonDetailPage from '../shared/LessonDetailPage';
import { DIV_TUTORIAL } from '@/data/content/learn';

export default function DivLearnDetail() {
  return (
    <LessonDetailPage
      records={DIV_TUTORIAL}
      courseTitle="占卜入门教程"
      basePath="/learn/divination"
    />
  );
}
