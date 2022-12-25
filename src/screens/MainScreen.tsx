import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import AlarmModal from '../components/AlarmModal';

const getDateFromMs = (milliSecond: number) => {
  let ms = milliSecond;
  const day = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms = ms - day * 1000 * 60 * 60 * 24;
  const hour = Math.floor(ms / (1000 * 60 * 60));
  ms = ms - hour * 1000 * 60 * 60;
  const min = Math.ceil(ms / (1000 * 60));

  // const remainingTime = day === 0 ? `${hour}h ${min}m` : `${day}d ${hour}h`;
  return `${day}d ${hour}h ${min}m`;
};

const getDiffTime = (endTime: number, entireTime: number) => {
  let diff = endTime - new Date().getTime();
  const per = 100 - Math.ceil((diff / entireTime) * 100);

  return {
    per: per > 100 ? 100 : per,
    entireTime: getDateFromMs(entireTime),
    remainingTime: diff > 1000 ? getDateFromMs(diff) : 0,
  };
};

function MainScreen() {
  const [mainData, setMainData] = useState<any>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [category, setCategory] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('mainData').then(value => {
      setMainData(JSON.parse(value || '[]'));
    });
  }, []);

  const onPressModal = (text: string) => {
    setCategory(text);
    setIsVisible(true);
  };

  console.log(JSON.stringify(mainData));

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        {mainData.map(v => (
          <View key={v.id} style={styles.wrapper}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>{v.sectionName}</Text>
              <Pressable onPress={() => onPressModal(v.sectionName)}>
                <Text>+</Text>
              </Pressable>
            </View>
            {v.alarms.map((alarm, i) => {
              const {per, entireTime, remainingTime} = getDiffTime(
                alarm.endDateTime,
                alarm.duration,
              );
              return (
                <View key={i} style={styles.alarmBox}>
                  <View style={styles.nameBox}>
                    <Text style={styles.name}>
                      {alarm.name}
                      <Text style={styles.entireTime}>({entireTime})</Text>
                    </Text>
                    <Text>re</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <Text style={styles.remainingTime}>
                      {remainingTime || 'done'}
                    </Text>
                    <View style={[styles.progress, {width: `${per}%`}]} />
                  </View>
                </View>
              );
            })}
          </View>
        ))}
        <Pressable onPress={() => onPressModal('')}>
          <View style={styles.newSection}>
            <Text style={{fontSize: 20}}>new+</Text>
          </View>
        </Pressable>
        <View style={styles.manageData}>
          <Pressable
            onPress={() => {
              AsyncStorage.removeItem('mainData').then(() => {
                setMainData([]);
              });
            }}>
            <Text>테스트용: delData</Text>
          </Pressable>
        </View>
      </ScrollView>
      <AlarmModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        existingCategory={category}
        mainData={mainData}
        setMainData={setMainData}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    margin: 24,
    marginBottom: 0,
    padding: 12,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginRight: 4,
  },
  nameBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    marginRight: 4,
  },
  entireTime: {
    fontSize: 14,
  },
  progressBar: {
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  remainingTime: {
    zIndex: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FED049',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  alarmBox: {
    padding: 10,
  },
  newSection: {
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 70,
    margin: 24,
  },
  manageData: {
    flexDirection: 'row',
    padding: 20,
  },
});

export default MainScreen;
