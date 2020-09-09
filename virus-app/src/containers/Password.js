import React, {useState} from 'react'
import api from '../Api'

const Confirm = ({success}) => {
    if(success === null){
        return null
    }
    if(success === true){
        return <div className="alert alert-success" role="alert">
            Mot de passe modifié avec succès
        </div>
    }
    return <div className="alert alert-danger" role="alert">
        Erreur lors du changement de mot de passe
    </div>
}

const Password = ({user}) => {

    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [success, setSuccess] = useState(null)

    const changePassword = async (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const success = await api.changePassword({newPassword, confirmNewPassword, token})
        setSuccess(success)
        setTimeout(() => {
            setSuccess(null)
        }, 2000);
    }

    return <div>
        <Confirm success={success} />
        <form className="container w-50" onSubmit={changePassword}>
            <div className="form-group">
                <label htmlFor="new">Nouveau mot de passe</label>
                <input id="new"
                       type="password"
                       className="form-control"
                       value={newPassword}
                       onChange={e => setNewPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="new-confirm">Confirmation du nouveau mot de passe</label>
                <input id="new-confirm"
                       type="password"
                       className="form-control"
                       value={confirmNewPassword}
                       onChange={e => setConfirmNewPassword(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className={`btn btn-primary`}
            >Valider</button>
        </form>
    </div>
}

export default Password;
