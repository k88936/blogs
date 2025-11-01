---
date: 2025-10-31
title: teamcity-agent-on-win
---

# simple pass
```powershell

secedit /configure /db secedit.sdb /cfg "$env:TEMP\sec.cfg" /areas SECURITYPOLICY; (Get-Content "$env:TEMP\sec.cfg") -replace 'PasswordComplexity = 1', 'PasswordComplexity = 0' -replace 'MinimumPasswordLength = \d+', 'MinimumPasswordLength = 1' | Set-Content "$env:TEMP\sec.cfg"; secedit /configure /db secedit.sdb /cfg "$env:TEMP\sec.cfg" /areas SECURITYPOLICY
net user <username> <newpassword>

```

# previledge (allow Administrator run as service)
install choco
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
grant previledge
```powershell
choco install Carbon
Import-Module 'Carbon'
Grant-CPrivilege -Identity $SERVICE_USERNAME -Privilege SeServiceLogonRight
```

# install
```powershell
function Install-TeamCityAgent {
    param (
        [Parameter(Mandatory)]
        [string]$ServerUrl,

        [string]$AgentName = $env:COMPUTERNAME,
        [string]$AgentDir = "$env:SystemDrive\buildAgent",
        [string]$AgentWorkDir,
        [string]$AgentTempDir,
        [string]$AgentSystemDir,
        [string]$OwnPort = "9090",
        [string]$ServiceAccount,
        [string]$ServiceAccountPassword,
        [switch]$DownloadFullAgent
    )

    $ErrorActionPreference = 'Stop'

    # Resolve optional directories
    if (-not $AgentWorkDir) { $AgentWorkDir = "$AgentDir\work" }
    if (-not $AgentTempDir) { $AgentTempDir = "$AgentDir\temp" }
    if (-not $AgentSystemDir) { $AgentSystemDir = "$AgentDir\system" }

    # Normalize paths for Java properties
    $AgentWorkDirEsc = $AgentWorkDir.Replace('\', '\\')
    $AgentTempDirEsc = $AgentTempDir.Replace('\', '\\')
    $AgentSystemDirEsc = $AgentSystemDir.Replace('\', '\\')

    $agentZipName = if ($DownloadFullAgent) { "buildAgentFull.zip" } else { "buildAgent.zip" }
    $zipUrl = "$ServerUrl/update/$agentZipName"

    $buildAgentDistFile = "$AgentDir\conf\buildAgent.dist.properties"
    $buildAgentPropFile = "$AgentDir\conf\buildAgent.properties"
    $wrapperConfFile = "$AgentDir\launcher\conf\wrapper.conf"

    # Create agent directory
    if (-not (Test-Path $AgentDir)) {
        New-Item -ItemType Directory -Path $AgentDir -Force | Out-Null
    }

    # Download and extract
    $tempZip = "$env:TEMP\teamcity-agent-$([Guid]::NewGuid()).zip"
    try {
        Write-Host "Downloading agent from $zipUrl"
        Invoke-WebRequest -Uri $zipUrl -OutFile $tempZip
        Expand-Archive -Path $tempZip -DestinationPath $AgentDir -Force
    } finally {
        if (Test-Path $tempZip) { Remove-Item $tempZip -Force }
    }

    # Helper: parse Java properties
    function Get-PropsDictFromJavaPropsFile {
        param($Path)
        $dict = [ordered]@{}
        Get-Content $Path | ForEach-Object {
            if (-not $_.StartsWith('#') -and -not $_.StartsWith(';') -and -not $_.StartsWith('`') -and $_.Contains('=')) {
                $parts = $_.Split('=', 2)
                $dict[$parts[0]] = $parts[1]
            }
        }
        return $dict
    }

    # Configure buildAgent.properties
    if (Test-Path $buildAgentPropFile) {
        $props = Get-PropsDictFromJavaPropsFile $buildAgentPropFile
    } else {
        $props = Get-PropsDictFromJavaPropsFile $buildAgentDistFile
    }

    $props['serverUrl'] = $ServerUrl
    $props['name'] = $AgentName
    $props['workDir'] = $AgentWorkDirEsc
    $props['tempDir'] = $AgentTempDirEsc
    $props['systemDir'] = $AgentSystemDirEsc
    $props['ownPort'] = $OwnPort

    $propsLines = $props.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }
    Set-Content -Path $buildAgentPropFile -Value $propsLines -Encoding Ascii

    # Configure wrapper.conf if needed
    $defaultName = ($AgentName -eq $env:COMPUTERNAME)
    $defaultServiceAccount = (-not $ServiceAccount)

    if (-not ($defaultName -and $defaultServiceAccount) -and (Test-Path $wrapperConfFile)) {
        $wrapperProps = Get-PropsDictFromJavaPropsFile $wrapperConfFile

        if (-not $defaultName -and $AgentName) {
            $wrapperProps['wrapper.ntservice.name'] = $AgentName
            $wrapperProps['wrapper.ntservice.displayname'] = "$AgentName TeamCity Build Agent"
            $wrapperProps['wrapper.ntservice.description'] = "$AgentName TeamCity Build Agent Service"
        }

        if ($ServiceAccount) {
            if ($ServiceAccount -notlike "*\*") {
                $ServiceAccount = ".\$ServiceAccount"
            }
            $wrapperProps['wrapper.ntservice.account'] = $ServiceAccount
            if ($ServiceAccountPassword) {
                $wrapperProps['wrapper.ntservice.password'] = $ServiceAccountPassword
            }
        }

        $wrapperLines = $wrapperProps.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }
        Set-Content -Path $wrapperConfFile -Value $wrapperLines -Encoding Ascii
    }

    # Install and start service
    $binDir = Join-Path $AgentDir "bin"
    Push-Location $binDir
    try {
        Write-Host "Installing service..."
        & .\service.install.bat
        if ($LASTEXITCODE -ne 0) { throw "service.install.bat failed" }

        Start-Sleep -Seconds 2

        Write-Host "Starting service..."
        & .\service.start.bat
        if ($LASTEXITCODE -ne 0) { throw "service.start.bat failed" }
    } finally {
        Pop-Location
    }

    Write-Host "TeamCity agent '$AgentName' installed and started."
}
```
usage: 

```powershell
Install-TeamCityAgent `
  -ServerUrl "https://teamcity.k88936.top" `
  -AgentName "windows-agent" `
  -AgentDir "C:\Teamcity\agent" `
  -ServiceAccount ".\Administrator" `
  -ServiceAccountPassword "admin"
```


# reference
[priviledge](https://stackoverflow.com/questions/30718514/installing-teamcity-build-agent-as-a-user-failed-to-install-the-service-select)
[get-carbon](https://get-carbon.org/about_Carbon_Installation.html)
[teamcity-install-script](https://community.chocolatey.org/packages/TeamCityAgent#files)
