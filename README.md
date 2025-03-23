
# LOGISCALE

## Revolutionizing Delivery Systems Through Comprehensive Traffic Management

![logiscale](https://github.com/user-attachments/assets/9ff83166-fe0b-4e23-ab11-d05e4d4a043e)

## Overview

LOGISCALE is a revolutionary platform built from scratch that transforms how deliveries occur by addressing the root cause: traffic congestion. While the original challenge focused on slow deliveries, we recognized that reimagining the entire traffic ecosystem would create the most impactful solution. Our platform integrates data from multiple sources to create the most accurate traffic data system ever developed, helping to expedite deliveries, reduce congestion, improve air quality, and enhance social connections.

## The Problem

The hackathon challenged teams to solve the problem of slow deliveries. However, we identified that slow deliveries are merely a symptom of a larger issue: inefficient traffic systems. Delivery delays stem from:

- Unpredictable traffic congestion that makes estimated delivery times unreliable
- Lack of real-time routing optimization across delivery networks
- Inefficient coordination between different transportation services
- Limited data integration between public and private transportation systems
- Traffic congestion that wastes billions of hours annually and creates massive economic inefficiencies

## Our Solution

We've developed a comprehensive map platform that:

1. *Collects Real-Time Data* from multiple sources:
   - Government agencies
   - Ride-sharing services (Uber)
   - Food delivery platforms (Zomato, Swiggy)
   - Public transportation (KSRTC)
   - Private vehicles
   - Traffic cameras

2. *Processes Information* through advanced technologies:
   - Number plate detection using OCR
   - Traffic intensity analysis
   - Heat map generation at traffic nodes
   - Real-time route optimization

3. *Provides Simple Responses* to logistical requests:
   - Users simply receive a "yay" or "nay" response after submitting location data
   - The complex processing happens behind the scenes

## Technical Architecture

### Data Collection
- *Video Processing Pipeline*: Splits video feeds into frames
- *OCR Model*: Extracts plate numbers, timestamps, and traffic intensity
- *Neon Database*: Stores and updates traffic behavior on our map

### Integration Systems
- *Parivahan API*: Vehicle information retrieval
- *Twilio*: Sends consent messages to users
- *AWS*: Hosts our backend infrastructure

### Map Infrastructure
- *OSM* (OpenStreetMap): Base map data
- *MapBox*: Real-time route selection
- *Jawg*: Tile-based chunk loading
- *Leaflet*: Plotting and Next.js integration

### AI Components
- *Heatmap Generation Models*: Analyze traffic patterns
- *Cloudinary → Gemini 2.0 Flash*: Processes visual data into actionable integers
- *Custom APIs*: Enhanced with OCR capabilities

## Key Benefits

- *Faster Deliveries*: Our primary goal achieved through holistic traffic optimization
- *Real-Time Adaptation*: System continuously adjusts to changing traffic conditions
- *Cross-Platform Integration*: Unifies data from government, private companies, and individual users
- *Environmental Impact*: Reduced traffic means lower emissions and better air quality
- *Time Efficiency*: Optimal routing saves time for all road users
- *Social Enhancement*: Less time in traffic means more time for social connections
- *Data Accuracy*: The most comprehensive traffic data collection system available

## How to Use

1. Submit a request in the following format:
```json
{
  "name": "order",
  "start_location": "location",
  "destination": "destination",
  "type": "type"
}

```
## Admin test ceredentials(government)
- username: admin
- password: test


## Delivery Driver Login
- username: driver
- password: test
  
## Logistic Company Login
- username: amazon
- password: test

# 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** 
- **npm** (comes with Node.js)
- **Git** (to clone the repository)

# 2️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/Logitech.git
cd logiscale
```

# 3️⃣ Install Dependencies
```sh
npm install
npm run dev
```

