<!--代码编辑器-->
<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>
<script>
// 核心文件
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript' // 代码高亮必须引入

require('script-loader!jsonlint')
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

// 主题样式
import 'codemirror/theme/rubyblue.css'
// 括号显示匹配
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/selection/active-line'
// 括号、引号编辑和删除时成对出现
import 'codemirror/addon/edit/closebrackets'

export default {
  name: 'JsonEditor',
  props: {
    json: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'application/json'
    },
  },
  data() {
    return {
      jsonEditor: null
    }
  },
  watch: {
    json(val) {
      const editorValue = this.jsonEditor.getValue()
      if (val !== editorValue) {
        this.jsonEditor.setValue(this.json)
      }
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: this.mode,
      lint: true,
      tabSize: 2,
      smartIndent: true, // 是否智能缩进
      styleActiveLine: true, // 当前行高亮
      lineNumbers: true, // 显示行号
      gutters: ['CodeMirror-lint-markers'],
      lineWrapping: true, // 自动换行
      matchBrackets: true, // 括号匹配显示
      autoCloseBrackets: true, // 输入和退格时成对
      autoRefresh: true // 自动刷新
    })
    this.jsonEditor.setValue(this.json)
    this.jsonEditor.on('change', cm => {
      this.$emit('change', cm.getValue())
    })
  },
  methods: {
    refresh() {
      /*
       * refresh: Fires when the editor is refreshed or resized.
       * Mostly useful to invalidate cached values that depend on the editor or character size.
       */
      this.jsonEditor && this.jsonEditor.refresh()
    }
  }
}
</script>
<style scoped>
.json-editor {
  height: 100%;
  position: relative;
  border: #DCDFE6 1px solid;
}
.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 250px;
}
.json-editor >>> .CodeMirror-scroll {
  min-height: 250px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>
