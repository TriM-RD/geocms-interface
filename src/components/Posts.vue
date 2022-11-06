<template>
  <h1>Posts</h1>

  <div
    v-for="post in posts"
    :key="post.id"
  >
    <h2>{{ post.title }}</h2>
    <p>{{ post.category }}</p>
  </div>
</template>

<script>
export default {
  props: [
    'posts'
  ]
}
</script>
