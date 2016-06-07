import React from 'react';
import AppBar from 'material-ui/AppBar';
import {appTitle} from '../strings/strings';
import MyAppRightIcons from './myAppRightIcons';
import MyMainPageTab from './myMainPageTab';


const styles = {
    appBarStyle: {
        position: 'fixed',
        opacity: 0.65
    }
};


export default class MyAppBar extends React.Component {
    render() {
        return (
            <AppBar style={styles.appBarStyle}
                title={appTitle}
                iconElementRight={<MyAppRightIcons />}
            />
        );
    }
}

