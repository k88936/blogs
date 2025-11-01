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
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
```powershell
choco install Carbon
Import-Module 'Carbon'
Grant-CPrivilege -Identity $SERVICE_USERNAME -Privilege SeServiceLogonRight
```

# install
```powershell
# TeamCityAgent-Install.ps1

param (
    [Parameter(Mandatory)]
    [string]$serverUrl,

    [string]$agentDir = "$env:SystemDrive\buildAgent",
    [string]$agentName = $env:COMPUTERNAME,
    [string]$agentWorkDir,
    [string]$agentTempDir,
    [string]$agentSystemDir,
    [string]$ownPort = "9090",
    [string]$serviceAccount,
    [string]$serviceAccountPassword,
    [switch]$downloadFullAgent
)

$ErrorActionPreference = 'Stop'

# Resolve optional directories
if (-not $agentWorkDir) { $agentWorkDir = "$agentDir\work" }
if (-not $agentTempDir) { $agentTempDir = "$agentDir\temp" }
if (-not $agentSystemDir) { $agentSystemDir = "$agentDir\system" }

# Normalize paths for Java properties (escape backslashes)
$agentWorkDirEsc = $agentWorkDir.Replace('\', '\\')
$agentTempDirEsc = $agentTempDir.Replace('\', '\\')
$agentSystemDirEsc = $agentSystemDir.Replace('\', '\\')

$agentZipArchiveName = if ($downloadFullAgent) { "buildAgentFull.zip" } else { "buildAgent.zip" }
$zipUrl = "$serverUrl/update/$agentZipArchiveName"

$buildAgentDistFile = "$agentDir\conf\buildAgent.dist.properties"
$buildAgentPropFile = "$agentDir\conf\buildAgent.properties"
$wrapperConfFile = "$agentDir\launcher\conf\wrapper.conf"

# Create agent directory if missing
if (-not (Test-Path $agentDir)) {
    New-Item -ItemType Directory -Path $agentDir | Out-Null
}

# Download and extract ZIP
$tempZip = "$env:TEMP\teamcity-agent-$([Guid]::NewGuid()).zip"
try {
    Write-Host "Downloading agent from $zipUrl"
    Invoke-WebRequest -Uri $zipUrl -OutFile $tempZip
    Expand-Archive -Path $tempZip -DestinationPath $agentDir -Force
} finally {
    if (Test-Path $tempZip) { Remove-Item $tempZip -Force }
}

# Helper: Parse Java-style properties file into ordered dict
function Get-PropsDictFromJavaPropsFile {
    param($configFile)
    $configProps = [ordered]@{}
    Get-Content $configFile | ForEach-Object {
        if (-not $_.StartsWith('#') -and -not $_.StartsWith(';') -and -not $_.StartsWith('`') -and $_.Contains('=')) {
            $parts = $_.Split('=', 2)
            $configProps[$parts[0]] = $parts[1]
        }
    }
    return $configProps
}

# Load or initialize buildAgent.properties
if (Test-Path $buildAgentPropFile) {
    Write-Verbose "Using existing buildAgent.properties"
    $props = Get-PropsDictFromJavaPropsFile $buildAgentPropFile
} else {
    Write-Verbose "Using buildAgent.dist.properties as template"
    $props = Get-PropsDictFromJavaPropsFile $buildAgentDistFile
}

# Update required properties
$props['serverUrl'] = $serverUrl
$props['name'] = $agentName
$props['workDir'] = $agentWorkDirEsc
$props['tempDir'] = $agentTempDirEsc
$props['systemDir'] = $agentSystemDirEsc
$props['ownPort'] = $ownPort

# Write updated properties
$propsLines = $props.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }
Set-Content -Path $buildAgentPropFile -Value $propsLines -Encoding Ascii

# Update wrapper.conf if custom name or service account
$defaultName = ($agentName -eq $env:COMPUTERNAME)
$defaultServiceAccount = (-not $serviceAccount)

if (-not ($defaultName -and $defaultServiceAccount)) {
    if (Test-Path $wrapperConfFile) {
        $wrapperProps = Get-PropsDictFromJavaPropsFile $wrapperConfFile

        if (-not $defaultName -and $agentName) {
            $wrapperProps['wrapper.ntservice.name'] = $agentName
            $wrapperProps['wrapper.ntservice.displayname'] = "$agentName TeamCity Build Agent"
            $wrapperProps['wrapper.ntservice.description'] = "$agentName TeamCity Build Agent Service"
        }

        if ($serviceAccount) {
            if ($serviceAccount -notlike "*\*") {
                $serviceAccount = ".\$serviceAccount"
            }
            $wrapperProps['wrapper.ntservice.account'] = $serviceAccount
            if ($serviceAccountPassword) {
                $wrapperProps['wrapper.ntservice.password'] = $serviceAccountPassword
            }
        }

        $wrapperLines = $wrapperProps.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }
        Set-Content -Path $wrapperConfFile -Value $wrapperLines -Encoding Ascii
    }
}

# Install and start service
$binDir = Join-Path $agentDir "bin"
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

Write-Host "TeamCity agent installed and started successfully."

.\TeamCityAgent-Install.ps1 `
  -serverUrl "https://teamcity.k88936.top" `
  -agentName "windows-agent" `
  -agentDir "C:\Teamcity\agent" `
  -serviceAccount ".\Administrator" `
  -serviceAccountPassword "admin"
```


# reference
[priviledge](https://stackoverflow.com/questions/30718514/installing-teamcity-build-agent-as-a-user-failed-to-install-the-service-select)
[get-carbon](https://get-carbon.org/about_Carbon_Installation.html)
