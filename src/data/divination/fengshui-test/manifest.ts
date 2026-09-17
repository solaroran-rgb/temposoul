import type { FsManifest } from './types';

export const FS_MANIFEST: FsManifest = {
  questionCount: 8,
  rulesetVersion: 'fengshui-test/v1.0.0',
  degradedMessage: '结果服务降级，已保存答案，可稍后重试。',
  emptyMessage: '该组合规则整理中，敬请期待。',
};

export const FS_DRAFT_KEY = 'temposoul:a23:fs-test:draft';
export const FS_RESULT_KEY_PREFIX = 'temposoul:a23:fs-test:result:';
