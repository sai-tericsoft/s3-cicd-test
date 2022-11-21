interface IEnv {
    API_URL: string | undefined;
    ENV_MODE: "dev" | "test" | "uat" | "prod" | string | undefined;
    ENABLE_REDUX_LOGS: boolean;
    ENABLE_HTTP_LOGS: boolean;
}

const ENV: IEnv = {
    API_URL: process.env.REACT_APP_API_URL,
    ENV_MODE: process.env.REACT_APP_ENV,
    ENABLE_REDUX_LOGS: (process.env.REACT_APP_ENABLE_REDUX_LOGS) === 'true',
    ENABLE_HTTP_LOGS: (process.env.REACT_APP_ENABLE_HTTP_LOGS) === 'true',
}

export default ENV;
