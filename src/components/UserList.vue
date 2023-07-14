<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <v-row class="ma-0">
          <v-col cols="4" class="pa-0">
            <v-text-field
              outlined
              dense
              label="search..."
              v-model="search"
              append-icon="mdi-magnify"
            >
            </v-text-field>
          </v-col>
          <v-col cols="8" class="pa-0 d-flex justify-end">
            <v-btn color="primary" @click="showAddUserModal = true"
              >Add New User</v-btn
            >
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :search="search"
        hide-default-footer
      >
        <template v-slot:item.action="{ item }">
          <v-icon
            max-width:10
            color="green"
            class="mr-2"
            @click="editUser(item)"
            >mdi-pencil</v-icon
          >
          <v-icon max-width:10 color="red" @click="deleteUser(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="showAddUserModal" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          {{ selectedUser ? "Edit User" : "Add User" }}
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            @submit.prevent="selectedUser ? updateUser() : addUser()"
            v-model="valid"
          >
            <v-text-field
              label="Name"
              v-model="user.name"
              :rules="[(v) => !!v || 'Name is required']"
              required
            ></v-text-field>
            <v-text-field
              label="Email"
              v-model="user.email"
              :rules="emailRules"
              required
            ></v-text-field>
            <v-text-field
              label="Mobile"
              placeholder="(123) 456-7890"
              v-model="user.mobile"
              :maxlength="maxChars"
              :rules="phoneNumberRules"
              required
            ></v-text-field>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  readonly
                  label="Date of Birth"
                  v-model="user.dateOfBirth"
                  v-on="on"
                  :rules="[(v) => !!v || 'Date of birth is required']"
                  required
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="user.dateOfBirth"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                class="white--text"
                @click="(showAddUserModal = false), resetForm()"
                >Cancel</v-btn
              >
              <v-btn color="primary" type="submit" :disabled="!valid"
                >Save</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDeleteUserModal" max-width="500px" persistent>
      <v-card>
        <v-card-title> Confirm Delete </v-card-title>
        <v-card-text>
          Are you sure you want to delete
          {{ selectedUser ? selectedUser.name : "" }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            class="white--text"
            @click="showDeleteUserModal = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" @click="deleteConfirmed">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  name: "UserList",
  components: {},
  data() {
    return {
      search: "",
      headers: [
        { text: "Name", value: "name", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Mobile", value: "mobile", sortable: false },
        { text: "Date of Birth", value: "dateOfBirth", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
      showAddUserModal: false,
      showDeleteUserModal: false,
      selectedUser: "",
      menu: false,
      valid: false,
      user: {
        name: "",
        email: "",
        mobile: "",
        dateOfBirth: "",
      },
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+/.test(v) || "Email must be valid",
      ],
      maxChars: 10,
      phoneNumberRules: [
        (v) => /^[0-9]+$/.test(v) || "Please enter only numbers",
      ],
    };
  },
  computed: {
    filteredUsers() {
      return this.users
        .filter(
          (user) =>
            (user.name &&
              user.name.toLowerCase().includes(this.search.toLowerCase())) ||
            (user.email &&
              user.email.toLowerCase().includes(this.search.toLowerCase())) ||
            (user.mobile &&
              user.mobile.toLowerCase().includes(this.search.toLowerCase()))
        )
        .slice()
        .reverse();
    },
    users() {
      return this.$store.state.users;
    },
  },
  created() {
    this.$store.dispatch("getAllUsers");
  },
  methods: {
    resetForm() {
      this.selectedUser = "";
      this.$refs.form.reset();
    },
    addUser() {
      this.$store
        .dispatch("addUser", this.user)
        .then(() => {
          this.$refs.form.reset();
          this.showAddUserModal = false;
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        });
    },
    editUser(item) {
      this.selectedUser = item;
      this.user = Object.assign({}, item);
      this.showAddUserModal = true;
    },
    updateUser() {
      this.$store
        .dispatch("updateUser", {
          ...this.user,
          originalEmail: this.selectedUser.email,
        })
        .then(() => {
          this.$refs.form.reset();
          this.showAddUserModal = false;
          this.selectedUser = null;
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        });
    },
    deleteUser(user) {
      this.selectedUser = user;
      this.showDeleteUserModal = true;
    },
    deleteConfirmed() {
      this.$store
        .dispatch("deleteUser", this.selectedUser.email)
        .then(() => {
          this.showDeleteUserModal = false;
          this.selectedUser = null;
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        });
    },
  },
};
</script>
