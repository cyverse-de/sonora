// Browser-safe mock for the "config" npm package (node-config).
// node-config uses fs.readFileSync which is unavailable in Storybook's
// browser environment. This mock lets publicConfig.js build without
// crashing; the resulting values are unused in stories.
module.exports = {
    get: () => null,
    has: () => false,
};
