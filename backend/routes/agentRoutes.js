const express = require('express');
const router = express.Router();
const { 
    loginAgent, 
    createAgent, 
    getAllAgents, 
    getAgentById, 
    updateAgent, 
    deleteAgent,
    getCurrentAgent
} = require('../controllers/agentController');
const { authMiddleware, superAgentOnly } = require('../config/authMiddleware');

router.post('/login', loginAgent);
router.get('/me', authMiddleware, getCurrentAgent);
router.post('/', authMiddleware, superAgentOnly, createAgent);
router.get('/', authMiddleware, superAgentOnly, getAllAgents);
router.get('/:id', authMiddleware, superAgentOnly, getAgentById);
router.put('/:id', authMiddleware, superAgentOnly, updateAgent);
router.delete('/:id', authMiddleware, superAgentOnly, deleteAgent);

module.exports = router;
