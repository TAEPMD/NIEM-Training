
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://duikupbyljqvzfxojuhp.supabase.co'
const supabaseKey = 'sb_publishable_oKha_8QnpEoAJLvJ5-Yu0A_JGta28iL'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  const { data, error } = await supabase.from('systems').select('*')
  if (error) {
    console.error('Error fetching systems:', error)
  } else {
    console.log('Systems data:', data)
  }
}

checkData()
