<template>
  <UContainer>
     <div class="space-y-4">
      <div>
        <UHeader title="Authors" />
        <UTable :data="authors" class="flex-1 border border-secondary rounded-xl" />
      </div>

      <div>
        <UHeader title="Posts" />
        <UTable :data="posts" class="flex-1 border border-secondary rounded-xl" />
      </div>

      <div>
        <UHeader title="Comments" />
        <UTable :data="comments" class="flex-1 border border-secondary rounded-xl" />
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Users & Content',
})

const { data: users } = useFetch('/api/v1/users')
const { data: content } = useFetch('/api/v1/content')

const authors = computed(() => users.value?.authors)
const posts = computed(() => content.value?.posts)
const comments = computed(() => content.value?.comments)
</script>
