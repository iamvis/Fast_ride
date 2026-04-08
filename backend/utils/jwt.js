const crypto = require('crypto');

function base64UrlEncode(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64UrlDecode(input) {
    const normalized = input
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(input.length / 4) * 4, '=');

    return Buffer.from(normalized, 'base64').toString('utf8');
}

function parseExpiresIn(expiresIn) {
    if (typeof expiresIn === 'number' && Number.isFinite(expiresIn)) {
        return Math.floor(expiresIn);
    }

    if (typeof expiresIn !== 'string') {
        throw new Error('Invalid expiresIn format');
    }

    const match = expiresIn.trim().match(/^(\d+)([smhd])$/i);

    if (!match) {
        throw new Error('Unsupported expiresIn format');
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400
    };

    return value * multipliers[unit];
}

function sign(payload, secret, options = {}) {
    if (!secret) {
        throw new Error('JWT secret is required');
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const body = {
        ...payload,
        iat: issuedAt
    };

    if (options.expiresIn) {
        body.exp = issuedAt + parseExpiresIn(options.expiresIn);
    }

    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(body));
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto
        .createHmac('sha256', secret)
        .update(signingInput)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${signingInput}.${signature}`;
}

function verify(token, secret) {
    if (!secret) {
        throw new Error('JWT secret is required');
    }

    if (typeof token !== 'string') {
        throw new Error('Invalid token');
    }

    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error('Invalid token');
    }

    const [encodedHeader, encodedPayload, providedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(signingInput)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const expectedBuffer = Buffer.from(expectedSignature);
    const providedBuffer = Buffer.from(providedSignature);

    if (
        expectedBuffer.length !== providedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
        throw new Error('Invalid token signature');
    }

    const header = JSON.parse(base64UrlDecode(encodedHeader));

    if (header.alg !== 'HS256' || header.typ !== 'JWT') {
        throw new Error('Invalid token header');
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && now >= payload.exp) {
        throw new Error('Token expired');
    }

    return payload;
}

module.exports = {
    sign,
    verify
};
