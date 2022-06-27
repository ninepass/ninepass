import * as SQLite from "expo-sqlite";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

function openDatabase() {
    console.log("open: ");
    if (Platform.OS === "web") {
        return {
            transaction: () => {
                return {
                    executeSql: () => {},
                };
            },
        };
    }

    const db = SQLite.openDatabase("ninepass.db");
    return db;
}

type ninepassData = {
    id?: number;
    label: string;
    name: string;
    site?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    user: string;
    password: string;
    version?: number;
    created_at?: Date;
    updated_at?: Date;
};

const db = openDatabase();

const createTable = (tableName: string) => {
    db.transaction(
        (tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName}(
            id INTEGER PRIMARY KEY  AUTOINCREMENT,
            label CHAR(45) NOT NULL,
            name CHAR(45) NOT NULL,
            site CHAR(45) NULL,
            email CHAR(45) NULL,
            phone CHAR(45) NULL,
            user CHAR(45) DEFAULT NULL,
            password CHAR(45) DEFAULT NULL,
            version INTEGER NOT NULL DEFAULT '1',
            created_at timestamp NULL DEFAULT NULL,
            updated_at timestamp NULL DEFAULT NULL
        );`);
        },
        (err) => {
            console.log("create error: ", err);
        }
    );
};

export const deleteData = (id:number)=>{
    console.log("delete: ",id)
    db.transaction(tx=>{
        tx.executeSql(`delete from ninepass where id=?`,[id])
    },err=>{
        console.log("delete error: ",err)
    })
}

export const insertData = (data: any) => {
    db.transaction(
        (tx) => {
            tx.executeSql(
                `insert into ninepass (label,name,site,email,phone,user,password,version,created_at,updated_at) values (?,?,?,?,?,?,?,?,?,?)`,
                [
                    data.label,
                    data.name,
                    data.site,
                    data.email,
                    data.phone,
                    data.user,
                    data.password,
                    1,
                    new Date().getTime(),
                    new Date().getTime(),
                ]
            );
        },
        (err) => {
            console.log("insert error: ", err);
        }
    );
};

export const updateData = (data: any) => {
    console.log("update: ", data);
    db.transaction(
        (tx) => {
            tx.executeSql(
                `update ninepass set label=?,name=?,site=?,email=?,phone=?,user=?,password=?,version=?,updated_at=? where id=?`,
                [
                    data.label,
                    data.name,
                    data.site,
                    data.email,
                    data.phone,
                    data.user,
                    data.password,
                    data.version + 1,
                    new Date().getTime(),
                    data.id,
                ]
            );
        },
        (err) => {
            console.log("update error: ", err);
        }
    );
};

export const selectData = (query:string,callback: Function) => {
    let sql = `select * from ninepass`
    if (query){
        sql += ` where label like '%${query}%' or name like '%${query}%'  or user like '%${query}%'`
    }
    db.transaction(
        (tx) => {
            tx.executeSql(
                sql,
                [],
                (_, { rows: { _array } }) => {
                    callback(_array);
                }
            );
        },
        (res) => {
            console.log(res);
        }
    );
};

createTable("ninepass");

export { db };
