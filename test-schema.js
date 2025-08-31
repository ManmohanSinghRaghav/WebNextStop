import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
)

async function testSchema() {
  console.log('Testing schema...')
  
  // Test routes table
  const { data: routes, error: routesError } = await supabase
    .from('routes')
    .select('*')
    .limit(1)
    
  console.log('Routes test:', routesError ? routesError.message : 'OK')
  
  // Test buses table
  const { data: buses, error: busesError } = await supabase
    .from('buses')
    .select('*')
    .limit(1)
    
  console.log('Buses test:', busesError ? busesError.message : 'OK')
  
  // Test trips table
  const { data: trips, error: tripsError } = await supabase
    .from('trips')
    .select('*')
    .limit(1)
    
  console.log('Trips test:', tripsError ? tripsError.message : 'OK')
  
  // Test drivers table
  const { data: drivers, error: driversError } = await supabase
    .from('drivers')
    .select('*')
    .limit(1)
    
  console.log('Drivers test:', driversError ? driversError.message : 'OK')
}

testSchema()
