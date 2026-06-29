const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const homepageResponse = require("./responses/homepageResponse.json");
const utilityResponse = require("./responses/utilityResponse.json");
const menuResponse = require("./responses/menuResponse.json");
const profileResponse = require("./responses/profileResponse.json");
const packageChangeResponse = require("./responses/packageChangeResponse.json");
const authorizationResponse = require("./responses/authorizationResponse.json");
const companyResponse = require("./responses/companyResponse.json");
const loginResponse = require("./responses/loginResponse.json");
const logoutResponse = require("./responses/logoutResponse.json");
const token = require("./responses/token.json");
const packageDetailsResponse = require("./responses/packageDetailsResponse.json");
const packageChangeTriggerResponse = require("./responses/packageChangeTriggerResponse.json");

//utility
app.post("/syncpass/payment/utility_payment", (req, res) => {
  res.json(utilityResponse);
});

app.get("/syncpass/payment/utility_payment", (req, res) => {
  res.json(utilityResponse);
});

//menu
app.post("/syncpass/atomic/get_menu", (req, res) => {
  const { business_name } = req.body;

  if (business_name !== "menu_tree") {
    return res.status(400).json({
      result: "error",
      message: "business_name düzgün deyil",
    });
  }

  res.json(menuResponse);
});

app.get("/syncpass/atomic/get_menu", (req, res) => {
  res.json(menuResponse);
});

//profile
app.post("/syncpass/profile", (req, res) => {
  const { action } = req.body;

  if (action !== "info") {
    return res.status(400).json({
      result: "error",
      message: "action düzgün deyil",
    });
  }

  res.json(profileResponse);
});
app.get("/syncpass/profile", (req, res) => {
  res.json(profileResponse);
});

//homepage
app.get("/syncpass/main/homepage", (req, res) => {
  res.json(homepageResponse);
});

app.post("/syncpass/main/homepage", (req, res) => {
  res.json(homepageResponse);
});

//packageChange
app.get("/syncpass/package/package_change", (req, res) => {
  res.json(packageChangeResponse);
});

app.post("/syncpass/package/package_change", (req, res) => {
  const body = req.body;

  const isPackageChangeTrigger =
    body.form_name === "order_list" &&
    body.action === "trigger" &&
    body.form_id === "dynamic" &&
    body.form_data?.col_id === "package_id" &&
    body.form_data?.object_id === "packages" &&
    body.form_data?.type === "table";

  if (isPackageChangeTrigger) {
    return res.json(packageChangeTriggerResponse);
  }

  res.json(packageChangeResponse);
});

//authorization
app.post("/syncpass/authorization", (req, res) => {
  const body = req.body;

  // 1. Login mərhələsi
  if (
    body.form_id === "login" &&
    body.login_type === "userpass" &&
    body.username === "admin" &&
    body.password === "admin"
  ) {
    return res.json(authorizationResponse);
  }

  // 2. Company seçimi mərhələsi
  if (body.form_id === "company_list" && Number(body.company_id) === 1929) {
    return res.json(companyResponse);
  }

  return res.status(400).json({
    result: "error",
    message: "Payload düzgün deyil",
  });
});

app.get("/syncpass/authorization", (req, res) => {
  const { form_id, login_type, username, password, company_id } = req.query;

  // login mərhələsi
  if (
    form_id === "login" &&
    login_type === "userpass" &&
    username === "admin" &&
    password === "admin"
  ) {
    return res.json(authorizationResponse);
  }

  // company seçimi mərhələsi
  if (form_id === "company_list" && Number(company_id) === company_id) {
    return res.json(companyResponse);
  }

  res.status(400).json({
    result: "error",
    message: "GET query düzgün deyil",
  });
});

//token
app.get("/syncpass/generate_token", (req, res) => {
  res.json(token);
});

//login
app.get("/syncpass/login", (req, res) => {
  res.json(loginResponse);
});

//logout
app.get("/syncpass/logout", (req, res) => {
  res.json(logoutResponse);
});

// package details

app.post("/syncpass/package_details", (req, res) => {
  const body = req.body;

  const isPackageDetails =
    body.action === "trigger" &&
    body.form_id === "dynamic" &&
    body.form_data?.col_id === "package_id" &&
    body.form_data?.object_id === "packages";

  if (isPackageDetails) {
    return res.json(packageDetailsResponse);
  }

  return res.status(400).json({
    result: "error",
    message: "Payload düzgün deyil",
  });
});

app.get("/syncpass/package/package_details", (req, res) => {
  if (String(req.query.id_list) === "433710") {
    return res.json(packageChangeTriggerResponse);
  }

  res.json(packageDetailsResponse);
});

app.post("/syncpass/package/package_details", (req, res) => {
  if (String(req.query.id_list) === "433710") {
    return res.json(packageChangeTriggerResponse);
  }

  res.json(packageDetailsResponse);
});

// atomic trigger
app.post("/syncpass/atomic/trigger", (req, res) => {
  const body = req.body;

  const isPackageDetails =
    body.action === "trigger" &&
    body.form_id === "dynamic" &&
    body.form_data?.col_id === "package_id" &&
    body.form_data?.object_id === "packages";

  if (isPackageDetails) {
    return res.json(packageDetailsResponse);
  }

  return res.status(400).json({
    result: "error",
    message: "Payload düzgün deyil",
  });
});

app.get("/syncpass/package_details", (req, res) => {
  res.json(packageDetailsResponse);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
