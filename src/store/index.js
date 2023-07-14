import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: JSON.parse(localStorage.getItem("users") || "[]"),
  },
  mutations: {
    fetchUserList(state) {
      state.users = JSON.parse(localStorage.getItem("users") || "[]")
    },
    addUser(state, user) {
      state.users.push(user);
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    updateUser(state, user) {
      const index = state.users.findIndex((u) => u.email === user.email);
      if (index !== -1) {
        state.users.splice(index, 1, user);
        localStorage.setItem("users", JSON.stringify(state.users));
      }
    },
    deleteUser(state, email) {
      state.users = state.users.filter((u) => u.email !== email);
      localStorage.setItem("users", JSON.stringify(state.users));
    },
  },
  actions: {
    addUser({ commit, state }, user) {
      if (state.users.some((u) => u.email === user.email)) {
        return Promise.reject("Email already exists");
      }
      commit("addUser", user);
      setTimeout(() => {
        commit("fetchUserList")
      }, 200);
      return Promise.resolve();
    },
    updateUser({ commit, state }, user) {
      if (
        state.users.some(
          (u) => u.email === user.email && u.email !== user.originalEmail
        )
      ) {
        return Promise.reject("Email already exists");
      }
      commit("updateUser", user);
      return Promise.resolve();
    },
    deleteUser({ commit }, email) {
      commit("deleteUser", email);
      return Promise.resolve();
    },
    getAllUsers({ state }) {
      return Promise.resolve(state.users);
    },
  },
});
