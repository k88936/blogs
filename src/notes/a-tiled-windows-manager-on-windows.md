---
date: 2025-06-01
title: A tiled window manager for Windows 11
---
# 平铺式窗口管理器4Windows

## 来时路
我理想中的窗口管理器是i3wm: 大道至简.

我之前试过powertoys的FancyZone,还可以吧, 使用鼠标还是很频繁,

我在阮一峰的网络日志上看到了一个平铺式窗口管理器的介绍[Jwno](https://github.com/agent-kilo/jwno)  
但是细细看完文档觉得这个设计的太强大了, 功能全可以自己写(用的Janet语言,只能说是有点小众),于是放弃了.  
又在互联网的大海捞针, 发现了一个[GlazeWM](https://github.com/glzr-io/glazewm), 大体上仿照i3wm做的,
![demo video](https://github.com/glzr-io/glazewm/raw/refs/heads/main/resources/assets/demo.webp)
不过配置文件是yaml的,没法直接迁移就是了.  
不过其他地方还好, 我决定试试.

## 安装
GlazeWM和(可选的依赖zebar状态栏组件)都可以用scoop安装,这点还是很方便的.  
使用默认配置的话如果不装zebar会报错, 后来看了一下,这个相当于i3wm的workspace的指示器,蛮需要的.  
* zebar v2.7.0有启动闪退的问题,我的临时解决办法是自己编译最新版本的替换exe

## 配置之路
### 改绑定键
刚看配置文件的文档我还挺别扭因为默认用alt作为mod键, 我习惯用win键, 于是我把配置文件的mod改成了win键.  
但是,没有反应.... 对比文档,应该用lwin才行.  

### 解决快捷键冲突
用win键有这么一个问题: explorer自带了大量的快捷键, 比如win+e打开资源管理器, win+v打开剪贴板历史, win+shift+s截图等.  
这些快捷键和GlazeWM的冲突了,  
两者之间取其善, 我想办法关闭windows的这些快捷键:   
* 使用脚本
  
```powershell
# 创建注册表路径和键值
$Path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\System"
$Name = "DisableLockWorkstation"
$Value = 1
# 检查路径是否存在，不存在则创建
if (-not (Test-Path $Path)) {
    New-Item -Path $Path -Force | Out-Null
}
# 设置值
New-ItemProperty -Path $Path -Name $Name -Value $Value -PropertyType DWORD -Force | Out-Null
Write-Host "已成功禁用 Win+L 锁屏快捷键。" -ForegroundColor Green

# 启用“关闭 Windows 键热键”组策略（会禁用大部分 Win+X 组合）
# 注意：这不是注册表，要用 PowerShell 调用组策略对象
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoWinKeys" -Value 1 -Type DWORD
Write-Host "已成功禁用 Win+* 快捷键。" -ForegroundColor Green
```
> [参考1](https://www.zhihu.com/question/512157683)  
> [参考2](https://cn.windows-office.net/?p=18346)


### start on boot
```powershell
# Define paths
$TargetPath = "$env:USERPROFILE\scoop\apps\glazewm\current\glazewm.exe"
$ShortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\GlazeWM.lnk"

# Create WScript.Shell COM object
$WScriptShell = New-Object -ComObject WScript.Shell

# Create shortcut
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = "$env:USERPROFILE\scoop\apps\glazewm\current"
$Shortcut.Description = "Launch GlazeWM at startup"
$Shortcut.Save()

Write-Host "Shortcut created: $ShortcutPath"
```

### 其他
终于到了配置这里了.  
窗口规则

```yaml
window_rules:
  - commands: ["set-floating"]
    match:
      - window_title: { equals: 'Command Palette' } # 命令面板不平铺
  - commands: ['ignore']
    match:
      # Ignores any Zebar windows.
      - window_process: { equals: "zebar" }
      # Ignore rules for various 3rd-party apps.
      - window_process: { equals: 'Taskmgr' }
      - window_process: { regex: '\w*PowerToys Settings' }
      - window_process: { equals: 'msrdc' }         # 远程桌面(wsl2)用到的,支持的不好,会异常. 
```
一些使用快捷键:
```yaml
  - commands: ['shell-exec pwsh']
    bindings: ['lwin+enter']
  - commands: ['shell-exec wsl']
    bindings: ['lwin+shift+enter']
  - commands: ['shell-exec explorer']
    bindings: ['lwin+e']
  - commands: ['shell-exec shotmd']
    bindings: ['lwin+s']
```
这个shotmd是我自己写的一个程序(screenshoot to markdown : [shotmd](https://github.com/k88936/shotmd)), 用来截图,直接嵌入markdown的.
