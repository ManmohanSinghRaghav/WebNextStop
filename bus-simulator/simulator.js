import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_KEY')
  console.error('Please create a .env file with your Supabase credentials.')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Simulation configuration
const SIMULATION_INTERVAL = parseInt(process.env.SIMULATION_INTERVAL) || 5000 // 5 seconds
const MOVEMENT_SPEED = parseFloat(process.env.MOVEMENT_SPEED) || 0.001 // Degrees per update
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

class BusSimulator {
  constructor() {
    this.isRunning = false
    this.intervalId = null
    this.activeTrips = new Map()
    this.routeWaypoints = new Map()
  }

  log(level, message, data = null) {
    if (LOG_LEVEL === 'debug' || level !== 'debug') {
      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`)
      if (data) {
        console.log(JSON.stringify(data, null, 2))
      }
    }
  }

  // Calculate distance between two coordinates (in degrees)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const dlat = lat2 - lat1
    const dlng = lng2 - lng1
    return Math.sqrt(dlat * dlat + dlng * dlng)
  }

  // Calculate next position towards target
  calculateNextPosition(currentLat, currentLng, targetLat, targetLng, speed) {
    const distance = this.calculateDistance(currentLat, currentLng, targetLat, targetLng)
    
    if (distance <= speed) {
      // Reached the target
      return { lat: targetLat, lng: targetLng, reached: true }
    }

    // Calculate direction and move towards target
    const ratio = speed / distance
    const nextLat = currentLat + (targetLat - currentLat) * ratio
    const nextLng = currentLng + (targetLng - currentLng) * ratio

    return { lat: nextLat, lng: nextLng, reached: false }
  }

  // Get waypoints for a route
  async getRouteWaypoints(routeId) {
    if (this.routeWaypoints.has(routeId)) {
      return this.routeWaypoints.get(routeId)
    }

    try {
      const { data, error } = await supabase
        .from('routes')
        .select('waypoints')
        .eq('id', routeId)
        .single()

      if (error) {
        this.log('error', `Failed to fetch waypoints for route ${routeId}:`, error)
        return []
      }

      const waypoints = data?.waypoints || []
      this.routeWaypoints.set(routeId, waypoints)
      return waypoints
    } catch (err) {
      this.log('error', `Error fetching waypoints:`, err)
      return []
    }
  }

  // Get all active trips with bus and route information
  async getActiveTrips() {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          buses (*),
          routes (*)
        `)
        .eq('started', true)

      if (error) {
        this.log('error', 'Failed to fetch active trips:', error)
        return []
      }

      return data || []
    } catch (err) {
      this.log('error', 'Error fetching active trips:', err)
      return []
    }
  }

  // Update bus location
  async updateBusLocation(busId, latitude, longitude) {
    try {
      const { error } = await supabase
        .from('buses')
        .update({
          current_location: `POINT(${longitude} ${latitude})`,
          updated_at: new Date().toISOString()
        })
        .eq('id', busId)

      if (error) {
        this.log('error', `Failed to update location for bus ${busId}:`, error)
        return false
      }

      return true
    } catch (err) {
      this.log('error', `Error updating bus location:`, err)
      return false
    }
  }

  // Initialize trip simulation data
  async initializeTripData(trip) {
    const tripId = trip.id
    const bus = trip.buses
    const route = trip.routes

    if (!bus || !route) {
      this.log('warn', `Trip ${tripId} missing bus or route data`)
      return
    }

    // Get waypoints for this route
    const waypoints = await this.getRouteWaypoints(route.id)
    if (waypoints.length === 0) {
      this.log('warn', `No waypoints found for route ${route.id}`)
      return
    }

    // Initialize trip simulation state
    const tripState = {
      tripId,
      busId: bus.id,
      routeId: route.id,
      waypoints,
      currentWaypointIndex: 0,
      currentLat: waypoints[0]?.lat || waypoints[0]?.latitude || 0,
      currentLng: waypoints[0]?.lng || waypoints[0]?.longitude || 0,
      targetLat: waypoints[0]?.lat || waypoints[0]?.latitude || 0,
      targetLng: waypoints[0]?.lng || waypoints[0]?.longitude || 0,
      isReversing: false, // For round trips
      completedRounds: 0
    }

    this.activeTrips.set(tripId, tripState)
    this.log('info', `Initialized simulation for trip ${tripId} on route ${route.name}`)
  }

  // Update single trip simulation
  async updateTripSimulation(tripState) {
    const { busId, waypoints, currentLat, currentLng, targetLat, targetLng } = tripState

    // Calculate next position
    const nextPos = this.calculateNextPosition(
      currentLat, currentLng, targetLat, targetLng, MOVEMENT_SPEED
    )

    // Update current position
    tripState.currentLat = nextPos.lat
    tripState.currentLng = nextPos.lng

    // Update bus location in database
    const success = await this.updateBusLocation(busId, nextPos.lat, nextPos.lng)
    
    if (!success) {
      this.log('error', `Failed to update location for bus ${busId}`)
      return
    }

    // Check if reached current target waypoint
    if (nextPos.reached) {
      // Move to next waypoint
      if (tripState.isReversing) {
        tripState.currentWaypointIndex--
        if (tripState.currentWaypointIndex < 0) {
          // Completed reverse journey, start forward again
          tripState.isReversing = false
          tripState.currentWaypointIndex = 1
          tripState.completedRounds++
        }
      } else {
        tripState.currentWaypointIndex++
        if (tripState.currentWaypointIndex >= waypoints.length) {
          // Reached end, start reverse journey
          tripState.isReversing = true
          tripState.currentWaypointIndex = waypoints.length - 2
        }
      }

      // Set new target
      const targetIndex = Math.max(0, Math.min(tripState.currentWaypointIndex, waypoints.length - 1))
      const targetWaypoint = waypoints[targetIndex]
      tripState.targetLat = targetWaypoint?.lat || targetWaypoint?.latitude || 0
      tripState.targetLng = targetWaypoint?.lng || targetWaypoint?.longitude || 0

      this.log('debug', `Bus ${busId} reached waypoint, moving to index ${targetIndex}`)
    }

    this.log('debug', `Bus ${busId} at (${nextPos.lat.toFixed(6)}, ${nextPos.lng.toFixed(6)})`)
  }

  // Main simulation loop
  async runSimulationCycle() {
    try {
      this.log('debug', 'Starting simulation cycle...')

      // Get current active trips
      const activeTrips = await this.getActiveTrips()
      
      // Remove trips that are no longer active
      for (const [tripId, tripState] of this.activeTrips) {
        if (!activeTrips.find(trip => trip.id === tripId)) {
          this.activeTrips.delete(tripId)
          this.log('info', `Removed inactive trip ${tripId} from simulation`)
        }
      }

      // Add new active trips
      for (const trip of activeTrips) {
        if (!this.activeTrips.has(trip.id)) {
          await this.initializeTripData(trip)
        }
      }

      // Update all active trip simulations
      const updatePromises = Array.from(this.activeTrips.values()).map(
        tripState => this.updateTripSimulation(tripState)
      )

      await Promise.all(updatePromises)

      this.log('info', `Simulation cycle completed. Active trips: ${this.activeTrips.size}`)

    } catch (err) {
      this.log('error', 'Error in simulation cycle:', err)
    }
  }

  // Start the simulator
  async start() {
    if (this.isRunning) {
      this.log('warn', 'Simulator is already running')
      return
    }

    this.log('info', 'Starting NextStop Bus Simulator...')
    this.log('info', `Simulation interval: ${SIMULATION_INTERVAL}ms`)
    this.log('info', `Movement speed: ${MOVEMENT_SPEED} degrees per update`)

    this.isRunning = true

    // Run initial cycle
    await this.runSimulationCycle()

    // Set up recurring simulation
    this.intervalId = setInterval(async () => {
      if (this.isRunning) {
        await this.runSimulationCycle()
      }
    }, SIMULATION_INTERVAL)

    this.log('info', 'Simulator started successfully')
  }

  // Stop the simulator
  stop() {
    if (!this.isRunning) {
      this.log('warn', 'Simulator is not running')
      return
    }

    this.log('info', 'Stopping NextStop Bus Simulator...')
    
    this.isRunning = false
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    this.activeTrips.clear()
    this.routeWaypoints.clear()

    this.log('info', 'Simulator stopped')
  }

  // Get simulator status
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeTrips: this.activeTrips.size,
      routesCached: this.routeWaypoints.size,
      interval: SIMULATION_INTERVAL,
      movementSpeed: MOVEMENT_SPEED
    }
  }
}

// Create simulator instance
const simulator = new BusSimulator()

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nReceived SIGINT. Gracefully shutting down...')
  simulator.stop()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\nReceived SIGTERM. Gracefully shutting down...')
  simulator.stop()
  process.exit(0)
})

// Start the simulator
async function main() {
  try {
    await simulator.start()
    
    // Keep the process running
    console.log('Bus simulator is running. Press Ctrl+C to stop.')
    
  } catch (error) {
    console.error('Failed to start simulator:', error)
    process.exit(1)
  }
}

// Run the main function
main()
