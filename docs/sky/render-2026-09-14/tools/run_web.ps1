$ErrorActionPreference='Continue'
$port=9395
$httpPort=8903
$R="E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\sky\render-2026-09-14"

Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
  Where-Object { $_.CommandLine -like "*cw_u*" -or $_.CommandLine -like "*remote-debugging-port=93*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -like "*drive_*.js*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
  Where-Object { $_.CommandLine -like "*http.server*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Start-Sleep -Seconds 2

# 组装 HTTP 站点目录
Remove-Item "C:\temp\tsprev\eng3" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "C:\temp\tsprev\eng3" -Force | Out-Null
New-Item -ItemType Directory -Path "C:\temp\tsprev\eng3\assets" -Force | Out-Null
Copy-Item "$R\home-web*.html" "C:\temp\tsprev\eng3\" -Force
Copy-Item "$R\assets\scene_*.webp" "C:\temp\tsprev\eng3\assets\" -Force
Copy-Item "$R\assets\scene_*.avif" "C:\temp\tsprev\eng3\assets\" -Force

$py = "C:\Users\oran\.workbuddy\binaries\python\versions\3.13.12\python.exe"
$srv = Start-Process -FilePath $py -ArgumentList @("-m","http.server","$httpPort","--bind","127.0.0.1","--directory","C:/temp/tsprev/eng3") -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 3
$chk = ""
foreach($f in @("home-web.html","home-web-fixed1920.html","assets/scene_1920.webp","assets/scene_1920.avif")){
  try { $t = Invoke-WebRequest -Uri "http://127.0.0.1:$httpPort/$f" -UseBasicParsing -TimeoutSec 10
        $chk += "$f=$($t.StatusCode)/$([math]::Round($t.RawContentLength/1024))KB " }
  catch { $chk += "$f=ERR " }
}
$chk | Set-Content "C:\temp\tsprev\_web_step.txt" -Encoding UTF8

$prof="C:\temp\cw_u$port"
if(Test-Path $prof){ Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue }
$argstr = "--headless=new --remote-debugging-port=$port --remote-allow-origins=* --no-first-run --no-default-browser-check --user-data-dir=`"$prof`" --force-device-scale-factor=1 --window-size=1920,969 --hide-scrollbars"
Start-Process -FilePath "C:\Users\oran\AppData\Local\Google\Chrome\Application\chrome.exe" -ArgumentList $argstr
Start-Sleep -Seconds 10

$env:NODE_PATH="C:/Users/oran/.workbuddy/binaries/node/workspace/node_modules"
$env:CDP_PORT="$port"
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:http_proxy=""; $env:https_proxy=""; $env:ALL_PROXY=""; $env:all_proxy=""; $env:NO_PROXY="127.0.0.1,localhost"
Remove-Item "C:\temp\tsprev\_web.json" -Force -ErrorAction SilentlyContinue
& "C:/Users/oran/.workbuddy/binaries/node/versions/22.22.2-3/node.exe" "C:/temp/tsprev/drive_web.js" 2>&1 |
  Set-Content "C:\temp\tsprev\_web.log" -Encoding UTF8
"exit=$LASTEXITCODE" | Add-Content "C:\temp\tsprev\_web.log" -Encoding UTF8

Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
  Where-Object { $_.CommandLine -like "*cw_u*" -or $_.CommandLine -like "*remote-debugging-port=93*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
if($srv){ Stop-Process -Id $srv.Id -Force -ErrorAction SilentlyContinue }
"done" | Add-Content "C:\temp\tsprev\_web.log" -Encoding UTF8
