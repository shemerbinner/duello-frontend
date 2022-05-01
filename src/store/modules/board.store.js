import { boardService } from '../../services/board.service';
import { taskService } from '../../services/task.service';
import { designService } from '../../services/design.services';
import { utilService } from '../../services/util.service';

export const boardStore = {
  state: {
    board: null,
    boardGroups: [],
    currGroup: null,
    labelsExpanded: false,
    colors: null,
    imgs: null,
    imgSearches: null,
    checklists: [],
    comments: [],
    bcg: '#026AA7',
    isDark: true,
    BoardStyle: null,
  },
  getters: {
    board(state) {
      return JSON.parse(JSON.stringify(state.board));
    },
    activities(state) {
      return state.board.activities;
    },
    comments(state) {
      return state.comments;
    },
    boardLabels(state) {
      return state.board.labels;
    },
    groups(state) {
      return state.boardGroups;
    },
    tasks(state) {
      return state.currGroup.tasks;
    },
    labelsExpanded(state) {
      return state.labelsExpanded;
    },
    imgs(state) {
      return state.imgs;
    },
    colors(state) {
      return state.colors;
    },
    imgSearches(state) {
      return state.imgSearches;
    },
    checklists(state) {
      return JSON.parse(JSON.stringify(state.checklists));
    },
    bcg(state) {
      return state.bcg;
    },
    isDark(state) {
      return state.isDark;
    },
    boardStyle(state) {
      return state.boardStyle;
    },
  },
  mutations: {
    getActivities(state) {
      var activities = [];

      state.board.groups.forEach((group) => {
        if (group.tasks && group.tasks.length) {
          group.tasks.forEach((task) => {
            if (task.activities && task.activities.length) {
              task.activities = task.activities.map((activity) => {
                if (!activity.byMember) activity.byMember = user;
                return activity;
              });

              activities = [...activities, ...task.activities];
            }
          });
        }
      });
      state.board.activities = activities;
    },
    getComments(state) {
      var comments = [];

      state.board.groups.forEach((group) => {
        if (group.tasks && group.tasks.length) {
          group.tasks.forEach((task) => {
            if (task.comments && task.comments.length) {
              comments = [...comments, ...task.comments];
            }
          });
        }
      });
      state.comments = comments;
    },
    getChecklists(state) {
      var lists = [];

      state.boardGroups.forEach((grp) => {
        grp.tasks.forEach((task) => {
          if (task.checklist && task.checklist.length) {
            task.checklist.forEach((checklist) => {
              if (checklist.todos && checklist.todos.length) {
                const newChecklist = JSON.parse(JSON.stringify(checklist));
                newChecklist.todos = newChecklist.todos.map((todo) => {
                  todo.id = utilService.makeId();
                  return todo;
                });
                newChecklist.taskTitle = task.title;
                lists.push(newChecklist);
              }
            });
          }
        });
      });

      state.checklists = lists;
      lists = [];
    },
    toggleLabelsExpanded(state) {
      state.labelsExpanded = !state.labelsExpanded;
    },
    setBoard(state, { board }) {
      state.board = board;
      state.boardGroups = board.groups;
      if (board.style.type === 'img') state.bcg = board.style.color;
      else state.bcg = '#00000029';
      state.isDark = board.style.isDark;
      state.boardStyle = board.style;
    },
    setBoards(state, { boards }) {
      state.boards = boards;
    },
    addGroup(state, { newGroup }) {
      state.boardGroups.push(newGroup);
    },
    updateGroup(state, { updatedGroup }) {
      const idx = state.board.groups.findIndex((grp) => grp.id === updatedGroup.id);
      state.board.groups.splice(idx, 1, updatedGroup);
    },
    removeGroup(state, { groupId }) {
      const idx = state.board.groups.findIndex((group) => group.id === groupId);
      if (idx !== -1) state.board.groups.splice(idx, 1);
    },
    removeTask(state, { taskId, groupId }) {
      const groupIdx = state.board.groups.findIndex((group) => group.id === groupId);
      const idx = state.board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId);
      if (idx !== -1) state.board.group[groupIdx].tasks.splice(idx, 1);
    },
    updateGroups(state, { newOrder }) {
      state.board.groups = newOrder;
      state.boardGroups = state.board.groups;
    },
    setGroup(state, { group }) {
      state.currGroup = group;
    },
    setDesign(state, { design }) {
      state.imgs = design[0].imgs;
      state.colors = design[0].colors;
      state.imgSearches = design[0].suggestedSearches;
    },
    resetBcg(state) {
      state.bcg = '#026AA7';
      state.isDark = true;
    },
  },
  actions: {
    async updateBoardLabel({ commit, state }, { label }) {
      try {
        const board = await boardService.updateBoardLabel(label, JSON.parse(JSON.stringify(state.board)));
        commit({ type: 'setBoard', board });
        return board;
      } catch (err) {
        console.log(err);
      }
    },
    async deleteBoardLabel({ commit, state }, { labelId }) {
      try {
        const board = await boardService.deleteBoardLabel(labelId, JSON.parse(JSON.stringify(state.board)));
        commit({ type: 'setBoard', board });
        return board;
      } catch (err) {
        console.log(err);
      }
    },
    async createBoardLabel({ commit, state }, { labelData }) {
      try {
        const board = await boardService.createBoardLabel(labelData, JSON.parse(JSON.stringify(state.board)));
        commit({ type: 'setBoard', board });
        return board;
      } catch (err) {
        console.log(err);
      }
    },
    toggleLabelsExpanded({ commit }) {
      commit({ type: 'toggleLabelsExpanded' });
    },
    async loadBoards({ commit }, { filterBy }) {
      try {
        const board = await boardService.query(filterBy);
        commit({ type: 'setBoards', board });
        return board;
      } catch (err) {
        console.log(err);
      }
    },
    async loadBoard({ commit }, { boardId }) {
      try {
        const board = await boardService.getById(boardId);
        commit({ type: 'setBoard', board });
        return board;
      } catch (err) {
        console.log(err);
      }
    },
    async addGroup({ commit }, { title, boardId }) {
      try {
        const newGroup = await boardService.addGroup(title, boardId);
        commit({ type: 'addGroup', newGroup });
      } catch (err) {
        console.log(err);
      }
    },
    async removeGroup({ state, commit }, { groupId }) {
      try {
        await boardService.removeGroup(groupId, JSON.parse(JSON.stringify(state.board)));
        commit({ type: 'removeGroup', groupId });
      } catch (err) {
        console.log(err);
      }
    },
    async updateGroup({ commit, state }, { newGroup }) {
      try {
        const updatedGroup = await boardService.updateGroup(newGroup, state.board._id);
        commit({ type: 'updateGroup', updatedGroup });
      } catch (err) {
        console.log(err);
      }
    },
    async removeTask({ state, commit }, { taskId, groupId }) {
      try {
        const updatedGroup = await taskService.removeTask(taskId, groupId, state.board._id);
        commit({ type: 'updateGroup', updatedGroup });
      } catch (err) {
        console.log(err);
      }
    },
    async addTask({ state, commit }, { taskTitle, groupId }) {
      try {
        const updatedGroup = await taskService.addTask(taskTitle, groupId, state.board._id);
        commit({ type: 'updateGroup', updatedGroup });
      } catch (err) {
        console.log(err);
      }
    },
    async updateTask({ commit, state }, { taskPartial, groupId }) {
      try {
        const updatedGroup = await taskService.updateTask(taskPartial, groupId, state.board._id);
        commit({ type: 'updateGroup', updatedGroup });
        return updatedGroup;
      } catch (err) {
        console.log(err);
      }
    },
    async createBoard({ commit }, { board }) {
      try {
        const newBoard = await boardService.addNewBoard(board);
        commit({ type: 'setBoard', board: newBoard });
        return newBoard._id;
      } catch (err) {
        console.log(err);
      }
    },
    async loadDesign({ commit }) {
      try {
        const design = await designService.query();
        commit({ type: 'setDesign', design });
      } catch (err) {
        console.log(err);
      }
    },
    async updateBoard({ commit }, { board }) {
      try {
        const newBoard = await boardService.updateBoard(board);
        commit({ type: 'setBoard', board: newBoard });
      } catch (err) {
        console.log(err);
      }
    },
    async drag({ commit, state }, { board }) {
      try {
        commit({ type: 'setBoard', board });

        setTimeout(async () => {
          await boardService.updateBoard(board);
        }, 1)

      } catch (err) {
        const oldBoard = await boardService.updateBoard(JSON.parse(JSON.stringify(state.board)));
        commit({ type: 'setBoard', board: oldBoard });

        console.log(err);
      }
    },
    getChecklists({ commit }) {
      commit({ type: 'getChecklists' });
    },
    getComments({ commit }) {
      commit({ type: 'getComments' });
    },
    getActivities({ commit }) {
      commit({ type: 'getActivities' });
    },
    updateBoardSocket({ commit }, { board }) {
      commit({ type: 'setBoard', board });
    },

  },
};
