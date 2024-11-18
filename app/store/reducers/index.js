import {combineReducers} from 'redux';
import {cart} from './cart';
import {coupons} from './coupons';
import {currency} from './currency';
import {forumCategory, forumPostInfo} from './forum';
import {loading} from './loading';
import {product} from './product';
import {user} from './user';
import {balance} from './balance';
import {
  myNotification,
  unreadMyNotification,
  systemNotification,
  unreadSystemNotification,
} from './notification';
const rootReducer = combineReducers({
  cart,
  coupons,
  currency,
  forumCategory,
  forumPostInfo,
  loading,
  product,
  user,
  balance,
  myNotification,
  unreadMyNotification,
  systemNotification,
  unreadSystemNotification,
});
export default rootReducer;
