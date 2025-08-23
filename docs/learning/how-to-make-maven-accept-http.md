---
date: 2025-8-22
title: let maven use http
---
# How
create folder and files like this:

- pom.xml
- .mvn/
    - maven.config
        ```shell
        --settings=./.mvn/local-settings.xml
        ```
    - local-settings.xml
        ```shell
        <settings>
            <mirrors>
                <mirror>
                    <id>maven-default-http-blocker</id>
                    <mirrorOf>dummy</mirrorOf>
                    <name>Dummy mirror to override default blocking mirror that blocks http</name>
                    <url>http://0.0.0.0/</url>
                </mirror>
            </mirrors>
        </settings>
        ```
