import { useState } from 'react'
import { ScatterChart } from '@mui/x-charts/ScatterChart';
// import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';
import Box from '@mui/material/Box';
import { useScatterSeries, useXScale, useYScale } from '@mui/x-charts/hooks';
import './GraphsPage.css'

const GraphsPage = ({mainData, crossData, closeCircles, fullEight, targetPoint}) => {
    const series = [ 
        { id: 's1', data: mainData, label: 'Track', markerSize: 2}, 
        {id: 's2', data: [{x: targetPoint[0], y: targetPoint[1], id: 0}], label: "Target", markerSize: 4}, 
        // {id: 's3', data: [
        //     {x: targetPoint[0]*0.99991, y: targetPoint[1]*0.99990, id: 300000},
        //     {x: targetPoint[0]*0.99991, y: targetPoint[1]*1.00011, id: 400000},
        //     {x: targetPoint[0]*1.00009, y: targetPoint[1]*1.00011, id: 500000},
        //     {x: targetPoint[0]*1.00009, y: targetPoint[1]*0.99990, id: 600000}
        //     // {x: targetPoint[0]*0.9999995, y: targetPoint[1]*0.999999, id: 30<PASSWORD>},
        //     // {x: targetPoint[<PASSWORD>], y: targetPoint[1]*1.00<PASSWORD>, id: 4<PASSWORD>},
        //     // {x: targetPoint[0]*1.0000005, y: targetPoint[1]*1.000001, id: 500000},
        //     // {x: targetPoint[0]*1.0000005, y: targetPoint[1]*0.999999, id: 600000}
        // ],
        //  label: "Target Square"},
        // { id: 's4', data: crossData, label: 'crosses', markerSize: 3},
        // { id: 's5', data: closeCircles, label: 'close circles', markerSize: 3},
        { id: 's6', data: fullEight, label: "full eight", markerSize: 4}];
         

    const LinkPoints = ({ seriesId, close }) => {
        const scatter = useScatterSeries(seriesId);
        const xScale = useXScale();
        const yScale = useYScale();

        if (!scatter) {
            return null;
        }
        const { color, datam } = scatter;

        if (!datam) {
            return null;
        }

        return (
            <path
                fill="none"
                stroke={color}
                strokeWidth={2}
                d={`M ${datam.map(({ x, y }) => `${xScale(x)}, ${yScale(y)}`).join(' L')}${
                    close ? 'Z' : ''
                }`}
            />
        );
    }
    
    return (
        <div className="GraphsPage">
            <Box sx={{ width: 1300, height: 600 }}>
                <ScatterChart
                    series={series}
                >
                    <LinkPoints seriesId="s1" />
                    <LinkPoints seriesId="s3" close/>
                    <LinkPoints seriesId="s4" />
                    <LinkPoints seriesId="s5" />
                </ScatterChart>
            </Box>
        </div>
    );
}

export default GraphsPage


