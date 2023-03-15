const bytesInGiB = 1024 ** 3;

const bytesToGiB = (bytes) => {
    return parseFloat(bytes / bytesInGiB).toFixed(1);
};

export { bytesInGiB, bytesToGiB };
