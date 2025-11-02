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