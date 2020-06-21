import React from "react";
import { Bar } from 'react-chartjs-2';

export default (props) => {
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
        },
            {
                label: 'Confirmed',
                backgroundColor: 'rgba(99,255,237,0.2)',
                borderColor: 'rgb(99,255,232)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(99,255,237,0.4)',
                hoverBorderColor: 'rgb(99,255,224)',
                data: props.stats[0]?.provinces?.map(p => p.confirmed)
            }]
    }

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