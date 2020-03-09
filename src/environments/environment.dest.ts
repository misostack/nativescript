export const environment = {
  production: false,
  name: 'ENV_NAME',
  PUSHER: {
    API_KEY: '',
    OPTIONS: {
      cluster: '',
      forceTLS: true		
    },
    GLOBAL_CHANNEL: 'global',
    GLOBAL_EVENTS: ['message', 'notification'],
    DEFAULT_EVENT: 'message'
  },
  debug: true,
  mock: {
    token: '',
    user: '',
    password: ''
  },
  apiURL: 'http://localhost:3000/api',  
};