/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://analytics.ll-u.ru",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: "" }],
  },
  sitemapSize: 5000,
};
