import Toast from 'react-native-root-toast';

const ToastUtil = {
  showMessage(message) {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
    });
  },
};

export default ToastUtil;
