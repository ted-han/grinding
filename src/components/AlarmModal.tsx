import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  StyleSheet,
  Alert,
  View,
  Pressable,
  SafeAreaView,
  Text,
  Keyboard,
  TextInput,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {setStorageData, addSection, addName, getSelectHtml} from '../utils';

interface AlarmModal {
  selectedGame: string;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  mainData: any;
  setMainData: (mainData: any) => void;
}

const AlarmModal = ({
  selectedGame = '',
  isVisible,
  setIsVisible,
  mainData,
  setMainData,
}: AlarmModal) => {
  const inRef = useRef(0);
  const outRef = useRef(0);
  const [isKeyboard, setIsKeyboard] = useState(false);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [day, setDay] = useState('00');
  const [hour, setHour] = useState('00');
  const [min, setMin] = useState('00');

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboard(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onClose = () => {
    setCategory('');
    setName('');
    setDay('00');
    setHour('00');
    setMin('00');
    setIsVisible(!isVisible);
  };

  const onSubmit = async () => {
    if (!category.trim() && !selectedGame) {
      Alert.alert('게임이름을 입력해주세요');
      return;
    }
    if (!name.trim()) {
      Alert.alert('name 입력해주세요');
      return;
    }
    if (day === '00' && hour === '00' && min === '00') {
      Alert.alert('시간을 입력해주세요');
      return;
    }
    const inputData = {
      existingData: mainData,
      game: category || selectedGame,
      name: name,
      day: parseInt(day, 10),
      hour: parseInt(hour, 10),
      min: parseInt(min, 10),
    };

    if (selectedGame) {
      const newData = await addName(inputData);
      setStorageData(newData);
      setMainData(newData);
    } else {
      const newData = await addSection(inputData);
      setStorageData(newData);
      setMainData(newData);
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      transparent={true}
      onRequestClose={() => {
        // 안드로이드 뒤로가기
        Alert.alert('Modal has been closed.');
        onClose();
      }}>
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.backgroundBox}>
          <Pressable style={styles.pressable} onPress={onClose} />
        </View>
        <View style={styles.contentBox}>
          <Pressable style={[]} onPress={onClose}>
            <Text style={styles.textStyle}>X</Text>
          </Pressable>
          <Pressable
            style={[styles.pressable]}
            onPress={() => Keyboard.dismiss()}
            onPressIn={e => {
              inRef.current = e.nativeEvent.pageY;
            }}
            onPressOut={e => {
              outRef.current = e.nativeEvent.pageY;
              if (outRef.current - inRef.current > 50 && !isKeyboard) {
                onClose();
              }
            }}>
            {selectedGame ? (
              <Text>{selectedGame}</Text>
            ) : (
              <TextInput
                style={styles.textInput}
                onChangeText={setCategory}
                value={category}
                placeholder="게임 이름"
              />
            )}
            <TextInput
              style={styles.textInput}
              onChangeText={setName}
              value={name}
              placeholder="알림 이름"
            />
            <View style={styles.timeSelectBox}>
              <View style={styles.timeSelect}>
                <Text style={styles.time}>{day} 일</Text>
                <WebView
                  style={styles.webView}
                  source={{html: getSelectHtml(50)}}
                  onMessage={event => {
                    setDay(event.nativeEvent.data);
                  }}
                />
              </View>
              <View style={styles.timeSelect}>
                <Text style={styles.time}>{hour} 시간</Text>
                <WebView
                  style={styles.webView}
                  source={{html: getSelectHtml(24)}}
                  onMessage={event => {
                    setHour(event.nativeEvent.data);
                  }}
                />
              </View>
              <View style={styles.timeSelect}>
                <Text style={styles.time}>{min} 분</Text>
                <WebView
                  style={styles.webView}
                  source={{html: getSelectHtml(60)}}
                  onMessage={event => {
                    setMin(event.nativeEvent.data);
                  }}
                />
              </View>
            </View>
          </Pressable>
        </View>
        <Pressable onPress={onSubmit}>
          <Text style={styles.submit}>등록</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centeredView: {
    flex: 1,
  },
  backgroundBox: {
    backgroundColor: 'white',
    opacity: 0.5,
    height: 20,
  },
  pressable: {
    flex: 1,
  },
  contentBox: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopColor: 'gray',
    borderStyle: 'solid',
    borderTopWidth: 1,
  },
  textStyle: {
    textAlign: 'right',
    fontSize: 20,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  timeSelectBox: {
    padding: 20,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timeSelect: {
    width: 80,
    height: 40,
    textAlign: 'center',
  },
  time: {
    width: '100%',
    position: 'absolute',
    top: 4,
    fontSize: 20,
    textAlign: 'center',
  },
  webView: {
    opacity: 0,
  },

  submit: {
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'orange',
  },
});

export default AlarmModal;
