# OpenWeatherMap API Integration - EcoFresh Dashboard

## 🌐 API Integration Overview

The EcoFresh Air Quality Dashboard now uses **real-time data** from the OpenWeatherMap Air Pollution API to display live air quality information.

### 🔑 API Configuration
- **API Key**: `741081f2196356e85d5138db13c2f41c`
- **Base URL**: `http://api.openweathermap.org/data/2.5`
- **Geocoding URL**: `http://api.openweathermap.org/geo/1.0`

## 📡 API Endpoints Used

### 1. Geocoding API
```
GET http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=1&appid={API_key}
```
- **Purpose**: Get latitude/longitude coordinates for cities
- **Usage**: Convert city names to coordinates for pollution data requests

### 2. Current Air Pollution API
```
GET http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_key}
```
- **Purpose**: Get current air quality data
- **Returns**: AQI level (1-5) and pollutant concentrations (PM2.5, PM10, O₃, etc.)

### 3. Historical Air Pollution API
```
GET http://api.openweathermap.org/data/2.5/air_pollution/history?lat={lat}&lon={lon}&start={start}&end={end}&appid={API_key}
```
- **Purpose**: Get historical air quality data for trends
- **Usage**: Generate 12-hour trend charts

## 🏙️ Monitored Cities

The dashboard tracks air quality for these major US cities:
1. **New York City, NY**
2. **Los Angeles, CA**
3. **Seattle, WA**
4. **Miami, FL**

## 🎯 Real-Time Features

### ✅ Live Data Display
- **Stats Cards**: Show real AQI values, pollutant levels, and status
- **Color-coded Status**: Excellent, Good, Moderate, Poor, Very Poor
- **Real Coordinates**: Uses actual city coordinates from geocoding

### ✅ Interactive Charts
- **Trend Chart**: 12-hour historical AQI data
- **Pollutant Breakdown**: Real PM2.5, PM10, O₃ concentrations
- **Dynamic Updates**: Charts update with fresh data

### ✅ Smart Map Markers
- **Live Positioning**: Markers show real city data
- **Status Colors**: Green (Good), Orange (Moderate), Red (Poor)
- **Hover Tooltips**: Display AQI values and status
- **Click Interactions**: Show detailed city information

### ✅ Dynamic Alerts
- **Real-time Alerts**: Based on actual air quality conditions
- **Pollution Warnings**: Triggered by poor air quality
- **API Status**: Shows connection to live data source

## 🔄 Data Flow

1. **App Initialization**
   - `useAirQuality` hook loads on mount
   - Fetches coordinates for all cities
   - Gets current pollution data for each city

2. **Data Processing**
   - Converts WHO AQI (1-5) to US EPA scale (0-300)
   - Categorizes air quality status
   - Formats pollutant concentrations

3. **Real-time Updates**
   - Refresh button in header
   - Error handling with retry options
   - Loading states throughout the app

4. **Historical Data**
   - Fetches last 24 hours of data
   - Processes into 12-hour intervals
   - Updates trend charts

## ⚡ Performance Features

### Loading States
- **Skeleton screens** while fetching data
- **Spinner animations** on refresh
- **Progressive loading** of components

### Error Handling
- **Network error recovery**
- **Retry mechanisms**
- **Fallback data** when API is unavailable
- **User-friendly error messages**

### Caching Strategy
- **Single API call** per city on load
- **Shared data** across all components using custom hook
- **Efficient re-renders** with React state management

## 🎨 Visual Enhancements

### Status Color Mapping
```javascript
AQI 1 (Excellent) → Green (#10b981)
AQI 2 (Good)      → Light Green (#22c55e)
AQI 3 (Moderate)  → Orange (#f97316)
AQI 4 (Poor)      → Red (#ef4444)
AQI 5 (Very Poor) → Dark Red (#dc2626)
```

### Real-time Indicators
- **Live data badges** on cards
- **"Real-time" timestamps** in alerts
- **Connection status** indicators
- **Data freshness** indicators

## 🛠️ Technical Implementation

### Custom Hook (`useAirQuality`)
- **Centralized state management**
- **API call orchestration**
- **Error handling**
- **Loading state management**

### Type Safety
- **TypeScript interfaces** for API responses
- **Proper error typing**
- **Component prop validation**

### API Rate Limiting
- **Efficient batching** of requests
- **Single calls per city**
- **Reasonable refresh intervals**

## 🚀 Usage

The API integration is automatic and requires no additional configuration. Users can:

1. **View live data** immediately on page load
2. **Refresh data** using the header button
3. **See loading states** during data fetches
4. **Handle errors** with retry options
5. **Interact with real data** on maps and charts

## 📊 Data Accuracy

- **Real-time updates** from OpenWeatherMap
- **Accurate coordinates** from geocoding API
- **Professional-grade data** used by weather services worldwide
- **Consistent with WHO standards**

The integration transforms the dashboard from a static demo into a **fully functional air quality monitoring system** with live, accurate data from a trusted meteorological source. 