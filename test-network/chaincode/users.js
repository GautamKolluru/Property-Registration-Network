"use strict"
const {
  generateUserRequestCompositKey,
  updateLedger,
  generateUserApprovedCompositKey,
  getDataFromLedger,
  generateRegistrationRequestCompositKey,
  generateRegistrationApprovedCompositKey,
  getClientAddress,
} = require("./ledger.js")
const { Contract } = require("fabric-contract-api")

class UsersContract extends Contract {
  constructor() {
    // Provide a custom name to refer to this smart contract
    super("org.property-registration-network.regnet")
  }

  // This is a basic user defined function used at the time of instantiating the smart contract
  // to print the success message on console
  async instantiate(ctx) {
    console.info("Users regnet Smart Contract Instantiated")
  }

  /**
   * This function store the authorized user details
   * @returns - authorize user array
   */
  authorizeUsers() {
    let userAddress = [
      "peer0.users.property-registration-network.com",
      "peer1.users.property-registration-network.com",
      "peer2.users.property-registration-network.com",
    ]
    return userAddress
  }

  /**
   * New user request
   * @param ctx - The transaction context
   * @param name - user name
   * @param emailId - user emailID
   * @param phonenum - user phone number
   * @param aadharNum - user aadhar Number
   * @returns - user details
   */
  async requestNewUser(ctx, name, emailId, phoneNum, aadharNum) {
    const userRequestKey = await generateUserRequestCompositKey(
      ctx,
      name,
      aadharNum
    )
    /*This condition is to check if the request for same user already added **/

    const data = await getDataFromLedger(ctx, userRequestKey)

    if (data != undefined) {
      return "User Request Already Added"
    }
    const userDetails = {
      Name: name,
      Email: emailId,
      PhoneNumber: phoneNum,
      AadharNumber: aadharNum,
      CreatedAt: ctx.stub.getTxTimestamp(),
      Status: "requested",
    }
    /*This statment is used to update ledger with new data **/

    await updateLedger(ctx, userDetails, userRequestKey)
    return userDetails
  }

  /**
   * Recharge user upgrade coin
   * @param ctx - The transaction context
   * @param name - user name
   * @param aadharNumber - user aadhar Number
   * @param txID - bank transcation ID
   * @returns - updated user details
   */
  async rechargeAccount(ctx, name, aadharNumber, txID) {
    /*This condition is to check if user is authorize to access this function **/

    // let userAddress = this.authorizeUsers()
    // const address = getClientAddress(ctx.clientIdentity.getID())
    // if (!userAddress.includes(address)) {
    //   return "Only Authorized users can access!!!"
    // }
    const banktxId = new Map([
      ["upg100", 100],
      ["upg500", 500],
      ["upg1000", 1000],
    ])
    /*This condition is to check if the user exist in the approved list  **/

    const userRequestKey = await generateUserApprovedCompositKey(
      ctx,
      name,
      aadharNumber
    )
    const data = await getDataFromLedger(ctx, userRequestKey)
    if (data == undefined) {
      return "User doesn't exist"
    } else if (banktxId.get(txID) != undefined) {
      let amount = parseInt(data.upgradCoins) + parseInt(banktxId.get(txID))
      const updatedData = {
        ...data,
        upgradCoins: amount,
      }
      await updateLedger(ctx, updatedData, userRequestKey)
      return updatedData
    } else {
      return "Invalid Bank Transaction ID"
    }
  }

  /**
   * View approved customer details
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
    /*This condition is to check if the user exist in the approved list  **/

