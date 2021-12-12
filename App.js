import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import { theme } from './colors';

const STORAGE_KEY = '@todos';
const LAST_MENU = '@menu';

export default function App() {
  useEffect(() => {
    loadLastMenu();
    loadToDos();
  }, []);

  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  const travel = () => {
    AsyncStorage.setItem(LAST_MENU, JSON.stringify('travel'));
    setWorking(false);
  };
  const work = () => {
    AsyncStorage.setItem(LAST_MENU, JSON.stringify('work'));
    setWorking(true);
  };
  const onChangeText = (payload) => {
    setText(payload);
  };

  const loadLastMenu = async () => {
    const getLastMenu = await AsyncStorage.getItem(LAST_MENU);
    JSON.parse(getLastMenu) === 'work' ? setWorking(true) : setWorking(false);
  };

  // Todo Part
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        setToDos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addTodo = async () => {
    if (text === '') {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };
  const deleteToDo = async (key) => {
    Alert.alert('삭제', '정말 삭제하시나요?', [
      { text: '취소' },
      {
        text: '확인',
        style: 'destructive',
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? theme.white : theme.gray }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: working ? theme.gray : theme.white }}>
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          returnKeyType={'done'}
          placeholder={working ? '할일 추가' : '어디를 가고 싶나요?'}
          value={text}
          style={styles.input}
        />
        <ScrollView>
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={24} color={theme.gray} />
                </TouchableOpacity>
              </View>
            ) : null,
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 40,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 15,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toDoText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
