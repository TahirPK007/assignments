import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacityComponent,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage'

const db = openDatabase({ name: 'mydb' })
const App = () => {
  useEffect(
    () => {
      createTable()
      fetchuser()
    }, [])
  const [userlist, setuserList] = useState([])
  const [name, setName] = useState('')
  const [id, setId] = useState(0)
  const [buttonTitle, setButtonTitle] = useState('Add')
  const createTable = () => {
    db.transaction(
      txn => {
        txn.executeSql(
          `create Table if not Exists users (id INTEGER PRIMARY KEY AUTOINCREMENT,name varchar(20))`,
          [],
          (sqltxn, res) => {
            console.log('user Table created Successfully..')
          },
          (error) => {
            console, log('Error occured during Table Creation...')
          }
        );
      }
    );
  };
  function fetchuser() {
    console.log('Fetch Wish List Execution Started')
    db.transaction(
      txn => {
        txn.executeSql(
          `Select * from users`,
          [],
          (sqltxn, res) => {
            let len = res.rows.length;
            let resultSet = []
            for (let i = 0; i < len; i++) {
              let record = res.rows.item(i)
              resultSet.push({ id: record.id, name: record.name })
            }
            setuserList(resultSet)
          },
          (error) => {
            console, log('Error occured during Fetching user...')
          }
        );
      }
    );
  }
  function updateWish() {
    db.transaction(
      txn => {
        txn.executeSql(
          `update users set name=? where id=? `,
          [name,id],
          (sqltxn, res) => {
            Alert.alert("Success", "details Updated Successfully..")
            setId(0)
            setName('')
            setButtonTitle('Add')
            fetchuser()
          },
          (error) => {
            console, log('Error occured during Adding WishList...')
          }
        );
      }
    );
  }
  function adduser() {
    console.log('Execution Started...', name)
    db.transaction(
      txn => {
        txn.executeSql(
          `insert into users(name) values(?) `,
          [name],
          (sqltxn, res) => {
            console.log(name)
            console.log(res)
            setId(0)
            setName('')
            fetchuser()
          },
          (error) => {
            console, log('Error occured during Adding WishList...')
          }
        );
      }
    );
  }
  function saveuser() {
    if (!name) {
      Alert.alert('Warning', 'Enter Wish List')
      return false
    }
    if (buttonTitle === 'Add') {
      adduser()
      fetchuser()
    }
    else {
      updateWish()
    }
  }
  function editWish({ item }) {
    console.log("edit item name", item.name)
    console.log("edit item id", item.id)
    setId(item.id)
    setName(item.name)
    setButtonTitle('Update user')
  }
  function deleteuser(id) {
    db.transaction(
      txn => {
        txn.executeSql(
          `delete from users where id=?`,
          [id],
          (sqltxn, res) => {
            fetchuser()
          },
          (error) => {
            Alert.alert('Error', 'Error occured during Wish Deletion...')
          }
        );
      }
    );
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 16 }}> enter user details</Text>
      <TextInput placeholder='Enter user' value={name}
        onChangeText={value => setName(value)}
      />
      <Button title={buttonTitle} onPress={saveuser} />
      <Text style={{ fontSize: 20, fontFamily: 'arial' }} >
        UserList Details
      </Text>
      <FlatList
        data={userlist}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
        (
          <View style={{ backgroundColor: 'yellow', height: 50, margin: 10 }}>
            <TouchableOpacity onPress={() => deleteuser(item.id)}>
              <Text style={{ color: 'black', fontSize: 17 }}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editWish({ item })}>
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>
        )
        }
      />
    </View>
  )
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})