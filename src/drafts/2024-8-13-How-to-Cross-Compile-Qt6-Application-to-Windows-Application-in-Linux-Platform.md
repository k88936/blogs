---
layout: post
tags: qt,wsl2,mingw
---
# How-to-Cross-Compile-Qt6-Application-to-Windows-Application-in-Linux-Platform

## why

Im working on wsl2, having got used to Jetbrains Tools,
so I use clion to develop qt program instead of qtcreator
the program I am working on is targeted at not-tech-people ,
so I need release it on windows

## how-to-do-it

env:archlinux on wsl2 ,clion

### basic install

1. mingw-w64-cmake
2. mingw-w64-g++
3. qt6-base (which is avaliable on archlinux,or you can use online installer)
4. get qt6 mingw package(which I used online installer for windows,and got it in "C:\Qt\6.7.2\mingw_64",and copy it to ~/qt)

### config

1. create a qt6 project
2. config toolchain of clion using mingw-w64-cmake,mingw-w64-g++

### fix problem one :qt6 package  not found

add cmake param

```shell
-DCMAKE_TOOLCHAIN_FILE=~/qt/lib/cmake/Qt6/qt.toolchain.cmake
```

### fix problem two: conflict between host-headers and mingw-headers

add cmake param

```shell
-DCMAKE_SHARED_LINKER_FLAGS="-Wl,-undefined"
```

add in CMakeLists.txt

```txt
set(CMAKE_FIND_USE_CMAKE_SYSTEM_PATH FALSE)
set(CMAKE_FIND_USE_SYSTEM_ENVIRONMENT_PATH FALSE)
set(CMAKE_SYSROOT "/usr/x86_64-w64-mingw32/")
```

[refer](https://stackoverflow.com/questions/68105648)
if that fails try to swap the position of the two params

### fix problem three: missing dlls

using package tool in ~/qt/bin/windeployqt6.exe ,because I am using wsl2,
I can run it directly,as this

```shell
windeployqt6.exe PROJECT/WIN_BUILD/XXX.exe
```

if it still remind you the missing dll ,find them in /usr/x86_64-w64-mingw32/bin/,copy them to the same dir as XXX.exe  

### fix problem four: the black console appears when the app run in windows

edit CMakeLists.txt, pay attention to postion of  WIN32

```txt
add_executable(PROJECT WIN32
        main.cpp )
```

[refer](https://www.codenong.com/18553125/)

## Compose them all in Makefiles

```make
.PHONY:mingw
projectName=$(shell basename $(CURDIR))
projectPath=D:\\linux$(subst /,\\,$(shell pwd))
mingw:
    x86_64-w64-mingw32-cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=x86_64-w64-mingw32-make -DCMAKE_C_COMPILER=x86_64-w64-mingw32-gcc -DCMAKE_CXX_COMPILER=x86_64-w64-mingw32-g++ -DCMAKE_TOOLCHAIN_FILE=/mnt/c/Qt/6.7.2/mingw_64/lib/cmake/Qt6/qt.toolchain.cmake -DCMAKE_SHARED_LINKER_FLAGS=-Wl,-undefined -DCMAKE_FIND_USE_CMAKE_SYSTEM_PATH=FALSE -DMAKE_FIND_USE_SYSTEM_ENVIRONMENT_PATH=FALSE -DCMAKE_SYSROOT=/usr/x86_64-w64-mingw32/ -G "Unix Makefiles" -S . -B ./cmake-build-mingw
    cmake --build ./cmake-build-mingw --target all
    cp /usr/x86_64-w64-mingw32/bin/libgcc_s_seh-1.dll ./cmake-build-mingw/
    cp /usr/x86_64-w64-mingw32/bin/libstdc++-6.dll   ./cmake-build-mingw/
    cp /usr/x86_64-w64-mingw32/bin/libwinpthread-1.dll   ./cmake-build-mingw/
    /mnt/c/Qt/6.7.2/mingw_64/bin/windeployqt.exe ./cmake-build-mingw/$(projectName).exe
testOnWindows: mingw
    cd $(shell pwd)/cmake-build-mingw/ && ./$(projectName).exe
```
