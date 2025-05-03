const User = require('../../client/models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};