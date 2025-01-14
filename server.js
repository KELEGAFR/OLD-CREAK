const express = require('express');
const fetch = require('node-fetch'); // Install using `npm install node-fetch`

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000

async function req(url) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    throw new Error("Network Error");
  }
}

async function checkToolControl() {
  const data = await req("https://raw.githubusercontent.com/KELEGAFR/MR-SEXY/refs/heads/main/Toolcontrolon.txt");
  if (data.trim() !== "ON") {
    return { message: "OFF" };
  }
}

async function checkStatus() {
  const data = await req("https://raw.githubusercontent.com/KELEGAFR/MR-SEXY/refs/heads/main/Status.txt");
  if (data.trim() === "TRIAL") {
    return "TRIAL";
  } else if (data.trim() === "PAID") {
    return "PAID";
  } else {
    throw new Error("Network Error");
  }
}

async function checkBlock(key) {
  const data = await req("https://raw.githubusercontent.com/KELEGAFR/MR-SEXY/refs/heads/main/Block.txt");
  if (data.includes(key)) {
    return { message: "Blocked" };
  }
}

async function checkApproval(key) {
  const data = await req("https://raw.githubusercontent.com/KELEGAFR/MR-SEXY/refs/heads/main/approble.txt");
  if (!data.includes(key)) {
    return { message: "Check" };
  }
}

function executeCustomFunctionality() {
  // Add your custom functionality here
  return { message: "Active" };
}

// Define API endpoint
app.get('/api', async (req, res) => {
  try {
    const key = req.query.key || "";
    if (!key) {
      return res.status(400).json({ error: "Key is required." });
    }

    await checkToolControl(); // Step 1: Check tool control
    const status = await checkStatus(); // Step 2: Check status
    await checkBlock(key); // Step 3: Check if key is blocked

    if (status === "PAID") {
      await checkApproval(key); // Step 4: Check if the user is paid
    }

    // If all checks pass, execute functionality
    const response = executeCustomFunctionality();
    res.status(200).json(response);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});