import { Link } from "react-router-dom"


function Home() {

  return (
    <>
      <div className="my-10 px-30">
        <div className="my-4">
          <h1 className="text-center text-3xl font-bold">🎓 Welcome to TECHXAGON CBT TEST</h1>
          <p className="text-sm text-center mt-2 font-semibold">Please read the instructions carefully before starting.</p>
        </div>
        <hr className="w-3/5 mx-auto text-gray-300" />
        <div className="my-4">
          <h3 className="text-lg font-semibold">📘 Exam details</h3>
          <ul>
            <li>Number of Questions: 20</li>
            <li>Time Limit: 5 minutes</li>
            <li>Type: Multiple choice</li>
            <li>Scoring: 3 points per correct answer. No negative marking.</li>
          </ul>
        </div>

        <div className="my-4">
          <h3 className="text-lg font-semibold">📖 Rules</h3>
          <ul>
            <li>Do not refresh or close your browser during the test.</li>
            <li>Only one attempt is allowed.</li>
            <li>Make sure your internet connection is stable.</li>
          </ul>
        </div>
        
        <div className="my-4">
          <h3 className="text-lg font-semibold">✅ After Submission</h3>
          <ul>
            <li>Your score will be shown immediately.</li>
            <li>You will be able to download your result.</li>
          </ul>
        </div>

        <p className="italic">By clicking Start Exam, you confirm that you will complete this test honestly and independently.</p>
        <Link to={"/login"} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 inline-block">Start</Link>
      </div>
    </>
  )
}

export default Home
