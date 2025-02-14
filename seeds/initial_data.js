const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Clear existing data
  await knex('website_software').del();
  await knex('user_websites').del();
  await knex('master_software').del();
  await knex('user').del();

  // Insert users
  const users = await knex('user').insert([
    {
      email: 'admin@test.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    },
    {
      email: 'user1@test.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user'
    },
    {
      email: 'user2@test.com',
      password: await bcrypt.hash('user456', 10),
      role: 'user'
    }
  ]).returning('*');

  // Insert master software from JSON
  const masterSoftwareData = [
    {
      name: 'advanced custom fields',
      type: 'plugin',
      latest_version: '6.3.12',
      last_update_date: '2025-01-21',
      update_notes: 'Enhancement - Error messages that occur when field validation fails due an insufficient security nonce now have additional context',
      update_url: 'https://www.advancedcustomfields.com/changelog/'
    },
    {
      name: 'woocommerce',
      type: 'plugin',
      latest_version: '7.6.0',
      last_update_date: '2025-02-03',
      update_notes: 'Enhancement - Added compatibility with the latest version of WordPress.',
      update_url: 'https://woocommerce.com/changelog/'
    },
    {
      name: 'astra',
      type: 'theme',
      latest_version: '4.0.1',
      last_update_date: '2025-02-02',
      update_notes: 'Enhancement - Improved compatibility with the latest WordPress version.',
      update_url: 'https://wpastra.com/changelog/'
    }
  ];

  const masterSoftware = await knex('master_software').insert(masterSoftwareData).returning('*');

  // Insert user websites
  const websites = await knex('user_websites').insert([
    {
      user_id: users[0].user_id,  // admin's site
      website_url: 'https://admin-site.com',
      last_update_performed: new Date()
    },
    {
      user_id: users[1].user_id,  // user1's sites
      website_url: 'https://user1-site1.com',
      last_update_performed: new Date()
    },
    {
      user_id: users[1].user_id,
      website_url: 'https://user1-site2.com',
      last_update_performed: new Date()
    },
    {
      user_id: users[2].user_id,  // user2's site
      website_url: 'https://user2-site.com',
      last_update_performed: new Date()
    }
  ]).returning('*');

  // Insert website software
  await knex('website_software').insert([
    {
      website_id: websites[0].uw_id,  // admin's site software
      software_id: masterSoftware[0].ms_id,  // ACF
      name: masterSoftware[0].name,
      type: masterSoftware[0].type,
      installed_version: '6.3.10',  // slightly older version
      installed_version_date: '2024-12-15'
    },
    {
      website_id: websites[0].uw_id,
      software_id: masterSoftware[2].ms_id,  // Astra theme
      name: masterSoftware[2].name,
      type: masterSoftware[2].type,
      installed_version: '4.0.0',
      installed_version_date: '2024-12-20'
    },
    {
      website_id: websites[1].uw_id,  // user1's first site software
      software_id: masterSoftware[1].ms_id,  // WooCommerce
      name: masterSoftware[1].name,
      type: masterSoftware[1].type,
      installed_version: '7.5.0',
      installed_version_date: '2024-12-10'
    },
    {
      website_id: websites[2].uw_id,  // user1's second site software
      software_id: masterSoftware[0].ms_id,  // ACF
      name: masterSoftware[0].name,
      type: masterSoftware[0].type,
      installed_version: '6.3.11',
      installed_version_date: '2025-01-10'
    },
    {
      website_id: websites[3].uw_id,  // user2's site software
      software_id: masterSoftware[2].ms_id,  // Astra theme
      name: masterSoftware[2].name,
      type: masterSoftware[2].type,
      installed_version: '3.9.9',
      installed_version_date: '2024-11-30'
    }
  ]);
};