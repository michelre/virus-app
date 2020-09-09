import React, {useState} from 'react'
import api from '../Api'

const Confirm = ({success}) => {
    if(success === null){
        return null
    }
    if(success === true){
        return <div className="alert alert-success" role="alert">
            Un email vient de vous être envoyé pour réinitialiser votre mot de passe
        </div>
    }
    return <div className="alert alert-danger" role="alert">
        Une erreur s'est produite
    </div>
}

const PasswordForgot = ({user}) => {

    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(null)

    const sendForgotPassword = async (e) => {
        e.preventDefault()
        const success = await api.sendForgotPassword({email})
        setSuccess(success)
        setTimeout(() => {
            setSuccess(null)
        }, 2000);
    }


    return <div>
        <Confirm success={success} />
        <form className="container w-50" onSubmit={sendForgotPassword}>
            <div className="form-group">
                <label htmlFor="email">Votre email</label>
                <input id="email"
                       type="email"
                       className="form-control"
                       value={email}
                       onChange={e => setEmail(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">Valider</button>
        </form>
    </div>
}

export default PasswordForgot;