    if (data == undefined) {
      return "User doesn't exist"
    }
    return data
  }

  /**
   * User property registration request
   * @param ctx - The transaction context
   * @param name - user name
   * @param aadharNumber - user aadhar Number
   * @param propertyID- User property geo location
   * @param price - Property Price
   * @param status - Property status registered/onSale
   * @returns - updated user details
   */

  async propertyRegistrationRequest(
    ctx,
    name,
    aadharNumber,
    propertyID,
    price,
    status
  ) {
    /*This condition is to check if user is authorize to access this function **/

    // let userAddress = this.authorizeUsers()
    // const address = getClientAddress(ctx.clientIdentity.getID())
    // if (!userAddress.includes(address)) {
    //   return "Only Authorized users can access!!!"
    // }

    /*This condition is to check if property already registred **/

    const reqKey = await generateRegistrationRequestCompositKey(ctx, propertyID)
    const propertyData = await getDataFromLedger(ctx, reqKey)

    if (propertyData != undefined) {
      return "Property Already Registered"
    }

    const userRequestKey = await generateUserApprovedCompositKey(
      ctx,
      name,
      aadharNumber
    )
    const data = await getDataFromLedger(ctx, userRequestKey)

    const localStatus = ["registered", "onSale"]

    /*This condition is to check whether user exist in approved list **/
    if (data == undefined) {
      return "User doesn't exist"
    }
    /*This condition is to check whether status value is registred/onSale **/
    if (!localStatus.includes(status)) {
      return "Status should be registered or onSale"
    }

    const propertyAssert = {
      PropertyID: propertyID,
      Owner: userRequestKey,
      Price: price,
      Status: status,
      RequestStatus: "requested",
    }

    await updateLedger(ctx, propertyAssert, reqKey)

    return propertyAssert
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
   * Update status of approved property
   * @param ctx - The transaction context
   * @param propertyID - geo location of the property
   * @param name - user name
   * @param aadharNumber - user aadhar Number
   * @param status - Property status registered/onSale
   * @returns - property details
   */
  async updateProperty(ctx, propertyID, name, aadharNumber, status) {
    /* generate composite key form  approved property registratiion name space **/
    const userRequestKey = await generateRegistrationApprovedCompositKey(
      ctx,
      propertyID
    )
    /* generate composit key from approved user name space **/
    const userApproved = await generateUserApprovedCompositKey(
      ctx,
      name,
      aadharNumber
    )
    const localStatus = ["registered", "onSale"]

    if (!localStatus.includes(status)) {
      return "Status should be registered or onSale"
    }
    /*This condition is to check if property already registred **/

    let updatedData = {}
    const data = await getDataFromLedger(ctx, userRequestKey)

    if (data == undefined) {
      throw new Error("Property not registered")
    }
    /* condition to check only owner of the property can perform the update **/
    if (userApproved == data.Owner) {
      updatedData = {
        ...data,
        Status: status,
      }
      await updateLedger(ctx, updatedData, userRequestKey)
    } else {
      return "Only Owner Of The Property Can Perform This Operation"
    }

    return updatedData
  }

  /**
   * Purchase property on sale
   * @param ctx - The transaction context
   * @param propertyID - geo location of the property
   * @param buyername - buyer name
   * @param buyeraadharNumber - buyer aadhar Number
   */
  async purchaseProperty(ctx, propertyID, buyerName, buyerAadharNumber) {
    /*Condition to check only authorize user can access this function **/
    // let userAddress = this.authorizeUsers()
    // const address = getClientAddress(ctx.clientIdentity.getID())
    // if (!userAddress.includes(address)) {
    //   return "Only Authorized users can access!!!"
    // }
    /* generate composite key form  approved property registratiion name space **/
    const propertyKey = await generateRegistrationApprovedCompositKey(
      ctx,
      propertyID
    )

    /* generate composit key from approved user name space **/
    const buyerKey = await generateUserApprovedCompositKey(
      ctx,
      buyerName,
      buyerAadharNumber
    )

    let updatedPropertyData = {}
    let updatedBuyerData = {}
    let updatedSellerData = {}
    const propertyData = await getDataFromLedger(ctx, propertyKey)
    const buyerData = await getDataFromLedger(ctx, buyerKey)

    /* check whether buyer registered on the system **/
    if (buyerData == undefined) {
      return "Buyer not registered"
    }

    /* check whether property registered on the system **/
    if (propertyData == undefined) {
      return "Property not registered"
    }

    let sellerCompositKey = propertyData.Owner
    const sellerData = await getDataFromLedger(ctx, sellerCompositKey)

    /* check whether property available for sale **/
    if (propertyData.Status == "onSale") {
      if (parseInt(propertyData.Price) <= parseInt(buyerData.upgradCoins)) {
        let sellerTotalAmt =
          parseInt(sellerData.upgradCoins) + parseInt(propertyData.Price)
        let buyerTotalAmt =
          parseInt(buyerData.upgradCoins) - parseInt(propertyData.Price)

        updatedPropertyData = {
          ...propertyData,
          Owner: buyerKey,
          Status: "registered",
        }
        updatedBuyerData = {
          ...buyerData,
          upgradCoins: buyerTotalAmt,
        }
        updatedSellerData = {
          ...sellerData,
          upgradCoins: sellerTotalAmt,
        }
        await updateLedger(ctx, updatedPropertyData, propertyKey)
        await updateLedger(ctx, updatedBuyerData, buyerKey)
        await updateLedger(ctx, updatedSellerData, sellerCompositKey)
      } else {
        return "User not having sufficent balance"
      }
    } else {
      return "Property not registered for sale"
    }
  }
}

module.exports = UsersContract
