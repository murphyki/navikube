<template>
  <resource-details></resource-details>
</template>

<script>
  import ResourceDetails from './ResourceExplorer/ResourceDetails'

  export default {
    name: 'resource-explorer',
    components: { ResourceDetails },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }

  }

</script>

<style>
</style>
