import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigatorProps, NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from './routers';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { Barometer } from 'expo-sensors';
import * as Random from 'expo-random';
import { Button, Input, Icon,Text } from "@rneui/themed";


import { applyStoreData } from "../store/secureStore"
import {insertData,updateData} from "../store/sqlite"


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    title: {
        fontSize: 24
    },
    item: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        // margin: 10,
    },
    itemIcon: {
        position: "absolute",
        zIndex: 1,
        right: 20,
        bottom:40
    },
    name: {
        fontSize: 18
    },
    input: {
        width: "100%",
        backgroundColor: "#fff",
        height: 40,
        padding: 10,
        fontSize: 18
    },
    button: {
        width: "40%",
        marginTop: 50,
        marginRight:10,
        marginLeft:10
    },
    itemText: {
        fontSize: 15,
        margin: 2
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    }
})

export type NinePassData = {
    id?:number
    label: string
    name: string
    site?: string
    email?: string
    phone?: string
    user: string
    password: string
    version?:number
}

export default function Settings({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Settings'>) {



    const [user, setUser] = useState<string>(route.params?.user || "");
    const [password, setPassword] = useState<string>(route.params?.password || "");

    const [pressure, setPressure] = useState<string>("");
    const [token,setToken] = useState<string>(global.token)

    useEffect(() => {
        Barometer.addListener(barometerData => {
            Barometer.removeAllListeners()
            setPressure(barometerData.pressure+"")

        });
    }, [])


    

    const createUser = () => {
        setUser('u' + Math.random().toString(36).substr(2, 9));
    }

    const createPassword = async () => {
        let pass = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA1,
            new Date().toString() + pressure + Random.getRandomBytes(9),
            { encoding: Crypto.CryptoEncoding.BASE64 }
        )
        setPassword("P" + pass);
    }

    const notice = (message: string) => {
        Alert.alert("保存失败", message, [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ])
    }

    const save = async () => {


        navigation.replace("PassList")
        

    }

    return <SafeAreaView style={styles.container}>
        <View style={{margin:10}}><Text h3>配置</Text></View>
        <View style={styles.item}>
            <Input style={styles.input} placeholder="全局Token" leftIcon={
                <Icon
                    name='label'
                    size={24}
                    color='black'
                />
            } onChangeText={setToken} value={token} />
        </View>

        <View style={styles.item}>
            <Input style={styles.input} placeholder="气压" leftIcon={
                <Icon
                    name='label'
                    size={24}
                    color='black'
                />
            } onChangeText={setPressure} value={pressure+""} />
        </View>
       

        <View style={styles.item}>
            <View style={styles.button}>
                <Button onPress={save} title="保存" />
            </View>
            <View style={styles.button}>
                <Button onPress={() => navigation.navigate("PassList")} title="取消" />
            </View>

        </View>

    </SafeAreaView>
}