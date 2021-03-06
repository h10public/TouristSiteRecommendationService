import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyAppBar from './components/myAppBar';
import {appBarHeight} from '../dimensions/dimensions';
import MyAppBody from './components/myAppBody';
import {stringEn} from '../strings/strings';
import {stringKo} from '../strings/strings_korean';

injectTapEventPlugin();


const muiTheme = getMuiTheme({
    appBar: {
        height: appBarHeight
    }
});

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: {
                user: JSON.parse(window.sessionStorage.user),
                query: null,
                bodyPage: "my page",
                place: null,
                strings: stringEn,
                english: false
            }
        };

        this.changeAppLanguage = this.changeAppLanguage.bind(this);
        this.updateSessionStorage = this.updateSessionStorage.bind(this);
        this.handlePlaceClick = this.handlePlaceClick.bind(this);
        this.handlePlaceLike = this.handlePlaceLike.bind(this);
        this.handleReviewSubmit = this.handleReviewSubmit.bind(this);
        this.handleProfileEditSubmit = this.handleProfileEditSubmit.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    changeAppLanguage() {
        if (this.state.info.english) {
            this.state.info.strings = stringEn;
            this.state.info.english = false;
        } else {
            this.state.info.strings = stringKo;
            this.state.info.english = true;
        }

        this.setState(this.state);
    }

    updateSessionStorage() {
        window.sessionStorage.user = JSON.stringify(this.state.info.user);
    }

    handlePlaceClick(place) {
        this.state.info.bodyPage = "place page";

        this.state.info.place = place;
        this.setState(this.state);
    }

    handleBackButtonClick() {
        this.state.info.bodyPage = "my page";
        this.setState(this.state);
    }

    handlePlaceLike() {
        // This method is same as that of main.js. Copy it once it is implemented.

        var duplicate =
            this.state.info.user.likedPlaces
                .map(
                    function(e) {
                        return e.cid == this.state.info.place.cid;
                    }.bind(this))
                .reduce(
                    function(p, c) {
                        return p || c;
                    }.bind(this)
                );

        if (!duplicate) {
            /* Routine */

            this.state.info.user.likedPlaces.unshift(this.state.info.place);
            this.updateSessionStorage();

            console.log("Place liked!");
        } else {
            console.log("Duplicate entry.");
        }
    }

    handleReviewSubmit(review) {
        // This method is same as that of main.js. Copy it once it is implemented.

        this.state.info.user.reviews.unshift(review);
        this.state.info.place.reviews.unshift(review);
        this.updateSessionStorage();

        console.log("Review submitted!");
    }

    handleProfileEditSubmit(profileInfo) {
        /*
         Take a profileInfo (json object) as the argument and update the user info:

         @param profileInfo:
         {
         nickname: string,
         age: string,
         gender: string,
         nationality: string
         }
         */

        /* TODO: Routine for updating user information in the server goes here */
        var success = 0;
        $.ajax({
            url: "/api/usermodify?uid=" + window.sessionStorage.uid +
            "&age=" + profileInfo.age +
            "&sex=" + profileInfo.gender +
            "&nationality=" + profileInfo.nationality +
            "&nickname=" + profileInfo.nickname +
            "&travStyle=alone",
            type: 'get',
            cache: false,
            async: false,
            success: function(data) {
                if (data.result == 1) {
                    success = 1;
                    console.log("Profile Edited!");
                }
            }.bind(this),
            error: function(request, status, error) {
                console.error(error);
            }.bind(this)
        });

        if (success) {
            this.state.info.user.nickname = profileInfo.nickname;
            this.state.info.user.age = profileInfo.age;
            this.state.info.user.gender = profileInfo.gender;
            this.state.info.user.nationality = profileInfo.nationality;
            this.updateSessionStorage();
        }
    }

    render() {
        const appBarHandlers = {
            handleBackButtonClick: this.handleBackButtonClick,
            changeAppLanguage: this.changeAppLanguage
        };

        const bodyHandlers = {
            handlePlaceClick: this.handlePlaceClick,
            handlePlaceLike: this.handlePlaceLike,
            handleProfileEditSubmit: this.handleProfileEditSubmit,
            handleReviewSubmit: this.handleReviewSubmit,
            handleBackButtonClick: this.handleBackButtonClick,
        };

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div >
                    <MyAppBar
                        info={this.state.info}
                        handlers={appBarHandlers}
                    />
                    <MyAppBody
                        info={this.state.info}
                        handlers={bodyHandlers}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('app')
);













