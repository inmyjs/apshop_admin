<template>
  <product-detail :is-edit='false'></product-detail>
</template>

<script>
import ProductDetail from './components/ProductDetail'

export default {
  name: 'createProduct',
  components: { ProductDetail }
}
</script>

