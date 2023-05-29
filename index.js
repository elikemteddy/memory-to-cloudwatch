const AWS = require("aws-sdk");
const {
  getSystemMemoryUsage,
  getApplicationMemoryUsage,
} = require("./utility");
const crypto = require("crypto");

module.exports = (region) => {
  const cloudwatch = new AWS.CloudWatch({ region });
  const id = crypto.randomBytes(16).toString("hex");

  async function putMetricData(metricData) {
    try {
      const params = {
        MetricData: metricData,
        Namespace: `MemoryUsage ${id}`,
      };
      await cloudwatch.putMetricData(params).promise();
      console.log("Successfully put metric data");
    } catch (error) {
      throw error;
    }
  }

  async function memoryUsageToCloudwatch() {
    try {
      const { memoryUsagePercentage } = getSystemMemoryUsage();
      const { rss } = getApplicationMemoryUsage();
      const metricData = [
        {
          MetricName: `MemoryUsage ${id}`,
          Dimensions: [
            {
              Name: "MemoryUsage",
              Value: "System",
            },
          ],
          Unit: "Percent",
          Value: memoryUsagePercentage,
        },
        {
          MetricName: "ApplicationMemoryUsage",
          Dimensions: [
            {
              Name: "MemoryUsage",
              Value: "Application",
            },
          ],
          Unit: "Megabytes",
          Value: rss,
        },
      ];
      await putMetricData(metricData);
    } catch (error) {
      throw error;
    }
  }

  setInterval(async () => {
    await memoryUsageToCloudwatch();
  }, 1000 * 60 * 1);
};
