
const ENV = {
    API_URL: process.env.REACT_APP_API_URL,
    ENV_MODE: process.env.REACT_APP_ENV,
    ENABLE_REDUX_LOGS: (process.env.REACT_APP_ENABLE_REDUX_LOGS) === 'true',
    ENABLE_HTTP_LOGS: (process.env.REACT_APP_ENABLE_HTTP_LOGS) === 'true',
}

export default ENV;
