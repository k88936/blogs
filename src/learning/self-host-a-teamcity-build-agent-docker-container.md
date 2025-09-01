---
date: 2025-9-1
title: self host a teamcity build agent docker container
---

# Previous Trial: Install From Archlinux AUR
## prons: 
* accessible to the toolchains on host
* share the proxy service on the host
## conns:
* weak isolation
* it will overwrite many config after upgrade (this is posibly the problem of the makepkg config)

# Build my own docker image
this way, we need to solve these problems:
* lack of toolchains
  - this can be easily solved by extend the official image
* proxy
  - by adding proxy variable to environment
  - note for docker-compose, we need to add extra_host, and fuckingly strange, we need to set bridge as network_mode
  - for dockerd in docker, we need to use /etc/default/docker to config proxy
[the whole](https://github.com/k88936/teamcity-agent)