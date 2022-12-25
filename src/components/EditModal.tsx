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
import {setStorageData, updateNoti, delNoti, getSelectHtml} from '../utils';

interface EditModal {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  mainData: any;
  setMainData: (mainData: any) => void;
  gameIndex: number;
  notiIndex: number;
}

const getDateFromMs = (milliSecond: number) => {
  let ms = milliSecond;
  const day = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms = ms - day * 1000 * 60 * 60 * 24;
  const hour = Math.floor(ms / (1000 * 60 * 60));
  ms = ms - hour * 1000 * 60 * 60;
  const min = Math.ceil(ms / (1000 * 60));

  return {
    d: day,
    h: hour,
    m: min,
  };
};

const EditModal = ({
  isVisible,
  setIsVisible,
  mainData,
  setMainData,
  gameIndex,
  notiIndex,
}: EditModal) => {
  const inRef = useRef(0);
  const outRef = useRef(0);
  const [isKeyboard, setIsKeyboard] = useState(false);
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

  useEffect(() => {
    if (mainData.length === 0) {
      return;
    }
    if (!mainData[gameIndex]?.notis[notiIndex]) {
      return;
    }
    const {d, h, m} = getDateFromMs(
      mainData[gameIndex].notis[notiIndex].duration,
    );

    setName(mainData[gameIndex].notis[notiIndex].name);
    setDay(d.toString().padStart(2, '0'));
    setHour(h.toString().padStart(2, '0'));
    setMin(m.toString().padStart(2, '0'));
  }, [gameIndex, notiIndex, mainData]);

  const onClose = () => {
    setIsVisible(!isVisible);
  };

  const onDelete = () => {
    const inputData = {
      existingData: mainData,
      gameIndex,
      notiIndex,
    };
    const newData = delNoti(inputData);
    setStorageData(newData);
    setMainData(newData);
    onClose();
  };

  const onUpdate = () => {
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
      name: name,
      gameIndex,
      notiIndex,
      day: parseInt(day, 10),
      hour: parseInt(hour, 10),
      min: parseInt(min, 10),
    };

    const newData = updateNoti(inputData);
    setStorageData(newData);
    setMainData(newData);

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
            <Text>{mainData[gameIndex]?.sectionName}</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setName}
              value={name}
              placeholder="name"
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
        <Pressable onPress={onDelete}>
          <Text style={styles.submit}>삭제하기</Text>
        </Pressable>
        <Pressable onPress={onUpdate}>
          <Text style={styles.submit}>수정하기</Text>
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

export default EditModal;
