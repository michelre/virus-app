import React, {useEffect, useState} from 'react'
import api from '../Api'
import Tabs from "../components/Tabs";
import logoVirus from "../logo-virus.svg";

const CovidClassificationLine = ({country, value}) => <tr>
    <td>{country}</td>
    <td>{value}</td>
</tr>

const CovidClassificationContent = ({latest, loading, user}) => {
    if (loading) {
        return <img src={logoVirus} className="App-logo m-auto d-block" alt="Logo"/>
    }

    if (!latest) {
        return null;
    }

    return <div>
        <table className='table table-stripped'>
            <thead>
            <tr>
                <th>Pays</th>
                <th>Nombre de cas</th>
            </tr>
            </thead>
            <tbody>
            {latest.map((data) => <CovidClassificationLine key={data.country} {...data} />)}
            </tbody>
        </table>
    </div>
}

const CovidClassificationFilter = ({onChange}) => {
    return <select
        className={'form-control w-50 mr-0 ml-auto mt-2 mb-4'}
        onChange={e => onChange(e.target.value)}
    >
        <option value={'deaths'}>Nombre de morts</option>
        <option value={'recovered'}>Nombre de guérisons</option>
        <option value={'confirmed'}>Nombre de infectés</option>
        <option value={'critical'}>Nombre de nouveaux cas</option>

    </select>
}


const CovidClassification = ({user}) => {

    const [latest, setLatest] = useState(null);
    const [type] = useState('deaths')
    const [loading, setLoading] = useState(false);

    const onChange = async (v) => {
        setLatest(null)
        setLoading(true);
        const data = await api.getLatestAllCountries(v);
        setLatest(data);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true)
        api.getLatestAllCountries(type).then((data) => {
            setLatest(data)
            setLoading(false)
        })
    }, [type])

    if (!user) {
        return <div className={'container'}>
            <p>Vous devez être connecté pour pouvoir accéder aux chiffres</p>
        </div>
    }

    return <div className={'container'}>
        {<Tabs />}
        {<CovidClassificationFilter onChange={onChange}/>}
        {<CovidClassificationContent latest={latest} loading={loading}/>}
    </div>
}

export default CovidClassification;
