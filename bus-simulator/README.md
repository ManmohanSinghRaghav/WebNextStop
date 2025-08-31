# NextStop Bus Simulator

Real-time bus movement simulator for the NextStop application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

## Usage

### Start the simulator:
```bash
npm start
```

### Development mode (auto-restart on changes):
```bash
npm run dev
```

## How it works

1. **Connects to Supabase** using service role key for admin operations
2. **Finds active trips** by querying the trips table for status='active'
3. **Gets route waypoints** for each active trip
4. **Simulates movement** by calculating next positions along the route
5. **Updates bus locations** in real-time using the `update_bus_location` RPC function
6. **Handles round trips** by reversing direction at route endpoints

## Configuration

Environment variables:
- `SIMULATION_INTERVAL`: Update frequency in milliseconds (default: 5000)
- `MOVEMENT_SPEED`: Movement speed in degrees per update (default: 0.001)
- `LOG_LEVEL`: Logging verbosity - 'info' or 'debug' (default: 'info')

## Features

- **Real-time simulation**: Buses move along their assigned routes
- **Multiple trips**: Handles multiple active trips simultaneously
- **Route following**: Buses follow waypoints in correct sequence
- **Round trips**: Automatic reversal at route endpoints
- **Database integration**: Updates are immediately visible in the app
- **Graceful shutdown**: Proper cleanup on SIGINT/SIGTERM
- **Error handling**: Robust error handling and logging

## Testing

1. Start some trips using the driver dashboard
2. Run the simulator
3. Watch buses move on the passenger map in real-time

## Troubleshooting

- Ensure you have the correct Supabase service role key
- Make sure the `update_bus_location` RPC function exists in your database
- Check that there are active trips and waypoints in your database
- Verify the buses table has proper GPS coordinates
