import session from 'express-session';
import User from '../models/userModel.js';

export const login = async (req, res, next) => {
    try{
        const{email, password_hash} = req.body;
        const user = await User.findOne({email});

        if(!user) throw new Error('Incorrect login data');
        
        const validPassword = await user.passwordIsValid(password_hash);

        if (!validPassword) throw new Error('Incorrect login data');

        req.session.userId = user._id;
        req.session.userEmail = user.email;
        req.session.userName = user.name;
        req.session.isLoggedIn = true;

        await new Promise(resolve,reject){
            req.session.save((err)=> {
                if (err) reject(err);
                else resolve();
            })
        }

        res.json({
            sucess: true,
            message: 'User logged in sucefully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                address: user.address,
                phoneNumber: user.phoneNumber
        },
            session:{  
                isLoggedIn: true,
                sessionId: req.sessionID}
            });
    }catch(err){
        next(err)
    }
}
