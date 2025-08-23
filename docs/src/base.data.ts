import {createContentLoader} from 'vitepress'

interface Post {
    title: string
    url: string
    date: {
        time: number
        string: string
    }
}


function formatDate(raw: string): Post['date'] {
    const date = new Date(raw)
    date.setUTCHours(12)
    return {
        time: +date,
        string: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}

export default function genPostsData(dir : string) {
    return createContentLoader(dir+'*.md', {
        transform(raw): Post[] {
            return raw
                .filter(({url, frontmatter}) => (url && frontmatter && frontmatter.title))
                .map(({url, frontmatter}) => ({
                    title: frontmatter.title,
                    url,
                    date: formatDate(frontmatter.date)
                }))
                .sort((a, b) => b.date.time - a.date.time)
        }
    })
}
