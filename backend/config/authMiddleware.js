const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No authorization token provided',
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization header format',
            });
        }

        const token = authHeader.slice(7);

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired',
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Invalid or malformed token',
            });
        }

        const agent = await Agent.findById(decoded.id).select('-password');

        if (!agent) {
            return res.status(401).json({
                success: false,
                message: 'Agent not found',
            });
        }

        if (!agent.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated',
            });
        }

        req.agent = agent;
        req.agentId = agent._id;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
        });
    }
};

const superAgentOnly = (req, res, next) => {
    if (!req.agent) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
    }

    if (req.agent.role !== 'super_agent') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Super agent access required.',
        });
    }

    next();
};

module.exports = { authMiddleware, superAgentOnly, JWT_SECRET };
