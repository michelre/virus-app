import React, {useState} from 'react';
import api from '../Api'
import {
    useHistory
} from 'react-router-dom'

export default (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const history = useHistory()

    const signin = (e) => {
        e.preventDefault()
        api.signin({email, password})
            .then((data) => {
                localStorage.setItem('token-virus', data.token)
                setError('')
                props.signSuccess()
                history.push('/')
            }, () => {
                setError('Merci de vérifier vos identifiants')
            })
    }

    return <section className="connexion">
        <h2>Me connecter</h2>
        <form onSubmit={(e) => signin(e)}>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <div>
                    <input
                        id="email"
                        placeholder="Email"
                        className="form-control"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div>
                    <input
                        id="password"
                        placeholder="Password"
                        className="form-control"
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <p className="text-danger">{error}</p>

            <button className="btn btn-primary" type="submit">Me connecter</button>
        </form>
    </section>
}