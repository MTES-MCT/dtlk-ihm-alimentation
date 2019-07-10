export const totalMessages = (state) => {
  if (state.messages) {
    return state.messages.read + state.messages.unread
  }
  return null
}

export const unreadMessages = (state) => {
  if (state.messages) {
    return state.messages.unread
  }
  return null
}
