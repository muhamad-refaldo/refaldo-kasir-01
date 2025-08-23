import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Komponen sekarang menerima prop 'chartTitle'
const SalesChart = ({ chartData, chartTitle }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'top',
                labels: {
                    color: '#e5e7eb' // Warna teks legenda untuk tema gelap
                }
            },
            title: { 
                display: true, 
                text: chartTitle || 'Grafik Pendapatan', // Judul dinamis
                color: '#e5e7eb' // Warna teks judul
            },
        },
        scales: {
            y: {
                ticks: {
                    color: '#9ca3af', // Warna teks skala Y
                    // Format angka menjadi Rupiah
                    callback: function(value) {
                        if (value >= 1000) {
                            return 'Rp ' + (value / 1000) + 'k';
                        }
                        return 'Rp ' + value;
                    }
                },
                grid: {
                    color: '#4b5563' // Warna garis grid
                }
            },
            x: {
                 ticks: {
                    color: '#9ca3af', // Warna teks skala X
                },
                 grid: {
                    color: '#4b5563' // Warna garis grid
                }
            }
        }
    };

    const data = {
        labels: chartData?.labels || [],
        datasets: [
            {
                label: 'Pendapatan (Rp)',
                data: chartData?.data || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.1
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default SalesChart;