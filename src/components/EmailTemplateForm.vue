<template>
  <v-dialog scrollable v-model="openDialog">
    <v-card>
      <v-card-title>
        Title
        <v-spacer />
        <v-btn icon @click="openDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="inputVal" label="Name"></v-text-field>
        <QuillEditor id="templateForm" ref="editor" v-model="quillData" />
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-btn
          :disabled="!inputVal"
          @click="saveTemplate"
          block
          depressed
          color="primary"
          class="rounded-0"
        >
          {{ selectedObject ? "update" : "save" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import QuillEditor from "./General/QuillRichTextEditor.vue";
export default {
  components: {
    QuillEditor,
  },
  props: {
    value: {
      default: false,
    },
    selectedText: {
      required: false,
    },
    selectedObject: {
      required: false,
    },
  },
  data() {
    return {
      quill: null,
      inputVal: "",
      quillData: "",
    };
  },
  computed: {
    openDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    openDialog(val) {
      if (val) {
        if (!this.selectedText && !this.selectedObject)
          throw new Error("Selected Text/Object is required");
        this.getTextFromRTE();
      }
    },
  },
  methods: {
    getTextFromRTE() {
      const interval = setInterval(() => {
        const editor = this.$refs?.editor;
        if (editor) {
          clearInterval(interval);
          if (this.selectedText) editor.setContents(this.selectedText);
          if (this.selectedObject) {
            editor.setContents(this.selectedObject.obj);
            this.inputVal = this.selectedObject.title;
          }
        }
      }, 400);

      setTimeout(() => {
        if (interval) clearInterval(interval);
      }, 3000);
    },
    async saveTemplate() {
      console.log(this.quillData)
      this.$emit("text-block", this.inputVal, this.quillData);
      this.inputVal = "";
      this.openDialog = false;
    },
  },
};
</script>

<style scoped></style>
