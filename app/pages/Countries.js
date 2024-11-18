import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';
import {isIphoneX} from '../utils/isApplePhone';
import {proportion} from '../utils/conversion';
import Icon from 'react-native-vector-icons/EvilIcons';
import ContriesItem from '../components/Countries/ContriesItem';
import I18n from '../language/i18n';
const {width} = Dimensions.get('window');
import BackLeftIco from '../components/Common/BackLeftIco';
export default class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      queryResult: [],
    };
    this.supportedCountries = [
      {name: '阿尔巴尼亚', code: '355'},
      {name: '阿尔及利亚', code: '213'},
      {name: '阿富汗', code: '93'},
      {name: '阿根廷', code: '54'},
      {name: '阿拉伯联合酋长国', code: '971'},
      {name: '阿鲁巴', code: '297'},
      {name: '阿曼', code: '968'},
      {name: '阿塞拜疆', code: '994'},
      {name: '埃及', code: '20'},
      {name: '埃塞俄比亚', code: '251'},
      {name: '爱尔兰', code: '353'},
      {name: '爱沙尼亚', code: '372'},
      {name: '安道尔', code: '376'},
      {name: '安哥拉', code: '244'},
      {name: '安圭拉', code: '1264'},
      {name: '安提瓜和巴布达', code: '1268'},
      {name: '奥地利', code: '43'},
      {name: '澳大利亚', code: '61'},
      {name: '澳门特别行政区', code: '853'},
      {name: '巴巴多斯', code: '1246'},
      {name: '巴布亚新几内亚', code: '675'},
      {name: '巴哈马', code: '1242'},
      {name: '巴基斯坦', code: '92'},
      {name: '巴拉圭', code: '595'},
      {name: '巴勒斯坦', code: '970'},
      {name: '巴拿马', code: '507'},
      {name: '巴西', code: '55'},
      {name: '白俄罗斯', code: '375'},
      {name: '百慕大', code: '1441'},
      {name: '保加利亚', code: '359'},
      {name: '贝宁', code: '229'},
      {name: '比利时', code: '32'},
      {name: '冰岛', code: '354'},
      {name: '波多黎各', code: '1787'},
      {name: '波黑', code: '387'},
      {name: '波兰', code: '48'},
      {name: '玻利维亚', code: '591'},
      {name: '伯利兹', code: '501'},
      {name: '博茨瓦纳', code: '267'},
      {name: '不丹', code: '975'},
      {name: '布基纳法索', code: '226'},
      {name: '布隆迪', code: '257'},
      {name: '赤道几内亚', code: '240'},
      {name: '丹麦', code: '45'},
      {name: '德国', code: '49'},
      {name: '东帝汶', code: '670'},
      {name: '多哥', code: '228'},
      {name: '多米尼加共和国', code: '1809'},
      {name: '多米尼克', code: '1767'},
      {name: '俄罗斯', code: '7'},
      {name: '厄瓜多尔', code: '593'},
      {name: '法国', code: '33'},
      {name: '法罗群岛', code: '298'},
      {name: '法属波利尼西亚', code: '689'},
      {name: '法属圭亚那', code: '594'},
      {name: '菲律宾', code: '63'},
      {name: '斐济', code: '679'},
      {name: '芬兰', code: '358'},
      {name: '佛得角', code: '238'},
      {name: '冈比亚', code: '220'},
      {name: '刚果共和国', code: '242'},
      {name: '刚果民主共和国', code: '243'},
      {name: '哥伦比亚', code: '57'},
      {name: '哥斯达黎加', code: '506'},
      {name: '格林纳达', code: '1473'},
      {name: '格陵兰', code: '299'},
      {name: '格鲁吉亚', code: '995'},
      {name: '古巴', code: '53'},
      {name: '瓜德罗普', code: '590'},
      {name: '关岛', code: '1671'},
      {name: '圭亚那', code: '592'},
      {name: '哈萨克斯坦', code: '7'},
      {name: '海地', code: '509'},
      {name: '韩国', code: '82'},
      {name: '荷兰', code: '31'},
      {name: '荷属圣马丁', code: '599'},
      {name: '黑山', code: '382'},
      {name: '洪都拉斯', code: '504'},
      {name: '基里巴斯', code: '686'},
      {name: '吉布提', code: '253'},
      {name: '吉尔吉斯斯坦', code: '996'},
      {name: '几内亚', code: '224'},
      {name: '几内亚比绍', code: '245'},
      {name: '加拿大', code: '1'},
      {name: '加纳', code: '233'},
      {name: '加蓬', code: '241'},
      {name: '柬埔寨', code: '855'},
      {name: '捷克共和国', code: '420'},
      {name: '津巴布韦', code: '263'},
      {name: '喀麦隆', code: '237'},
      {name: '卡塔尔', code: '974'},
      {name: '开曼群岛', code: '1345'},
      {name: '科摩罗和马约特', code: '269'},
      {name: '科特迪瓦', code: '225'},
      {name: '科威特', code: '965'},
      {name: '克罗地亚', code: '385'},
      {name: '肯尼亚', code: '254'},
      {name: '库克群岛', code: '682'},
      {name: '拉脱维亚', code: '371'},
      {name: '莱索托', code: '266'},
      {name: '黎巴嫩', code: '961'},
      {name: '立陶宛', code: '370'},
      {name: '利比里亚', code: '231'},
      {name: '利比亚', code: '218'},
      {name: '列支敦士登', code: '423'},
      {name: '留尼汪', code: '262'},
      {name: '卢森堡', code: '352'},
      {name: '卢旺达', code: '250'},
      {name: '罗马尼亚', code: '40'},
      {name: '马达加斯加', code: '261'},
      {name: '马尔代夫', code: '960'},
      {name: '马耳他', code: '356'},
      {name: '马拉维', code: '265'},
      {name: '马来西亚', code: '60'},
      {name: '马里', code: '223'},
      {name: '马其顿', code: '389'},
      {name: '马提尼克', code: '596'},
      {name: '毛里求斯', code: '230'},
      {name: '毛里塔尼亚', code: '222'},
      {name: '美国', code: '1'},
      {name: '美属维尔京群岛', code: '1340'},
      {name: '蒙古', code: '976'},
      {name: '蒙特塞拉特', code: '1664'},
      {name: '孟加拉国', code: '880'},
      {name: '秘鲁', code: '51'},
      {name: '缅甸', code: '95'},
      {name: '摩尔多瓦', code: '373'},
      {name: '摩洛哥', code: '212'},
      {name: '摩纳哥', code: '377'},
      {name: '莫桑比克', code: '258'},
      {name: '香港', code: '852'},
      {name: '墨西哥', code: '52'},
      {name: '纳米比亚', code: '264'},
      {name: '南非', code: '27'},
      {name: '塞内加尔', code: '221'},
      {name: '南苏丹', code: '211'},
      {name: '尼加拉瓜', code: '505'},
      {name: '尼泊尔', code: '977'},
      {name: '尼日尔', code: '227'},
      {name: '尼日利亚', code: '234'},
      {name: '挪威', code: '47'},
      {name: '帕劳', code: '680'},
      {name: '葡萄牙', code: '351'},
      {name: '日本', code: '81'},
      {name: '瑞典', code: '46'},
      {name: '瑞士', code: '41'},
      {name: '萨尔瓦多', code: '503'},
      {name: '萨摩亚', code: '685'},
      {name: '塞尔维亚', code: '381'},
      {name: '塞拉利昂', code: '232'},
      {name: '塞浦路斯', code: '357'},
      {name: '塞舌尔', code: '248'},
      {name: '沙特阿拉伯', code: '966'},
      {name: '圣多美和普林西比', code: '239'},
      {name: '圣基茨和尼维斯', code: '1869'},
      {name: '圣卢西亚', code: '1758'},
      {name: '圣文森特和格林纳丁斯', code: '1784'},
      {name: '斯里兰卡', code: '94'},
      {name: '斯洛伐克', code: '421'},
      {name: '斯洛文尼亚', code: '386'},
      {name: '斯威士兰', code: '268'},
      {name: '苏丹', code: '249'},
      {name: '苏里南', code: '597'},
      {name: '所罗门群岛', code: '677'},
      {name: '索马里', code: '252'},
      {name: '塔吉克斯坦', code: '992'},
      {name: '台湾', code: '886'},
      {name: '泰国', code: '66'},
      {name: '坦桑尼亚', code: '255'},
      {name: '汤加', code: '676'},
      {name: '特克斯和凯科斯群岛', code: '1649'},
      {name: '特立尼达和多巴哥', code: '1868'},
      {name: '突尼斯', code: '216'},
      {name: '土耳其', code: '90'},
      {name: '土库曼斯坦', code: '993'},
      {name: '瓦努阿图', code: '678'},
      {name: '危地马拉', code: '502'},
      {name: '委内瑞拉', code: '58'},
      {name: '文莱', code: '673'},
      {name: '老挝', code: '856'},
      {name: '乌干达', code: '256'},
      {name: '乌克兰', code: '380'},
      {name: '乌拉圭', code: '598'},
      {name: '乌兹别克斯坦', code: '998'},
      {name: '希腊', code: '30'},
      {name: '西班牙', code: '34'},
      {name: '新加坡', code: '65'},
      {name: '新喀里多尼亚', code: '687'},
      {name: '新西兰', code: '64'},
      {name: '匈牙利', code: '36'},
      {name: '叙利亚', code: '963'},
      {name: '牙买加', code: '1876'},
      {name: '亚美尼亚', code: '374'},
      {name: '也门', code: '967'},
      {name: '伊拉克', code: '964'},
      {name: '伊朗', code: '98'},
      {name: '巴林', code: '973'},
      {name: '以色列', code: '972'},
      {name: '意大利', code: '39'},
      {name: '印度', code: '91'},
      {name: '印度尼西亚', code: '62'},
      {name: '英国', code: '44'},
      {name: '英属维尔京群岛', code: '1284'},
      {name: '约旦', code: '962'},
      {name: '越南', code: '84'},
      {name: '赞比亚', code: '260'},
      {name: '乍得', code: '235'},
      {name: '直布罗陀', code: '350'},
      {name: '智利', code: '56'},
      {name: '中非共和国', code: '236'},
      {name: '中华人民共和国', code: '86'},
    ];
  }

  componentDidMount() {}

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F9FBFC', alignItems: 'center'}}>
        <View style={styles.nav}>
          <BackLeftIco size={30} color={'#707070'} />
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
              {' '}
              {I18n.t('chooseareacode')}
            </Text>
          </View>
          <View
            style={{
              marginRight: 18,
              width: 25,
            }}
          />
        </View>
        <View style={styles.search}>
          <Icon
            name={'search'}
            size={15}
            color={'#C2C2C2'}
            style={styles.searchIcon}
          />
          <TextInput
            style={{color: '#C2C2C2', fontSize: 12}}
            style={styles.input}
            placeholder={I18n.t('searchcountries')}
            onChangeText={query => {
              this.setState({query}, () => {
                if (!query) {
                } else {
                  this.handlerSearch();
                }
              });
            }}
          />
        </View>
        {!this.state.query ? (
          <FlatList
            data={this.supportedCountries}
            ListHeaderComponent={this.headerComponent}
            renderItem={this.renderItem}
            style={{backgroundColor: 'white'}}
          />
        ) : (
          <FlatList
            data={this.state.queryResult}
            renderItem={this.searchRenderItem}
            style={{backgroundColor: 'white'}}
          />
        )}
      </View>
    );
  }

  handlerSearch = () => {
    let result = [];
    this.supportedCountries.map(item => {
      if (
        item.name.indexOf(this.state.query) !== -1 ||
        item.code === this.state.query
      ) {
        result.push(item);
      }
    });
    this.setState({queryResult: result});
  };
  renderItem = item => {
    if (item.index == 0) {
      return (
        <View>
          <View style={{height: 40 * proportion}} />
          <ContriesItem
            key={item.index}
            country={item.item.name}
            number={item.item.code}
          />
        </View>
      );
    } else if (item.index == 210) {
      return (
        <View>
          <ContriesItem
            key={item.index}
            country={item.item.name}
            number={item.item.code}
          />
          <View style={{height: 40 * proportion}} />
        </View>
      );
    } else {
      return (
        <ContriesItem
          key={item.index}
          country={item.item.name}
          number={item.item.code}
        />
      );
    }
  };

  searchRenderItem = item => {
    return (
      <View style={{width: width, backgroundColor: '#F9FBFC'}}>
        <ContriesItem
          key={item.index}
          country={item.item.name}
          number={item.item.code}
        />
      </View>
    );
  };
  headerComponent = () => {
    return (
      <View
        style={{
          height: 343 * proportion,
          width: width,
          backgroundColor: '#F9FBFC',
        }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{I18n.t('incommonuse')}</Text>
        </View>
        <View style={{height: 216 * proportion, backgroundColor: 'white'}}>
          <View style={{height: 40 * proportion}} />
          <ContriesItem country={'中华人民共和国'} number={'86'} />
          <ContriesItem country={'加拿大'} number={'1'} />
          <ContriesItem country={'美国'} number={'1'} />
          <View style={{height: 40 * proportion}} />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>{I18n.t('all')}</Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  nav: {
    marginTop: isIphoneX() ? 58 * proportion : 38 * proportion,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  navIcon: {
    width: 25,
    height: 16,
  },
  search: {
    width: '90%',
    backgroundColor: 'white',
    marginTop: 14 * proportion,
    height: 35,
    borderRadius: 17.5 * proportion,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  header: {
    height: 63 * proportion,
    justifyContent: 'center',
    marginLeft: 18 * proportion,
  },
  headerText: {
    color: '#24A5FE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
});
