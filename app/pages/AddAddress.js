import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  DeviceEventEmitter,
  Alert,
  refs,
  Button,
} from 'react-native';
import Split from '../components/Common/Split';
import {
  addressSave,
  getCity,
  getCountry,
  getProvince,
  getRegion,
} from '../api/request';
import I18n from '../language/i18n';
import Spinner from 'react-native-spinkit';
import {colors} from './../style/colors';
import ListModal from './../components/address/ListModal';
import {userStorage} from '../utils/Storage';
function AddAddress(props) {
  props.navigation.setOptions({
    headerRight: () => (
      <Button
        onPress={() => saveAddress()}
        title={I18n.t('save')}
        color={colors.primary}
      />
    ),
    headerTitle: I18n.t('addaddress'),
  });
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    getCountry().then(data => {
      setCountry(data);
    });
  }, []);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState(null);
  const [country, setCountry] = useState([]);
  const [countryId, setCountryId] = useState('');
  const [countryName, setCountryName] = useState('');
  const [countryModel, setCountryModel] = useState(false);
  const [province, setProvince] = useState([]);
  const [provinceId, setProvinceId] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [provinceModel, setProvinceModel] = useState(false);
  const [city, setCity] = useState([]);
  const [cityId, setCityId] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityModel, setCityModel] = useState(false);
  const [region, setRegion] = useState([]);
  const [regionId, setRegionId] = useState('');
  const [regionName, setRegionName] = useState('');
  const [regionModel, setRegionModel] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [detailAddress, setDetailAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const userRef = useRef(null);
  const phoneRef = useRef(null);
  const detailAddressRef = useRef(null);
  const saveAddress = () => {
    if (!user || user == '') {
      Alert.alert('Please eneter recipients name!');
      userRef.current.focus();
      return false;
    }
    if (!phone || phone == '') {
      Alert.alert('Please eneter recipients phone!');
      phoneRef.current.focus();
      return false;
    }
    if (!countryId || countryId == '') {
      Alert.alert('Please eneter select country!');
      setCountryModel(true);
      return false;
    }
    if (!provinceId || provinceId == '') {
      Alert.alert('Please eneter select province!');
      setProvinceModel(true);
      return false;
    }
    if (!cityId || cityId == '') {
      Alert.alert('Please eneter select city!');
      setCityModel(true);
      return false;
    }
    if (!regionId || regionId == '') {
      Alert.alert('Please eneter select region!');
      setRegionModel(true);
      return false;
    }
    if (!detailAddress || detailAddress == '') {
      Alert.alert('Please eneter enter detailAddress!');
      detailAddressRef.current.focus();
      return false;
    }
    setLoading(true);
    addressSave(
      user,
      phone,
      detailAddress,
      countryId,
      provinceId,
      cityId,
      regionId,
      isDefault ? 1 : 0,
    ).then(() => {
      DeviceEventEmitter.emit('addAddressSuccess');
      this.props.navigation.goBack();
      setLoading(false);
    });
  };
  return (
    <View style={{flex: 1}}>
      <Spinner
        isVisible={loading}
        size={50}
        color={'red'}
        type="Bounce"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 1000,
          marginTop: -25,
          marginLeft: -25,
        }}
      />
      <View style={styles.item}>
        <Text style={styles.text}>{I18n.t('recipients')}</Text>
        <TextInput
          onChangeText={text => setUser(text)}
          style={{flex: 1}}
          ref={userRef}
        />
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>{I18n.t('phone')}</Text>
        <TextInput
          onChangeText={text => setPhone(text)}
          style={{flex: 1}}
          ref={phoneRef}
        />
      </View>
      <View style={styles.item}>
        <Text
          style={styles.text}
          onPress={() => {
            setCountryModel(true);
          }}>
          {I18n.t('country')}
        </Text>
        <Text
          onPress={() => {
            setCountryModel(true);
          }}>
          {countryName}
        </Text>
        <ListModal
          title={I18n.t('country')}
          closeAction={() => {
            setCountryModel(false);
          }}
          list={country}
          selected={countryId}
          handerClick={(value, label) => {
            setCountryId(value);
            setCountryModel(false);
            setCountryName(label);
            getProvince(value).then(data => {
              setProvince(data);
              setProvinceModel(true);
            });
          }}
          isVisible={countryModel}
        />
      </View>

      <View style={styles.item}>
        <Text
          style={styles.text}
          onPress={() => {
            setProvinceModel(true);
          }}>
          {I18n.t('province')}
        </Text>
        <Text
          onPress={() => {
            setProvinceModel(true);
          }}>
          {provinceName}
        </Text>
        <ListModal
          title={I18n.t('province')}
          closeAction={() => {
            setProvinceModel(false);
          }}
          list={province}
          selected={provinceId}
          handerClick={(value, label) => {
            setProvinceId(value);
            setProvinceModel(false);
            setProvinceName(label);
            getCity(value).then(data => {
              setCity(data);
              setCityModel(true);
            });
          }}
          isVisible={provinceModel}
        />
      </View>

      <View style={styles.item}>
        <Text
          style={styles.text}
          onPress={() => {
            setCityModel(true);
          }}>
          {I18n.t('city')}
        </Text>
        <Text
          onPress={() => {
            setCityModel(true);
          }}>
          {cityName}
        </Text>
        <ListModal
          title={I18n.t('city')}
          closeAction={() => {
            setCityModel(false);
          }}
          list={city}
          selected={cityId}
          handerClick={(value, label) => {
            setCityId(value);
            setCityModel(false);
            setCityName(label);
            getRegion(value).then(data => {
              setRegion(data);
              setRegionModel(true);
            });
          }}
          isVisible={cityModel}
        />
      </View>

      <View style={styles.item}>
        <Text
          style={styles.text}
          onPress={() => {
            setRegionModel(true);
          }}>
          {I18n.t('district')}
        </Text>
        <Text
          onPress={() => {
            setRegionModel(true);
          }}>
          {regionName}
        </Text>
        <ListModal
          title={I18n.t('district')}
          closeAction={() => {
            setCountryModel(false);
          }}
          list={region}
          selected={regionId}
          handerClick={(value, label) => {
            setRegionId(value);
            setRegionModel(false);
            setRegionName(label);
          }}
          isVisible={regionModel}
        />
      </View>

      <View style={[styles.item, {height: 100}]}>
        <TextInput
          placeholder={I18n.t('detailaddressplacehander')}
          style={styles.text}
          onChangeText={text => {
            setDetailAddress(text);
          }}
          ref={detailAddressRef}
        />
      </View>
      <Split color={'#F8F8F8'} height={20} top={-1} />
      <View style={styles.item}>
        <Text style={[styles.text, {marginRight: 'auto'}]}>
          {I18n.t('tobesetdefaultaddress')}
        </Text>
        <Switch
          onValueChange={value => {
            setIsDefault(value);
          }}
          value={isDefault}
          color={colors.primary}
          style={{marginRight: 20}}
        />
      </View>

      <TouchableOpacity
        style={{
          marginBottom: 0,
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        onPress={saveAddress}>
        <View
          style={{
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
            width: '100%',
          }}>
          <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>
            {I18n.t('savedandused')}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F4F4',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    marginLeft: 20,
    marginRight: 20,
    color: '#949090',
    fontSize: 14,
  },
  tag: {
    paddingLeft: 12,
    color: '#949090',
    fontSize: 14,
    paddingRight: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 20,
  },
});

export default React.memo(AddAddress);
