

function Login() {

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-center mb-6">Student Information</h1>

                    <form className="space-y-4">

                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Class Input */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Class</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Enter your class"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3 pt-4">
                            <button
                                type="button"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                Start Quiz
                            </button>

                            <button
                                type="button"
                                className="w-full border border-gray-400 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                                Admin Login
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
