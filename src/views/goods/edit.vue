<template>
  <product-detail :is-edit='true' :goods_id="$route.params.goods_id"></product-detail>
</template>

<script>
import ProductDetail from './components/ProductDetail'

export default {
  name: 'editProduct',
  components: { ProductDetail }
}
</script>

