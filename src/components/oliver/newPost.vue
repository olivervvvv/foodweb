<template>
  <div id="app">
    <div v-for="item in items" :key="item.id">
      <!-- Your content goes here -->
      {{ item.content }}
    </div>
    <div v-if="loading">Loading...</div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const items = ref([]); // Array to store loaded content
    const loading = ref(false);
    let page = 0;

    const loadContent = () => {
      loading.value = true;
      // Make an AJAX request to your backend to load more content
      // Update 'yourApiEndpoint' with your actual API endpoint
      fetch(`http://localhost:8081/posts/getNewPosts?page=${page}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          items.value = items.value.concat(data);
          page++;
          loading.value = false;
        });
    };

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.offsetHeight - 100 &&
        !loading.value
      ) {
        loadContent();
      }
    };

    onMounted(() => {
      loadContent();
      window.addEventListener("scroll", handleScroll);
    });

    return {
      items,
      loading,
    };
  },
};
</script>

<style>
/* Your component styles here */
</style>
