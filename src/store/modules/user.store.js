import { utilService } from '../../services/util.service.js';
import { userService } from '../../services/user.service.js';

export const userStore = {
  state: {
    loggedinUser: utilService.loadFromSessionStorage('user'),
    users: null,
  },
  getters: {
    user(state) {
      return state.loggedinUser;
    },
  },
  mutations: {
    setUser(state, { user }) {
      state.loggedinUser = user;
    },
  },
  actions: {
    async googleUserLoggedIn(context, { user }) {
      await utilService.saveToSessionStorage('user', user);
      context.commit({ type: 'setUser', user });
      return user;
    },
    async loadUser(context) {
      const user = await utilService.loadFromSessionStorage('user');
      console.log(user);
      if (user) {
        context.commit({ type: 'setUser', user });
        return user;
      }
    },
    async login(context, { user }) {
      console.log(user);
      const loggedinUser = await userService.login(user);
      if (!loggedinUser) return;
      await utilService.saveToSessionStorage('user', loggedinUser);
      context.commit({ type: 'setUser', user: loggedinUser });
      return loggedinUser;
    },
    async signup(context, { user }) {
      const loggedinUser = await userService.signup(user);
      if (!loggedinUser) return;
      await utilService.saveToSessionStorage('user', loggedinUser);
      context.commit({ type: 'setUser', loggedinUser });
      return loggedinUser;
    },
    async searchMembers(context, { searchVal }) {
      const users = await userService.getUsers(searchVal);
      return users;
    },
  },
};
