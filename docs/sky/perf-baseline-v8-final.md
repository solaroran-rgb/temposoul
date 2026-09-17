# promote-gate · v8-final
- base: http://localhost:4173

# perf-baseline-v8-final
- url: http://localhost:4173/sky?perf=1
- tier: high
- 判据（D5）：full P95 ≤ 16.9ms；ambient >100ms 尖峰 = 0

| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full | 49 | 16 | 16 | 200 | 2 | 2 | PASS |
| ambient | 2012 | 16 | 16 | 16 | 0 | 0 | PASS |

## notes
- tier-downgrade: high→mid (mean 40.7ms)

# perf-baseline-v8-final
- url: http://localhost:4173/sky?perf=1
- tier: high
- 判据（D5）：full P95 ≤ 16.9ms；ambient >100ms 尖峰 = 0

| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full | 61 | 16 | 16 | 149 | 1 | 1 | PASS |
| ambient | 2012 | 16 | 16 | 16 | 0 | 0 | PASS |

## notes
- tier-downgrade: high→mid (mean 33.9ms)

## 门禁汇总

| gate | 结果 |
| --- | --- |
| G1 | pass(desktop-1920:ok mobile-390:ok) |
| G4 | pass(mem:pass ctx:pass resume:pass) |
| G5 | pass(desktop-1920:0err mobile-390:0err) |
| G2 | skip(docs/sky/audit/summary.json 缺失) |
| G3 | FAIL(3 项未勾选) |
| G6 | pass(sw v8) |
