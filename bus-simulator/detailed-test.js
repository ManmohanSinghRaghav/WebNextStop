import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

async function detailedTest() {
  console.log('Testing trips table structure...')
  
  // First check if we have any data at all
  const { data: routes } = await supabase.from('routes').select('*').limit(1)
  const { data: buses } = await supabase.from('buses').select('*').limit(1)
  const { data: drivers } = await supabase.from('drivers').select('*').limit(1)
  
  console.log('Routes count:', routes?.length || 0)
  console.log('Buses count:', buses?.length || 0) 
  console.log('Drivers count:', drivers?.length || 0)
  
  // Try to understand the trips table structure
  console.log('\\nTesting trips table...')
  
  // Let's try some different approaches to understand the schema
  const { data: tripsSchema, error: schemaError } = await supabase.rpc('get_table_schema', { table_name: 'trips' })
  console.log('Schema RPC result:', schemaError ? schemaError.message : 'Schema call not available')
  
  // Try a basic insert to see what fails
  const { error: insertError } = await supabase
    .from('trips')
    .insert({ test: 'test' })
    
  console.log('Insert test error (expected):', insertError?.message || 'No error')
}

detailedTest()
