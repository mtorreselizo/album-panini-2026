const supabaseUrl = "https://ntplhuyoiloaoonslsod.supabase.co"
const supabaseKey = "sb_publishable_b_cOaU0MjFsfyKxO99I7Hw_pIGDfsMJ"

async function checkConnection() {
  console.log('Testing connection to Supabase REST API...')
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/users?select=id,short_code&limit=5`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('API Error:', response.status, error)
      return
    }

    const data = await response.json()
    console.log('Success! Users found:', data)
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

checkConnection()
