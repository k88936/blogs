---
date: 2025-9-1
title: use boinc
---
# 什么是boinc
![logo of boinc](https://boinc.berkeley.edu/logo/boinc_logo.png)
* BOINC lets you help cutting-edge science research using your computer. The BOINC app, running on your computer, downloads scientific computing jobs and runs them invisibly in the background. It's easy and safe.

* About 30 science projects use BOINC. They investigate diseases, study climate change, discover pulsars, and do many other types of scientific research.

* The BOINC and Science United projects are located at the University of California, Berkeley and are supported by the National Science Foundation.

# 为什么我想跑boinc
我之前买了一个服务器，平时负载不大，功率大概200w，"性价比"不是很高，闲置的算力不如给人类社区做点贡献（或者挖矿？）。
# 各种安装方案
## 1. 裸机直装
优点是可以利用显卡，archlinux的wiki说明也很详细。但是如果你在自己的账号运行，下载的各种东西会把你的home弄乱。
## 2. docker
优点开箱即用，隔离性更好。我选docker
[demo](https://github.com/k88936/boinc)
# 运行
## 使用命令行
```shell 
boinccmd
```
## 添加账户管理 science united
```shell
boinccmd --acct_mgr attach URL name passwd  attach to account manager
```
## 添加 world community grid
```shell
boinccmd --project_attach URL auth
```
