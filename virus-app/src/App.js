import React from 'react';
import logo from './logo.svg';
import './App.css';
import api from './Api'
import Covid19 from "./containers/Covid19";
import Password from "./containers/Password";
import Signin from './containers/Signin'
import Signup from './containers/Signup'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import CovidClassification from "./containers/CovidClassification";
import "react-router-tabs/styles/react-router-tabs.css";
import PasswordForgot from "./containers/PasswordForgot";

const Subscription = (props) => {
    if (!props.user?.id) {
        return <div className={'d-flex align-items-center flex-shrink-0'}>
            <Link to="/signin" className={'mr-2'}>Me connecter</Link>
            <Link to="/signup">M'inscrire</Link>
        </div>
    }
    return <div className={'d-flex align-items-center flex-shrink-0'}>
        <p className={'mb-0 mr-2'}>{props.user.email}</p>
        <div>
            <button className="btn btn-primary" onClick={() => props.loggout()}>Me déconnecter</button>
        </div>
    </div>
}

class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            user: null,
        }
    }

    componentDidMount() {
        api.getUser().then((user) => {
            this.setState({user})
        }, () => {
            this.setState({user: null})
        })
    }

    loggout(){
        localStorage.setItem('token-virus', null)
        this.setState({user: null})
    }

    signSuccess(){
        api.getUser().then((user) => {
            this.setState({user})
        }, () => {
            this.setState({user: null})
        })
    }

    render() {
        return (
            <Router className="App">
                <header className="header py-2">
                    <div className="container d-flex align-items-center justify-content-between">
                        <Link to={'/'}>
                            <img src={logo} className="App-logo" alt="Logo"/>
                        </Link>
                        <div className="action">
                            <Subscription
                                user={this.state.user}
                                loggout={() => this.loggout()}
                            />
                        </div>
                    </div>
                </header>
                <Switch>
                    <Route path="/signin">
                        <Signin
                            signSuccess={() => this.signSuccess()}
                        />
                    </Route>
                    <Route path="/signup">
                        <Signup
                            signSuccess={() => this.signSuccess()}
                        />
                    </Route>
                    <Route path="/forgot-password">
                        <PasswordForgot />
                    </Route>
                    <Route path="/password">
                        <Password
                            user={this.state.user}
                        />
                    </Route>

                    <Route path="/classification">
                        <CovidClassification user={this.state.user}/>
                    </Route>
                    <Route path="/" exact>
                        <Covid19 user={this.state.user} />
                    </Route>
                </Switch>
            </Router>
        );
    }

}

export default App;
