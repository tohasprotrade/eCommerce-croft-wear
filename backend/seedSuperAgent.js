const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Agent = require('./models/Agent');

const createSuperAgent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existingSuperAgent = await Agent.findOne({ role: 'super_agent' });
        
        if (existingSuperAgent) {
            console.log('Super agent already exists');
            console.log('Email:', existingSuperAgent.email);
            await mongoose.disconnect();
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const superAgent = await Agent.create({
            name: 'Super Admin',
            email: 'admin@craftwear.com',
            password: hashedPassword,
            role: 'super_agent',
            createdBy: null,
            isActive: true
        });

        console.log('Super agent created successfully!');
        console.log('Email: admin@craftwear.com');
        console.log('Password: admin123');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createSuperAgent();
