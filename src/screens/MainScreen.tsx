import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Switch,
  Pressable,
} from 'react-native';
import Header from '../components/Header';
import AlarmModal from '../components/AlarmModal';

const DATA = [
  {
    id: 1,
    gameName: 'ESO',
    alarms: [
      {
        name: 'horse',
        time: 777600000, // 9d
        endDateTime: 1671840000000, //'2022-12-24T09:00:00'
        isDone: false,
      },
      {
        name: 'research',
        time: 691200000, // 8d
        endDateTime: 1671608400000, //'2022-12-21T16:40:00'
        isDone: false,
      },
      {
        name: 'cotton',
        time: 108000000, // 30h
        endDateTime: 1671172857000, //2022-12-16T15:40:57
        isDone: false,
      },
    ],
  },
  {
    id: 2,
    gameName: 'Black Desert',
    alarms: [
      {
        name: 'cooking',
        time: 23400000, // 6h 30m
        endDateTime: 1671161400000, // 2022-12-16T12:30:00
        isDone: false,
      },
    ],
  },
];

const getDateFromMs = (milliSecond: number) => {
  let ms = milliSecond;
  const day = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms = ms - day * 1000 * 60 * 60 * 24;
  const hour = Math.floor(ms / (1000 * 60 * 60));
  ms = ms - hour * 1000 * 60 * 60;
  const min = Math.floor(ms / (1000 * 60));

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
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [category, setCategory] = useState('');

  const onPressModal = (text: string) => {
    setCategory(text);
    setIsVisible(true);
  };

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        {DATA.map(v => (
          <View key={v.id} style={styles.wrapper}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>{v.gameName}</Text>
              <Pressable onPress={() => onPressModal(v.gameName)}>
                <Text>+</Text>
              </Pressable>
            </View>
            {v.alarms.map((alarm, i) => {
              const {per, entireTime, remainingTime} = getDiffTime(
                alarm.endDateTime,
                alarm.time,
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
          <View style={styles.newGame}>
            <Text>new+</Text>
          </View>
        </Pressable>
      </ScrollView>
      <AlarmModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        existingCategory={category}
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
  newGame: {
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    margin: 24,
  },
  manageData: {
    flexDirection: 'row',
  },
});

export default MainScreen;
