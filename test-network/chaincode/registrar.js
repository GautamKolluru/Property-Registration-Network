"use strict"
const {
  getUserRequesDetails,
  generateUserRequestCompositKey,
  getClientAddress,
  getDataFromLedger,
  generateUserApprovedCompositKey,
  updateLedger,
  generateRegistrationRequestCompositKey,
  generateRegistrationApprovedCompositKey,
  getPropertyRegistrationAllRequest,
} = require("./ledger.js")
const { Contract } = require("fabric-contract-api")

class UsersContract extends Contract {
  constructor() {
    // Provide a custom name to refer to this smart contract
    super("org.property-registration-network.registrar.regnet")
  }

  // This is a basic user defined function used at the time of instantiating the smart contract
  // to print the success message on console
  async instantiate(ctx) {
    console.log("Registrar regnet Smart Contract Instantiated")
  }

  /**
   * This function store the authorized user details
   * @returns - authorize user array
   */
  authorizeUsers() {
    let userAddress = [
      "peer0.registrar.property-registration-network.com",
      "peer1.registrar.property-registration-network.com",
    ]
    return userAddress
  }

  /**
   * Register can use this method to see all the user request that was not approved
   * @param ctx - The transaction context
   * @returns - all the user request data
   */

  async getNewUserRequest(ctx) {
    const dataSet = await getUserRequesDetails(ctx, "request")
    return dataSet
  }

  /**
   * Register can use this method to see all approved user details
   * @param ctx - The transaction context
   * @returns - all approved user data
   */
  async getAllApprovedUsers(ctx) {
    // let userAddress = this.authorizeUsers()

    // const address = getClientAddress(ctx.clientIdentity.getID())
    // if (!userAddress.includes(address)) {
    //   throw new Error("Only Authorized users can access!!!")
    // }
    const dataSet = await getUserRequesDetails(ctx, "approved")
    return dataSet
  }

  /**
   * Approve new user request and create assert in network
   * @param ctx - The transaction context
   * @param name - name of the user
   * @param aadharNumber - user addhar number
   * @returns
   */
  async approveNewUser(ctx, name, aadharNumber) {
    // const registerAddress = this.authorizeUsers()
    // const identity = getClientAddress(ctx.clientIdentity.getID())
    // const authorized = registerAddress.includes(identity)
    let updatedData = {}

    const userRequestKey = await generateUserRequestCompositKey(
      ctx,
      name,
      aadharNumber
    )
    /* Condition to check that user request for given user exist  **/
    const data = await getDataFromLedger(ctx, userRequestKey)
    if (data == undefined) {
      return "New user request not exist"
    } else {
      data.Status = "Approved"
      updatedData = {
        ...data,
        upgradCoins: 0,
      }

      //creating approved assert in ledger
      const userApprovedKey = await generateUserApprovedCompositKey(
        ctx,
        name,
        aadharNumber
      )
      /* Condition to check if Request was already approved **/
      const approveData = await getDataFromLedger(ctx, userApprovedKey)
      if (approveData != undefined) {
        return "This Request Was Already approved!!!"
      }

      await updateLedger(ctx, data, userRequestKey)
      await updateLedger(ctx, updatedData, userApprovedKey)
    }
    return updatedData
  }
  /**
   * View customer details
   * @param ctx - The transaction context
   * @param name - user name
   * @param aadharNumber - user aadhar Number
   * @returns - updated user details
   */
  async viewUser(ctx, name, aadharNumber) {
    const userRequestKey = await generateUserApprovedCompositKey(
      ctx,
      name,
      aadharNumber
    )
    const data = await getDataFromLedger(ctx, userRequestKey)
    if (data == undefined) {
      return "User doesn't exist"
    }
    return data
  }

  /**
   * View  approved property
   * @param ctx - The transaction context
   * @param propertyID - geo location of the property
   * @returns - property details
   */

  async viewProperty(ctx, propertyID) {
    const userRequestKey = await generateRegistrationApprovedCompositKey(
      ctx,
      propertyID
    )
    const data = await getDataFromLedger(ctx, userRequestKey)
    if (data == undefined) {
      return "Property not registered"
    }

    return data
  }

  /**
   * View  all the property registration request
   * @param ctx - The transaction context
   * @returns - property details
   */

  async viewAllPropertyRegistrationRequest(ctx) {
    const propertyRequestData = await getPropertyRegistrationAllRequest(
      ctx,
      "request"
    )

    if (propertyRequestData.length < 1) {
      return "None of the property Registred"
    }

    // let userAddress = this.authorizeUsers()

    // const address = getClientAddress(ctx.clientIdentity.getID())
    // if (!userAddress.includes(address)) {
    //   throw new Error("Only Authorized users can access!!!")
    // }
    return propertyRequestData
  }

  /**
   * Approve Registered property
   * @param ctx - The transaction context
   * @param propertyID - geo location of the property
   * @returns - property details
   */
  async approvePropertyRegistration(ctx, propertyID) {
    const userRequestKey = await generateRegistrationRequestCompositKey(
      ctx,
      propertyID
    )
    /*Checking if property registration request was there on the system **/
    const data = await getDataFromLedger(ctx, userRequestKey)
    if (data == undefined) {
      return "Property Registration request not found!!!"
    }

    /*Checking if property request was already approved **/
    if (data.RequestStatus == "approved") {
      return "Property Request Already Approved!!!"
    }

    let updatedData = {
      ...data,
      RequestStatus: "approved",
    }

    const approveKey = await generateRegistrationApprovedCompositKey(
      ctx,
      propertyID
    )
    await updateLedger(ctx, updatedData, userRequestKey)
    await updateLedger(ctx, updatedData, approveKey)

    return updatedData
  }
}

module.exports = UsersContract
