
const subscription1 = {
  "id":"/search/issues?q=user:steedos is:issue sort:updated-desc",
  "type":"issue_or_pr",
  "subtype":"ISSUES",
  "params":{ 
    "owners":{ 
      "steedos":{ 
        "value":true
      }
    },
    "subjectType":"Issue"
  },
  "createdAt":"2019-09-20T13:20:48.665Z",
  "updatedAt":"2019-09-20T14:38:48.665Z"
}

const column1 = {
  "id":"column1",
  "type":"issue_or_pr",
  "options":{ 
    "enableAppIconUnreadIndicator":true
  },
  "filters":{ 
    "subjectTypes":{ 
      "Issue":true
    },
    "owners":{ 
      "steedos":{ 
        "value":true
      }
    },
    "clearedAt":"2019-09-23T13:54:26.553Z"
  },
  "subscriptionIds":[ 
    subscription1.id
  ],
  "createdAt":"2019-09-20T13:20:48.664Z",
  "updatedAt":"2019-09-20T14:38:48.664Z"
}

const columns = {}
columns.allIds = [column1.id]
columns.byId = {}
columns.byId[column1.id] = column1
columns.updatedAt = column1.updatedAt

const subscriptions = {}
subscriptions.allIds = [subscription1.id]
subscriptions.byId = {}
subscriptions.byId[subscription1.id] = subscription1
subscriptions.updatedAt = subscription1.updatedAt

const github = { 
  "app":{ 
    "scope":[ 

    ],
    "token":"3f0d696566493d18ee2c591538f862a779db4a42",
    "tokenType":"bearer",
    "tokenCreatedAt":"2019-09-21T10:55:32.406Z"
  },
  "oauth":{ 
    "scope":[ 
      "notifications",
      "user:email"
    ],
    "token":"fbb4fe2abad39ac4cc9231abbb9960ff4f38efff",
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

export const me = {
  _id: "5d84bc3de4bc290017d94b57",
  columns: columns,
  subscriptions: subscriptions,
  github: github,
  plan: plan,
  createdAt: "2019-09-20T11:47:09.644Z",
  updatedAt: "2019-09-24T06:37:44.974Z",
  lastLoginAt: "2019-09-24T05:37:44.937Z"
}

export const login = {
  appToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDg0YmMzZGU0YmMyOTAwMTdkOTRiNTciLCJnaXRodWJMb2dpbiI6InN0ZWVkb3MtcHJpdmF0ZSIsImFwcCI6eyJzY29wZSI6W10sInRva2VuIjoiM2YwZDY5NjU2NjQ5M2QxOGVlMmM1OTE1MzhmODYyYTc3OWRiNGE0MiIsInRva2VuQ3JlYXRlZEF0IjoiMjAxOS0wOS0yMVQxMDo1NTozMi40MDZaIiwidG9rZW5UeXBlIjoiYmVhcmVyIiwibG9naW4iOiJzdGVlZG9zLWFwcHMifSwib2F1dGgiOnsic2NvcGUiOlsibm90aWZpY2F0aW9ucyIsInVzZXI6ZW1haWwiXSwidG9rZW4iOiJmYmI0ZmUyYWJhZDM5YWM0Y2M5MjMxYWJiYjk5NjBmZjRmMzhlZmZmIiwidG9rZW5DcmVhdGVkQXQiOiIyMDE5LTA5LTIxVDEwOjU1OjMzLjc5NloiLCJ0b2tlblR5cGUiOiJiZWFyZXIiLCJsb2dpbiI6InN0ZWVkb3MtYXBwcyJ9LCJpYXQiOjE1NjkzMDM0NjUsImV4cCI6MTU3MTg5NTQ2NX0.DzvNn_hJOZrdnJhT__QShpXl2JADYg-1IUp2YthQWxw",
  user: me
}

