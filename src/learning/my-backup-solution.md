---
date: 2025-3-5
title: My backup solution
---
前几天wsl挂载错误手欠unregister了一下，把整个vhd给删了，又陆陆续续花了几天重新配环境，痛定思痛，决定好好备份一下。

# .xxxrc等配置文件
包括.vimrc等，还额外存了一个软件包列表。
* arch
backup
```shell
yay -Qe | awk '{print $1}' > .configure/backup/arch_packages
```
恢复
```shell
cat .configure/backup/arch_packages | xargs yay -S --noconfirm --needed
```

* win scoop
backup
```shell
scoop list | awk 'NR > 3 && $1 != "" {print $1}' > .configure/backup/scoop_packages
```
retore
```shell
scoop bucket add extras
scoop bucket add java
cat .configure/backup/scoop_packages | xargs scoop install
```

这部分大多是文本文件，直接在root建仓库丢gitee上

> 成本：0



# archlinux全盘备份
archlinux真机有1t固态，用了100多g，dd了个200g的文件，mkfs成ext4，用rsync从根目录复制进去。

> 成本：0

archlinux真机自带一个sd卡槽，淘宝一个512g tf卡，竟然还带sd转接的套，把备份文件复制到上面。


大概传了一晚上，学校晚上断电，但是电池撑到了第二天早上。  
之前想过直接rsync到tf卡上面去，但是那个tf卡不支持日志系统，格式化成ext4失败，而且读写速度感人，于是放弃。  
但是我再用windows读取不了了，无所谓了。  

> 成本：26 小作坊真是量大管饱

当然我有个外接的4tb机械硬盘，丢进去。  
买的时候写错地址给送到江苏去了。  

> 成本：500加硬盘座 还可以吧，存点别的也能用上


# WSL
这方面比较简单，export到vhdx，再重新import in place每次读写都是对vhdx文件了，备份直接复制，机械，固态，tf卡随处丢一份。

wsl 有个.wslconfig，直接把上面那个仓库克隆到目录里，git add 这个一起同步了。这样我的.vimrc .ideavimrc也能够复用了，之前没在win上用jetbrains就是因为复制配置文件到win上麻烦。

成本：0？

# windows全盘备份
win在这方面还是很友好的，自带的备份恢复就够用

额外安了块2t的固态，不算成本吧。本来c盘就不够用了

# 媒体文件
在用syncthing，多平台都有，能自动把我的手机相册备份到电脑上。在电脑上我再定期打包，机械，固态，tf卡各丢一份，这部分自动化脚本没考虑，我手机256g从前年暑校到上个月存满照片视频，频率很低了。

# 百度网盘
小水管我的解决方法：

首先不想让百度之流进我的电脑手机。

其次脚本api啥的看过先例给封号了，网盘里还有别的东西，不敢冒险。

一个闲置手机（vivo x5，安卓5.0没错是5.0还不是5.1，当年有个游戏就是不到5.1玩不了。高中时用来作业帮，还费了大劲降级，root，搞linux deploy，配vim，写java.......算是linux启蒙了）拿到大学配了ftp，当然也用过上面提到的syncthing，然后用百度网盘的相册自动上传，外接充电宝（没忘我们学校晚上断电吧），也作为一个24小时小水管下载东西.第一学期期末就坏了，现在丢在老家了，是个功臣。

其实不用root，syncthing安卓端加百度网盘自动备份就够了，现在还缺一个旧手机.




