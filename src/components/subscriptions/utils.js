const bytesInGiB = 1024 ** 3;

const bytesToGiB = (bytes) => {
    return parseFloat(bytes / bytesInGiB);
};

export { bytesInGiB, bytesToGiB };
