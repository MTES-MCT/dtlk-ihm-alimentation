
// commit for getting list
export const loadingList = state => { state.pending_list = true }
export const updateList = (state, { messages }) => {
  state.list = messages.map(message => ({...message, pending_delete: false}))
  state.pending_list = false
}
export const updateRefreshed = (state, value) => { state.refreshed = value }

// commit for updating state of modal
export const updateOpenModal = (state, { open, messageId }) => {
  state.openModal = open
  if (open === false) {
    state.messageId = null
  }
  if (open === true) {
    state.messageId = messageId
  }
}

export const updateMessageInList = (state, { updatedMessage }) => {
  let i = state.list.indexOf(state.list.find(message => message.id === updatedMessage.id))
  state.list.splice(i, 1, updatedMessage)
}

export const setPendingDelete = (state, message) => {
  let i = state.list.indexOf(state.list.find(m => m.id === message.id))
  if (i) state.list[i].pending_delete = true
}
export const unsetPendingDelete = (state, message) => {
  let i = state.list.indexOf(state.list.find(m => m.id === message.id))
  if (i > 0) state.list[i].pending_delete = false
}

export const deleteMessageInList = (state, { deletedMessage }) => {
  let i = state.list.indexOf(state.list.find(message => message.id === deletedMessage.id))
  state.list.splice(i, 1)
}
