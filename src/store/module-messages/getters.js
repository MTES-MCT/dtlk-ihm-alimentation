export const message = (state) => {
  return state.list.find(message => message.id === state.messageId)
}
