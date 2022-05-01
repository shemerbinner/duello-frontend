import { httpService } from '../services/httpService.js';
import { socketService } from './socket.service.js';
import { utilService } from './util.service';
import { nextTick } from 'vue';

export const boardService = {
  query,
  addGroup,
  removeGroup,
  updateGroup,
  updateGroups,
  getEmptyBoard,
  addNewBoard,
  updateBoard,
  updateBoardLabel,
  createBoardLabel,
  deleteBoardLabel,
  updateAfterTaskDrag,
  getById,
  getEmptyActivity,
};

var newBoard = '';

async function query(filterBy) {
  try {
    return httpService.get('board');

    // var queryStr = !filterBy ? '' : `?userId=${filterBy.userId}`;
    // return httpService.get(BOARD_URL + queryStr);
  } catch (err) {
    console.log(err);
  }
}

// async function query(filterBy) {
//   try {
//     const boards = await storageService.query(BOARD_KEY);
//     if (filterBy.boardId) return boards.find((board) => filterBy.boardId === board._id);
//     else if (filterBy.userId) {
//       boards.filter((board) => filterBy.userId === board.createdBy._id);
//       return boards.filter((board) => filterBy.userId === board.createdBy._id);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

async function addGroup(title, boardId) {
  const group = {
    id: utilService.makeId(),
    title,
    tasks: [],
  };
  const board = await _getBoard(boardId);
  board.groups.push(group);
  updateBoard(board);
  return group;
}

async function updateGroup(newGroup, boardId) {
  const board = await _getBoard(boardId);
  const groupIdx = board.groups.findIndex((group) => group.id === newGroup.id);
  if (groupIdx !== -1) {
    board.groups.splice(groupIdx, 1, newGroup);
    updateBoard(board);
    return newGroup;
  }
}

async function updateGroups(newOrder, board) {
  board.groups = newOrder;
  await updateBoard(board);
  // console.log(newOrder);
  // return board;
  return newOrder;
}

async function updateAfterTaskDrag(group, board) {
  const groupIdx = board.groups.findIndex((grp) => grp.id === group.id);
  if (board.groups[groupIdx].tasks.length !== group.tasks.length && newBoard) {
    newBoard.groups[groupIdx] = group;
    newBoard = '';
  } else {
    board.groups[groupIdx] = group;
    newBoard = board;
  }
  await updateBoard(newBoard);
  return group;
}

async function getById(boardId) {
  return await httpService.get(`board/${boardId}`);
}

async function removeGroup(groupId, board) {
  const idx = board.groups.findIndex((group) => group.id === groupId);
  if (idx === -1) return;
  board.groups.splice(idx, 1);
  await updateBoard(board);
}

async function updateBoardLabel(updatedLabel, board) {
  const idx = board.labels.findIndex((label) => label.id === updatedLabel.id);
  if (idx === -1) {
    return board;
  }
  board.labels.splice(idx, 1, updatedLabel);
  return await updateBoard(board);
}

async function deleteBoardLabel(labelId, board) {
  board.labels = board.labels.filter((label) => label.id !== labelId);
  return await updateBoard(board);
}

async function createBoardLabel(labelData, board) {
  board.labels.push({
    id: utilService.makeId(),
    ...labelData,
  });
  return await updateBoard(board);
}

async function addNewBoard(board) {
  board.createdAt = Date.now();
  return await httpService.post('board', board);
}

function getEmptyBoard() {
  return {
    title: '',
    subName: '',
    createdAt: null,
    createdBy: {},
    style: {
      backgroundImg: null,
      color: null,
      type: 'img',
    },
    labels: _createLabels(),
    members: [],
    groups: [],
    activities: [],
  };
}

function getEmptyActivity() {
  return {
    id: utilService.makeId(),
    type: '',
    action: '',
    createdAt: Date.now(),
    byMember: {
      _id: '',
      imgUrl: null,
      fullname: '',
    },
    task: {
      id: '',
      title: '',
    },
  };
}

function _createLabels() {
  return [
    {
      title: 'urgent',
      id: 'l101',
      color: '#61bd4f',
    },
    {
      title: 'doing',
      id: 'l102',
      color: '#f2d600',
    },
    {
      title: '',
      id: utilService.makeId(),
      color: '#ff9f1a',
    },
    {
      title: '',
      id: utilService.makeId(),
      color: '#eb5a46',
    },
    {
      title: '',
      id: utilService.makeId(),
      color: '#c377e0',
    },
    {
      title: '',
      id: utilService.makeId(),
      color: '#0079bf',
    },
  ];
}

async function _getBoard(boardId) {
  return await httpService.get(`board/${boardId}`);
}

async function updateBoard(newUpdated) {
  socketService.emit('update', newUpdated);

  return await httpService.put(`board/${newUpdated._id}`, newUpdated);
}
