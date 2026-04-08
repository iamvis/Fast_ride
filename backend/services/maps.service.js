const axios = require('axios');
const captainModel = require('../models/captain.model');

const OPENROUTESERVICE_BASE_URL = process.env.OPENROUTESERVICE_BASE_URL || 'https://api.openrouteservice.org';

function getOpenRouteServiceParams(params = {}) {
    const apiKey = process.env.OPENROUTESERVICE_API_KEY;
    const isHostedOpenRouteService = OPENROUTESERVICE_BASE_URL === 'https://api.openrouteservice.org';

    if (isHostedOpenRouteService && !apiKey) {
        throw new Error('OPENROUTESERVICE_API_KEY is not configured');
    }

    return apiKey ? { ...params, api_key: apiKey } : params;
}

module.exports.getAddressCoordinate = async (address) => {
    const url = `${OPENROUTESERVICE_BASE_URL}/geocode/search`;

    try {
        const response = await axios.get(url, {
            params: getOpenRouteServiceParams({
                text: address,
                size: 1,
                'boundary.country': 'IN',
            }),
        });

        const features = response.data.features || [];

        if (features.length === 0) {
            throw new Error(`Coordinates not found for address: ${address}`);
        }

        const [lng, ltd] = features[0].geometry.coordinates;

        return { ltd, lng };
    } catch (error) {
        console.error('Error fetching address coordinates:', error.response?.data || error.message);
        throw error;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destinationCoords = await module.exports.getAddressCoordinate(destination);

        const response = await axios.get(`${OPENROUTESERVICE_BASE_URL}/v2/directions/driving-car`, {
            params: getOpenRouteServiceParams({
                start: `${originCoords.lng},${originCoords.ltd}`,
                end: `${destinationCoords.lng},${destinationCoords.ltd}`,
            }),
        });

        const features = response.data.features || [];

        if (features.length === 0) {
            throw new Error('No routes found');
        }

        const summary = features[0].properties?.summary;

        if (!summary) {
            throw new Error('Route summary missing from openrouteservice response');
        }

        return {
            distance: summary.distance,
            duration: summary.duration,
        };
    } catch (error) {
        console.error('Error fetching distance and time:', error.response?.data || error.message);
        throw error;
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }

    try {
        const response = await axios.get(`${OPENROUTESERVICE_BASE_URL}/geocode/autocomplete`, {
            params: getOpenRouteServiceParams({
                text: input,
                size: 5,
                'boundary.country': 'IN',
            }),
        });

        const features = response.data.features || [];

        return features
            .map((feature) => feature.properties?.label || feature.properties?.name)
            .filter(Boolean);
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.response?.data || error.message);
        throw error;
    }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        socketId: { $ne: null },
        'location.ltd': { $ne: null },
        'location.lng': { $ne: null }
    });

    const toRadians = (value) => value * (Math.PI / 180);
    const earthRadiusKm = 6371;

    const filteredCaptains = captains.filter((captain) => {
        const captainLat = captain.location?.ltd;
        const captainLng = captain.location?.lng;

        if (typeof captainLat !== 'number' || typeof captainLng !== 'number') {
            return false;
        }

        const dLat = toRadians(captainLat - ltd);
        const dLng = toRadians(captainLng - lng);
        const originLat = toRadians(ltd);
        const destinationLat = toRadians(captainLat);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(originLat) * Math.cos(destinationLat) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = earthRadiusKm * c;

        return distanceKm <= radius;
    });

    return filteredCaptains;
};

module.exports.getOnlineCaptains = async () => {
    return captainModel.find({
        socketId: { $ne: null }
    });
};
