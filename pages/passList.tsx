import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigatorProps, NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from './routers';

import { Input, Icon, ListItem, Button, SpeedDial, SearchBar, SocialIcon, Avatar } from '@rneui/themed';

import { getData } from "../store/secureStore";
import { iconDataList } from "../store/icon";
import { NinePassData } from "./createPass"
import { selectData, deleteData } from "../store/sqlite"

const findIcon = (name: string) => {
    let icon = iconDataList.find(item => item.type === name.toLowerCase())
    if (icon) {
        return icon.type
    } else {
        return ""
    }
}

const Item = ({ data, navigation, deleteItem }: any) => (
    <ListItem.Swipeable
        style={styles.item}
        onPress={() => navigation.navigate("CreatePass", data)}
        rightContent={(reset) => (
            <Button
                title="Delete"
                onPress={() => { deleteItem(data.id, reset); }}
                icon={{ name: 'delete', color: 'white' }}
                buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
            />
        )}
    >
        {
            findIcon(data.label) ? <SocialIcon
                type={data.label.toLowerCase()} /> : <Avatar size={64} rounded iconStyle={{ backgroundColor: "red" }}><Text style={{ fontSize: 32, textAlign: "center" }}>{data.label[0]?.toLocaleUpperCase()}</Text></Avatar>
        }
        <ListItem.Content>
            {data.label ? <ListItem.Title style={styles.title}>{data.label}</ListItem.Title> : null}
            {data.name ? <ListItem.Subtitle style={styles.title}>{data.name}</ListItem.Subtitle> : null}
            {data.email ? <ListItem.Subtitle style={styles.title}>{data.email}</ListItem.Subtitle> : null}
            {data.phone ? <ListItem.Subtitle style={styles.title}>{data.phone}</ListItem.Subtitle> : null}
            {data.user ? <ListItem.Subtitle style={styles.title}>{data.user}</ListItem.Subtitle> : null}
        </ListItem.Content>
        <ListItem.Chevron />
    </ListItem.Swipeable>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        // backgroundColor: '#fff',
        // padding: 20,
        // marginVertical: 8,
        // marginHorizontal: 16,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        // width: '100%',
    },
    title: {
        fontSize: 16,
    },
    input: {
        height: 40,
        // margin: 12,
        // borderWidth: 1,
        padding: 10,
        // position: 'absolute',
        zIndex: 1,
        width: "80%",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: 50,
        position: 'absolute',
    },
    listContainer: {
        // marginTop: 50,
        width: Dimensions.get('window').width,
        backgroundColor: '#f1f1f1',
    },
    plusContainer: {
        position: 'absolute',
        bottom: 50,
        right: 20,
    }
});

export default function PassList({ navigation }: NativeStackScreenProps<RootStackParamList, 'PassList'>) {
    const renderItem = ({ item }: any) => <Item data={item} navigation={navigation} deleteItem={deleteItem} />;
    const [search, onChangeText] = React.useState('');
    const [list, setList] = useState<NinePassData[]>([])
    let [renderList, setRenderList] = useState<NinePassData[]>([])
    let [interval,setIntgerval]= useState(0)

    const onSearch = (search: string) => {
        if (interval){
            let now = new Date().getTime()
            if ((now - interval) > 400) {
                selectData(search,callback)
                
                setIntgerval(0)
            }
        }else{
            setIntgerval(new Date().getTime())
        }
        onChangeText(search)
    }

    const onPress = () => {
        navigation.navigate('CreatePass', undefined);
    }

    const [open, setOpen] = React.useState(false);

    const callback = (data: any) => {
        // setList(data)
        setRenderList(data)
    }

    useEffect(() => {
        selectData(search,callback)
        console.log("111")
    }, [])

    const deleteItem = (id: number, reset: Function) => {
        deleteData(id);
        selectData(search,callback)
        reset()
    }


    return <SafeAreaView style={styles.container}>

        <SearchBar placeholder='Search' onChangeText={onSearch} value={search} onClear={() => onChangeText("")} />

        <FlatList style={styles.listContainer} data={renderList} renderItem={renderItem} keyExtractor={(item, key) => key + ""} />

        <SpeedDial
            isOpen={open}
            icon={{ name: 'edit', color: '#fff' }}
            openIcon={{ name: 'close', color: '#fff' }}
            onOpen={() => setOpen(!open)}
            onClose={() => setOpen(!open)}
        >
            <SpeedDial.Action
                icon={{ name: 'add', color: '#fff' }}
                title="Add"
                onPress={onPress}
            />
            <SpeedDial.Action
                icon={{ name: 'settings', color: '#fff' }}
                title="Setting"
                onPress={() =>  navigation.navigate('Settings', undefined)}
            />

        </SpeedDial>

    </SafeAreaView>
}