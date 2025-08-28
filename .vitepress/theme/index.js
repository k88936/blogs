import { h } from 'vue'
import Theme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default {
    ...Theme,
    // Wrap the default theme with ElementPlus
    enhanceApp({ app }) {
        app.use(ElementPlus)
    }
}