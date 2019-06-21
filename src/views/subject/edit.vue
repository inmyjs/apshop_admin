<template>
  <subject-detail :is-edit="true"/>
</template>

<script>
import SubjectDetail from './components/SubjectDetail'

export default {
  name: 'EditForm',
  components: { SubjectDetail }
}
</script>

