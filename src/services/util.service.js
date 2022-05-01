export const utilService = {
  makeId,
  loadFromSessionStorage,
  saveToSessionStorage,
  applyDrag
};
function makeId(length = 8) {
  var txt = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function loadFromSessionStorage(key) {
  var val = sessionStorage.getItem(key);
  return val ? JSON.parse(val) : null;
}

function saveToSessionStorage(key, val) {
  if (!val._id) val._id = makeId();
  sessionStorage[key] = JSON.stringify(val);
  return val;
}

function applyDrag(arr, dragResult) {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;
  const result = [...arr];
  let itemToAdd = payload;
  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  return result;
};
