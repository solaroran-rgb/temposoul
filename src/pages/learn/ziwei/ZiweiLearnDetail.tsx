/**
 * 紫微入门教程 · 章节详情页
 */
import LessonDetailPage from '../shared/LessonDetailPage';
import { ZIWEI_TUTORIAL } from '@/data/content/learn';

export default function ZiweiLearnDetail() {
  return (
    <LessonDetailPage records={ZIWEI_TUTORIAL} courseTitle="紫微入门教程" basePath="/learn/ziwei" />
  );
}
