const os = require("os");
const { setTimeout, clearTimeout } = require("timers");
const { statfs } = require('fs');

async function getSystemInfo() {
    const cpuUsage = os.loadavg()[0] * 100;
    const cpuUsage15min = os.loadavg()[2] * 100;

    const memTotal = os.totalmem(); 
    const memFree = os.freemem();
    const memUsed = memTotal - memFree;

    const networkInterfaces = os.networkInterfaces();
    console.log(networkInterfaces);

    const diskTable = await getDiskSize();
    const totalBytes =  formatBytes(diskTable[0]);
    const freeBytes = formatBytes(diskTable[1]);
    const usedBytes = formatBytes(diskTable[2]);
    const percentUsed = diskTable[3] + "%";

    let googlePing = "N/A";
    let githubPing = "N/A";
    let googlePing2 = "N/A";
    let githubPing2 = "N/A";

    try {
        const googlePingResult = await ping("google.com");
        const googlePingResult2 = await ping2("google.com");
        googlePing = googlePingResult + " ms";
        googlePing2 = googlePingResult2 + " ms";

        const githubPingResult = await ping("github.com");
        const githubPingResult2 = await ping2("github.com");
        githubPing = githubPingResult + ` ms`;
        githubPing2 = githubPingResult2 + ` ms`;
    } catch (error) {
        console.error("Error measuring pings:", error);
    }

    return {
        LoadNow: cpuUsage + "%",
        LoadAvg: cpuUsage15min + "%",
        googlePing,
        googlePing2,
        githubPing,
        githubPing2,
        uptime: formatUptime(os.uptime()),
        totalRam: formatBytes(memTotal),
        usedRam: formatBytes(memUsed), 
        ramUsage: ((memUsed * 100 / memTotal)).toFixed(2) + "%",
        ramFree: formatBytes(memFree),
        networkInterfaces: Object.values(networkInterfaces),
        diskTotal: totalBytes,
        diskFree: freeBytes,
        diskUsed: usedBytes,
        diskPercentUsed: percentUsed
    };
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