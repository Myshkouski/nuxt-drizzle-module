<template>
  <div class="space-y-4">
    <div>
      <UHeader title="Baz" />
      <UTable
        :data="baz"
        class="flex-1 border border-secondary rounded-xl"
      />
    </div>

    <div>
      <UHeader title="Qux" />
      <UTable
        :data="qux"
        class="flex-1 border border-secondary rounded-xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'foo & bar',
})

const { data: foo } = useFetch('/api/v1/foo')
const { data: bar } = useFetch('/api/v1/bar')

const baz = computed(() => bar.value?.baz)
const qux = computed(() => foo.value?.qux)
</script>
