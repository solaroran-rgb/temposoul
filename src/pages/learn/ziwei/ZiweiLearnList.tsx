/**
 * 紫微入门教程 · 章列表页
 */
import LessonListPage from '../shared/LessonListPage';
import { ZIWEI_TUTORIAL } from '@/data/content/learn';

export default function ZiweiLearnList() {
  return (
    <LessonListPage
      records={ZIWEI_TUTORIAL}
      courseTitle="紫微入门教程"
      courseDesc="六章带你认识紫微斗数：星曜、十二宫、命盘结构、四化、大运与实操。"
      basePath="/learn/ziwei"
    />
  );
}
