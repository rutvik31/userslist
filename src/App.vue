<template>
  <v-app>
    <v-container fill-height fluid>
      <v-row>
        <!-- <v-col cols="12">
          <UserList />
        </v-col> -->
        <v-col>
          <EmailTemplate />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import UserList from "./components/UserList.vue";
import EmailTemplate from "./components/EmailTemplate.vue";

export default {
  name: "App",
  components: {
    UserList,
    EmailTemplate,
  },
};
</script>
