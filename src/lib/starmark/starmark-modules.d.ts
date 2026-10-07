/**
 * starmark 模块本地类型声明（不装 @types/pngjs、不动共享 tsconfig）。
 * - pngjs：devDep 已装但无类型声明，这里给最小 any 模块声明（仅本模块用其 RGBA->PNG）。
 * - @napi-rs/canvas：L1 主路径原生依赖，当前环境未装成；动态 import 时让 tsc 能解析模块名。
 */
declare module 'pngjs';
declare module '@napi-rs/canvas';
