import React, { useState } from "react";

const LoanEligibilityChecker = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    salary: "",
    existingEmi: "",
    loanAmount: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setResult(null);
    setError("");
  };

  const checkEligibility = () => {
    const { name, age, salary, existingEmi, loanAmount } = formData;

    // Input validation
    if (!name || !age || !salary || !existingEmi || !loanAmount) {
      setError("Please fill in all fields.");
      setResult(null);
      return;
    }

    const ageNum = Number(age);
    const salaryNum = Number(salary);
    const emiNum = Number(existingEmi);
    const loanNum = Number(loanAmount);

    if (
      ageNum < 18 ||
      ageNum > 100 ||
      salaryNum <= 0 ||
      emiNum < 0 ||
      loanNum <= 0
    ) {
      setError("Please enter realistic values.");
      setResult(null);
      return;
    }

    // Eligibility Rules
    const proposedEmi = loanNum / 12; // simple assumption (1-year repayment)
    const dti = ((emiNum + proposedEmi) / salaryNum) * 100;
    const eligibleReasons = [];

    if (dti <= 60 && ageNum >= 21 && ageNum <= 60 && loanNum <= 10 * salaryNum)
      eligibleReasons.push("Eligible for the loan");

    let eligibility = true;
    const reasons = [];

    if (dti > 60) {
      eligibility = false;
      reasons.push(`High DTI (${dti.toFixed(2)}%) exceeds 60%`);
    }
    if (ageNum < 21 || ageNum > 60) {
      eligibility = false;
      reasons.push("Age should be between 21 and 60");
    }
    if (loanNum > 10 * salaryNum) {
      eligibility = false;
      reasons.push(
        `Requested loan exceeds 10x monthly salary (max ₹${10 * salaryNum})`
      );
    }

    setResult({
      eligible: eligibility,
      message: eligibility
        ? "Congratulations! You are eligible for the loan."
        : `Not Eligible: ${reasons.join(", ")}`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Loan Eligibility Checker
        </h1>

        <div className="space-y-4">
          {["name", "age", "salary", "existingEmi", "loanAmount"].map((field) => (
            <div key={field}>
              <label className="block font-medium text-gray-700 capitalize">
                {field === "existingEmi"
                  ? "Existing EMI/Debts (₹)"
                  : field === "salary"
                  ? "Monthly Salary (₹)"
                  : field === "loanAmount"
                  ? "Loan Amount Requested (₹)"
                  : field}
              </label>
              <input
                type={
                  field === "name" ? "text" : "number"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}

          {error && <p className="text-red-600 font-medium">{error}</p>}

          <button
            onClick={checkEligibility}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Check Loan Eligibility
          </button>

          {result && (
            <div
              className={`mt-4 p-3 rounded-lg text-center font-semibold ${
                result.eligible ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
              }`}
            >
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanEligibilityChecker;
