"""线上故障探测：所有公开端点 + 关键页面路由 + 资源加载。"""
import urllib.request, urllib.error, json, time

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0"}
BASE = "https://www.temposoul.com"

ENDPOINTS = [
    ("GET", "/"),
    ("GET", "/api/v1/health"),
    ("GET", "/api/v1/manifest"),
    ("GET", "/api/v1/openapi.json"),
    ("GET", "/api/v1/foundation/capabilities"),
    ("GET", "/.well-known/temposoul-api.json"),
    ("GET", "/temposoul-runtime-config.js"),
    ("GET", "/manifest.json"),
    ("GET", "/robots.txt"),
    ("GET", "/sitemap.xml"),
    ("GET", "/privacy"),
    ("GET", "/terms"),
    ("GET", "/bazi"),
    ("GET", "/ziwei"),
    ("GET", "/divination"),
    ("GET", "/404-nonexistent-page"),
]

def check(method, path, timeout=15):
    url = BASE + path
    req = urllib.request.Request(url, method=method, headers=UA)
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
            return {"path": path, "http": r.status, "ms": int((time.time()-t0)*1000),
                    "bytes": len(body), "ct": r.headers.get("content-type","")[:60]}
    except urllib.error.HTTPError as e:
        return {"path": path, "http": e.code, "ms": int((time.time()-t0)*1000),
                "bytes": 0, "ct": "", "err": str(e)[:100]}
    except Exception as e:
        return {"path": path, "http": -1, "ms": int((time.time()-t0)*1000),
                "bytes": 0, "err": str(e)[:100]}

print(f"{'path':<45} {'http':<5} {'ms':<6} {'bytes':<8} {'ct'}")
print("-"*100)
results = []
for method, path in ENDPOINTS:
    r = check(method, path)
    results.append(r)
    print(f"{r['path']:<45} {r['http']:<5} {r['ms']:<6} {r['bytes']:<8} {r.get('ct','')}")

# 汇总异常
print("\n=== 异常 ===")
for r in results:
    if r["http"] != 200 or r["ms"] > 2000:
        print(f"  {r['path']}: http={r['http']} ms={r['ms']} err={r.get('err','')}")
