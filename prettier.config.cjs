const config = {
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "^(@clerk/(.*)$)",
    "^(@prisma/(.*)$)",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^[./]",
  ],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    require.resolve("prettier-plugin-tailwindcss"),
  ],
};

module.exports = config;
