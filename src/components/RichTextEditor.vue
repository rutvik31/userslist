<template>
  <v-container>
    <v-row class="ma-0">
      <v-col class="px-0">
        <v-chip-group v-model="selectedTemp" column>
          <v-chip
            v-for="(data, index) in savedTemp"
            :key="index"
            @click="loadData(data.obj, index)"
            @click:close="loadData('')"
            :close="selectedChipIndex === index"
            :close-icon="selectedChipIndex > -1 ? 'mdi-close' : ''"
            :color="data.color"
            :class="`mr-2 ${data.fontColor}`"
          >
            {{ data.title }}
            <v-icon
              small
              v-if="selectedChipIndex !== index"
              @click="deleteBlock(index)"
              class="ml-2"
              :color="`mr-2 ${data.fontColor}`"
            >
              mdi-delete
            </v-icon>
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <div class="rich-text-editor">
      <div ref="editor" class="editor"></div>
      <button
        @click="openDialog"
        :disabled="!selectedText"
        :class="{ 'save-button': true, 'disabled-button': !selectedText }"
      >
        Make a text block of a selected text
      </button>
      <RichTextEditorBlocks
        @text-block="saveTextBlock"
        :selected-text="selectedText"
        v-model="dialogOpen"
      />
    </div>
  </v-container>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.snow.css";
import RichTextEditorBlocks from "./RichTextEditorBlocks.vue";
import {
  createQuillInstance,
  getSelectedQuillData,
} from "../utils/qillMethods";

export default {
  components: {
    RichTextEditorBlocks,
  },
  data() {
    return {
      dialogOpen: false,
      selectedText: null,
      quill: null,
      savedTemp: [],
      selectedChipIndex: null,
      selectedTemp: null,
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
      this.selectedText = await getSelectedQuillData(this.quill);
    },
    saveTextBlock(title, obj) {
      const object = {
        title,
        obj,
      };

      const { r, g, b } = this.getRandomColor();
      object.color = `rgb(${r}, ${g}, ${b})`;
      object.fontColor = this.getFontColor(r, g, b);

      this.savedTemp.push(object);
      localStorage.setItem("blocks", JSON.stringify(this.savedTemp));
      this.loadData("");
    },
    getTextBlocks() {
      this.savedTemp = JSON.parse(localStorage.getItem("blocks") || "[]");
      this.savedTemp = this.savedTemp.map((obj) => {
        const { r, g, b } = this.getRandomColor();
        obj.color = `rgb(${r}, ${g}, ${b})`;
        obj.fontColor = this.getFontColor(r, g, b);
        console.log(obj);
        return obj;
      });
    },
    deleteBlock(index) {
      this.savedTemp.splice(index, 1);
      localStorage.setItem("blocks", JSON.stringify(this.savedTemp));
      this.loadData("");
      this.selectedChipIndex = null;
    },
    loadData(data, index) {
      this.selectedChipIndex = index;
      this.quill.setContents(data);
    },
    openDialog() {
      if (this.selectedText) {
        this.dialogOpen = true;
      }
    },
    closeDialog() {
      this.dialogOpen = false;
    },
    loadEvents() {
      const interval = setInterval(() => {
        if (this.quill) {
          clearInterval(interval);
          this.quill.on("selection-change", this.getSelectedData);
        }
      }, 400);

      setTimeout(() => {
        if (interval) clearInterval(interval);
      }, 3000);
    },
    getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      return { r, g, b };
    },

    getFontColor(r, g, b) {
      const total = (r + g + b) * 0.4;
      if (total < 146) return "white--text";
      return "";
    },
  },
  mounted() {
    this.renderQuill();
    this.loadEvents();
    this.getTextBlocks();
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
