const bytesInGiB = 1024 ** 3;

const bytesToGiB = (bytes) => {
    return parseFloat(bytes / bytesInGiB);
};

const formatUsagePercentage = (usage, quota) =>
    quota ? ((usage / quota) * 100).toFixed(2) : 0;

export { bytesInGiB, bytesToGiB, formatUsagePercentage };
