import React from 'react';
import {View} from 'react-native';

function Split(props) {
    return (
        <View style={{
            height: props.height ? props.height : 11,
            width: '100%',
            backgroundColor: props.color ? props.color : '#F6F4F4',
            marginTop:
                props.top ? props.top : 20
        }}/>
    )
}

export default React.memo(Split)
