<template>
  <div class="rich-text-editor">
    <div :id="id" ref="editor" class="editor"></div>
  </div>
</template>
  
<script>
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  getQuillData,
  createQuillInstance,
  getSelectedQuillData,
} from "@/utils/qillMethods";

export default {
  props: {
    defaultText: {
      required: false,
    },
    id: {
      required: true
    }
  },
  data() {
    return {
      quill: null,
    };
  },
  methods: {
    renderQuill() {
      const interval = setInterval(async () => {
        const editor = this.$refs.editor;
        if (editor) {
          clearInterval(interval);
          this.quill = await createQuillInstance(Quill, editor);
        }
      }, 400);
    },
    async getSelectedData() {
      const selectedText = await getSelectedQuillData(this.quill);
      this.$emit("selection", selectedText);
    },
    async getData() {
      const data = await getQuillData(this.quill);
      this.$emit("input", data);
    },
    setContents(data) {
      const interval = setInterval(async () => {
        if (this.quill) {
          clearInterval(interval);
          this.quill.setContents(data);
        }
      }, 400);
    },
    loadEvents() {
      const interval = setInterval(() => {
        if (this.quill) {
          clearInterval(interval);
          if (this.defaultText) this.setContents(this.defaultText);

          this.quill.on("selection-change", this.getSelectedData);
          this.quill.on("text-change", this.getData);
        }
      }, 400);

      setTimeout(() => {
        if (interval) clearInterval(interval);
      }, 3000);
    },
  },
  mounted() {
    this.renderQuill();
    this.loadEvents();
  },
  beforeDestroy() {
    this.quill.off("selection-change", this.getSelectedData);
    this.quill.off("text-change", this.getData);
  },
};
</script>
  
  <style scoped>
.rich-text-editor {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.editor {
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

.save-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.disabled-button {
  background-color: #ccc;
  cursor: not-allowed;
}

.dialog {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
}

.close-dialog-button {
  margin-top: 10px;
  padding: 4px 8px;
  background-color: #ccc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
  