# 星空纪念事件 · 持久化与分享名片（T05 · D7-SKY 二期）

> 任务卡：`T05_星空纪念事件持久化与分享名片_20260930.md`
> 目标：把用户在星空页「保存的星空时刻」（时间 / 地理 / 星空参数快照）做持久化，并生成不可枚举的分享名片 URL（独立只读渲染页），带鉴权与防遍历。

---

## 1. 设计要点

- **复用现有登录 token 鉴权**：`readIdentity(token, AUTH_SECRET)`（HMAC-SHA256 JWT，`sub = 邮箱 = userId`）。本人事件操作必须带 `Authorization: Bearer <token>`。
- **存储复用 `AUTH_KV`**：本项目为 Cloudflare Pages，无数据库迁移需求；本特征沿用既有的 KV 持久化模式（与 `report/store.ts` 一致的「逆向索引 + 级联删除」），**无需新增 Cloudflare 绑定**。
- **分享 token 不可枚举**：128-bit 随机 `base64url`（≈22 字符），仅按 token 取数据；**不存在任何「列出全部事件」端点**，从根上杜绝遍历。
- **越权即 404**：读他人事件 / 不存在事件一律返回 `404 not_found`，不泄露存在性。
- **公开投影剔除隐私字段**：分享只读接口返回数据但不含 `userId`（邮箱）。
- **不重写渲染引擎**：分享页直接复用真实天文引擎（`createSkyScene` + `setTimeLocation`），按快照冻结渲染某一时刻的星空。

---

## 2. KV key 布局（= 本特征的「迁移 / schema」）

> KV 为 schemaless，以下即权威 key 契约。上线无需执行任何迁移脚本；只要 `AUTH_KV` 已绑定即可。

| Key | 值 | TTL | 说明 |
| --- | --- | --- | --- |
| `skyevt:data:<id>` | `JSON(SkyEvent)` | 5 年 | 事件数据主体（见 §3） |
| `skyevt:share:<token>` | `<id>` | 5 年 | token → 事件 映射（公开只读） |
| `skyevt_index:<userId>` | `string[]`（eventId） | 5 年 | 用户逆向索引，用于列表 / 级联删除 |

级联：每个事件创建时还会把 `skyevt:data:<id>`、`skyevt:share:<token>`、`skyevt_index:<userId>` 注册进既有 `user_assets:<userId>`，使账号级联删除（隐私合规 `me/data.ts`）一并清理纪念事件。

---

## 3. 数据模型 `SkyEvent`

```ts
interface SkyEvent {
  id: string;            // 内部主键 evt_<96bit>，非公开
  userId: string;        // identity.sub（邮箱）
  title: string;         // 纪念名称（1..120）
  note: string;          // 纪念文案（0..2000）
  eventTime: string;     // ISO8601 —— 天文时刻（渲染快照由 时间+经纬度 决定）
  lat: number;           // -90..90
  lng: number;           // -180..180
  locationName: string;  // 地点名（0..120）
  skySnapshot: Record<string, unknown>; // 星空参数快照（可扩展，当前含 {source,savedAt}）
  shareToken: string;    // 128-bit base64url，公开分享用
  createdAt: string;
  updatedAt: string;
}
```

> 引擎确定性：星空由「时刻 + 经纬度」完全决定，因此分享页只需 `eventTime/lat/lng` 即可精确复现；`skySnapshot` 容纳未来扩展的渲染偏好。

---

## 4. API 端点

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| `GET` | `/api/v1/sky-events` | 本人 | 列出本人全部纪念事件 |
| `POST` | `/api/v1/sky-events` | 本人 | 创建事件，返回含 `shareToken` |
| `GET` | `/api/v1/sky-events/:id` | 本人 | 读取本人事件（越权/不存在 → 404） |
| `PUT` | `/api/v1/sky-events/:id` | 本人 | 部分更新（越权/不存在 → 404） |
| `DELETE` | `/api/v1/sky-events/:id` | 本人 | 删除（数据 + 分享映射 + 索引级联） |
| `GET` | `/api/v1/sky-events/share/:token` | **公开** | 按 token 只读返回公开投影（不存在 → 404） |

输入校验（`_http.ts`）：`title` 必填 ≤120；`note` ≤2000；`eventTime` 须可解析；`lat/lng` 范围；`locationName` ≤120。

---

## 5. 防遍历 / 安全模型

1. 分享 token 为 128-bit 随机，暴力枚举成本 ≈ 2¹²⁸，不可行。
2. 无任何「枚举 / 列表他人事件」端点；本人列表需有效登录 token。
3. 越权访问一律 `404`（与「不存在」同态），攻击方无法区分。
4. 公开分享只读，且不返回 `userId`；被分享者无法改删。
5. 复用 `_middleware.ts` 的安全头注入（`X-Frame-Options: DENY` 等）。

---

## 6. 前端

- **保存入口**：`src/pages/SkyPage/SkyPage.tsx` 顶部新增「保存纪念」「我的纪念」按钮 → `SkyEventTools.tsx`（保存弹窗 + 我的纪念列表，支持复制名片链接 / 打开 / 删除）。
- **分享名片页**：`src/pages/SkyEventSharePage/SkyEventSharePage.tsx`，路由 `/sky-event/:token`（公开只读，无需登录），复用 `createSkyScene` 冻结渲染并叠加纪念文案 / 地点 / 时间 HUD。
- **API 客户端**：`src/lib/skyevent/api.ts`（自动附带 Bearer；公开读无需 token）。

---

## 7. 测试

```
node_modules/.bin/tsx --test tests/sky-event.test.ts
```

覆盖：CRUD、本人鉴权语义、越权返回 null、列表无跨用户泄漏、更新/删除、公开投影剔除 `userId`、token 不可枚举（5000 个无碰撞 + 格式校验）、防遍历（随机 token 取不到真实事件）。

---

## 8. 验收对照（任务卡 §6）

- ✅ 事件保存后跨会话可取（KV 持久化 + 列表/读取接口）
- ✅ 分享 URL 打开渲染正确（`/sky-event/:token` 复用真实引擎冻结渲染）
- ✅ 越权访问他人事件被拒（本人校验，越权 → 404）
- ✅ token 不可枚举（128-bit 随机 + 无枚举端点 + 遍历测试通过）
