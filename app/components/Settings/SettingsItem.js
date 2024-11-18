/**
 * Created by sujiayizu on 2019-12-17.
 */
import React from 'react';
import {View, StyleSheet, Text,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
function SettingsItem(props) {

    return (
        <TouchableOpacity style={styles.container} onPress={() => props.handleClick()}>
            <Text style={{marginRight:'auto'}}>{props.name}</Text>
            <Icon size={16} name={"right"}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        height: 40,
        borderBottomWidth:1,
        borderColor:'rgb(205,205,205)',
        paddingLeft: 10,
        paddingRight:10,
        alignItems:'center'
    }
});

export default React.memo(SettingsItem)
