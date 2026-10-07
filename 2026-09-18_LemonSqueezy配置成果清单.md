# TempoSoul · Lemon Squeezy 配置成果清单（自动化创建完成）

> 生成：2026-09-18 17:40 ｜ 操作：MainAgent 自动化（浏览器会话）
> 账号：用户已登录的 Lemon Squeezy（TempoSoul 商店）

## 一、✅ 已完成配置

### 1.1 Store（商店）
| 项 | 值 |
|---|---|
| Store 名称 | TempoSoul |
| Store ID | **473001** |
| Store 域名 | temposoul.lemonsqueezy.com |
| 货币 | CNY（人民币） |

### 1.2 产品（5 个已发布，另 1 个旧草稿）

| productId（代码内） | 产品名 | 价格 | 类型 | Product ID | **Variant ID** |
|---|---|---|---|---|---|
| event_9_9 | 事件单购 ¥9.9 | ¥9.90 | 单次 | 1370595 | **2141798** |
| sub_monthly_19_9 | 情绪微订阅·月付 ¥19.9 | ¥19.90/月 | 订阅(月) | 1370628 | **2141845** |
| report_39_9 | AI 十维深度报告 ¥39.9 | ¥39.90 | 单次 | 1370635 | **2141856** |
| premium_88 | 精批旗舰版 ¥88 | ¥88.00 | 单次 | 1370637 | **2141858** |
| sub_yearly_168 | 情绪微订阅·年付 ¥168 | ¥168.00/年 | 订阅(年) | 1370638 | **2141859** |
| — | TempoSoul Pro（旧草稿） | ¥9.99/年 | Draft | 1356751 | 2118676 |

### 1.3 Webhook（已配置 12 事件）
| 项 | 值 |
|---|---|
| Callback URL | https://www.temposoul.com/api/v1/ls-webhook |
| Signing Secret | <REDACTED: 见密钥管理器> |
| Webhook ID | 135151 |
| 订阅事件（12） | order_created / order_refunded / subscription_created / subscription_updated / subscription_cancelled / subscription_resumed / subscription_expired / subscription_payment_failed / subscription_payment_success / subscription_payment_recovered / subscription_payment_refunded / subscription_plan_changed |
| 模式 | ⚠️ Test mode（需商店激活后配置 Live mode） |

### 1.4 API Key（已创建）
| 项 | 值 |
|---|---|
| Key 名称 | temposoul-prod |
| 值 | 已在弹窗显示一次（截图 OCR 有部分误码，**需用户在 Lemon Squeezy 后台重新查看或按需重新生成**） |
| 模式 | ⚠️ Test mode |

## 二、⏳ 待用户操作（商店激活，解锁 Live mode）

Lemon Squeezy 当前处于 **Test mode**（页面顶部黄色横幅）。要接受真实收款，必须完成：

1. **Identity verification（身份验证）**：Settings → General → Store activation
   - 入口：https://app.lemonsqueezy.com/settings/general
   - 需要：个人/企业身份信息（姓名、地址、税务信息等）
2. 验证通过后 → 商店自动切换 Live mode → 重新创建 **Live API Key** + **Live Webhook**（事件同上）
3. 完成后将 Live API Key 给我，即可配置生产环境

## 三、📦 代码侧待配置（等 Live 密钥）

```env
PAYMENT_PROVIDER=lemonsqueezy
LEMONSQUEEZY_API_KEY=<Live API Key>
LEMONSQUEEZY_STORE_ID=473001
LEMONSQUEEZY_VARIANTS={"event_9_9":"2141798","sub_monthly_19_9":"2141845","report_39_9":"2141856","premium_88":"2141858","sub_yearly_168":"2141859"}
LEMONSQUEEZY_WEBHOOK_SECRET=<REDACTED: 见密钥管理器>
```

> 注：Test mode 的 webhook secret 与 Live mode 不同，Live 激活后需重新生成并更新。

## 四、⚠️ 注意

- Test mode 的 API key / webhook 只能用于测试数据（沙箱）。
- 5 个产品的 variant ID 已在 Test mode 下建立；激活 Live 后 **variant ID 保持不变**（同一产品），可直接复用。
- 前端 PricingPage 价格显示待校正：¥29→¥19.9、¥39→¥39.9（支付上线前必须）。

## 五、📤 支持工单（2026-09-18 20:24 已发送）

| 项 | 值 |
|---|---|
| 收件人 | support@lemonsqueezy.com |
| 主题 | Unable to set up tax form (W-8BEN) from China - need manual assistance to activate store |
| 发件账号 | solaroran@gmail.com（网易邮箱大师） |
| 发送时间 | 2026-09-18 20:24（高级搜索"收件人含 support@lemonsqueezy.com"确认，状态=已发送） |
| 正文要点 | Store ID 473001 / Store URL temposoul.lemonsqueezy.com / 已完成 5 产品+Webhook 135151+API key+PayPal(ferryoran@outlook.com) / 报错原文 "Unable to set up tax form. Please try again or contact support." / 请求人工协助完成 W-8BEN 或提供替代激活方式 |
| 下一步 | 等待 LS 支持回复；若人工通道可行则激活商店→Live mode→接支付；不可行则转 B 线（国内支付宝/微信）或 C 线（其他 MoR） |

> 背景：LS 银行收款不支持中国大陆（仅港澳台）；税务表单由 Stripe Express 驱动，Stripe 不支持中国主体 → 表单无法自助建立，故发工单请求人工协助。
