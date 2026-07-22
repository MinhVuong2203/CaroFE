export function getSignalRError(error) {
  //   if (!error?.message) return "Đã xảy ra lỗi."

  const index = error.message.indexOf('HubException:')

  if (index >= 0) {
    return error.message.substring(index + 'HubException:'.length).trim()
  }

  return error.message
}
