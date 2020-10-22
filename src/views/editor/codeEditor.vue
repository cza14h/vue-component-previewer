)<template>
  <div id="editor">
    <textarea style="height: 100%" ref="textarea"></textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/cobalt.css'
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/mode/css/css.js'
// import 'codemirror/mode/xml/xml.js'
// import 'codemirror/mode/clike/clike.js'
// import 'codemirror/mode/markdown/markdown.js'
// import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/r/r.js'
// import 'codemirror/mode/shell/shell.js'
// import 'codemirror/mode/sql/sql.js'
// import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/vue/vue.js'
// import editorMenu from '../../menus/editorMenu'
let editorInstance = null

window.ipcRenderer.on('file-opened', function (e, arg) {
  editorInstance.setValue('')
  editorInstance.setValue(arg)
})
export default {
  name: 'CodeEditor',
  data() {
    return {
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
}
</style>