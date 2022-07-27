const express = require("express")
const session = require("express-session")

const createUserrequest = require("./lib/createUserRequest")
const getUserrequest = require("./lib/getUserRequest")
const approveUserrequest = require("./lib/approveUserRequest")
const rechargeUserAccount = require("./lib/rechargeUserAccount")
const viewUser = require("./lib/viewUser")
const propertyRegistration = require("./lib/propertyRegistrationRequest")
const approveProperty = require("./lib/approvePropertyRegistration ")
const getAllApproveProperty = require("./lib/getApproveProperty")
const viewProperty = require("./lib/viewProperty")
const updateProperty = require("./lib/updateProperty")
const buyProperty = require("./lib/purchaseProperty")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* URL exposed so that user can create a request to register in block chain  **/

app.post("/createuserrequest", async (req, res) => {
  let value = await createUserrequest.execute(
    req.body.Name,
    req.body.Email,
    req.body.PhoneNumber,
    req.body.AadharNumber
  )
  res.status(201).send(value)
})

/* URL exposed for approving  user request  **/

app.post("/approveuserrequest", async (req, res) => {
  let value = await approveUserrequest.execute(
    req.body.Name,
    req.body.AadharNumber
  )
  res.status(200).send(value)
})

/* URL exposed for recharge approved user account  **/

app.post("/rechargeuseraccount", async (req, res) => {
  let value = await rechargeUserAccount.execute(
    req.body.Name,
    req.body.AadharNumber,
    req.body.TXID
  )
  res.status(200).send(value)
})

/* URL exposed for property registration request from approved user  **/

app.post("/propertyregistration", async (req, res) => {
  let value = await propertyRegistration.execute(
    req.body.Name,
    req.body.AadharNumber,
    req.body.PropertyId,
    req.body.Price,
    req.body.PropertyStatus
  )
  res.status(200).send(value)
})

/* URL exposed for approve  property registration request   **/

app.post("/approveproperty", async (req, res) => {
  try {
    let value = await approveProperty.execute(req.body.PropertyId)
    res.status(200).send(value)
  } catch (error) {
    res.status(500).send(error)
  }
})

/* URL exposed for view approve  property  **/

app.post("/viewproperty", async (req, res) => {
  try {
    let value = await viewProperty.execute(req.body.PropertyId)
    res.status(200).send(value)
  } catch (error) {
    res.status(500).send(error)
  }
})

/* URL exposed for user who own the approve property can update propertu status  **/

app.post("/updateproperty", async (req, res) => {
  try {
    let value = await updateProperty.execute(
      req.body.PropertyId,
      req.body.Name,
      req.body.AadharNumber,
      req.body.PropertyStatus
    )
    res.status(200).send(value)
  } catch (error) {
    res.status(500).send(error)
  }
})

/* URL exposed for approve user can buy approve  property   **/

app.post("/buyproperty", async (req, res) => {
  try {
    let value = await buyProperty.execute(
      req.body.PropertyId,
      req.body.BuyerName,
      req.body.BuyerAadharNumber
    )
    res.status(200).send(value)
  } catch (error) {
    res.status(500).send(error)
  }
})

/* URL exposed to get all the approve property   **/

app.get("/getallapproveproperty", async (req, res) => {
  try {
    let value = await getAllApproveProperty.execute()
    res.status(200).send(value)
  } catch (error) {
    res.status(500).send(error)
  }
})

/* URL exposed view approve user   **/

app.get("/viewuser", async (req, res) => {
  let value = await viewUser.execute(req.body.Name, req.body.AadharNumber)
  res.status(200).send(value)
})

/* URL exposed for to see all the user request  **/

app.get("/getuserrequest", async (req, res) => {
  let value = await getUserrequest.execute()

  res.send(value)
})

app.listen(3000, () => {
  console.log("Server is running.....")
})
