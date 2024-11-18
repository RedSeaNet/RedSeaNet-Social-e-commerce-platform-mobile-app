import React, {Component} from 'react';
import { Provider } from "react-redux";
import getRouter from "./app/router";
//import configureStore from "./app/store/configure-store";
import "@react-navigation/native";
import {
  tokenStorage,
  userStorage,
  currencyStorage,
} from "./app/utils/Storage";
import thunkMiddleware from "redux-thunk";
import { logger } from "redux-logger";
import { getToken } from "./app/api/request";
import DeviceInfo from "react-native-device-info";
import { configureStore } from '@reduxjs/toolkit';

import rootReducer from "./app/store/reducers";
export const store = configureStore({
  reducer: rootReducer,
});
//export const store = configureStore();
// store.runSage();
import SplashScreen from "react-native-splash-screen";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false, // 控制 App 刷新的状态
    };
  }

  componentDidMount() {
    global.REFRESH_LANGUAGE = () => {
      const { refresh } = this.state;
      this.setState({ refresh: !refresh });
    };
    tokenStorage.getData((error, token) => {
      if (error === null && token != null) {
        if ((token.time + 60 * 60 * 24) * 1000 >= Date.now()) {
          console.log("获取token", token);
          global.REQUESTTOKEN = token;
        } else {
          getToken();
        }
      } else {
        console.log("else");
        getToken();
      }
    });
    userStorage.getData((error, user) => {
      if (error === null && user != null) {
        global.USERINFO = user;
      } else {
        global.USERINFO = {};
      }
    });
    currencyStorage.getData((error, currency) => {
      if (error === null && currency != null) {
        global.CURRENCY = currency;
      } else {
        let currency = { code: "CNY", id: "3", symbol: "￥" };
        global.CURRENCY = currency;
      }
    });
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }

  render() {
    return (
      <Provider store={store} screenProps={this.state.refresh}>
        {getRouter()}
      </Provider>
    );
  }
}

