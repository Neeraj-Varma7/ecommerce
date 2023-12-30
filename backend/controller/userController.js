import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/usersModel.js";
import generateToken from "../utils/generateToken.js";

//fetches the auth user and get token, 
//post /api/users/login
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ 'email': { $eq: email } });
    
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

//fetches the auth user and get token, 
//post /api/users
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password,
    });
    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//log out user/clear cookie,
//post /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

//get profile,
//get /api/users/profile private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error('User not Found');
    }
});

//upfate profile,
//put /api/users/profile private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updateUser = user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        })
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});

//get users private admin function,
//put /api/users private
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

//get users by id private admin function,
//put /api/users/:id private
const getUsersByID = asyncHandler(async (req, res) => {
    const users = await User.findById(req.params.id).select('-password');
    if (users) {
        return res.json(users);
    }
    else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

//delete users private admin function,
//delete /api/users/:id private
const deleteUsers = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(404);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({ _id: user._id })
        res.status(200).json({ message: 'user deleted successfully' });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});

//update user,
//put /api/users/:id private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }

    res.send('update user');
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUsers,
    getUsersByID,
    updateUser,
};