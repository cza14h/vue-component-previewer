<template>
  <div id="editor">
    <textarea
      style="height: 100%"
      ref="textarea"
    ></textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import emmet from '@emmetio/codemirror-plugin'
import 'codemirror/lib/codemirror.css'
 import 'codemirror/theme/cobalt.css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/matchbrackets'
import debounce from 'lodash/debounce'
import 'codemirror/mode/vue/vue.js'
emmet(CodeMirror)

let editorInstance = null
const { ipcRenderer } = window.require('electron')

ipcRenderer.on('file-opened', function (e, arg) {
  editorInstance.setValue('')
  editorInstance.setValue(arg)
})
export default {
  name: 'CodeEditor',
  data() {
    return {
      editor: null,
      options: {
        tabSize: 2,
        theme: 'cobalt',
        lineNumbers: true,
        line: true,
        mode: 'vue',
        indentUnit: 2,
        smartIndent: true,
        indentWithTabs: true,
      },
    }
  },
  methods: {
    init(value = '') {
      editorInstance = CodeMirror.fromTextArea(this.$refs.textarea, { ...this.options, value })
      this.editor = editorInstance
      this.editor.on('change', debounce(() => {
        ipcRenderer.send('code-updated',{type:'component',code:this.editor.getValue()})
      }, 400))
    },
  },
  mounted() {
    this.init()
    document.title = 'Code Editor'
  }
}
</script>

<style>
.CodeMirror {
  height: 100%;
  min-height: 100vh;
  font-family:  Monaco, "Andale Mono", "Ubuntu Mono", monospace;
}
</style>