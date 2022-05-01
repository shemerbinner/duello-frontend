<template>
  <section class="welcome-page">
    <div class="welcome-header">
      <div class="welcome-logo">
        <img src="../assets/imgs/trello.png" />
        <span>Duello</span>
      </div>
      <div class="welcome-btn-container">
        <button class="welcome-btn" @click="login">Log in</button>
        <button class="welcome-btn" @click="login">Sign up</button>
      </div>
    </div>
    <div class="welcome-body">
      <div class="welcome-signin">
        <h1>Duello helps teams move work forward.</h1>
        <p>
          Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way
          your team works is unique—accomplish it all with Duello.
        </p>
        <form @submit.prevent="logGuestUser">
          <!-- <input type="text" /> -->
          <input class="welcome-btn" type="submit" value="Log in with guest user" />
        </form>
      </div>
      <img class="welcome-img" src="../assets/imgs/welcome-img.png" />
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    login() {
      this.$router.replace('/login');
    },
   async logGuestUser(){
     console.log('dgfdgdfgdgdgdgdg');
      const guestUser ={
        username:'guest',
        password:'123',
      }
      const user = await this.$store.dispatch({
        type: 'login',
        user: guestUser,
      });
      if (user) this.$router.replace('/');
    },
    
  },
};
</script>

<style></style>
