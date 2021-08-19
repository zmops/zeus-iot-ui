<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    routepath: {
      type: String,
      default: ''
    },
    active: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, path, routepath, active } = context.props
    const vnodes = []

    if (icon) {
      if (routepath.includes(path)) {
        vnodes.push(<svg-icon icon-class={active}/>)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
      if (title) {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    } else {
      if (title) {
        if (routepath.includes(path)) {
          vnodes.push(<span slot='title' class='subnav active'>{(title)}</span>)
        } else {
          vnodes.push(<span slot='title' class='subnav'>{(title)}</span>)
        }
      }
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
