import packageInfo from '../../../../package.json';

interface AppVersionComponentProps {

}

const AppVersionComponent = (props: AppVersionComponentProps) => {

    return (
        <div className="app-version">
            Version {packageInfo.version}
        </div>
    );
};

export default AppVersionComponent;