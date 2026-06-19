const user = require('../models/user');

const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        
        if (!role || !['admin', 'staff'].includes(role)) {
            return res.status(400).json({ message: 'valid role is Required' });
        }
        const users = await user.find({ role }).select('name email contact');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getUsersByRole };