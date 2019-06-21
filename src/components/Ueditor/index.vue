<template>
  <div :id="ueditorId"></div>
</template>

<script>
import toolbar from './toolbar'
import { getServerToken } from '@/utils/auth'
export default {
  name: 'Ueditor',
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-ueditor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    height: {
      type: Number,
      required: false,
      default: 360
    },
    width: {
      type: Number,
      required: false,
      default: 700
    }
  },
  data() {
    return {
      ueditor:null,
      hasChange: false,
      hasInit: false,
      ueditorId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN'
      }
    }
  },
  computed: {
    language() {
      return this.languageTypeList[this.$store.getters.language]
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          this.ueditor.setContent(val || ''))
      }
    },
    language() {
      this.destroyUeditor()
      this.$nextTick(() => this.initUeditor())
    }
  },
  mounted() {
    this.initUeditor()
  },
  activated() {
    this.initUeditor()
  },
  deactivated() {
    this.destroyUeditor()
  },
  destroyed() {
    this.destroyUeditor()
  },
  methods: {
    initUeditor() {
      const _this = this
      let ueditor_config = {
        serverUrl: process.env.BASE_API+'/ueditor?_csrf='+getServerToken('csrfToken'),
        initialFrameWidth: this.width,
        initialFrameHeight: this.height,
        autoHeightEnabled: false
      };
      this.ueditor=UE.getEditor(this.ueditorId,ueditor_config);
      this.ueditor.ready(function() {
        if (_this.value) {
          _this.ueditor.setContent(_this.value)
        }
        _this.hasInit = true;
      });
      this.ueditor.on('contentchange NodeChange Change', () => {
        _this.hasChange = true
        _this.$emit('input', _this.ueditor.getContent())
      })
    },
    destroyUeditor() {
      if (this.ueditor) {
        this.ueditor.destroy()
      }
    },
    setContent(value) {
      this.ueditor.setContent(value)
    },
    getContent() {
      this.ueditor.getContent()
    }
  }
}
</script>

