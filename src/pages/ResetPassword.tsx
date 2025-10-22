function ResetPassword() {
    return (
        <div>
            <div className="flex min-h-screen">
            <div className="relative w-1/2 bg-white flex items-center justify-center">
                <div className="absolute top-0 left-0 p-6">
                    <img src="public/images/Navonous_Logo.png" alt="Navonous Logo" className="h-auto w-32" />
                </div>
                <img className="h-auto max-w-full" src="public/images/Reset_Password.png" alt="image description" />
            </div>

            {/* Right Side */}
            <div className="relative w-1/2 bg-gray-100 flex items-center justify-center">
                <div className="w-full max-w-md px-8 py-12">
                <h2 className="text-3xl font-bold mb-8">Reset Password</h2>

                <form>
                <label className="block text-gray-700 font-medium mb-2">Enter New Password</label>
                <input className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none rounded-lg" type="password" />

                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                <input className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none rounded-lg" type="password" />

                <button className="w-full bg-blue-900 text-white py-3 rounded text-lg font-semibold mb-4 rounded-lg">Set Password</button>
                </form>
            </div>
            </div>
            </div>
        </div>
    );
}

export default ResetPassword;