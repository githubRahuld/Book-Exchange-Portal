import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
	{
		email: {
			type: String,
			lowercase: true,
			trim: true,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			lowercase: true,
			trim: true,
			required: true,
			index: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			min: [6, "Password must be atleast 6 char"],
		},
		mobileNumber: {
			type: String,
			required: [true, "Mobile Number is required"],
			min: [10, "Password must be atleast 10 char"],
		},
		role: {
			type: String,
			enum: ["owner", "seeker"],
			default: "seeker",
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // if user not modified passward then return

	this.password = await bcrypt.hash(this.password, 10); //else
	next();
});

//custom methods to check the password
userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password); //return true or false
};

// syntax:- jwt.sign(payload, secretOrPrivateKey, [options, callback])
userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullName: this.fullName,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

export const User = mongoose.model("User", userSchema);
