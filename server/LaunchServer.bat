@ECHO OFF

:: When setting the memory below make sure to include the amount of ram letter. M = MB, G = GB. Don't use 5GB for example, it's 5G ::

:: This is allocated memory ::
set mem=3G

:: Don't edit past this point ::
ECHO [Hexxit II] Server is starting...

java -server -Xmx%mem% -XX:+UseG1GC -Xms2G -Dsun.rmi.dgc.server.gcInterval=2147483646 -XX:+UnlockExperimentalVMOptions -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M -Dfml.queryResult=confirm -Duser.language=en -jar forge-1.12.2-14.23.5.2855.jar nogui

PAUSE
