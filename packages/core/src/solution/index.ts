/**
 * @temposoul/core · solution 统一出口
 *
 * G01 收口：将解盘引擎（./semantic/index，runSolution 等）与
 * L0-L4 五层输出 schema（./types）合并为一个命名空间导出。
 * 前端 `import { solution } from '@temposoul/core'` 可同时访问
 * `solution.runSolution` 与 `solution.L0L4Output / DepthLevel` 等。
 *
 * G03 收口：追加 AI 回答标准化（./aiResponse，结论+依据+置信度+建议 四段式）。
 */
export * from './semantic/index';
export * from './types';
export * from './aiResponse';
