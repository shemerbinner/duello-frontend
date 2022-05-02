import { httpService } from './httpService';
const ENDPOINT = 'auth';

export const userService = {
  login,
  signup,
  logout,
  getUsers,
};

async function login(cred) {
  return await httpService.post(ENDPOINT + '/login', cred);
}

async function signup(cred) {
  const user = await httpService.post(ENDPOINT + '/signup', cred);
  socketService.emit('set-user-socket', user._id);
  return user;
}

async function logout() {
  const user = await httpService.post(ENDPOINT + '/logout');
  socketService.emit('unset-user-socket');
  return user;
}

async function getUsers(txt) {
  return await httpService.get('user' + `?txt=${txt}`);
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem('user') || 'null');
}

function getGuestUser() {
  return {
    fullname: 'Guest User',
    username: 'guest',
    password: 'guest',
    isAdmin: true,
  };
}

(async () => {
  var user = getLoggedinUser();
  if (user) socketService.emit('set-user-socket', user._id);
})();
