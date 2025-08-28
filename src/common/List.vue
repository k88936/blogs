<script setup>
import { withBase } from 'vitepress'
// Expect posts to be passed as a prop
defineProps({
  posts: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="post-list">
    <el-timeline class="posts">
      <el-timeline-item v-for="(post,index) in posts" :key="index" :timestamp="post.date.string">
        <a :href="withBase(post.url)" class="post-link">
          <span class="post-title">{{ post.title }}</span>
          <span class="post-date">{{ post.date.string }}</span>
        </a>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped>
.blog-post-list {
  margin: 2rem 0;
}

.post-list h1 {
  font-size: 1.8rem;
  font-weight: 700;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.posts {
  list-style: none;
  padding: 0;
}

.post-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
      background-color 0.25s ease,
      border-color 0.25s ease,
      transform 0.1s ease;
}

.post-link:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
}

.post-title {
  font-weight: 600;
  font-size: 1.1rem;
  flex: 1;
}

.post-date {
  flex: 0 0 90px;
  text-align: right;
  white-space: nowrap;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .post-link {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .post-date {
    text-align: left;
    order: -1;
    color: var(--vp-c-text-2);
  }
}
</style>