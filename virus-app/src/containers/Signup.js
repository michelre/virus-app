import React, {useState} from 'react';
import api from '../Api'

const Confirm = ({success}) => {
    if(success === null){
        return null
    }
    if(success === true){
        return <div className="alert alert-success" role="alert">
            Un email vient de vous être envoyé pour confirmer votre email
        </div>
    }
    return <div className="alert alert-danger" role="alert">
        Une erreur s'est produite
    </div>
}

export default (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(null)

    const signup = (e) => {
        e.preventDefault()
        api.signup({email, password})
            .then((data) => {
                props.signSuccess()
                setError('')
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(null)
                }, 2000);
            }, () => {
                setError('Une erreur s\'est produite')
            })
    }

    return <section>
        <Confirm success={success} />
        <div className={'container w-50'}>
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
        </div>
    </section>
}
