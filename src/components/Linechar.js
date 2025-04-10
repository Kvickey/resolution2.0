import React from 'react'
import {Line} from 'react-chartjs-2'
import {Chart as chartJS, 
    CategoryScale, 
    LinearScale,
    PointElement, LineElement,Title, Tooltip,Legend

} from 'chart.js'

chartJS.register(CategoryScale, 
    LinearScale,
    PointElement, LineElement,Title, Tooltip,Legend)

export default function LineChar() {

    const options={};
    const data={
        labels:["jan","Feb","Mar","Apr","may","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets:[
            {
                label:" Cases Per Month",
                data:[5000,6000,7000,10000,8000,7000,8000,9000,10000,9000,11000],
                borderColor:"rgb(241,196,15)",
            },
            
        ],
    };

  return (
    <div>
        
       <Line options={options} data={data}/>
    </div>
  )
}
