import { storageService } from './storage.service';
import { boardService } from './board.service';
import { utilService } from './util.service';
import { httpService } from './httpService';

export const taskService = {
  addTask,
  removeTask,
  updateTask,
  getById,
  getEmptyComment,
};
const BOARD_KEY = 'boardDB';

async function addTask(taskTitle, groupId, boardId) {
  const task = {
    title: taskTitle,
    id: utilService.makeId(),
    labels: [],
    members: [],
    comments: [],
    activities: [],
    attachments: [],
    checklist: [],
    attachments: [],
    style: {
      cover: {
        type: '',
        style: '',
        imgUrl: '',
        color: '',
      },
    },
  };
  const group = await _findGroup(groupId, boardId);
  group.tasks.push(task);
  return boardService.updateGroup(group, boardId);
}

async function updateTask(taskPartial, groupId, boardId) {
  const group = await _findGroup(groupId, boardId);
  const taskIdx = group.tasks.findIndex((task) => task.id === taskPartial.id);
  if (taskIdx === -1) return;
  group.tasks.splice(taskIdx, 1, {
    ...group.tasks[taskIdx],
    ...taskPartial,
  });
  return boardService.updateGroup(group, boardId);
}

async function removeTask(taskId, groupId, boardId) {
  const group = await _findGroup(groupId, boardId);
  const taskIdx = group.tasks.findIndex((task) => task.id === taskId);
  if (taskIdx === -1) return;
  group.tasks.splice(taskIdx, 1);
  return boardService.updateGroup(group, boardId);
}

async function getById(taskId, groupId, boardId) {
  const group = await _findGroup(groupId, boardId);
  const task = group.tasks.find((task) => task.id === taskId);
  return { task, group };
}

function getEmptyComment() {
  return {
    id: utilService.makeId(),
    txt: '',
    createdAt: null,
    byMember: {},
    type: 'comment-cmp'
  };
}

// async function updateTasks(taskId, groupId, board) {}

async function _findGroup(groupId, boardId) {
  // const board = await storageService.get(BOARD_KEY, boardId);
  const board = await httpService.get(`board/${boardId}`)
  const group = board.groups.find((group) => group.id === groupId);
  return group;
}
