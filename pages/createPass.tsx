import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TextInput, ScrollView, Dimensions, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigatorProps, NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from './routers';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { Barometer } from 'expo-sensors';
import * as Random from 'expo-random';
import { Button } from "@rneui/themed";


import { applyStoreData } from "../store/secureStore"


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    itemIcon: {
        position: "absolute",
        zIndex: 1,
        right: 10,
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
        marginTop: 50
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
    label: string
    name: string
    site?: string
    email?: string
    phone?: string
    user: string
    password: string
}

export default function CreatePass({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'CreatePass'>) {
    console.log("route: ", route.params)

    const emailList = [{ id: "1", title: 'test' }, { id: "2", title: 'test2' }, { id: "3", title: 'test3' }];
    const [data, setData] = useState<NinePassData>({ label: "", name: "", site: "", email: "", phone: "", user: "", password: "" })

    const [label, setLabel] = useState(route.params?.label || "")
    const [name, setName] = useState(route.params?.name || "")
    const [site, setSite] = useState(route.params?.site || "")
    const [email, setEmail] = useState<any>({});
    const [phone, setPhone] = useState(route.params?.phone || "")
    const [user, setUser] = useState<string>(route.params?.user || "");
    const [password, setPassword] = useState<string>(route.params?.password || "");

    const [pressure, setPressure] = useState<Number>(0);

    useEffect(() => {
        Barometer.addListener(barometerData => {
            Barometer.removeAllListeners()
            setPressure(barometerData.pressure)

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
        data.label = label
        data.name = name
        if (!name) {
            notice("名称不能为空")
            return false
        }
        data.site = site
        data.phone = phone
        if (!user) {
            notice("用户名不能为空")
            return false
        }
        data.user = user
        if (!password) {
            notice("密码不能为空")
            return false
        }
        data.password = password

        await applyStoreData("DATA", data)
        navigation.replace("PassList")
        // alert(JSON.stringify(data,null,2))
    }

    return <SafeAreaView style={styles.container}>
        <View style={styles.item}>
            <TextInput style={styles.input} placeholder="自定义标签" onChangeText={setLabel} value={label} />
        </View>
        <View style={styles.item}>
            <TextInput style={styles.input} placeholder="名称*" onChangeText={setName} value={name} />
        </View>
        <View style={styles.item}>
            <TextInput style={styles.input} placeholder="网址" onChangeText={setSite} value={site} />
        </View>
        <View style={styles.item}>

            <View style={{ width: "100%" }}>
                <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    initialValue={{ email }} // or just '2'
                    onSelectItem={setEmail}
                    dataSet={emailList}
                    textInputProps={
                        { placeholder: "邮箱" }
                    }

                />
            </View>

        </View>
        <View style={styles.item}>
            <TextInput style={styles.input} placeholder="手机" onChangeText={setPhone} value={phone} />
        </View>
        <View style={styles.item}>
            <TextInput style={styles.input} placeholder="用户名*" onChangeText={setUser} value={user} />
            <View style={styles.itemIcon}>
                {user ? <MaterialIcons name="cancel" size={24} color="black" onPress={() => setUser("")} /> : <MaterialIcons name="create" size={24} color="black" onPress={createUser} />}
            </View>
        </View>
        <View style={styles.item}>
            <TextInput style={styles.input} placeholder="密码*" onChangeText={setPassword} value={password} />
            <View style={styles.itemIcon}>
                {password ? <MaterialIcons name="cancel" size={24} color="black" onPress={() => setPassword("")} /> : <MaterialIcons name="create" size={24} color="black" onPress={createPassword} />}
            </View>
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