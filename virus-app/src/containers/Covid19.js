import React, {useEffect, useState} from 'react';
import api from '../Api'
import CovidKpis from "../components/CovidKpis";
import CovidChart from "../components/CovidChart";
import logoVirus from "../logo-virus.svg";
import Tabs from "../components/Tabs";

const Covid19Content = ({loading, countryCode, countries, stats, user, changeCountry}) => {

    if (loading) {
        return <img src={logoVirus} className="App-logo m-auto d-block" alt="Logo"/>
    }

    return <div>
        <div className="d-flex">
            <select
                className="mr-0 ml-auto mt-2 mb-2 w-50 form-control"
                onChange={(e) => changeCountry(e)}
                value={countryCode}
            >
                {countries.map((c) => <option
                    key={c.name}
                    value={c.alpha2code?.toLowerCase()}
                >{c.name}</option>)}
            </select>
        </div>
        <div className="covid-main">
            <CovidChart stats={stats}/>
            <CovidKpis
                nbCountries={countries?.length}
                stats={stats}
            />
        </div>
    </div>


}


const Covid19 = ({user}) => {

    const [countries, setCountries] = useState([]);
    const [stats, setStats] = useState({});
    const [countryCode, setCountryCode] = useState('fr');
    const [date] = useState('2020-06-27');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.fetchAllCountries().then((data) => {
            setCountries(data)
        })

        setTimeout(async () => {
            const stats = await api.getDailyByCountry('?country=' + countryCode + '&date=' + date)
            setStats(stats)
            setLoading(false);
        }, 2000)
    }, [countryCode, date])

    const changeCountry = async (e) => {
        setLoading(true);
        const countryCode = e.target.value.toLowerCase()
        const stats = await api.getDailyByCountry('?country=' + countryCode + '&date=' + date)
        setCountryCode(countryCode)
        setStats(stats)
        setLoading(false);
    }

    if (!user) {
        return <p>
            Vous devez être connecté pour pouvoir accéder aux chiffres
        </p>
    }

    return <section className="container">
        <Tabs />
        <Covid19Content
            countries={countries}
            countryCode={countryCode}
            loading={loading}
            stats={stats}
            user={user}
            changeCountry={changeCountry}
        />

    </section>
}

export default Covid19
