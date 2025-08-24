---
layout: post
tags: cpp,wsl2,clion,qt,msvc
---

# The problem to be solved

I want to work on clion on wsl2 ,to build a multiplatform product, having some problem on MinGW , so I turned to MSVC

## prepare

* wsl2 is the basis of our discussion.
* install MSVC ,I choosed Visual Studio 2022 Community.
* install Qt6,I installed on C:Qt6, *note install msvc2019_64 version*

## steps

1. **invoke MSVC tools**  
    the problem is MSVC has its own env so calling cmake.exe or cl.exe in wsl2 will not work
    so I turned to call the Powershell for Visual Studio dev and invoke cmake.exe there

    ```shell
    powershell.exe -c  "& 'C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\Launch-VsDevShell.ps1' -SkipAutomaticLocation;cmake ..." 
    ```

    pay attention to the method to make a Powershell.exe for dev.
2. **config Qt6 Compile**  
    we need to add "-DCMAKE_TOOLCHAIN_FILE=C:\Qt\6.7.2\msvc2019_64\lib\cmake\Qt6\qt.toolchain.cmake" for cmake to recognize Qt6 cmake project  
    And a param "-DCMAKE_CXX_FLAGS='-std:c++20 -Zc:__cplusplus'" should be set to solve MSVC build problem

3. **prepare a space to build**
    there is some problem to run MSVC cmake.exe in wsl2 file system. So I determined a place to build.  
    Also to make everything auto ,I Write a Makefiles

    ```shell
    projectName=$(shell basename $(CURDIR))
    projectPath=D:\\linux$(subst /,\\,$(shell pwd))
    msvc:
        powershell.exe -c  "& 'C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\Launch-VsDevShell.ps1' -SkipAutomaticLocation;cmake -DCMAKE_BUILD_TYPE=Release  -DCMAKE_TOOLCHAIN_FILE=C:\Qt\6.7.2\msvc2019_64\lib\cmake\Qt6\qt.toolchain.cmake  -DCMAKE_CXX_FLAGS='-std:c++20 -Zc:__cplusplus' -S . -B $(projectPath)\\cmake-build-msvc"
    ```

    *note: when I choose Ninja as thr build program, it fails with qt6 not configured well,however the Visual Studio build the project in IDE using Ninja can work*
4. **do the rest thing**  
    build, windeployqt:  

    ```shell
    powershell.exe -c  "& 'C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\Launch-VsDevShell.ps1' -SkipAutomaticLocation;msbuild $(projectPath)\\cmake-build-msvc\\$(projectName).sln /p:Configuration=Release"
    /mnt/c/Qt/6.7.2/msvc2019_64/bin/windeployqt.exe $(projectPath)\\cmake-build-msvc\\Release\\$(projectName).exe
    ```

## compose them all

```make
.PHONY:msvc
projectName=$(shell basename $(CURDIR))
projectPath=D:\\linux$(subst /,\\,$(shell pwd))
msvc:
    mkdir -p /mnt/d/linux$(shell pwd)
    powershell.exe -c  "& 'C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\Launch-VsDevShell.ps1' -SkipAutomaticLocation;cmake -DCMAKE_BUILD_TYPE=Release  -DCMAKE_TOOLCHAIN_FILE=C:\Qt\6.7.2\msvc2019_64\lib\cmake\Qt6\qt.toolchain.cmake  -DCMAKE_CXX_FLAGS='-std:c++20 -Zc:__cplusplus' -S . -B $(projectPath)\\cmake-build-msvc"
    powershell.exe -c  "& 'C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\Launch-VsDevShell.ps1' -SkipAutomaticLocation;msbuild $(projectPath)\\cmake-build-msvc\\$(projectName).sln /p:Configuration=Release"
    /mnt/c/Qt/6.7.2/msvc2019_64/bin/windeployqt.exe $(projectPath)\\cmake-build-msvc\\Release\\$(projectName).exe
```

