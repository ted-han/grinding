import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';

interface InputData {
  existingData: [
    {
      id: number;
      game: string;
      notis: [
        {
          name: string;
          duration: string;
          endDateTime: number;
        },
      ];
    },
  ];
  game: string;
  name: string;
  day: number;
  hour: number;
  min: number;
}

function setStorageData(value: any) {
  const jsonValue = JSON.stringify(value);
  AsyncStorage.setItem('mainData', jsonValue);
}

async function addSection({
  existingData,
  game,
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

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: duration + Date.now(),
  };

  const notiId = await notifee.createTriggerNotification(
    {
      title: 'GRINDING',
      body: `${name} 완료!`,
      android: {
        channelId: 'your-channel-id',
      },
    },
    trigger,
  );

  const newData = existingData.concat({
    id: lastId + 1,
    game: game,
    notis: [{...res, notiId: notiId}],
  });
  return newData;
}

async function addName({existingData, game, name, day, hour, min}: InputData) {
  const duration =
    day * (1000 * 60 * 60 * 24) + hour * (1000 * 60 * 60) + min * (1000 * 60);
  const res = {
    name: name,
    duration: duration,
    endDateTime: duration + Date.now(),
  };

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: duration + Date.now(),
  };

  const notiId = await notifee.createTriggerNotification(
    {
      title: 'GRINDING',
      body: `${name} 완료!`,
      android: {
        channelId: 'your-channel-id',
      },
    },
    trigger,
  );

  const newData = existingData.map(v => {
    if (v.game === game) {
      return {
        ...v,
        notis: v.notis.concat({...res, notiId: notiId}),
      };
    }
    return v;
  });

  return newData;
}

function updateNoti({
  existingData,
  gameIndex,
  notiIndex,
  name,
  day,
  hour,
  min,
}) {
  const duration =
    day * (1000 * 60 * 60 * 24) + hour * (1000 * 60 * 60) + min * (1000 * 60);

  const res = {
    name: name,
    duration: duration,
    endDateTime: duration + Date.now(),
  };

  const newData = existingData.map((v, gameIdx) => {
    if (gameIdx === gameIndex) {
      return {
        ...v,
        notis: v.notis.map((noti, notiIdx) =>
          notiIdx === notiIndex ? res : noti,
        ),
      };
    }
    return v;
  });
  return newData;
}

function delNoti({existingData, gameIndex, notiIndex}) {
  const notiLength = existingData[gameIndex].notis.length;
  if (notiLength === 1) {
    const newData = existingData.filter((v, i) => i !== gameIndex);
    return newData;
  }
  const newData = existingData.map((v, gameIdx) => {
    if (gameIdx === gameIndex) {
      return {
        ...v,
        notis: v.notis.filter((noti, notiIdx) => notiIdx !== notiIndex),
      };
    }
    return v;
  });
  return newData;
}

function restartNoti({existingData, gameIndex, notiIndex}) {
  const {name, duration} = existingData[gameIndex].notis[notiIndex];

  const res = {
    name: name,
    duration: duration,
    endDateTime: duration + Date.now(),
  };

  const newData = existingData.map((v, gameIdx) => {
    if (gameIdx === gameIndex) {
      return {
        ...v,
        notis: v.notis.map((noti, notiIdx) =>
          notiIdx === notiIndex ? res : noti,
        ),
      };
    }
    return v;
  });
  return newData;
}

function getSelectHtml(cnt: number) {
  let text = '';
  for (let i = 0; i < cnt; i++) {
    // 분은 5단위로만 표시
    if (cnt === 60 && i % 5 !== 0) {
      continue;
    }
    text =
      text +
      `<option value="${i}" ${i === 0 ? 'selected' : ''}>${i
        .toString()
        .padStart(2, '0')}</option>`;
  }

  return `
    <html>
      <head>
        <style>
          body {
            background-color: powderblue;
          }
          select {
            width: 220px;
            height: 80px;
            -o-appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            text-align: center;
            font-size: 50px;
          }
        </style>
      </head>
      <body>
        <select name="day" id="day-select" onchange="onChange()">
          ${text}
        </select>
        <script>
          function onChange() {
            const daySelect = document.getElementById('day-select');
            const selectValue = daySelect.options[daySelect.selectedIndex].text;
            window.ReactNativeWebView.postMessage(selectValue);
          }
        </script>
      </body>
    </html>
  `;
}

export {
  setStorageData,
  addSection,
  addName,
  updateNoti,
  delNoti,
  restartNoti,
  getSelectHtml,
};
