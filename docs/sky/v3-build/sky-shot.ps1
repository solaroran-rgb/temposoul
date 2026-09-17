# sky-shot.ps1 —— 一体化：拉起独立 headless Chrome + 同会话驱动 node 截图
# 关键约束：Chrome 只能由 PowerShell Start-Process 拉起（Bash/Python 会 [WinError 740] Permission denied），
#           且必须在**同一个 PowerShell 会话内**驱动 CDP —— 会话结束 Chrome 即被杀。
# 不调用 taskkill /IM chrome.exe（会误杀用户正在使用的浏览器），只清理自身 PID 树。
param(
  [Parameter(Mandatory=$true)][string]$OutDir,
  [Parameter(Mandatory=$true)][string[]]$Urls,
  [int]$Port = 9350,
  [int]$WaitMs = 9000
)
$ErrorActionPreference = 'SilentlyContinue'
$node  = "C:/Users/oran/.workbuddy/binaries/node/versions/22.22.2-3/node.exe"
$exe   = "C:\Users\oran\AppData\Local\Google\Chrome\Application\chrome.exe"
$dir   = Split-Path -Parent $MyInvocation.MyCommand.Definition
$drive = Join-Path $dir 'sky-shots.cjs'
$logLines = @()

$prof = "C:\temp\cdp_sky_$Port"
if (Test-Path $prof) { Remove-Item $prof -Recurse -Force }

$args = @(
  "--headless=new",
  "--remote-debugging-port=$Port",
  "--remote-allow-origins=*",
  "--no-first-run",
  "--no-default-browser-check",
  "--user-data-dir=$prof",
  "--enable-unsafe-swiftshader",
  "--window-size=1920,1080",
  "--hide-scrollbars"
)
$p = Start-Process -FilePath $exe -ArgumentList $args -PassThru
$logLines += "chrome_pid=$($p.Id)"

# 数组传参（单字符串内嵌引号会让 Chrome 解析错 user-data-dir，从而静默忽略调试端口）
$open = $false
for ($i = 0; $i -lt 25; $i++) {
  Start-Sleep -Seconds 1
  $tcp = New-Object System.Net.Sockets.TcpClient
  try {
    $task = $tcp.ConnectAsync("127.0.0.1", $Port)
    if ($task.Wait(1000)) { $open = $tcp.Connected }
  } catch { }
  try { $tcp.Close() } catch { }
  if ($open) { $logLines += "port_open_at=${i}s"; break }
}
$logLines += "final_open=$open"

if (-not $open) {
  $logLines += "FAILED: debug port never opened"
  $logLines | Set-Content (Join-Path $OutDir '_run.txt') -Encoding UTF8
  throw "CDP port $Port did not open"
}

$env:NODE_PATH   = "C:/Users/oran/.workbuddy/binaries/node/workspace/node_modules"
$env:CDP_PORT    = "$Port"
$env:HTTP_PROXY  = ""; $env:HTTPS_PROXY = ""; $env:http_proxy = ""; $env:https_proxy = ""
$env:ALL_PROXY   = ""; $env:all_proxy  = ""; $env:NO_PROXY = "127.0.0.1,localhost"

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$out = & $node $drive $Port $OutDir @Urls 2>&1 | Out-String
$logLines += $out
$logLines | Set-Content (Join-Path $OutDir '_run.txt') -Encoding UTF8

Start-Sleep -Seconds 1
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
