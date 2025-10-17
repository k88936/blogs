---
date: 2025-10-17
title: disk related
---

## healthcheck
```shell
pacman -S smartmontools
```
```shell
smartctl -a /dev/sda 
```

## bunchmark
```shell
pacman -S hdparm
```

```shell
hdparm -Tt /dev/sda
```
