import React from "react";
import {
    Link
} from "react-router-dom";

export default (props) => {
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