---
date: 2025-8-12
title: How to SSH into a QEMU Windows VM
---
# QEMU Windows 虚拟机 SSH 登录

## 目标
通过 SSH 从宿主机登录 QEMU Windows 虚拟机，实现命令行远程管理(图形页面太卡了)


## 前置条件
- 宿主机：Linux/macOS/Windows WSL
- QEMU 已安装
- Windows 虚拟机镜像（qcow2 格式）
- Windows 虚拟机已启动并可操作


## 配置 QEMU 网络端口转发

### 修改 QEMU 启动命令
在启动命令中添加网络配置：

```bash
-netdev user,id=net0,hostfwd=tcp::2222-:22 \
-device e1000,netdev=net0
```

### 完整示例
```bash
qemu-system-x86_64 \
  -smp 8 \
  -enable-kvm \
  -m 8G \
  -drive file=windows.qcow2,format=qcow2,if=none,id=disk0 \
  -device virtio-blk-pci,drive=disk0 \

  -netdev user,id=net0,hostfwd=tcp::2222-:22 \
  -device e1000,netdev=net0
```

> 端口映射：宿主机 2222 → 虚拟机 22


## 在 Windows 虚拟机中启用 SSH 服务

### 以管理员身份打开 PowerShell

### 安装 OpenSSH Server
```powershell
# 检查是否已安装
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH.Server*'

# 安装 OpenSSH 服务器
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

### 启动并设置开机自启
```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
```

### 配置防火墙
```powershell
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

## 配置 SSH 密钥认证
like any other 复制粘贴公钥  

windows的`C:\ProgramData\ssh\sshd_config`默认关闭了密钥认证,
确保有
```
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```



#### 对于管理员用户（如 Administrator）：
##### 公钥要放在`C:\ProgramData\ssh\administrators_authorized_keys`
##### 设置正确权限
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

## 配置 SSH 客户端别名

### 编辑 SSH 配置文件
```bash
vim ~/.ssh/config
```

### 添加配置
```conf
Host winvm
    HostName localhost
    User administrator
    Port 2222
    ServerAliveInterval 60
```

### 使用别名登录
```bash
ssh winvm
```
