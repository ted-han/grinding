import AsyncStorage from '@react-native-async-storage/async-storage';

interface InputData {
  existingData: [
    {
      id: number;
      sectionName: string;
      alarms: [
        {
          name: string;
          duration: string;
          endDateTime: number;
        },
      ];
    },
  ];
  sectionName: string;
  name: string;
  day: number;
  hour: number;
  min: number;
}

function setStorageData(value: any) {
  const jsonValue = JSON.stringify(value);
  AsyncStorage.setItem('mainData', jsonValue);
}

function addSection({
  existingData,
  sectionName,
  name,
  day,
  hour,
  min,
}: InputData) {
  const duration =
    day * (1000 * 60 * 60 * 24) + hour * (1000 * 60 * 60) + min * (1000 * 60);
  const res = {
    name: name,
    duration: duration,
    endDateTime: duration + Date.now(),
  };
  const len = existingData.length;
  const lastId = existingData[len - 1]?.id || 0;

  const newData = existingData.concat({
    id: lastId + 1,
    sectionName: sectionName,
    alarms: [res],
  });

  return newData;
}

function addName({existingData, sectionName, name, day, hour, min}: InputData) {
  const duration =
    day * (1000 * 60 * 60 * 24) + hour * (1000 * 60 * 60) + min * (1000 * 60);
  const res = {
    name: name,
    duration: duration,
    endDateTime: duration + Date.now(),
  };

  const newData = existingData.map(v => {
    if (v.sectionName === sectionName) {
      return {
        ...v,
        alarms: v.alarms.concat(res),
      };
    }
    return v;
  });

  return newData;
}

export {setStorageData, addSection, addName};
