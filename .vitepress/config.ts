import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    srcDir: "src",

    title: "k88936's blogs",
    description: "A VitePress Site",
    base: "/blogs/",
    head: [
        ['link', {rel: 'icon', type: 'image/x-icon', href: '/icon.png'}]
    ],
    themeConfig: {
        logo: "/icon.png",
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Learning', link: '/learning/'},
            {text: 'Diary', link: '/diary/'},
            {text: 'Art', link: '/art/'},
            {text: 'About', link: '/about'}
        ],

        socialLinks: [
            {icon: 'github', link: 'https://github.com/k88936'}
        ]
    }
})
