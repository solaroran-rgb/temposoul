# promote-gate · v8-final2
- base: http://localhost:4173

# perf-baseline-v8-final2
- url: http://localhost:4173/sky?perf=1
- tier: high
- 判据（D5）：full P95 ≤ 16.9ms；ambient >100ms 尖峰 = 0

| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full | 52 | 16 | 33 | 366 | 1 | 1 | FAIL |
| ambient | 2004 | 16 | 16 | 16 | 0 | 0 | PASS |

## notes
- tier-downgrade: high→mid (mean 44.7ms)

# perf-baseline-v8-final2
- url: http://localhost:4173/sky?perf=1
- tier: high
- 判据（D5）：full P95 ≤ 16.9ms；ambient >100ms 尖峰 = 0

| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full | 59 | 16 | 33 | 66 | 2 | 0 | FAIL |
| ambient | 2016 | 16 | 16 | 16 | 0 | 0 | PASS |

## notes
- tier-downgrade: high→mid (mean 32.8ms)

## 门禁汇总

| gate | 结果 |
| --- | --- |
| G1 | FAIL(desktop-1920:full p95=33 spk=1 mobile-390:full p95=33 spk=0) |
| G4 | pass(mem:pass ctx:pass resume:pass) |
| G5 | pass(desktop-1920:0err mobile-390:0err) |
| G2 | skip(docs/sky/audit/summary.json 缺失) |
| G3 | pass(人工确认项见清单) |
| G6 | pass(sw v8) |
