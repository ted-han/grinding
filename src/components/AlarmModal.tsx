import React, {useState, useEffect} from 'react';
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
  Dimensions,
} from 'react-native';

interface AlarmModal {
  existingCategory: string;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const AlarmModal = ({
  existingCategory = '',
  isVisible,
  setIsVisible,
}: AlarmModal) => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [min, setMin] = useState('');

  const onClose = () => {
    setCategory('');
    setName('');
    setDay('');
    setHour('');
    setMin('');
    setIsVisible(!isVisible);
  };

  const onSubmit = () => {
    if (!category.trim() && !existingCategory) {
      Alert.alert('category 입력해주세요');
      return;
    }
    if (!name.trim()) {
      Alert.alert('name 입력해주세요');
      return;
    }
    const d = parseInt(day, 10) || 0;
    const h = parseInt(hour, 10) || 0;
    const m = parseInt(min, 10) || 0;
    if (!d && !h && !m) {
      Alert.alert('시간을 입력해주세요');
      return;
    }
    const inputData = {
      gameName: category,
      text: name,
      day: d,
      hour: h,
      min: m,
    };
    console.log(inputData);
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
            onPress={() => Keyboard.dismiss()}>
            {existingCategory ? (
              <Text>{existingCategory}</Text>
            ) : (
              <TextInput
                style={styles.textInput}
                onChangeText={setCategory}
                value={category}
                placeholder="category"
              />
            )}
            <TextInput
              style={styles.textInput}
              onChangeText={setName}
              value={name}
              placeholder="name"
            />
            <View style={styles.timeBox}>
              <TextInput
                style={styles.timeInput}
                onChangeText={setDay}
                value={day}
                placeholder="day"
                keyboardType="number-pad"
              />
              <TextInput
                style={styles.timeInput}
                onChangeText={setHour}
                value={hour}
                placeholder="hour"
                keyboardType="number-pad"
              />
              <TextInput
                style={styles.timeInput}
                onChangeText={setMin}
                value={min}
                placeholder="min"
                keyboardType="number-pad"
                // onSubmitEditing={Keyboard.dismiss}
              />
            </View>
            <Pressable onPress={onSubmit}>
              <Text>submit</Text>
            </Pressable>
          </Pressable>
        </View>
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
    // backgroundColor: 'black',
    // opacity: 0.5,
    height: 20,
  },
  pressable: {
    flex: 1,
  },
  contentBox: {
    backgroundColor: '#fff',
    flex: 1,
    // marginTop: 20,
    borderTopColor: 'gray',
    borderStyle: 'solid',
    borderTopWidth: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {},
  timeBox: {
    flexDirection: 'row',
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  timeInput: {
    width: Dimensions.get('window').width / 4,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AlarmModal;
