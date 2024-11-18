'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import LazyImage from '../../common/LazyImage';
import DashSecondLine from '../../common/DashSecondLine';
import {width} from '../../utils/Adapter';

class GroupFriendRows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
    };
  }

  componentDidMount(): void {
    this.setState({
      status: this.props.status,
    });
  }

  _checkMyfriend = (vis, item) => {
    if (this.props.addGroupFriend && this.props.status) {
    } else {
      this.setState({status: vis});
      this.props._callback(item.username, item.id);
    }
  };

  render() {
    return (
      <TouchableHighlight
        onPress={() =>
          this.props.navigation.navigate('FriendDetail', {
            item: this.props.item,
            uri: this.props.url,
          })
        }
        style={styles.rowFront}
        underlayColor={'#FFF'}>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {this.props.addGroupFriend && this.props.status ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={[styles.readus, {backgroundColor: '#24A5FE'}]} />
            </TouchableOpacity>
          ) : this.state.status ? (
            <TouchableOpacity
              onPress={() =>
                this._checkMyfriend(!this.state.status, this.props.item)
              }
              activeOpacity={0.8}
              style={{
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={[styles.readus, {backgroundColor: '#24A5FE'}]} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                this._checkMyfriend(!this.state.status, this.props.item)
              }
              activeOpacity={0.8}
              style={{
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.readus} />
            </TouchableOpacity>
          )}

          <View style={{width: 50}}>
            {this.props.item.avatar ? (
              <LazyImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={{uri: this.props.url + this.props.item.avatar}}
              />
            ) : (
              <LazyImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={require('./../../../images/defaultImg.jpg')}
              />
            )}
          </View>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 10,
                flex: 1,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 'bold',
                  flex: 1,
                }}
                numberOfLines={1}>
                {this.props.item.username}
              </Text>
            </View>
            <DashSecondLine
              backgroundColor="#adacb4"
              len={50}
              width={width - 130}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: 'black',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  inputViews: {
    height: 30,
    backgroundColor: '#F9FBFC',
    borderRadius: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  textIm: {
    width: width - 20,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 30,
  },
  containerNew: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  titleHeader: {
    height: 25,
    backgroundColor: '#f4f5f8',
    justifyContent: 'center',
  },
  renderRows: {
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  readus: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#24A5FE',
  },
});

export default GroupFriendRows;
