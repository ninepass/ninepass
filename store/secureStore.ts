import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import * as Random from "expo-random";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function save(key: string, value: any) {
    await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        // alert("🔐 Here's your value 🔐 \n" + result);
        return result;
    } else {
        alert("No values stored under that key.");
    }
}

export async function createGlobalToken() {
    let token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        new Date().toString() + Random.getRandomBytes(9),
        { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    await save("GlobalToken", token);
}

export const storeData = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        // saving error
    }
};

export const getData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
};

export const applyStoreData = async (key: string, value: any) => {
    try {
        console.log("key: ", key);
        let data = (await getData(key)) || [];

        data.push(value);
        // console.log("store: ", data);
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        // saving error
    }
};

export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        // clear error
    }

    console.log("Done.");
};


// clearAll()