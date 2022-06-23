import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigatorProps, NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from './routers';

import { Input, Icon, ListItem, Button, SpeedDial, SearchBar, SocialIcon, Avatar } from '@rneui/themed';

import { getData } from "../store/secureStore";
import { iconDataList } from "../store/icon";
import {NinePassData} from "./createPass"

const findIcon = (name: string) => {
    let icon = iconDataList.find(item => item.type === name.toLowerCase())
    if (icon) {
        return icon.type
    } else {
        return ""
    }
}

const Item = ({ data, navigation }: any) => (
    <ListItem.Swipeable
        style={styles.item}
        onPress={() => navigation.navigate("CreatePass", data)}
        rightContent={(reset) => (
            <Button
                title="Delete"
                onPress={() => reset()}
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
    const renderItem = ({ item }: any) => <Item data={item} navigation={navigation} />;
    const [text, onChangeText] = React.useState('');
    // const [number, onChangeNumber] = React.useState(null);
    const [list, setList] = useState(global.data || [])
    let [renderList, setRenderList] = useState<NinePassData[]>([])

    const onSearch = (search:string) => {
        setRenderList(list.filter((item:NinePassData)=>{
            if (item.label?.includes(search)||item.name?.includes(search)||item.user?.includes(search)){
                return item
            }else {
                return false
            }
        }))
        onChangeText(search)
    }

    const onPress = () => {
        navigation.navigate('CreatePass', undefined);
    }

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        const fetchDdata = async () => {
            let data = await getData("DATA")
            setList(data)
            setRenderList(data)
        }
        fetchDdata()
    }, [])

    return <SafeAreaView style={styles.container}>

        <SearchBar placeholder='Search' onChangeText={onSearch} value={text} onClear={() => onChangeText("")} />

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
                icon={{ name: 'delete', color: '#fff' }}
                title="Delete"
                onPress={() => console.log('Delete Something')}
            />

        </SpeedDial>

    </SafeAreaView>
}