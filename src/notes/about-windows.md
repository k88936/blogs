---
date: 2025-4-26
title: reinstall my Windows11
---

# simple pass (for Windows server)
```powershell
secedit /export /cfg "$env:TEMP\sec.cfg" /areas SECURITYPOLICY; (Get-Content "$env:TEMP\sec.cfg") -replace 'PasswordComplexity = 1', 'PasswordComplexity = 0' -replace 'MinimumPasswordLength = \d+', 'MinimumPasswordLength = 1' | Set-Content "$env:TEMP\sec.cfg"; secedit /configure /db "$env:TEMP\secedit.sdb" /cfg "$env:TEMP\sec.cfg" /areas SECURITYPOLICY
net user Administrator admin
```
---
# Win11 only
use Administrator and pass OOBE
```cmd
# 启用Administrator账户
net user Administrator /active:yes
oobe\msoobe && shutdown -r
```
[reference](https://vae.life/archives/win11skipoobe)

uninstall bundled apps
```powershell
winget uninstall "Cross Device Experience Host" "Windows Web Experience Pack" "Quick Assist" "Windows Media Player" "Phone Link" "Game Speech Window" "Xbox Identity Provider" "Xbox Identity Provider" "Game Bar" "Xbox TCUI" "Microsoft Store" "Windows Sound Recorder" "Windows Notepad" "Feedback Hub" "Windows Camera" "Windows Calculator" "Windows Clock" "Microsoft Photos" "Dev Home" "Widgets Platform Runtime" "Microsoft To Do" "Store Experience Host" "Start Experiences App" "MSIX\Microsoft.Services.Store.Engagement_10.0.23012.0_x86__8wekyb3d8bbwe" "MSIX\Microsoft.Services.Store.Engagement_10.0.23012.0_x64__8wekyb3d8bbwe" "Snipping Tool" "Power Automate" "Paint" "Outlook for Windows" "Microsoft.OneDrive" "Microsoft Sticky Notes" "Microsoft 365 Copilot" "Get Help" "Xbox" "Microsoft Edge Game Assist" "Copilot" "Microsoft Bing" "Microsoft Teams" "Smart Microphone Settings" "Microsoft Clipchamp" "MSN Weather" "News" "Start Experiences App"
```
Clean your taskbar
```powershell
# Disable Search icon (shows/hides search box or icon)
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "SearchboxTaskbarMode" -Value 0
# Disable Task View button
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowTaskViewButton" -Value 0
```
clean your desktop
```powershell
# Hide the Recycle Bin icon from the desktop
$Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\HideDesktopIcons\NewStartPanel"
if (-not (Test-Path $Path)) {
    New-Item -Path $Path -Force
}
Set-ItemProperty -Path $Path -Name "{645FF040-5081-101B-9F08-00AA002F954E}" -Value 1
Stop-Process -Name explorer -Force
```
disable notification
```powershell
# Define registry paths
$RegistryPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\PushNotifications"
$ActionCenterPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"

# Step 1: Disable push notifications (including app toasts)
if (-not (Test-Path $RegistryPath)) {
    New-Item -Path $RegistryPath -Force
}
Set-ItemProperty -Path $RegistryPath -Name "ToastEnabled" -Value 0 -Type DWord

# Step 2: Disable Action Center (notification center UI)
if (-not (Test-Path $ActionCenterPath)) {
    New-Item -Path $ActionCenterPath -Force
}
Set-ItemProperty -Path $ActionCenterPath -Name "EnableActionCenter" -Value 0 -Type DWord

# Step 3: (Optional) Disable login notifications (e.g., "Apps can show info...")
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name "SubscribedContent-338388Enabled" -Value 0 -Type DWord

# Step 4: Disable all app notifications via Group Policy-like setting
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name "SubscribedContent-338387Enabled" -Value 0 -Type DWord
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name "SubscribedContent-353694Enabled" -Value 0 -Type DWord
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name "SubscribedContent-353696Enabled" -Value 0 -Type DWord

# Step 5: (Optional) Prevent apps from running in background (they can trigger notifications)
$BackgroundAppsPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications"
if (-not (Test-Path $BackgroundAppsPath)) {
    New-Item -Path $BackgroundAppsPath -Force
}
Set-ItemProperty -Path $BackgroundAppsPath -Name "GlobalUserDisabled" -Value 1 -Type DWord

# 🟡 Inform user
Write-Host "All notifications have been disabled. Restart Explorer or log off and back in for full effect." -ForegroundColor Green
```

# fix WTF is ms-gaming overlay
```powershell
# 禁用 AppCapture（游戏录制）
$AppCapturePath = "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR"
if (-not (Test-Path $AppCapturePath)) {
    New-Item -Path $AppCapturePath -Force
}
Set-ItemProperty -Path $AppCapturePath -Name "AppCaptureEnabled" -Value 0 -Type DWord

# 禁用 GameDVR 功能
$GameConfigPath = "HKCU:\System\GameConfigStore"
if (-not (Test-Path $GameConfigPath)) {
    New-Item -Path $GameConfigPath -Force
}
Set-ItemProperty -Path $GameConfigPath -Name "GameDVR_Enabled" -Value 0 -Type DWord

Write-Host "已成功禁用 Game DVR 和游戏录制功能。" -ForegroundColor Green
Write-Host "重启资源管理器或注销后重新登录以确保设置生效。" -ForegroundColor Yellow
```
---
# Dev Drive 扩容
```powershell
Resize-VHD -Path '.\DevDrive.vhdx' -SizeBytes 100GB
```
and then expend the volume  
[reference](https://devenliu.com/blog/zh-CN/dev-drive-expansion/)

---


# NO ZUO NO DIE
Disable Windows Security
```powershell
Set-MpPreference -DisableRealtimeMonitoring $true
Set-MpPreference -DisableBehaviorMonitoring $true
Set-MpPreference -DisableScriptScanning $true
Set-MpPreference -DisableIOAVProtection $true
Set-MpPreference -DisableBlockAtFirstSeen $true
Set-MpPreference -DisableArchiveScanning $true
Set-MpPreference -DisableIntrusionPreventionSystem $true
Set-MpPreference -DisableNetworkProtection $true
Set-MpPreference -DisableCatchupFullScan $true
Set-MpPreference -DisableCatchupQuickScan $true
Set-MpPreference -DisableRemovableDriveScanning $true
Set-MpPreference -DisableScanningMappedNetworkDrivesForFullScan $true
Set-MpPreference -DisableScanningNetworkFiles $true
Set-MpPreference -DisableEmailScanning $true
Set-MpPreference -DisableAutoExclusions $true
Set-MpPreference -DisablePrivacyMode $true
Set-MpPreference -DisableCpuThrottleOnIdleScans $true
Set-MpPreference -DisableRestorePoint $true

# Cloud & MAPS
Set-MpPreference -MAPSReporting Disabled
Set-MpPreference -SubmitSamplesConsent 2

# Network protocol parsing (if supported)
Set-MpPreference -DisableTlsParsing $true
Set-MpPreference -DisableFtpParsing $true
Set-MpPreference -DisableHttpParsing $true
Set-MpPreference -DisableSmtpParsing $true
Set-MpPreference -DisableDnsParsing $true
Set-MpPreference -DisableDnsOverTcpParsing $true
Set-MpPreference -DisableSshParsing $true
Set-MpPreference -DisableRdpParsing $true
Set-MpPreference -DisableQuicParsing $true
```
Disable firewall
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```
---
# start up
```powershell
irm https://get.activated.win | iex
```
```powershell
iex "& {$(irm get.scoop.sh)} -RunAsAdmin"
scoop install git 
scoop bucket add extras
scoop install clash-verge-rev
```
```powershell
scoop bucket add kvto https://github.com/k88936/scoop-bucket
scoop install envmgr
scoop install pwshrc
```
```powershell
scoop install malware-sandbox
scoop install shotmd
```
# [restore apps](https://k88936.github.io/blogs/notes/my-backup-solution.html)

# auto mount
```powershell
$action = New-ScheduledTaskAction -Execute "diskpart" -Argument "/s D:\mount"
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 1) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName "MountDrivesAtBoot" -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Run diskpart script at boot to mount volumes"
```
# feature
wsl/hyper-v
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V,Microsoft-Hyper-V-Management-PowerShell,HypervisorPlatform,Microsoft-Windows-Subsystem-Linux -All -NoRestart
```
# ssl cert
```powershell
Import-Certificate -FilePath ${HOME}/cert.pem -CertStoreLocation Cert:\LocalMachine\Root
```
# extra install
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools 
```
# power related
```powershell
powercfg /hibernate on

# Disable sleep (standby) timeout
powercfg /setacvalueindex SCHEME_CURRENT SUB_SLEEP STANDBYIDLE 0
powercfg /setdcvalueindex SCHEME_CURRENT SUB_SLEEP STANDBYIDLE 0

# Disable hibernate timeout (system won't auto-hibernate)
powercfg /setacvalueindex SCHEME_CURRENT SUB_SLEEP HIBERNATEIDLE 0
powercfg /setdcvalueindex SCHEME_CURRENT SUB_SLEEP HIBERNATEIDLE 0

# Set power button to hibernate (AC and DC)
powercfg /setacvalueindex SCHEME_CURRENT SUB_BUTTONS PBUTTONACTION 2
powercfg /setdcvalueindex SCHEME_CURRENT SUB_BUTTONS PBUTTONACTION 2

# Apply the active power scheme
powercfg /setactive SCHEME_CURRENT
```
---
# sshd
install && start sshd
```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
```
配置防火墙
```powershell
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```
secret auth
```shell
vim C:\ProgramData\ssh\sshd_config
```
ensure
```
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```
as for Administrator：  

put public key to`C:\ProgramData\ssh\administrators_authorized_keys`

ensure privilege
```powershell
# 设置公钥文件路径
$filePath = "C:\ProgramData\ssh\administrators_authorized_keys"

$acl = Get-Acl $filePath
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrators","FullControl","Allow")
$acl.SetOwner([System.Security.Principal.NTAccount]"Administrators")
$acl.SetAccessRule($rule)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("SYSTEM","FullControl","Allow")
$acl.SetAccessRule($rule)
$acl.SetAccessRuleProtection($true, $false)
Set-Acl $filePath $acl
# 重启 SSH 服务
Restart-Service sshd
```
to use powershell
```powershell
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -PropertyType String -Force
```

---
# long path
```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```
[refer](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation?tabs=powershell#enable-long-paths-in-windows-10-version-1607-and-later)
