const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON requests

// In-memory storage for expenses
const expenses = [];
const predefinedCategories = ["Food", "Travel", "Bills", "Entertainment", "Other"];

// 1. Add Expense
app.post("/expenses", (req, res) => {
  const { category, amount, date } = req.body;

  // Validate inputs
  if (!predefinedCategories.includes(category)) {
    return res.status(400).json({ status: "error", error: "Invalid category." });
  }
  if (amount <= 0) {
    return res.status(400).json({ status: "error", error: "Amount must be positive." });
  }

  // Add the expense to memory
  const expense = { id: expenses.length + 1, category, amount, date: new Date(date) };
  expenses.push(expense);

  res.json({ status: "success", data: expense });
});

// 2. Get Expenses
app.get("/expenses", (req, res) => {
  const { category, startDate, endDate } = req.query;

  let filteredExpenses = expenses;

  // Filter by category
  if (category) {
    filteredExpenses = filteredExpenses.filter(exp => exp.category === category);
  }

  // Filter by date range
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    filteredExpenses = filteredExpenses.filter(exp => exp.date >= start && exp.date <= end);
  }

  res.json({ status: "success", data: filteredExpenses });
});

// 3. Analyze Spending
app.get("/expenses/analysis", (req, res) => {
  const analysis = predefinedCategories.map(category => {
    const total = expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { category, total };
  });

  const highestSpendingCategory = analysis.reduce((max, cat) =>
    (cat.total > max.total ? cat : max), { category: null, total: 0 });

  res.json({
    status: "success",
    data: {
      analysis,
      highestSpendingCategory
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Expense Tracker API running on http://localhost:${3000}`));
