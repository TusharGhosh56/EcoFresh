import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { useAirQuality } from '../hooks/useAirQuality'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

function ChartsSection() {
  const { cities, historicalData, loading } = useAirQuality()

  // Use real historical data if available, otherwise use default data
  const trendData = {
    labels: historicalData?.labels || [
      '12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'
    ],
    datasets: [{
      label: 'AQI',
      data: historicalData?.data || [60, 62, 65, 70, 78, 85, 90, 88, 80, 75, 68, 65],
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0,212,255,0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#5e72e4'
    }]
  }

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#fff' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#fff' }
      }
    }
  }

  // Calculate pollutant breakdown from real data
  const getPollutantData = () => {
    if (cities.length > 0) {
      // Use first city's data for pollutant breakdown
      const firstCity = cities[0]
      const pm25 = parseInt(firstCity.details.pm25)
      const pm10 = parseInt(firstCity.details.pm10)
      const o3 = parseInt(firstCity.details.o3)
      
      return {
        labels: ['PM2.5', 'PM10', 'O₃'],
        datasets: [{
          data: [pm25, pm10, o3],
          backgroundColor: [
            'rgba(34,197,94,0.8)',
            'rgba(249,115,22,0.8)',
            'rgba(94,114,228,0.8)'
          ],
          borderWidth: 2,
          borderColor: '#16213e'
        }]
      }
    }
    
    // Fallback data
    return {
      labels: ['PM2.5', 'PM10', 'O₃'],
      datasets: [{
        data: [45, 62, 89],
        backgroundColor: [
          'rgba(34,197,94,0.8)',
          'rgba(249,115,22,0.8)',
          'rgba(94,114,228,0.8)'
        ],
        borderWidth: 2,
        borderColor: '#16213e'
      }]
    }
  }

  const pollutantOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { 
          color: '#fff', 
          font: { size: 14 } 
        }
      }
    },
    cutout: '70%'
  }

  if (loading) {
    return (
      <div className="charts-section grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="chart-container glass-effect rounded-3xl p-8 animate-pulse">
          <div className="h-6 bg-white/20 rounded w-48 mb-6"></div>
          <div className="h-[200px] bg-white/10 rounded"></div>
        </div>
        <div className="chart-container glass-effect rounded-3xl p-8 animate-pulse">
          <div className="h-6 bg-white/20 rounded w-40 mb-6"></div>
          <div className="h-[200px] bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="charts-section grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <div className="chart-container glass-effect rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
        <h3 className="chart-title text-2xl font-semibold mb-6 text-white">
          {historicalData ? 'Real-time 12-Hour Trend' : '24-Hour Trend Analysis'}
        </h3>
        <div className="h-[200px]">
          <Line data={trendData} options={trendOptions} />
        </div>
      </div>
      
      <div className="chart-container glass-effect rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
        <h3 className="chart-title text-2xl font-semibold mb-6 text-white">
          Pollutant Breakdown {cities.length > 0 && `(${cities[0].city})`}
        </h3>
        <div className="h-[200px]">
          <Doughnut data={getPollutantData()} options={pollutantOptions} />
        </div>
      </div>
    </div>
  )
}

export default ChartsSection 