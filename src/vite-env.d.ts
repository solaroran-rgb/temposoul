/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_DONATION_BOX?: string;
  /** 错误埋点公开写入令牌（仅写权限，可安全嵌入前端）；缺省则前端静默不发送 */
  readonly VITE_ERRLOG_INGEST_TOKEN?: string;
}
