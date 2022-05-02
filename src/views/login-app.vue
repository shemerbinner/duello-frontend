<template>
  <section class="login-cmp">
    <div class="logo-container">
      <img class="logo-img" src="../../src/assets/icons/trello-blue.svg" />
      <h1>Duello</h1>
    </div>
    <div class="login-container">
      <h2>Log in to Duello</h2>
      <form @submit.prevent="login">
        <input type="text" v-model="user.username" placeholder="Enter username" />
        <input type="text" v-model="user.password" placeholder="Enter password" />
        <input class="submit-btn" type="submit" value="Log in" />
      </form>
      <h3 class="separator">OR</h3>
      <div class="g-signin2" data-onsuccess="onSignIn"></div>
    </div>
    <!-- <form @submit.prevent="signup">
      <input type="text" v-model="newUser.fullname" placeholder="full name" />
      <input type="text" v-model="newUser.username" placeholder="username" />
      <input type="text" v-model="newUser.password" placeholder="password" />
      <input type="submit" value="sign up!" />
    </form> -->
  </section>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: null,
      },
      newUser: {
        username: '',
        password: '',
        fullname: '',
      },
    };
  },
  created() {
    window.onSignIn = this.onSignIn;
  },
  methods: {
    async onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      const fullname = profile.getName();
      const imgUrl = profile.getImageUrl();
      const score = 100;
      const username = profile.getEmail();
      const _id = profile.getId();
      const user = {
        fullname,
        imgUrl,
        score,
        username,
        _id,
      };
      await this.$store.dispatch({
        type: 'googleUserLoggedIn',
        user,
      });
      this.$router.push({ path: '/' });
    },
    async login() {
      this.user.password = this.user.password.toString();
      console.log(this.user.password);
      const user = await this.$store.dispatch({
        type: 'login',
        user: this.user,
      });
      console.log(user);
      if (user) this.$router.replace('/');
    },
    // async signup() {
    //   const user = await this.$store.dispatch({
    //     type: 'signup',
    //     user: this.newUser,
    //   });
    //   console.log(user);
    //   if (user) this.$router.replace('/');
    // },
  },
};
</script>
