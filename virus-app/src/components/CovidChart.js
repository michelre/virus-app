import React from "react";
import { Bar } from 'react-chartjs-2';

export default (props) => {
    console.log(props)
    //0: {province: "France", confirmed: 92839, recovered: 16183, deaths: 8078, active: 68578}
    //1: {province: "French Guiana", confirmed: 61, recovered: 22, deaths: 0, active: 39}
    const data = {
        labels: props.stats[0]?.provinces?.map(p => p.province),
        datasets: [{
            label: 'Deaths',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: props.stats[0]?.provinces?.map(p => p.deaths)
        }]
    }
    console.log(data)
    return <section className="covid-stats">
        <Bar
            width={100}
            height={500}
            options={{
                maintainAspectRatio: false
            }}
            data={data}
        ></Bar>
    </section>
}