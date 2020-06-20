import React from 'react';
import api from '../Api'
import CovidKpis from "../components/CovidKpis";
import CovidChart from "../components/CovidChart";

class Covid19 extends React.Component {
    constructor() {
        super();
        this.state = {
            countries: [],
            stats: {},
            countryCode: 'fr',
            date: '2020-06-18'
        }
    }

    async init(){
        if (this.props.user) {
            const countries = await api.fetchAllCountries()
            this.setState({countries})

            setTimeout(async () => {
                const stats = await api.getDailyByCountry('?country=' + this.state.countryCode + '&date=' + this.state.date)
                this.setState({stats})
            }, 2000)
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps?.user?.id !== this.props?.user?.id){
            this.init()
        }
    }

    async changeCountry(e){
        const countryCode = e.target.value.toLowerCase()
        const stats = await api.getDailyByCountry('?country=' + countryCode + '&date=' + this.state.date)
        this.setState({countryCode, stats})
    }

    render() {
        if (!this.props.user) {
            return <section>
                <h2>COVID-19</h2>
                <p>
                    Vous devez être connecté pour pouvoir accéder aux chiffres
                </p>
            </section>
        }

        return <section>
            <h2>COVID-19</h2>
            <select
                onChange={(e) => this.changeCountry(e)}
                value={this.state.countryCode}
            >
                {this.state.countries.map((c) => <option
                    key={c.name}
                    value={c.alpha2code?.toLowerCase()}
                >{c.name}</option>)}
            </select>
            <div className="covid-main">
                <CovidChart stats={this.state.stats}/>
                <CovidKpis
                    nbCountries={this.state.countries?.length}
                    stats={this.state.stats}
                />
            </div>

        </section>
    }
}

export default Covid19