import { defineStore } from 'pinia'

// defineStore là hàm có sẵn của pania, dùng để tạo ra một store mới. Nó nhận vào 2 tham số:
// - Tham số đầu tiên là tên của store, trong trường hợp này là "loading".
// - Tham số thứ hai là một đối tượng chứa các thuộc tính và phương thức của store.
export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    message: 'Loading...',
    cancelable: false,
    cancelCallback: null,
    messageCancel: 'Hủy',
  }),

  actions: {
    show(message = 'Loading...', isCancelable = false, cancelAction = null, cancelMessage = 'Hủy') {
      this.message = message
      this.cancelable = isCancelable
      this.cancelCallback = cancelAction
      this.messageCancel = cancelMessage
      this.isLoading = true
    },

    hide() {
      this.isLoading = false
      this.cancelable = false
      this.cancelCallback = null
    },

    cancel() {
      if (this.cancelCallback) {
        this.cancelCallback()
      }
      this.hide()
    },
  },
})
