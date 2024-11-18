import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Image, ImageBackground} from 'react-native';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {proportion} from '../../../app/util/conversion';
import {Config} from '../../../app/public/Common/Import';
import {navigate} from '../../utils/Navigation';

export default class MyAttentionPageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => {
    this.props.navigation.navigate('historyArticle', {
      message: this.props.ministryId,
      username: this.props.ministryName,
    });
  };
  render() {
    let props = this.props;
    return (
      <View style={styles.itemView}>
        <TouchableOpacity
          style={[styles.item2]}
          onPress={() => {
            this.handleClick();
          }}>
          <Image
            style={[styles.item]}
            source={{
              uri: Config.AWSS3RESOURCESURL + 'upload/ministry/' + props.avatar,
            }}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{props.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  itemView: {
    alignItems: 'center',
    width: '33%',
    marginTop: 20,
  },
  item: {
    width: 100 * proportion,
    height: 100 * proportion,
    borderRadius: 50 * proportion,
  },
  item2: {
    width: 110 * proportion,
    height: 110 * proportion,
    borderRadius: 55 * proportion,
    borderColor: 'white',
    borderWidth: 3 * proportion,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 14,
  },
});
