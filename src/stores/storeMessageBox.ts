import { defineStore } from 'pinia'

interface MessageBoxOptions {
  message: string;
  title?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  showDeclineButton?: boolean;
  declineButtonText?: string;
  onDecline?: () => void;
  showAcceptButton?: boolean;
  acceptButtonText?: string;
  onAccept?: () => void;
}

export const useStoreMessageBox = defineStore('messageBox', {
  state: () => ({
    data: {} as MessageBoxOptions
  }),
  actions: {
    setData(data: MessageBoxOptions) {
      this.data = data
    }
  },
  getters: {
    getData: (state) => state.data
  }
});