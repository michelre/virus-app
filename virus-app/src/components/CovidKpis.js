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

    return <table className={'table table-bordered'}>
        <thead>
            <tr>
                <th>Nombre de morts</th>
                <th>Nombre de Guérisons</th>
                <th>Nombre d'infections</th>
                <th>Nombre de nouveaux cas</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{totals?.deaths}</td>
                <td>{totals?.recovered}</td>
                <td>{totals?.active}</td>
                <td>{totals?.confirmed}</td>
            </tr>
        </tbody>

    </table>
}
