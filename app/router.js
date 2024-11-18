import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import I18n from './language/i18n';
import HomePage from './pages/HomePage';
import Cart from './pages/Cart';
import Find from './pages/Find';
import My from './pages/My';
import Message from './pages/Message';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import SignUp from './pages/SignUP';
import SignUpByPhone from './pages/SignUpByPhone';
import UserAgreement from './pages/UserAgreement';
import ProductList from './pages/ProductList';
import * as Constant from './style/constant';
import ProductDetail from './pages/ProductDetail';
import ConfirmOrder from './pages/ConfirmOrder';
import ForgetPassword from './pages/ForgetPassword';
import Settings from './pages/Settings';
import Language from './pages/Language';
import Currency from './pages/Currency';
import ChangePassword from './pages/ChangePassword';
import PersonDetail from './pages/PersonDetail';
import AddForum from './pages/AddForum';
import AddAddress from './pages/AddAddress';
import UpdateAddress from './pages/UpdateAddress';
import MyAddress from './pages/MyAddress';
import OrderList from './pages/OrderList';
import ClearCache from './pages/ClearCache';
import Feedback from './pages/Feedback';
import UpdateEmail from './pages/UpdateEmail';
import UpdatePhone from './pages/UpdatePhone';
import OrderDetail from './pages/OrderDetail';
import MyCoupon from './pages/MyCoupon';
import SearchProductList from './pages/SearchProductList';
import ForumDetail from './pages/ForumDetail';
import WishList from './pages/WishList';
import RewardPointsList from './pages/RewardPointsList';
import BalanceList from './pages/BalanceList';
import UpdateForum from './pages/UpdateForum';
import MyForumPostList from './pages/MyForumPostList';
import MyFavoritePostList from './pages/MyFavoritePostList';
import MyLikePostList from './pages/MyLikePostList';
import MyFavoritePosReviewtList from './pages/MyFavoritePosReviewtList';
import MyBeFavoritedPostList from './pages/MyBeFavoritedPostList';
import MyBeLikedPostList from './pages/MyBeLikedPostList';
import MyForumFans from './pages/MyForumFans';
import MyForumFollowing from './pages/MyForumFollowing';
import UserSpace from './pages/UserSpace';
import CmsList from './pages/CmsList';
import Cms from './pages/Cms';
import HistoryProductList from './pages/HistoryProductList';
import Countries from './pages/Countries';
import WorkerManChatIndex from './pages/WorkerManChat/ChatIndex';
import WorkerManToChat from './pages/WorkerManChat/ToChat';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function TabMune() {
  let cartData = useSelector(state => state.cart.cart);

  let unreadMyNotificationData = useSelector(
    state => state.unreadMyNotification.unreadMyNotification,
  );
  let unreadSystemNotificationData = useSelector(
    state => state.unreadSystemNotification.unreadSystemNotification,
  );
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
      options={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: I18n.t('home'),
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={Constant.tabIconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Find"
        component={Find}
        options={{
          tabBarLabel: I18n.t('social'),
          tabBarIcon: ({color, size}) => (
            <Icon name="find" size={Constant.tabIconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: I18n.t('notifications'),
          tabBarIcon: ({color, size}) => (
            <Icon name="message1" size={Constant.tabIconSize} color={color} />
          ),
          tabBarBadge:
            (unreadMyNotificationData ? unreadMyNotificationData.length : 0) +
            (unreadSystemNotificationData
              ? unreadSystemNotificationData.length
              : 0),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel: I18n.t('cart'),
          tabBarIcon: ({color, size}) => (
            <Icon
              name="shoppingcart"
              size={Constant.tabIconSize}
              color={color}
            />
          ),
          tabBarBadge: cartData.productCount ? cartData.productCount : 0,
        }}
      />
      <Tab.Screen
        name="My"
        component={My}
        options={{
          tabBarLabel: I18n.t('my'),
          tabBarIcon: ({color, size}) => (
            <Icon name="user" size={Constant.tabIconSize} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
const getRouter = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TabMune">
        <Stack.Screen
          name="TabMune"
          component={TabMune}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="signup"
          component={SignUp}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="signupbyphone"
          component={SignUpByPhone}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="userAgreement"
          component={UserAgreement}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="productList"
          component={ProductList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="productDetail"
          component={ProductDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="confirmOrder"
          component={ConfirmOrder}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="forgetPassword"
          component={ForgetPassword}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name={'settings'}
          component={Settings}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name={'addAddress'}
          component={AddAddress}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="updateAddress"
          component={UpdateAddress}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myAddress"
          component={MyAddress}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="orderList"
          component={OrderList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="orderDetail"
          component={OrderDetail}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="personDetail"
          component={PersonDetail}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="language"
          component={Language}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen name="currency" component={Currency} />
        <Stack.Screen name="changePassword" component={ChangePassword} />
        <Stack.Screen name="clearCache" component={ClearCache} />
        <Stack.Screen name="feedback" component={Feedback} />
        <Stack.Screen
          name="updateemail"
          component={UpdateEmail}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="updatephone"
          component={UpdatePhone}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="addForum"
          component={AddForum}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="mycoupon"
          component={MyCoupon}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="searchProductList"
          component={SearchProductList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="forumDetail"
          component={ForumDetail}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="wishList"
          component={WishList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="rewardPointsList"
          component={RewardPointsList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="balanceList"
          component={BalanceList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myForumPostList"
          component={MyForumPostList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myBeFavoritedPostList"
          component={MyBeFavoritedPostList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myBeLikedPostList"
          component={MyBeLikedPostList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myForumFans"
          component={MyForumFans}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myForumFollowing"
          component={MyForumFollowing}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="userSpace"
          component={UserSpace}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="updateForum"
          component={UpdateForum}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myFavoritePostList"
          component={MyFavoritePostList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myLikePostList"
          component={MyLikePostList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="myFavoritePosReviewtList"
          component={MyFavoritePosReviewtList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="cms"
          component={Cms}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="cmsList"
          component={CmsList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name={'historyProductList'}
          component={HistoryProductList}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name={'countries'}
          component={Countries}
          options={{
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="WorkerManChatIndex"
          component={WorkerManChatIndex}
        />
        <Stack.Screen name="WorkerManToChat" component={WorkerManToChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default getRouter;
