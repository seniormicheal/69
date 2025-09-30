// This script runs independently in the background, not as part of the web server.
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Service = require('./models/Service'); // The new model

// Data helpers
const countryCodes = require('./country-codes.js');
const countryTranslations = require('./translations.js');
const servicePriority = require('./service-priority.js');

const FIVESIM_API_KEY = process.env.FIVESIM_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

const fiveSimClient = axios.create({
  baseURL: 'https://5sim.net/v1',
  headers: { 'Authorization': `Bearer ${FIVESIM_API_KEY}`, 'Accept': 'application/json' },
});

async function runUpdate() {
  console.log('Starting service update process...');
  
  try {
    // 1. Connect to the database
    await mongoose.connect(MONGO_URI);
    console.log('Database connected.');

    // 2. Fetch the large JSON file from 5sim
    console.log('Fetching fresh services from 5sim...');
    const response = await fiveSimClient.get('/guest/prices');
    const priceData = response.data;
    console.log('Successfully fetched data.');

    // 3. Process the data (same logic as before)
    console.log('Formatting and processing data...');
    const RUB_TO_TOMAN_RATE = 1200;
    const allServices = [];
    for (const countryName in priceData) {
        for (const productName in priceData[countryName]) {
            const details = priceData[countryName][productName];
            if (details.cost !== undefined) {
                allServices.push({ country: countryName, service: productName, operator: 'any', ...details });
            } else {
                for (const operatorName in details) {
                    allServices.push({ country: countryName, service: productName, operator: operatorName, ...details[operatorName] });
                }
            }
        }
    }

    const formattedServices = allServices.map(s => {
        const cleanCountry = s.country.toLowerCase();
        const cleanService = s.service.toLowerCase();
        const priorityInfo = servicePriority[cleanService];
        return {
            id: `srv_${cleanService}_${cleanCountry}_${s.operator}`,
            service: s.service,
            service_persian: priorityInfo?.name || s.service,
            country: s.country,
            country_persian: countryTranslations[cleanCountry] || s.country,
            country_code: countryCodes[cleanCountry] || null,
            operator: s.operator,
            price_toman: Math.ceil(s.price * RUB_TO_TOMAN_RATE * 1.2),
            priority: priorityInfo?.priority || 99,
            available: s.count > 0,
            success_rate: s.rate || 0,
        };
    });

    // 4. Update the database
    console.log(`Updating database with ${formattedServices.length} services...`);
    // This is an efficient way to refresh the data: delete all old ones, then insert all new ones.
    await Service.deleteMany({});
    await Service.insertMany(formattedServices);
    console.log('✅ Database update complete!');

  } catch (error) {
    console.error('❌ An error occurred during the service update process:', error.message);
  } finally {
    // 5. Disconnect from the database
    await mongoose.disconnect();
    console.log('Database disconnected. Script finished.');
  }
}

runUpdate();
