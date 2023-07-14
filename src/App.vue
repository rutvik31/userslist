<template>
  <v-app>
    <v-container fill-height fluid>
      <v-row>
        <!-- <v-col cols="12">
          <UserList />
        </v-col> -->
        <v-col>
          <RichTextEditor />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import UserList from "./components/UserList.vue";
import RichTextEditor from "./components/RichTextEditor.vue";

export default {
  name: "App",
  components: {
    UserList,
    RichTextEditor
},
};
</script>
