<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(msg, index) in messages" :key="index">
                {{ field }} {{ msg }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  v-model="user.image"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  v-model="user.username"
                  type="text"
                  required
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  v-model="user.bio"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  v-model="user.email"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  v-model="user.password"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from "@/api/user";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  name: "SettingsIndex",
  middleware: "authenticated",
  asyncData({ store }) {
    const { image, username, bio, email } = store.state.user;
    return {
      user: {
        image,
        username,
        bio,
        email,
        password: "",
      },
      errors: {},
    };
  },
  methods: {
    logout() {
      this.$store.commit("setUser", null);
      Cookie.remove("user");
      this.$router.push("/");
    },
    async onSubmit() {
      console.log(this.user);
      try {
        await updateUser({
          user: this.user,
        });
        let newUser = {
          ...this.$store.state.user,
          image: this.user.image,
          username: this.user.username,
          bio: this.user.bio,
          email: this.user.email,
        }
        this.$store.commit('setUser', newUser)
        Cookie.set('user', newUser)
        this.$router.push(`/profile/${this.user.username}`);
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },
  },
};
</script>

<style>
</style>