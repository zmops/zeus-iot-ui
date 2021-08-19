<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  async created() {
    console.log('name::::::' + location.pathname)
    console.log('path::::::' + this.$route.path)
    if (location.pathname !== '/login' && this.$route.path !== '/') {
      this.$store.dispatch('user/getMember').then(() => {})
    }
    if (location.pathname === '/' && this.$route.path === '/') {
      this.$store.dispatch('user/getMember').then(() => {})
    }
  }
}
</script>
