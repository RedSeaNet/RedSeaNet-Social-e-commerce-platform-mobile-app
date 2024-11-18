'use strict'

import lib from 'react-native-lomocoin-rongcloud'; //融云聊天库导入
import * as actionCreator from "./ChatAction";
import Client from './../../app/public/Chat/ChatClient';

const ChatClient = new Client();

export default class RongYunChatManager {

    static chat = null;

    //appkey
    static ChatAppKey = {
        //'rongyunAppKey': 'kj7swf8o7by32'
        'rongyunAppKey': 'qd46yzrf483pf'
    }


    //初始化SDK
    static init(obj) {
        try {
            if (obj.isChatType == 'rongyun') {
                lib.initWithAppKey(this.ChatAppKey.rongyunAppKey);

            }
        } catch (e) {
            console.log('初始化SDK init', e);
        }
    }


    static getInstance(obj) {
        if (ChatManager.chat == null) {
            if (obj.isChatType == 'rongyun') {
                ChatManager.chat = lib.initWithAppKey(this.ChatAppKey.rongyunAppKey);
            }
        }
        return ChatManager.cometchat;
    }

    //连接聊天服务器
    static chatConnect(obj) {
        try {
            if (obj.isChatType == 'rongyun') {
                ChatClient.connect();
            }
        } catch (e) {
            console.log('连接聊天服务器chatConnect', e);
        }
    }


    //断开连接
    static disconnect(obj) {
        try {
            if (obj.isChatType == 'rongyun') {
                ChatClient.logout();
            }
        } catch (e) {
            console.log('断开连接disconnect', e);
        }
    }

    //获取好友列表
    static getFriendList(obj) {
        try {
            return actionCreator.getFriendList(obj)
        } catch (e) {
            console.log('获取好友列表getFriendList', e);
        }
    }


    //添加好友
    static addFriends(obj) {
        try {
            if (obj.isChatType == 'rongyun') {
                ChatClient._addFriend(obj.appendMsg)
            }
        } catch (e) {
            console.log('添加好友addFriends', e);
        }
    }


    //删除好友
    static deleteFriend(obj) {
        if (obj.isChatType == 'rongyun') {
            ChatClient._deleteFriend(obj.appendMsg);
        }
    }


    //输入状态提醒
    static sendTypingStatus() {

    }


    //发送文本消息  send(m, session, type, apnsName, anonymous = 0, pushText='')
    static sendMessage(obj) {
        if (isChatType == 'Rongcloud') {
            ChatClient.send(obj.m, obj.session, obj.type, obj.apnsName, obj.anonymous = 0, obj.pushText = '');
        }
    }


    //发送图片消息  send(m, session, type, apnsName, anonymous = 0, pushText='')
    static sendMediaMessage(obj) {
        if (isChatType == 'Rongcloud') {
            ChatClient.send(obj.m, obj.session, obj.type, obj.apnsName, obj.anonymous = 0, obj.pushText = '');
        }
    }


    //发送文件
    static sendMediaMessage() {

    }

    //发送语音信息
    static sendVoiceMessage() {

    }


    //获取消息监听
    static addReceiveMessageListener() {

    }


    //获取本地消息历史
    static getHistoryMessages() {

    }


    //获取服务端历史消息
    static getRemoteHistoryMessages() {

    }


    //清除历史消息
    static cleanHistoryMessages() {

    }


    //删除指定 ID 的消息
    static deleteMessages() {

    }


    //置顶会话
    static setConversationToTop() {

    }


    //设置消息提醒 (设置会话的提醒状态来实现免打扰功能)
    static setConversationNotificationStatus() {

    }

    //获取消息提醒状态
    static getConversationNotificationStatus() {

    }


    //获取聊天室列表
    static getGroutList(obj) {
        try {
            return actionCreator.getGroutList(obj)
        } catch (e) {
            console.log('获取好友列表getFriendList', e);
        }
    }


    //创建聊天室
    static createChatRoom() {

    }

    //加入聊天室 _invitation(message, appendMsg, name, type, logId, noEmit, notes)
    static joinExistChatRoom(obj) {
        if (obj.isChatType == 'rongyun') {
            ChatClient._invitation(obj.message, obj.appendMsg, obj.name, obj.type, obj.logId, obj.noEmit, obj.notes)
        }
    }

    //删除群聊
    static deleteGroup(obj) {
        if (obj.isChatType == 'rongyun') {
            ChatClient._deleteGroup(obj.appendMsg);
        }
    }


    //退出聊天室
    static quitChatRoom() {

    }

    //查询聊天室信息
    static getChatRoomInfo() {

    }


    //获取服务器聊天室历史消息
    static getChatroomHistoryMessages() {

    }


    //单聊消息阅读回执(消息是否查看)
    static sendReadReceiptMessage() {

    }


    //组群消息阅读回执(消息是否查看)
    static sendReadReceiptRequest() {

    }


    //消息阅读回执(消息阅读已阅读)
    static addReceiptResponseListener() {

    }


    //消息记录同步
    static syncConversationReadStatus() {

    }


}
