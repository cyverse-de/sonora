const bytesInGiB = 1024 ** 3;

const bytesToGiB = (quota) => {
    return parseFloat(quota / bytesInGiB).toFixed(1);
};

export { bytesInGiB, bytesToGiB };
