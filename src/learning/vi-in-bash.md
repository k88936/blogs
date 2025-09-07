---
date: 2025-9-7
title: vi in bash
---

```bash
root@k88936t14p: ~# cat .inputrc
set editing-mode vi
set show-mode-in-prompt on
set vi-ins-mode-string \1\e[6 q\2
set vi-cmd-mode-string \1\e[2 q\2

# optionally:
# switch to block cursor before executing a command
set keymap vi-insert
RETURN: "\e\n"
```
[reference](https://unix.stackexchange.com/questions/533509/how-to-display-the-current-mode-of-vi-command-line-editing-set-editing-mode)
