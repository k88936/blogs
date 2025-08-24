---

---

<script setup>
import { data as posts } from './posts.data.js' ;
import {withBase} from "vitepress"; 
import PostList from '../common/List.vue';
</script>

<PostList :posts="posts" />