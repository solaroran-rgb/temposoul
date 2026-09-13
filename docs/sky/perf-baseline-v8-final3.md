# promote-gate · v8-final3
- base: http://localhost:4173

# perf-baseline-v8-final3
- url: http://localhost:4173/sky?perf=1
- tier: high
- 判据（D5）：full P95 ≤ 16.9ms；ambient >100ms 尖峰 = 0

| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full | 143 | 16 | 16 | 66 | 2 | 1 | PASS |
| ambient | 1914 | 16 | 16 | 16 | 0 | 0 | PASS |

## notes
- tier-downgrade: high→mid (mean 43.9ms)

# perf-baseline-v8-final3
- url: http://localhost:4173/sky?perf=1
- tier: high
- 判据（D5）：full P95 ≤ 16.9ms；ambient >100ms 尖峰 = 0

| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full | 63 | 16 | 16 | 183 | 1 | 1 | PASS |
| ambient | 2008 | 16 | 16 | 16 | 0 | 0 | PASS |

## notes
- tier-downgrade: high→mid (mean 37.3ms)

## 门禁汇总

| gate | 结果 |
| --- | --- |
| G1 | pass(desktop-1920:ok mobile-390:ok) |
| G4 | pass(mem:pass ctx:pass resume:pass) |
| G5 | pass(desktop-1920:0err mobile-390:0err) |
| G2 | skip(docs/sky/audit/summary.json 缺失) |
| G3 | pass(人工确认项见清单) |
| G6 | pass(sw v8) |
