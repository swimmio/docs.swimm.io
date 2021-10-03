const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Welcome To The Swimm Developer Community',
  tagline: 'Swimm Dev Docs',
  url: 'https://docs.swimm.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'swimmio', // Usually your GitHub org/user name.
  projectName: 'docs.swimm.io', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/swimmio/docs.swimm.io/edit/master/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/swimmio/docs.swimm.io/edit/master/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      }),
    ],
  ],
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
        // When applying `zh` in language, please install `nodejieba` in your project.
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '',
        logo: {
          alt: 'Swimm Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'Welcome', 
            label: 'Documentation', 
            position: 'left'
          },
          {
            to: '/blog', 
            label: 'Changelog', 
            position: 'left'
          },
          {
            to: '/support',
            label: 'Support', 
            position: 'left'
          },
          {
            to: '/community',
            label: 'Community',
            position: 'left',
          },
          {
            href: 'https://swimm.io/blog/',
            label: 'Blog',
            position: 'right',
          },
          {
            href: 'https://github.com/swimmio/docs.swimm.io',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Using Swimm',
            items: [
              {
                label: 'Quickstart',
                to: '/docs/quickstart',
              },
              {
                label: 'Use Cases',
                href: 'https://swimm.io/use-cases',
              },
              {
                label: 'Pricing',
                href: 'https://swimm.io/pricing',
              },
              {
                label: 'Support',
                to: '/support',
              },
              {
                label: 'Changelog',
                to: '/changelog',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Community Portal',
                to: '/community',
              },
              {
                label: 'Community Slack Channel',
                href: 'https://swimm.live/slack',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/swimm',
              },
            ],
          },
          {
            title: 'Swimm Socially',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/swimmio',
              },
              {
                label: 'Github',
                href: 'https://github.com/swimmio'
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/channel/UC-icYrmhtL3yYxaI0TnL7Lg'
              },
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com/in/swimmio',
              },
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/Swimm.io',
              },
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/swimm.io/',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Terms Of Service',
                href: 'https://swimm.io/terms-of-service',
              },
              {
                label: 'Privacy Policy',
                href: 'https://swimm.io/privacy-policy',
              },
            ],
          },
        ],
        copyright: `
        Copyright © ${new Date().getFullYear()} Swimm, Inc. Built with Docusaurus.<br />
        Text Content Only Licensed Under <a href="">CC-BY-SA 4.0</a>. Attribution Is Required.<br />
        Code Snippets & Configuration Examples Licensed Under <a href="#">The MIT License</a>.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      googleAnalytics: {
        trackingID: 'XX-XXXXXXXXX-X',
        anonymizeIP: true,
      },
      gtag: {
        trackingID: 'XX-XXXXXXXXX-X',
        anonymizeIP: true,        
      },
    }),
});
