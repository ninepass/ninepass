import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigatorProps, NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from './routers';


import { getData } from "../store/secureStore"

const Item = ({data,navigation}: any) => (
    <View style={styles.item}>
        <TouchableOpacity onPress={()=>navigation.navigate("CreatePass",data)}>
            {data.label ? <Text style={styles.title}>{data.label}</Text> : null}
            {data.name ? <Text style={styles.title}>{data.name}</Text> : null}
            {data.email ? <Text style={styles.title}>{data.email}</Text> : null}
            {data.phone ? <Text style={styles.title}>{data.phone}</Text> : null}
            {data.user ? <Text style={styles.title}>{data.user}</Text> : null}
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
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
        marginTop: 50,
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
    const [text, onChangeText] = React.useState('Useless Text');
    // const [number, onChangeNumber] = React.useState(null);
    const [list, setList] = useState(global.data || [])

    const onPress = () => {
        navigation.navigate('CreatePass',undefined);
    }

    useEffect(() => {
        const fetchDdata = async () => {
            let data = await getData("DATA")
            setList(data)
        }
        fetchDdata()
    }, [])

    return <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} onChangeText={onChangeText} value={text} />
        </View>
        <FlatList style={styles.listContainer} data={list} renderItem={renderItem} keyExtractor={(item, key) => key + ""} />
        <View style={styles.plusContainer}>
            <MaterialCommunityIcons name="database-plus" size={80} color="#999" onPress={onPress} />
        </View>
    </SafeAreaView>
}