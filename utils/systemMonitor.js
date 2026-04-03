const os = require("os");
const { setTimeout, clearTimeout } = require("timers");
const { statfs } = require('fs');

async function getSystemInfo() {
    let message = "";

    message += "# Système"
    message += "\n\n"
    message += "\n# 🖱️ CPU"
    const cpuUsage = os.loadavg()[0] * 100;
    message += "\n- " + cpuUsage + "%";
    const cpuUsage15min = os.loadavg()[2] * 100;
    message += "\n  - Il y a 15 minutes : " + cpuUsage + "%";

    message += "\n\n"
    message += "\n## 📝 RAM"
    const memTotal = os.totalmem();
    message += "\n- total : " + formatBytes(totalmem);
    const memFree = os.freemem();
    message += "\n- libre : " + formatBytes(memFree);
    const memUsed = memTotal - memFree;
    message += "\n- utilisé : " + formatBytes(memUsed);
    const memPercentUsed = ((memUsed * 100 / memTotal)).toFixed(2);
    message += "\n  - " + formatBytes(memUsed) + "%";

    /*
    const networkInterfaces = os.networkInterfaces();
    console.log(networkInterfaces); 
    message += networkInterfaces; 
    */

    const diskTable = await getDiskSize();
    message += "\n\n"
    message += "\n## 💾 Disque"
    const totalBytes =  formatBytes(diskTable[0]);
    message += "\n- Disque total : " + totalBytes;
    const freeBytes = formatBytes(diskTable[1]);
    message += "\n- Disque libre : " + freeBytes;
    const usedBytes = formatBytes(diskTable[2]);
    message += "\n- Disque utilisé : " + usedBytes;
    const percentUsed = diskTable[3] + "%";
    message += "\n  - " + percentUsed;

    let googlePing = "N/A";
    let githubPing = "N/A";
    let googlePing2 = "N/A";
    let githubPing2 = "N/A";
    message += "\n\n"
    message += "\n## 🛜 PING"

    try {
        message += "\n### 🔠 Google"
        const googlePingResult = await ping("google.com");
        const googlePingResult2 = await ping2("google.com");
        googlePing = googlePingResult + " ms";
        message += "\n- Fetch : " + googlePing;
        googlePing2 = googlePingResult2 + " ms";
        message += "\n- ICMP : " + googlePing2;

        message += "\n### 🐙 Github"
        const githubPingResult = await ping("github.com");
        const githubPingResult2 = await ping2("github.com");
        githubPing = githubPingResult + ` ms`;
        message += "\n- Fetch : " + githubPing;
        githubPing2 = githubPingResult2 + ` ms`;
        message += "\n- ICMP : " + githubPing2;
    } catch (error) {
        console.error("Error measuring pings:", error);
    }

    message += "\n\n"
    message += "\n## 🕰️ UpTime"
    const uptime = formatUptime(os.uptime()); 
    message += "\n- " + uptime;


    return message;
}

function formatUptime(uptime) {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    return days + " days, " + hours + " hours, " + minutes + " minutes";
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function ping(website) {
  const startTime = Date.now(); 

    try {
        const response = await fetch("https://" + website);
        if (!response.ok) {
            throw new Error("HTTP error! Status: " + response.status);
        }
        const endTime = Date.now(); 
        const delayMs = endTime - startTime;
        return delayMs;
    }
    catch (error) {
        console.error("Error pinging " + website + ":", error);
        return null; 
    }
}

async function ping2(website){
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
        exec(`ping -c 1 ` + website + ` | grep -oP "temps=\\K[0-9.]+"`, (error, stdout, stderr) => {
            resolve(stdout.trim()); // Resolve the promise with the output
        });
    });
}


function getDiskSize(){
    return new Promise((resolve, reject) => {
        statfs('/', (err, stats) => {
            if (err) throw err;

            const totalBytes = stats.blocks * stats.bsize;
            const freeBytes = stats.bfree * stats.bsize;
            const usedBytes = totalBytes - freeBytes;
            const percentUsed = (usedBytes / totalBytes) * 100;

            const diskTable = [totalBytes, freeBytes, usedBytes, percentUsed];

            resolve(diskTable);
        });
    });
}

module.exports = { getSystemInfo };