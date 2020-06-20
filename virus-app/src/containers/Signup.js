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

    const signup = (e) => {
        e.preventDefault()
        api.signup({email, password})
            .then((data) => {
                localStorage.setItem('token-virus', data.token)
                props.signSuccess()
                setError('')
                history.push('/')
            }, () => {
                setError('Une erreur s\'est produite')
            })
    }

    return <section className="connexion">
        <h2>M'inscrire</h2>
        <form onSubmit={(e) => signup(e)}>
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

            <button className="btn btn-primary" type="submit">M'inscrire</button>
        </form>
    </section>
}