# StarMark 星表接入规范（P0 ①）

> 本文件为 StarMark 星表预处理的权威接入规范。代码库内**无独立 HYG 全量数据文件**，
> 现用星表复用 A5 每日星图资产（`src/lib/sky/stars.data.ts`）。扩展字段（自行/温度/边界）
> 标【待数据】。

## 1. 确认版本 / 字段 / 许可（P0 冻结）

| 项 | 值 |
|---|---|
| 星表 | d3-celestial `stars.6.json`（上游源自 HYG v3 + Yale Bright Star Catalog） |
| 许可 | BSD-3-Clause（可商用，须保留许可声明） |
| 已用星数 | 5044 星（mag ≤ 6.0，J2000） |
| 字段 | RA/Dec（J2000）、V 星等 mag、B-V 色指数 bv |
| 星座线 | d3-celestial `constellations.lines.json`，端点 mag≤4.5 过滤 |
| 生成脚本 | `scripts/gen-stars.mjs`（A5 既有，勿改） |

## 2. StarMark 标准化 schema（预处理输出）

`scripts/starmark/preprocess-catalog.mjs` 输出：

```
{
  schema: "starmark-catalog@v1",
  source, license, magLimit, epoch: "J2000", timeScale: "UTC",
  stars: [{
    id,            // 【待数据】Henry Draper / HR 编号
    ra_deg, dec_deg,        // J2000 度（6 位小数）
    pm_ra_mas, pm_dec_mas,  // 【待数据】自行（毫角秒/年）
    mag,                    // V 星等
    bv,                     // B-V
    temp_k,                 // 由 B-V 估算有效温度
    boundary,               // 【待数据】星座边界标记
    dupFlag                 // 0.01° 内重复（保留最亮）
  }]
}
```

## 3. 去重与边界标记

- 去重：以 `round(ra*100)_round(dec*100)` 分桶，同桶保留 mag 最小（最亮）者，其余 `dupFlag=true`。
- 边界标记：【待数据】接入 constellation boundaries 后填。

## 4. 运行

```
node scripts/starmark/preprocess-catalog.mjs                 # 内置样例（确定性，CI 用）
node scripts/starmark/preprocess-catalog.mjs input.json out.json
```

对空/样例输入给出确定性输出。**未接入真实 HYG 全量前，禁止把样例当真实星表使用。**
