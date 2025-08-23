---
date: 2024-12-1
title: how to make your terminal work on with clash for windows
---
# How to

1.  卸载cfw
在Clash主页（General）中，找到TUN模式（TUN Mode）和系统代理（System Proxy），取消勾选。然后用win设置--应用--卸载就可以了
2. 安装clash verge
[github link](https://github.com/clash-verge-rev/clash-verge-rev/)

3. 配置clash verge
然后在设置里 安装&启用服务模式 启用tun模式（可以）关闭系统代理

4. 配置wsl
使用mirror 网络模式  
2025年4月已经有一个图形页面的wsl setting

# Why：
* tun可以理解成虚拟一个网卡出来，可以让所有流量通过代理
* clash for windows 的系统代理 和 tun 模式本人实测都不成功，class verge 成功 ，我猜测是内核太老的问题
* 之前折腾，开mirror才成功，具体为什么忘了。（不开的话难道最终不都是走虚拟的网卡吗）

