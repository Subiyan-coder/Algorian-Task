const clearRefreshToken = (res) => {
    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0)
    });
};

module.exports = { clearRefreshToken };