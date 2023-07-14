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
        <div class="rich-text-editor">
          <div ref="textBlockEditor" class="editor"></div>
        </div>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-btn
          @click="saveTemplate"
          block
          depressed
          color="primary"
          class="rounded-0"
          >save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Quill from "quill";
import { createQuillInstance, getQuillData } from "../utils/qillMethods";

export default {
  props: {
    value: {
      default: false,
    },
    selectedText: {
      required: true,
    },
  },
  data() {
    return {
      quill: null,
      inputVal: "",
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
        if (!this.quill) this.renderQuill();
        this.getTextFromRTE();
      }
    },
  },
  methods: {
    renderQuill() {
      const interval = setInterval(async () => {
        const editor = this.$refs.textBlockEditor;
        if (editor) {
          clearInterval(interval);
          this.quill = await createQuillInstance(Quill, editor);
        }
      }, 400);
    },
    getTextFromRTE() {
      const interval = setInterval(() => {
        if (this.quill) {
          clearInterval(interval);
          this.quill.setContents(this.selectedText);
        }
      }, 400);

      setTimeout(() => {
        if (interval) clearInterval(interval);
      }, 3000);
    },
    async saveTemplate() {
      const data = await getQuillData(this.quill);
      this.$emit("text-block", this.inputVal, data);
      this.openDialog = false;
    },
  },
};
</script>

<style scoped></style>
