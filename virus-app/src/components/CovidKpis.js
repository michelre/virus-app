import React from "react";

export default (props) => {

    const totals = props?.stats[0]?.provinces?.reduce((acc, curr) => {
        return {
            confirmed: acc?.confirmed + curr?.confirmed,
            recovered: acc?.recovered + curr?.recovered,
            deaths: acc?.deaths + curr?.deaths,
            active: acc?.active + curr?.active,

        }
    }, { confirmed: 0, recovered: 0, deaths: 0, active: 0 })


    return <section>
        <h2>{props.nbCountries} pays touchés</h2>
        <ul>
            <li>Nombre de morts: {totals?.deaths}</li>
            <li>Nombre de guérisons: {totals?.recovered}</li>
            <li>Nombre d'infectés: {totals?.active}</li>
            <li>Nombre de nouveaux cas: {totals?.confirmed}</li>
        </ul>
    </section>
}