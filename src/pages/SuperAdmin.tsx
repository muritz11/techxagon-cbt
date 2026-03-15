import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Download,
  Eye,
  Lock,
  LogOut,
  User,
  Calendar,
  Award,
  Search,
} from "lucide-react";
import type { QuizResultInterface } from "../utils/types";
import StudentClasses from "../assets/data/classes.json";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
const API_URL = import.meta.env.VITE_API_URL; // ← Vite uses import.meta.env not process.env

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [showClearPrompt, setShowClearPrompt] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [total, setTotal] = useState(0);
  const [overallTotal, setOverallTotal] = useState(0);
  const [password, setPassword] = useState("");
  const [results, setResults] = useState<QuizResultInterface[]>([]);
  const [selectedResult, setSelectedResult] =
    useState<QuizResultInterface | null>(null);
  const [error, setError] = useState("");

  const [selectedClass, setSelectedClass] = useState(
    StudentClasses?.[0]?.value,
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // const fetchResults = async () => {
  //   try {
  //     setLoading(true);
  //     const params = new URLSearchParams();
  //     if (searchQuery) params.append("name", searchQuery);
  //     if (selectedClass) params.append("class", selectedClass);

  //     const response = await fetch(
  //       `${API_URL}/result/all?${params.toString()}`,
  //     );
  //     const data = await response.json();

  //     console.log("result fetch response", data);
  //     if (!response.ok) alert(`result fetch failed: ${data?.message}`);
  //     setResults(data?.data);
  //     setTotal(data?.total);
  //     setOverallTotal(data?.totalSubmitted);
  //   } catch (error) {
  //     console.log("fetch result failed: ", error);
  //     alert("An error occurred fetching results");
  //     // toast.error((error as Error).message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // fetch on mount

  useEffect(() => {
    searcher(searchQuery, selectedClass);
  }, [searchQuery, selectedClass]);

  // refetch when class dropdown changes
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  // refetch when search is triggered manually (Enter or Button)
  const handleSearch = () => {
    debouncedSearch.cancel();
    setSearchQuery(searchInput);
  };

  // clear all filters
  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedClass(StudentClasses?.[0]?.value);
  };

  const abortController = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const searcher = useCallback(
    async (searchQuery?: string, selectedClass?: string) => {
      if (abortController.current) abortController.current.abort();

      const controller = new AbortController();
      abortController.current = controller;
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append("name", searchQuery);
        if (selectedClass) params.append("class", selectedClass);

        const response = await fetch(
          `${API_URL}/result/all?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );
        const data = await response.json();

        console.log("result fetch response", data);
        if (!response.ok) alert(`result fetch failed: ${data?.message}`);
        setResults(data?.data);
        setTotal(data?.total);
        setOverallTotal(data?.totalSubmitted);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          ((error as { name: string }).name === "AbortError" ||
            (error as { name: string }).name === "CanceledError")
        )
          return;
        console.log("fetch result failed: ", error);
        alert("An error occurred fetching results");
        // toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, 500),
    [],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123" || password === "Pass1234$") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setSelectedResult(null);
    navigate("/");
  };

  const downloadAllResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quiz-results-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = [
      "Student Name",
      "Class",
      "Date",
      "Score",
      "Total Questions",
      "Percentage",
    ];
    const rows = results.map((result) => {
      // const [correct, total] = result.score.split("/").map(Number);
      const correct = result.score;
      const total = result.totalQuestions;
      const percentage = ((correct / total) * 100).toFixed(1);
      return [
        result.student?.name,
        result.student?.class,
        result.date,
        result.score * result.questionWeight,
        total * result.questionWeight,
        `${percentage}%`,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quiz-results-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadIndividualResult = (result: QuizResultInterface) => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.student?.name}-${result.date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (weightedScore: number) => {
    if (weightedScore >= 40) return "text-green-600";
    if (weightedScore >= 20) return "text-yellow-600";
    return "text-red-600";
  };

  let tableCount = 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-full">
              <Lock className="text-indigo-600" size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Super Admin Login
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Enter password to access online results
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (selectedResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <button
              onClick={() => setSelectedResult(null)}
              className="mb-6 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Results
            </button>

            <div className="border-b pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedResult.student?.name}'s Quiz Result
              </h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={16} />
                  <span>
                    Class:{" "}
                    {StudentClasses?.find(
                      (val) => val.value === selectedResult.student?.class,
                    )?.label || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(selectedResult.date).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award
                    size={16}
                    className={getScoreColor(
                      selectedResult.score * selectedResult.questionWeight,
                    )}
                  />
                  <span
                    className={`font-bold ${getScoreColor(
                      selectedResult.score * selectedResult.questionWeight,
                    )}`}
                  >
                    Score:{" "}
                    {selectedResult.score * selectedResult.questionWeight}/
                    {selectedResult.totalQuestions *
                      selectedResult.questionWeight}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedResult.selectedQuestions.map((q, idx) => {
                const userAnswer = selectedResult.selectedAnswers[idx];
                const isCorrect = userAnswer === q.answer;

                return (
                  <div
                    key={idx}
                    className="border-2 border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {userAnswer ? (
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            isCorrect ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {isCorrect ? "✓" : "✗"}
                        </div>
                      ) : (
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-gray-500
                        }`}
                        >
                          {"✗"}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-3">
                          {idx + 1}. {q.question}
                        </h3>
                        {!userAnswer ? (
                          <p className="italic text-red-800 mb-3">
                            {"No answer provided"}
                          </p>
                        ) : (
                          ""
                        )}
                        <div className="space-y-2 mb-3">
                          {q.options.map((option, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-lg border-2 ${
                                option === q.answer
                                  ? "border-green-500 bg-green-50"
                                  : option === userAnswer
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              {option}
                              {option === q.answer && (
                                <span className="ml-2 text-green-600 font-semibold text-sm">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {option === userAnswer && option !== q.answer && (
                                <span className="ml-2 text-red-600 font-semibold text-sm">
                                  ✗ Student's Answer
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Explanation:</span>{" "}
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quiz Results Dashboard
              </h1>
              <p className="text-gray-600">Total submissions: {total}</p>
              <p className="text-gray-600">
                Overall Total submissions: {overallTotal}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {
            <>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={downloadAllResults}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download size={18} />
                  Download All (JSON)
                </button>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  <Download size={18} />
                  Download Summary (CSV)
                </button>
              </div>

              {/* 👇 Filter bar */}
              <div className="flex flex-wrap gap-3 mb-6">
                {/* Class dropdown */}
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">All Classes</option>
                  {StudentClasses.map((cls) => (
                    <option key={cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))}
                </select>

                {/* Search input + button */}
                <div className="flex gap-2 flex-1">
                  <input
                    type="text"
                    value={searchInput}
                    ref={inputRef}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchInput(value);
                      debouncedSearch(value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search by student name..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Search size={18} />
                    Search
                  </button>
                  {/* Clear filters */}
                  {searchQuery && (
                    <button
                      onClick={handleClear}
                      className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {showClearPrompt ? (
                <p className="mb-6">
                  Are you sure you want to clear all result records?{" "}
                  <span
                    className="hover:text-green-600 cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem("results");
                      location.reload();
                    }}
                  >
                    Yes
                  </span>{" "}
                  /{" "}
                  <span
                    className="hover:text-gray-600 cursor-pointer"
                    onClick={() => setShowClearPrompt(!showClearPrompt)}
                  >
                    No
                  </span>
                </p>
              ) : (
                ""
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        #
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Student Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Class
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Paper
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Score
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-gray-400"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : results.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-gray-400"
                        >
                          No results found.
                        </td>
                      </tr>
                    ) : (
                      results.map(
                        (
                          result,
                          idx // 👈 swap results → filteredResults
                        ) => {
                          tableCount++;
                          return (
                            <tr
                              key={idx}
                              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-4 text-gray-600">
                                {tableCount}
                              </td>
                              <td
                                className="py-4 px-4 font-medium text-gray-800 capitalize cursor-pointer"
                                onClick={() => setSelectedResult(result)}
                              >
                                {result.student?.name}
                              </td>
                              <td className="py-4 px-4 text-gray-600">
                                {StudentClasses?.find(
                                  (val) => val.value === result.student?.class
                                )?.label || "N/A"}
                              </td>
                              <td className="py-4 px-4 text-gray-600 text-sm">
                                {new Date(result.date).toLocaleString()}
                              </td>
                              <td className="py-4 px-4">
                                <span>{result.student?.paperTitle || "-"}</span>
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`font-bold ${getScoreColor(
                                    result.score * result.questionWeight
                                  )}`}
                                >
                                  {`${result.score * result.questionWeight}/${
                                    result.totalQuestions *
                                    result.questionWeight
                                  }`}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => setSelectedResult(result)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="View Details"
                                  >
                                    <Eye size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      downloadIndividualResult(result)
                                    }
                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                    title="Download"
                                  >
                                    <Download size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
