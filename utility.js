const os = require("os");
const AWS = require("aws-sdk");
const cloudwatch = new AWS.CloudWatch({ region: "your-region" });

function getSystemMemoryUsage() {
  const totalMemory = os.totalmem() / 1048576;
  const freeMemory = os.freemem() / 1048576;
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercentage = (usedMemory / totalMemory) * 100;
  return { totalMemory, freeMemory, usedMemory, memoryUsagePercentage };
}

function getApplicationMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  const rss = memoryUsage.rss / 1048576;
  const heapTotal = memoryUsage.heapTotal / 1048576;
  const heapUsed = memoryUsage.heapUsed / 1048576;
  const external = memoryUsage.external / 1048576;
  const arrayBuffers = memoryUsage.arrayBuffers / 1048576;
  return { rss, heapTotal, heapUsed, external, arrayBuffers };
}

module.exports = { getSystemMemoryUsage, getApplicationMemoryUsage };
