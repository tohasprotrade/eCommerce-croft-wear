const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/authMiddleware');

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

const loginAgent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const agent = await Agent.findOne({ email });

        if (!agent) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!agent.isActive) {
            return res.status(401).json({ message: 'Account is deactivated' });
        }

        const isMatch = await agent.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            role: agent.role,
            token: generateToken(agent._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createAgent = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            return res.status(400).json({ message: 'Agent with this email already exists' });
        }

        const agent = await Agent.create({
            name,
            email,
            password,
            role: role || 'agent',
            createdBy: req.agent._id
        });

        res.status(201).json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            role: agent.role,
            createdAt: agent.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllAgents = async (req, res) => {
    try {
        const agents = await Agent.find({}).select('-password').sort({ createdAt: -1 });
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAgentById = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id).select('-password');
        
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        res.json(agent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateAgent = async (req, res) => {
    try {
        const { name, email, role, isActive } = req.body;
        
        const agent = await Agent.findById(req.params.id);
        
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        if (name) agent.name = name;
        if (email) agent.email = email;
        if (role) agent.role = role;
        if (isActive !== undefined) agent.isActive = isActive;

        const updatedAgent = await agent.save();

        res.json({
            _id: updatedAgent._id,
            name: updatedAgent.name,
            email: updatedAgent.email,
            role: updatedAgent.role,
            isActive: updatedAgent.isActive
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteAgent = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        if (agent.role === 'super_agent') {
            return res.status(400).json({ message: 'Cannot delete super agent' });
        }

        await agent.deleteOne();
        res.json({ message: 'Agent removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getCurrentAgent = async (req, res) => {
    try {
        res.json(req.agent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    loginAgent,
    createAgent,
    getAllAgents,
    getAgentById,
    updateAgent,
    deleteAgent,
    getCurrentAgent
};
