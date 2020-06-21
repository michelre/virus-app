import React from 'react';
import logo from './logo.svg';
import './App.css';
import api from './Api'
import Covid19 from "./containers/Covid19";
import Signin from './containers/Signin'
import Signup from './containers/Signup'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const Subscription = (props) => {
    if (!props.user?.id) {
        return <div>
            <Link to="/signin" className="d-block w-100">Me connecter</Link>
            <Link to="/signup" className="d-block w-100 text-center">M'inscrire</Link>
        </div>
    }
    return <div>
        <p>{props.user.email}</p>,
        <button className="btn btn-primary" onClick={() => props.loggout()}>Me déconnecter</button>
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
                <header className="header">
                    <img src={logo} className="App-logo" alt="Logo"/>
                    <div className="action">
                        <Subscription
                            user={this.state.user}
                            loggout={() => this.loggout()}
                        />
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
                    <Route path="/">
                        <Covid19
                            user={this.state.user}
                        />
                    </Route>
                </Switch>
            </Router>
        );
    }

}

export default App;
