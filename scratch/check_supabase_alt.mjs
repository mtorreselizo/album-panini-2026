const supabaseUrl = "https://qtslxxqylrvbvjsnydpb.supabase.co"
const supabaseKey = "sb_publishable_gsx0GjsVPOeqGCUzI8qVNw_q_l2evEy"

async function checkFriendCode() {
  const code = "WLFB8V"
  console.log(`Checking code ${code} in project ${supabaseUrl}...`)
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/users?short_code=eq.${code}&select=id,short_code,display_name`, {
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
    if (data.length > 0) {
      console.log('Success! Friend found:', data[0])
    } else {
      console.log('Friend NOT found in this database.')
    }
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

checkFriendCode()
