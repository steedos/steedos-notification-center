import * as _ from 'lodash';

let appToken = "appToken"

export const setToken = (token) => {
  appToken = token;
} 

const subscriptionItems = [{
  "columnId": "contracts",
  "id":"/search/contracts?q=user:steedos is:issue sort:updated-desc",
  "type":"steedos_object",
  "subtype":"contracts",
  "objectLabel": "合同",
  "createdAt":"2019-09-20T13:20:48.665Z",
  "updatedAt":new Date().toISOString(),
  "serverUrl": process.env.STEEDOS_URL
}, {
  "columnId": "accounts",
  "id":"/search/accounts?q=user:steedos is:issue sort:updated-desc",
  "type":"steedos_object",
  "subtype":"accounts",
  "objectLabel": "单位",
  "createdAt":"2019-09-20T13:20:48.665Z",
  "updatedAt":"2019-09-20T14:38:48.665Z",
  "serverUrl": process.env.STEEDOS_URL
}, {
  "columnId": "contacts",
  "id":"/search/contacts?q=user:steedos is:issue sort:updated-desc",
  "type":"steedos_object",
  "subtype":"contacts",
  "objectLabel": "联系人",
  "createdAt":"2019-09-20T13:20:48.665Z",
  "updatedAt":"2019-09-20T14:38:48.665Z",
  "serverUrl": process.env.STEEDOS_URL
}, {
  "columnId": "instances",
  "id":"/search/instances?q=user:steedos is:issue sort:updated-desc",
  "type":"steedos_object",
  "subtype":"instances",
  "objectLabel": "审批",
  "createdAt":"2019-09-20T13:20:48.665Z",
  "updatedAt":"2019-09-20T14:38:48.665Z",
  "serverUrl": process.env.STEEDOS_URL
}]

const columns = {
  allIds: _.map(subscriptionItems, 'columnId'),
  byId: {},
  updatedAt: subscriptionItems[0].updatedAt
}
const subscriptions = {
  allIds: _.map(subscriptionItems, 'id'),
  byId: {},
  updatedAt: subscriptionItems[0].updatedAt
}

_.each(subscriptionItems, (sub)=>{
  const column = {
    "id": sub.columnId,
    "type": sub.type,
    "objectName": sub.columnId,
    "objectLabel": sub.objectLabel,
    "options":{ 
      "enableAppIconUnreadIndicator":true
    },
    "filters":{ 
      "clearedAt":"2019-09-23T13:54:26.553Z"
    },
    "subscriptionIds":[ 
      sub.id
    ],
    "createdAt": sub.createdAt,
    "updatedAt": sub.updatedAt,
  }
  columns.byId[sub.columnId] = column
  subscriptions.byId[sub.id] = sub
})

const github = () => { 
  return {
    "app":{ 
      "scope":[ 
  
      ],
      "token": appToken,
      "tokenType":"bearer",
      "tokenCreatedAt":"2019-09-21T10:55:32.406Z"
    },
    "oauth":{ 
      "scope":[ 
        "notifications",
        "user:email"
      ],
      "token": appToken,
      "tokenType":"bearer",
      "tokenCreatedAt":"2019-09-21T10:55:33.796Z"
    },
    "user":{ 
      "id":"55586035",
      "nodeId":"MDQ6VXNlcjU1NTg2MDM1",
      "login":"steedos-private",
      "name":"Jack Zhuang",
      "avatarUrl":"https://avatars3.githubusercontent.com/u/55586035?v=4"
    }
  }
}

export const plan = { 
  "id":"5d88053df1881ef99be58133",
  "source":"none",
  "amount":0,
  "currency":"usd",
  "trialPeriodDays":0,
  "interval":null,
  "intervalCount":1,
  "status":"active",
  "startAt":"2019-09-20T11:47:09.644Z",
  "cancelAt":null,
  "cancelAtPeriodEnd":false,
  "trialStartAt":null,
  "trialEndAt":null,
  "currentPeriodStartAt":"2019-09-20T11:47:09.644Z",
  "currentPeriodEndAt":null,
  "reason":null,
  "featureFlags":{ 
    "columnsLimit":6,
    "enableFilters":true,
    "enableSync":false,
    "enablePrivateRepositories":false,
    "enablePushNotifications":false
  },
  "createdAt":"2019-09-20T11:47:09.644Z",
  "updatedAt":"2019-09-20T11:47:09.644Z"
}

export const me = () => {
  return {
    _id: "5d84bc3de4bc290017d94b57",
    columns: columns,
    subscriptions: subscriptions,
    github: github(),
    plan: plan,
    createdAt: "2019-09-20T11:47:09.644Z",
    updatedAt: "2019-09-24T06:37:44.974Z",
    lastLoginAt: "2019-09-24T05:37:44.937Z"
  }
}

export const login = () => {
  return {
    appToken: appToken,
    user: me()
  }
}

