import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'MyComponent',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () => (
      <div>
        <h1>{props.message}</h1>
		<h2>This is a Vue component</h2>
      </div>
    )
  }
})


