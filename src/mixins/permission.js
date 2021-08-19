import { createNamespacedHelpers } from 'vuex'

const { mapState } = createNamespacedHelpers('permission')

export default {
  computed: {
    ...mapState({
      routes: state => state.routes
    })
  }
}
