const mainBundles = ["bundles/bundle.js", "bundles/integer.js", "bundles/stream.js", "bundles/util.js"];

export default {
  groups: [
    {
      name: "Bundles",
      include: mainBundles,
    },
    {
      name: "Hashing Functions",
      include: "bundles/*.js",
      exclude: mainBundles,
    },
  ],
  minify: true,
};
