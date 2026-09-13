# promote-gate · v8b
- base: http://localhost:4173

# perf-baseline-v8b
- url: http://localhost:4173/sky?perf=1
- tier: high
- 判据（D5）：full P95 ≤ 16.9ms；ambient >100ms 尖峰 = 0

| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full | 526 | 16 | 16 | 33 | 3 | 2 | PASS |
| ambient | 1520 | 16 | 16 | 16 | 0 | 0 | PASS |

## notes
- tier-downgrade: high→mid (mean 25.0ms)

# perf-baseline-v8b
- url: http://localhost:4173/sky?perf=1
- tier: high
- 判据（D5）：full P95 ≤ 16.9ms；ambient >100ms 尖峰 = 0

| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full | 60 | 16 | 16 | 83 | 1 | 0 | PASS |
| ambient | 2015 | 16 | 16 | 16 | 0 | 0 | PASS |

## notes
- tier-downgrade: high→mid (mean 33.1ms)

## 门禁汇总

| gate | 结果 |
| --- | --- |
| G1 | pass(desktop-1920:ok mobile-390:ok) |
| G4 | pass(mem:pass ctx:pass resume:pass) |
| G5 | pass(desktop-1920:0err mobile-390:0err) |
| G2 | skip(docs/sky/audit/summary.json 缺失) |
| G3 | skip(checklist 缺失) |
| G6 | pass(sw v8) |
