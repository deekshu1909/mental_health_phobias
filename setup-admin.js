import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://afavqnttrewdxlhwkuss.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  console.log('\nTo set up the admin user, you need to:');
  console.log('1. Go to your Supabase project settings');
  console.log('2. Copy your Service Role Key (keep this secret!)');
  console.log('3. Run: SUPABASE_SERVICE_ROLE_KEY=<your-key> node setup-admin.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user account...');

    const { data, error } = await supabase.auth.admin.createUser({
      email: 'deekshu1909@gmail.com',
      password: 'kaviram@2004',
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user:', error.message);
      if (error.message.includes('already exists')) {
        console.log('Admin user already exists');
      }
      process.exit(1);
    }

    console.log('✓ Admin user created successfully!');
    console.log(`User ID: ${data.user.id}`);
    console.log(`Email: ${data.user.email}`);
    console.log('\nYou can now log in to the admin panel with:');
    console.log('Email: deekshu1909@gmail.com');
    console.log('Password: kaviram@2004');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

createAdminUser();
