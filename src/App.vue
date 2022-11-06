<template>
  <div class="container">
    <div class="half">
      <Search
        :search="search"
      />
    </div>
    <div class="half">
      <Posts :posts="posts" />
    </div>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Posts from './components/Posts.vue'
import MOCK_DATA from './MOCK_DATA.json'
export default {
  name: 'App',
  components: {
    Search,
    Posts
  },
  data () {
    return {
      posts: MOCK_DATA
    }
  },
  methods: {
    search (term) {
      this.resetPosts()
      this.posts = this.posts.filter((post) => {
        return post.title.toLowerCase().includes(term.toLowerCase()) || post.category.toLowerCase().includes(term.toLowerCase())
      })
    },
    resetPosts () {
      this.posts = MOCK_DATA
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  margin: 20px;
}
.half {
  width: 40%;
}
</style>
