/**
 * Created by sujiayizu on 2019-12-17.
 */
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import I18n from '../language/i18n';
import {userStorage} from '../utils/Storage';
function ClearCache() {
  return (
    <View>
      <View style={styles.container}>
        <Text style={{marginRight: 'auto'}}>
          {I18n.t('clearproductscache')}
        </Text>
        <Icon name={'right'} size={16} />
      </View>
      <View style={styles.container}>
        <Text style={{marginRight: 'auto'}}>{I18n.t('clearorderscache')}</Text>
        <Icon name={'right'} size={16} />
      </View>
      <View style={styles.container}>
        <Text style={{marginRight: 'auto'}}>{I18n.t('clearcartcache')}</Text>
        <Icon name={'right'} size={16} />
      </View>
      <View style={styles.container}>
        <Text style={{marginRight: 'auto'}}>{I18n.t('clearusercache')}</Text>
        <Icon name={'right'} size={16} />
      </View>
      <View style={styles.container}>
        <Text style={{marginRight: 'auto'}}>{I18n.t('clearfindcache')}</Text>
        <Icon name={'right'} size={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'rgb(205,205,205)',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
});

export default React.memo(ClearCache);
