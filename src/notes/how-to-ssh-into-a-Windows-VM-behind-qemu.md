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


