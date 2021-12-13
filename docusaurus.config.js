const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Swimm Developer Community',
  tagline: 'Swimm Dev Docs',
  url: 'https://docs.swimm.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'swimmio', // Usually your GitHub org/user name.
  projectName: 'docs.swimm.io', // Usually your repo name.
  titleDelimiter: '🏊',
  customFields: {},
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/swimmio/docs.swimm.io/edit/main/',
        },
        blog: {
          id: 'changelog',
          routeBasePath: 'changelog',
          path: './changelog',
          showReadingTime: true,
          blogTitle: 'Swimm Changelog And Announcements',
          blogDescription: 'Changelog',
          blogSidebarCount: 5,
          blogSidebarTitle: 'Previous Posts',
          editUrl: 'https://github.com/swimmio/docs.swimm.io/edit/main/changelog/',
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
  // see https://docusaurus.io/docs/api/docusaurus-config#scripts
  scripts: 
  [

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
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'desktop',
        path: 'desktop',
        routeBasePath: 'desktop',
        sidebarPath: require.resolve('./sidebarsDesktop.js'),
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      /*
      announcementBar: {
        id: 'wip',
        content:
          '<b>This is a preview of Swimm\'s new documentation portal. It is not yet ready for use.</b>',
        backgroundColor: '#fafbfc',
        textColor: '#091E42',
        isCloseable: false,
      },
      */
      navbar: {
        title: '',
        logo: {
          alt: 'Swimm Documentation',
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
            to: '/changelog', 
            label: 'Changelog', 
            position: 'left'
          },
          {
            to: '/support',
            label: 'Support', 
            position: 'left'
          },
          {
            to: '/faq',
            label: 'FAQ',
            position: 'left',
          },
          {
            to: '/community',
            label: 'Community',
            position: 'left',
          },
          {
            href: 'https://app.swimm.io',
            label: 'Log In',
            position: 'right',
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
              {
                label: 'FAQ',
                to: '/faq',
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
                href: 'https://twitter.com/swimm_io',
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
                href: 'https://www.linkedin.com/company/swimm-io/',
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
        logo: {
          alt: 'Swimm Logo',
          src: 'img/logo.svg',
          href: 'https://swimm.io',
        },
        copyright: `
        Copyright © ${new Date().getFullYear()} Swimm, Inc. Built with Docusaurus.<br />
        Text Content Licensed Under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA 4.0</a> 
        with <a href="https://wiki.creativecommons.org/wiki/best_practices_for_attribution">Attribution Required</a>.<br />
        Code Snippets & Configuration Examples Are Also Licensed Under <a href="https://opensource.org/licenses/MIT">The MIT License</a>.<br />`,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
        switchConfig: {
          darkIcon: '🌙',
          darkIconStyle: {
            marginLeft: '2px',
          },
          // Unicode icons such as '\u2600' will work
          // Unicode with 5 chars require brackets: '\u{1F602}'
          lightIcon: '☀️',
          lightIconStyle: {
            marginLeft: '1px',
          },
        },
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      googleAnalytics: {
        trackingID: 'UA-140447049-1',
        anonymizeIP: true,
      },
      gtag: {
        trackingID: 'GTM-TJP96GG',
        anonymizeIP: false,        
      },
    }),
});
