import React , {Component} from 'react';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react';
import {Animated,
        Dimensions, 
        StyleSheet,
        Text,
        TouchableHighlight,
        View,
    } from 'react-native';

import {ListItem, Icon} from 'react-native-elements'

import { SwipeListView } from 'react-native-swipe-list-view';

import db from '../config'


export default class SwipeableFlatList extends Component {
    constructor(props){
        super(props);
        this.state = {
            allNotifications : this.props.allNotifications,
        };
    }
    updateMarkAsRead = (notification) => {
        db.collection("all_notifications").doc(notification.doc_id).update({
            "notification_status" : "read"
        })
    }

    onSwipeValueChange = swipeData => {
        var allNotifications = this.state.allNotifications
        const {key , value} = swipeData;

        if(value < Dimensions.get('window').width){
            const newData = [...allNotifications];
            const prevIndex = allNotifications.findIndex(item => item.key === key);
            this.updateMarkAsRead(allNotifications[prevIndex]);
            newData.splice(prevIndex , 1);
            this.setState({ allNotifications : newData})
        };
    };

    renderItem = data => (
        <Animated.View>
            <ListItem
            leftElement = {<Icon name = "book" type = "font-awesome" color = '#6969669' />}
            title = {data.book_name}
            titleStyle = {{color : 'black' , fontWeight : 'bold'}}
            subtitle = {data.item.message}
            bottomDivider
            />
        </Animated.View>
    );

    renderHiddenItem = () => (
        <View style={StyleSheet.rowBack}>
            <View style = {[styles.backRightBtn , styles.backRightBtnRight]}>
                <Text style = {styles.backTextWhite}></Text>
            </View>
        </View>
    );

    render(){
        return(
            <View style = {styles.container}>
                <SwipeListView
                    disableRightSwipe
                    data = {this.state.allNotifications} 
                    renderItem = {this.renderItem} 
                    renderHiddenItem = {this.renderHiddenItem}
                    rightOpenValue = {-Dimensions.get('window').width}
                    previewRowKey = {'0'}
                    previewOpenValue = {-40}
                    previewOpenDelay = {3000}
                    onSwipeValueChange = {this.onSwipeValueChange}
                />
            </View>
        );
    }

}


const style = StyleSheet.create({
    container : {
        backgroundColor : '#FFF',
        flex  : 1
    },
    backTextWhite : {
        color : '#FFF',
        fontWeight : 'bold',
        fontSize : 15
    },
    rowBack : {
        alipnItems : 'center',
        backgroundColor : '#29B6F6',
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between',
        paddingLeft  :15
    },
    backRightBtn : {
        alignItems : 'center',
        bottom : 0,
        justifyContent : 'space-between',
        paddingLeft : 15
    },
    backRightBtn : {
        alignItems : 'center',
        bottom : 0,
        justifyContent : 'center',
        position : 'absolute',
        top : 0,
        width : 100,
    },
    backRightBtnRight : {
        backgroundColor : '#29B6F6',
        right : 0
    }
})