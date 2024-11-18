"use strict";
import SocketIO from "react-native-socketio";

class WorkerManChatManager {
  static socket = null;

  //初始化
  static init() {
    this.socket = new SocketIO("store.redseanet.shop:7272");
    console.log("init method");
  }

  //连接聊天服务器
  static connect(obj) {
    try {
      this.socket.connect();
    } catch (e) {
      console.log("连接聊天服务器chatConnect", e);
    }
  }

  //断开连接
  static disconnect(obj) {
    try {
      this.socket.disconnect();
    } catch (e) {
      console.log("断开连接disconnect", e);
    }
  }

  //输入状态提醒
  static sendTypingStatus() {}

  //发送文本消息  send(m, session, type, apnsName, anonymous = 0, pushText='')
  static sendMessage(obj) {
    this.socket.send();
  }

  //发送图片消息  send(m, session, type, apnsName, anonymous = 0, pushText='')
  static sendMediaMessage(obj) {}

  //发送文件
  static sendMediaMessage() {}

  //发送语音信息
  static sendVoiceMessage() {}

  //获取消息监听
  static addReceiveMessageListener() {}

  //获取本地消息历史
  static getHistoryMessages() {}

  //获取服务端历史消息
  static getRemoteHistoryMessages() {}

  //清除历史消息
  static cleanHistoryMessages() {}

  //删除指定 ID 的消息
  static deleteMessages() {}

  //置顶会话
  static setConversationToTop() {}

  //设置消息提醒 (设置会话的提醒状态来实现免打扰功能)
  static setConversationNotificationStatus() {}

  //获取消息提醒状态
  static getConversationNotificationStatus() {}

  //获取聊天室列表
  static getGroutList(obj) {
    try {
    } catch (e) {
      console.log("获取好友列表getFriendList", e);
    }
  }

  //创建聊天室
  static createChatRoom() {}

  //加入聊天室 _invitation(message, appendMsg, name, type, logId, noEmit, notes)
  static joinExistChatRoom(obj) {}

  //删除群聊
  static deleteGroup(obj) {}

  //退出聊天室
  static quitChatRoom() {}

  //查询聊天室信息
  static getChatRoomInfo() {}

  //获取服务器聊天室历史消息
  static getChatroomHistoryMessages() {}

  //单聊消息阅读回执(消息是否查看)
  static sendReadReceiptMessage() {}

  //组群消息阅读回执(消息是否查看)
  static sendReadReceiptRequest() {}

  //消息阅读回执(消息阅读已阅读)
  static addReceiptResponseListener() {}

  //消息记录同步
  static syncConversationReadStatus() {}
}
export default WorkerManChatManager;
