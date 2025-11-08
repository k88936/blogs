---
date: 2025-10-17
title: disk related
---
# i3wm 不用确认一键退出
```
bindsym $mod+Shift+q exit
```
> [reference](https://faq.i3wm.org/question/1262/exiting-i3-without-mouse-click.1.html)

---

# vi in bash
```bash
cat > .inputrc <<'EOF'
set editing-mode vi
set show-mode-in-prompt on
set vi-ins-mode-string \1\e[6 q\2
set vi-cmd-mode-string \1\e[2 q\2

# optionally:
# switch to block cursor before executing a command
set keymap vi-insert
RETURN: "\e\n"
EOF
```
> [reference](https://unix.stackexchange.com/questions/533509/how-to-display-the-current-mode-of-vi-command-line-editing-set-editing-mode)
---

# disk
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
---

# Fix pacman ldconfig "file is empty, not checked" error
```shell
pacman -Syyu $(pacman -Qnq) --overwrite '*'
```
[refer](https://gist.github.com/metzenseifner/cb61ecfd614a93c5927ba3cd62d68127)

# proxy dockerd
```shell
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo tee /etc/systemd/system/docker.service.d/proxy.conf <<EOF
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1"
EOF
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl restart docker
# vertify
sudo systemctl show --property=Environment docker
```
[reference](https://chat.qwen.ai/s/87ddf6e6-6c0a-490d-851c-cfe7c5e73721?fev=0.0.237)



# aur
init a new pkg
```shell
git -c init.defaultBranch=master clone ssh://aur@aur.archlinux.org/pkgbase.git
```
update
```shell
makepkg --printsrcinfo > .SRCINFO
git add PKGBUILD .SRCINFO
# commit and push
```
lto issue when packaging rust: [refer](https://github.com/briansmith/ring/issues/1444)

# reset keyring
```shell
sudo rm -rf /etc/pacman.d/gnupg
sudo pacman-key --init
sudo pacman-key --populate archlinux
```
[refer](https://razonyang.com/zh-hans/blog/archlinux/reset-keyring/)
