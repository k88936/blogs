---
date: 2025-4-26
title: reinstall my Windows11
---

# 4-26
## 家庭版白嫖专业版
先下载到了win10和win11的安装镜像.  
重装到win10 选择专业版,然后登录微软账号激活.  
然后再升级到win11, 完事就是专业版...  

## 升级之后删除C盘Windows.old
1. 右键点击C盘，选择“属性”。
2. 在“常规”选项卡中，点击“磁盘清理”按钮。
3. 在弹出的窗口中，选择“清理系统文件”。
4. 在“磁盘清理”窗口中，勾选“以前的Windows安装”选项。
5. 点击“确定”按钮，等待清理完成。

[reference](https://support.microsoft.com/zh-cn/windows/%E5%88%A0%E9%99%A4%E4%BB%A5%E5%89%8D%E7%89%88%E6%9C%AC%E7%9A%84-windows-f8b26680-e083-c710-b757-7567d69dbb74)


## Uninstall bundled apps 
```powershell
winget uninstall "Cross Device Experience Host" "Windows Web Experience Pack" "Quick Assist" "Windows Media Player" "Phone Link" "Game Speech Window" "Xbox Identity Provider" "Xbox Identity Provider" "Game Bar" "Xbox TCUI" "Microsoft Store" "Windows Sound Recorder" "Windows Notepad" "Feedback Hub" "Windows Camera" "Windows Calculator" "Windows Clock" "Microsoft Photos" "Dev Home" "Widgets Platform Runtime" "Microsoft To Do" "Store Experience Host" "Start Experiences App" "MSIX\Microsoft.Services.Store.Engagement_10.0.23012.0_x86__8wekyb3d8bbwe" "MSIX\Microsoft.Services.Store.Engagement_10.0.23012.0_x64__8wekyb3d8bbwe" "Snipping Tool" "Power Automate" "Paint" "Outlook for Windows" "Microsoft.OneDrive" "Microsoft Sticky Notes" "Microsoft 365 Copilot" "Get Help" "Xbox" "Microsoft Edge Game Assist" "Copilot" "Microsoft Bing" "Microsoft Teams" "Smart Microphone Settings" "Microsoft Clipchamp" "MSN Weather" "News"
```

## Disable Windows Security
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
## Disable firewall
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```
## Clean your taskbar
```powershell
# Disable Search icon (shows/hides search box or icon)
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "SearchboxTaskbarMode" -Value 0
# Disable Task View button
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowTaskViewButton" -Value 0
```

## clean your desktop
```powershell
# Hide the Recycle Bin icon from the desktop
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\HideDesktopIcons\NewStartPanel" -Name "{645FF040-5081-101B-9F08-00AA002F954E}" -Value 1 -Type DWord
```
## scale dpi
```powershell
# Define registry paths
$regPath = "HKCU:\Control Panel\Desktop"
$regPathWin = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"

# Step 1: Set DPI scaling level to 100%
Set-ItemProperty -Path $regPath -Name "Win8DpiScaling" -Value 1 -Type DWord
Set-ItemProperty -Path $regPath -Name "DPIScaling" -Value 1 -Type DWord
Set-ItemProperty -Path $regPath -Name "LogPixels" -Value 96 -Type DWord
```
## disable notification
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
## dark mode
```powershell
# Registry paths for theme settings
$AppThemePath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"
$SystemThemePath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"

# Create the registry path if it doesn't exist
if (-not (Test-Path $AppThemePath)) {
    New-Item -Path $AppThemePath -Force
}

# Set App Mode to Dark (affects apps)
Set-ItemProperty -Path $AppThemePath -Name "AppsUseLightTheme" -Value 0 -Type DWord

# Set System Mode to Dark (affects taskbar, title bars, system UI)
Set-ItemProperty -Path $SystemThemePath -Name "SystemUsesLightTheme" -Value 0 -Type DWord

# 🟢 Success message
Write-Host "Dark Mode has been enabled for both system and apps." -ForegroundColor Green
Write-Host "Changes will take effect immediately in most cases." -ForegroundColor Yellow
```
## dev mode
```powershell
# Define registry path
$RegPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock"

# Create the registry path if it doesn't exist
if (-not (Test-Path $RegPath)) {
    New-Item -Path $RegPath -Force
}

# Enable Developer Mode: Allow development without a developer license
Set-ItemProperty -Path $RegPath -Name "AllowDevelopmentWithoutDevLicense" -Value 1 -Type DWord

# Enable Sideloading Apps (required for some dev features)
Set-ItemProperty -Path $RegPath -Name "AllowAllTrustedApps" -Value 1 -Type DWord

# 🟢 Confirm success
Write-Host "Developer Mode has been enabled." -ForegroundColor Green
Write-Host "You may now install apps from outside the Microsoft Store and use development tools." -ForegroundColor Yellow
```
## basic install
```powershell
iex "& {$(irm get.scoop.sh)} -RunAsAdmin"
scoop install git 
scoop bucket add extras
scoop install clash-verge-rev
```
## selfhosted apps
```powershell
scoop bucket add kvto https://github.com/k88936/scoop-bucket
scoop install envmgr
scoop install pwshrc
scoop install Shotmd
scoop install tencent-sandbox
```

## restore apps 
[see](https://k88936.github.io/2025/03/05/%E5%A4%87%E4%BB%BD%E6%8A%98%E8%85%BE%E8%AE%B0.html)

## fix WTF is ms-gamingoverlay
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
## auto mount
```powershell
$action = New-ScheduledTaskAction -Execute "diskpart" -Argument "/s D:\mount"
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 1) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName "MountDrivesAtBoot" -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Run diskpart script at boot to mount volumes"
```
## feature
```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
Enable-WindowsOptionalFeature -Online -FeatureName "Containers-DisposableClientVM" -All
```

## extra install
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools 
```
