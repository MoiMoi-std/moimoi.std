const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env')
const envFile = fs.readFileSync(envPath, 'utf-8')
const envVars = {}
envFile.split('\n').forEach((line) => {
  const [key, value] = line.split('=')
  if (key && value && !key.startsWith('#')) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function inspectPackages() {
  const { data, error } = await supabase.from('packages').select('id, name, price, original_price')
  console.table(data)
}
inspectPackages()
