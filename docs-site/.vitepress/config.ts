import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Spectrum Ferret",
  description: "Radio Transmission Analysis Platform Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Libraries', link: '/libraries' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Libraries & Architecture', link: '/libraries' }
        ]
      },
      {
        text: 'API Documentation',
        items: [
          { text: 'Overview', link: '/api/' },
          { text: 'Utilities', link: '/api/utilities' },
          {
            text: 'Authentication',
            items: [
              { text: 'Authentication Hooks', link: '/api/auth' }
            ]
          },
          {
            text: 'Radio Data',
            items: [
              { text: 'Transmissions', link: '/api/transmissions' },
              { text: 'Transmission Summary', link: '/api/transmission-summary' },
              { text: 'Transcriptions', link: '/api/transcriptions' },
              { text: 'STT Engines', link: '/api/stt-engines' }
            ]
          },
          {
            text: 'Playlists & Channels',
            items: [
              { text: 'Playlists', link: '/api/playlists' },
              { text: 'Playlist Channels', link: '/api/playlist-channels' },
              { text: 'Channels', link: '/api/channels' },
              { text: 'Trunking Channels', link: '/api/trunking-channels' }
            ]
          }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
