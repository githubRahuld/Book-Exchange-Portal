import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId);

		const refreshToken = await user.generateRefreshToken();
		const accessToken = await user.generateAccessToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });
		//validateBeforeSave:false = jisse validation check na ho kyouki we didnt give all fields here

		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"Something went wrong while generating refresh and access tokens"
		);
	}
};

const registerUser = asyncHandler(async (req, res) => {
	const { fullName, email, password, mobileNumber, role } = req.body;

	if (
		[fullName, email, password, mobileNumber, role].some(
			(field) => field?.trim() === ""
		)
	) {
		// throw new ApiError(400, "All field are required");
		return res
			.status(400)
			.json(new ApiResponse(400, {}, "All field are required"));
	}

	const existedUser = await User.findOne({
		email,
	});

	if (existedUser) {
		return res
			.status(409)
			.json(new ApiResponse(409, {}, "User with email already exists"));
	}

	const user = await User.create({
		fullName,
		email,
		password,
		mobileNumber,
		role,
	});

	const createdUser = await User.findById(user._id).select("-password");

	if (!createdUser) {
		return res
			.status(500)
			.json(
				new ApiResponse(
					500,
					{},
					"Something went wrong while registering user!"
				)
			);
	}

	if (!createdUser) {
		// throw new ApiError(500, "Something went wrong while registering user!");
		return res
			.status(500)
			.json(
				new ApiResponse(
					500,
					{},
					"Something went wrong while registering user!"
				)
			);
	}

	return res
		.status(201)
		.json(
			new ApiResponse(201, createdUser, "User Registered Successfully :)")
		);
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!(email && password)) {
		// throw new ApiError(400, "Email and Password is required");
		return res
			.status(400)
			.json(new ApiResponse(400, {}, "Email and Password is required"));
	}

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json(new ApiResponse(400, {}, "User not found"));
	}

	const isPassValid = await user.isPasswordCorrect(password);

	if (!isPassValid) {
		// throw new ApiError(401, "Invalid credentials");
		return res
			.status(401)
			.json(new ApiResponse(401, {}, "Invalid credentials"));
	}

	const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
		user._id
	);

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("resfreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: loggedInUser,
					accessToken,
					refreshToken,
				},
				"User successfully logged In"
			)
		);
});

const logout = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1,
			},
		},
		{
			new: true,
		}
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logout };
