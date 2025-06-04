const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const School = require('../models/school.model');
const Member = require('../models/member.model');
const Collector = require('../models/collector.model');
const generateToken = require('../utils/generateToken');

// School Register
exports.registerSchool = async (req, res) => {
    try {
        const { name, code, email, password, address } = req.body;
        const logoUrl = req.file ? req.file.path : null;

        // Check for existing email
        const existing = await School.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Create school record
        const school = await School.create({
            name,
            code,
            email,
            address,
            logoUrl,
            password: hashed,
        });

        res.status(201).json({
            token: generateToken({ id: school._id, role: 'school' }),
            user: {
                id: school._id,
                name: school.name,
                code: school.code,
                email: school.email,
                address: school.address,
                logoUrl: school.logoUrl,
            },
        });
    } catch (err) {
        console.error('Error registering school:', err);
        res.status(500).json({ message: 'Server error while registering school' });
    }
};

// School Login
exports.loginSchool = async (req, res) => {
    try {
        const { email, password } = req.body;
        const school = await School.findOne({ email });
        if (!school) return res.status(404).json({ message: 'School not found' });

        const valid = await bcrypt.compare(password, school.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            token: generateToken({ id: school._id, role: 'school' }),
            user: { id: school._id, name: school.name, code: school.code }
        });
    } catch (err) {
        console.error('Error login school:', err);
        res.status(500).json({ message: 'Server error while registering school' });
    }
};


exports.registerMember = async (req, res) => {
    try {
        const { username, email, password, schoolId } = req.body;

        const existing = await Member.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const member = await Member.create({ username, email, password: hashed, school: schoolId });
        res.status(201).json({
            token: generateToken({ id: member._id, role: 'member' }),
            user: { id: member._id, username: member.username, schoolId: member.school }
        });
    } catch (err) {
        console.error('Error registering member:', err);
        res.status(500).json({ message: 'Server error while registering school' });
    }
};

exports.loginMember = async (req, res) => {
    try {
        const { email, password } = req.body;
        const member = await Member.findOne({ email }).populate('school');
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const valid = await bcrypt.compare(password, member.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            token: generateToken({ id: member._id, role: 'member' }),
            user: { id: member._id, username: member.username, school: member.school.name, schoolId: member.school._id }
        });
    } catch (err) {
        console.error('Error login member:', err);
        res.status(500).json({ message: 'Server error while registering school' });
    }
};


exports.registerCollector = async (req, res) => {
    try {
        const { name, email, password, schoolId } = req.body;

        const existing = await Collector.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const collector = await Collector.create({ name, email, password: hashed, school: schoolId });
        res.status(201).json({
            token: generateToken({ id: collector._id, role: 'collector' }),
            user: { id: collector._id, name: collector.name, schoolId: collector.school }
        });
    } catch (err) {
        console.error('Error registering collector:', err);
        res.status(500).json({ message: 'Server error while registering school' });
    }
};


exports.loginCollector = async (req, res) => {
    try {
        const { email, password } = req.body;
        const collector = await Collector.findOne({ email }).populate('school');
        if (!collector) return res.status(404).json({ message: 'Collector not found' });

        const valid = await bcrypt.compare(password, collector.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            token: generateToken({ id: collector._id, role: 'collector' }),
            collector: { id: collector._id, name: collector.name, school: collector.school.name, schoolId: collector.school._id }
        });
    } catch (err) {
        console.error('Error login collectot:', err);
        res.status(500).json({ message: 'Server error while registering school' });
    }
};


exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await Member.findOne({ email });
        let role = 'member';

        if (!user) {
            user = await School.findOne({ email });
            role = 'school';
        }

        if (!user) {
            user = await Collector.findOne({ email });
            role = 'collector';
        }

        if (!user) return res.status(404).json({ message: 'Email is not registered' });

        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // In production: send token via email
        res.json({ message: 'Password reset token generated', token });
    } catch (err) {
        console.error('Error sending token:', err);
        res.status(500).json({ message: 'Server error while registering school' });
    }
};


exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decoded;

        let Model;
        if (role === 'member') Model = Member;
        else if (role === 'school') Model = School;
        else if (role === 'collector') Model = Collector;
        else return res.status(400).json({ message: 'Invalid role in token' });

        const user = await Model.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ message: 'Server error while registering school' });
    }
};


