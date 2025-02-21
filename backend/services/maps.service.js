const axios = require('axios');
const captainModel = require('../models/captain.model');



module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.HERE_API_KEY;
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const items = response.data.items;

        if (items.length === 0) {
            throw new Error(`Coordinates not found for address: ${address}`);
        }

        const location = items[0].position;
        return {
            lat: location.lat, // ✅ Fixed property name (was 'ltd')
            lng: location.lng
        };
    } catch (error) {
        console.error("Error fetching address coordinates:", error.message);
        throw error;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const apiKey = process.env.HERE_API_KEY;
    
    try {
        // Get coordinates for both locations
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destinationCoords = await module.exports.getAddressCoordinate(destination);

        // ✅ Corrected URL: Pass lat,lng instead of object
        const url = `https://router.hereapi.com/v8/routes?origin=${originCoords.lat},${originCoords.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&return=summary&transportMode=car&apikey=${apiKey}`;

        const response = await axios.get(url);
        const routes = response.data.routes;

        if (!routes || routes.length === 0) {
            throw new Error("No routes found");
        }

        const summary = routes[0].sections[0].summary;

        return {
            distance: summary.length, // Distance in meters
            duration: summary.duration // Duration in seconds
        };
    } catch (error) {
        console.error("Error fetching distance and time:", error.message);
        throw error;
    }
};


module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }

    const apiKey = process.env.HERE_API_KEY;
    const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(input)}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const items = response.data.items;

        return items.map(item => item.title);
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        throw error;
    }
};

module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
    // MongoDB requires [longitude, latitude] format for geospatial queries
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius / 6371] // 6371 km is Earth's radius
            }
        }
    });

    return captains;
};
