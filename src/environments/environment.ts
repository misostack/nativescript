import { environment as destEnvironment } from './environment.dest';
import { environment as localEnvironment } from './environment.local';
import { environment as devEnvironment } from './environment.dev';
import { environment as prodEnvironment } from './environment.prod';

interface IEnvironment {
  production: boolean,
  name: string,
  PUSHER: {
    API_KEY: string,
    OPTIONS: {
      cluster: string,
      forceTLS: boolean	
    },
    GLOBAL_CHANNEL: string,
    GLOBAL_EVENTS: Array<string>,
    DEFAULT_EVENT: string
  },
  debug: boolean,
  mock: {
    token: string,
    user: string,
    password: string
  },
  apiURL: string,
  stripe: {
    publishedKey: string
  }
}

export const environment : IEnvironment = (() => {
  let envVars;
  //@ts-ignore
  const APP_ENV = global.APP_ENV
  console.error('appGlobal', global.TNS_WEBPACK, APP_ENV)
  if (
    typeof global !== 'undefined' && global && APP_ENV
  ) {
    switch (APP_ENV) {
      case 'prod':
        envVars = prodEnvironment;
        break;
      case 'dev':
      	envVars = devEnvironment;
      	break;
      case 'local':
      	envVars = localEnvironment;
      	break;      	
      // TODO: Add additional environment (e.g. uat) if required. 
      default:
        envVars = localEnvironment
    }
  } else {
    envVars = localEnvironment
  }

  return envVars;
})();