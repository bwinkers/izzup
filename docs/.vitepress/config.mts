import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Izzup Social",
  description: "A free and open social network, built on the twtxt protocol.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Protocol', link: '/protocol' }
    ],

    sidebar: [
      {
        text: 'Protocol',
        items: [
          { text: 'Core twtxt', link: '/protocol/twtxt/' },
          { text: 'Official twtxt extensions', link: '/protocol/twtxt/extensions/' },
          { text: 'Izzup twtxt extensions', link: '/protocol/twtxt/izzup/' },
        ]
      },
      {
        text: 'Benefits',
        items: [
          { text: 'Own Your Identity', link: '/own-your-identity/' },
          { text: 'Open Source', link: '/open-source/' },
          { text: 'Portable Identity', link: '/api/self-hosting/' },
          { text: 'Built on Twtxt', link: '/izzup-twtxt/' },
        ]
      },
      {
        text: 'Izzup API',
        items: [
          { text: 'Software', link: 'https://github.com/bwinkers/izzup/api/' },
          { text: 'Swagger Spec', link: 'https://api.izzup.com/spec/' },
          { text: 'Self-hosting', link: '/api/self-hosting/' },
          { text: 'Architecture', link: '/api/architecture/' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bwinkers/izzup' }
    ]
  }
})
