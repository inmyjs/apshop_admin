<template>
  <subject-detail :is-edit="false"/>
</template>

<script>
import SubjectDetail from './components/SubjectDetail'

export default {
  name: 'CreateForm',
  components: { SubjectDetail }
}
</script>

