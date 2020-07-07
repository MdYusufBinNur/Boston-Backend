const {validationResult} = require('express-validator');
const User = require('../../../Models/User');
const Profile = require('../../../Models/Profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

module.exports = {
    login : async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
        }


        const { email, password } = req.body;
        //console.log(email);

        try {
            let user = await User.findOne({ email });
            if (!user){
                return  res.status(400).json({ errors: [{ msg: 'Invalid Credentials Email' }]});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch){
                return  res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]});
            }

            const profileId = await Profile.findOne({user: user.id});
            const payload ={
                user: {
                    id: user.id,
                    type: user.user_type,
                    profileId: profileId.id
                }
            };
            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                });

        }catch (err) {
            //console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    get : async (req, res) => {
        try{
            const user = await User.findById(req.user.id).select('-password');
            await res.json(user);
        }catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error')
        }
    }

}
