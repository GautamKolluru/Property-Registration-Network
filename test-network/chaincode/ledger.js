/**
 * Generate composite key for new user request
 * @param ctx - The transaction context
 * @param name - User Name
 * @param aadharNum - User aadhar number
 * @returns - Generated composite key
 */
const generateUserRequestCompositKey = async (ctx, name, aadharNum) => {
  const userRequestKey = ctx.stub.createCompositeKey("user.register", [
    "request",
    "-",
    name,
    "-",
    aadharNum,
  ]);

  return userRequestKey;
};

/**
 * Generate composite key for aproved user
 * @param ctx - The transaction context
 * @param name - User Name
 * @param aadharNum - User aadhar number
 * @returns - Generated composite key
 */
const generateUserApprovedCompositKey = async (ctx, name, aadharNum) => {
  const userRequestKey = ctx.stub.createCompositeKey("user.register", [
    "approved",
    "-",
    name,
    "-",
    aadharNum,
  ]);

  return userRequestKey;
};

/**
 * Generate composite key for property registration
 * @param ctx - The transaction context
 * @param name - User Name
 * @param aadharNum - User aadhar number
 * @returns - Generated composite key
 */
const generateRegistrationRequestCompositKey = async (ctx, propertyID) => {
  const userRequestKey = ctx.stub.createCompositeKey("property.register", [
    "request",
    "-",
    propertyID,
  ]);

  return userRequestKey;
};

/**
 * Generate composite key for approved property registration
 * @param ctx - The transaction context
 * @param name - User Name
 * @param aadharNum - User aadhar number
 * @returns - Generated composite key
 */
const generateRegistrationApprovedCompositKey = async (ctx, propertyID) => {
  const userRequestKey = ctx.stub.createCompositeKey("property.register", [
    "approved",
    "-",
    propertyID,
  ]);

  return userRequestKey;
};

/**
 * create assert on ledger
 * @param ctx - The transaction context
 * @param data - Assert the need to add to ledger
 * @param name - User Name
 * @param aadharNum - User aadhar number
 * @param userRequestKey - composit key
 * @returns - Generated composite key
 */
const updateLedger = async (ctx, data, userRequestKey) => {
  let dataBuffer = Buffer.from(JSON.stringify(data));
  await ctx.stub.putState(userRequestKey, dataBuffer);
};

/**
 * Get data from ledger
 * @param ctx - The transaction context
 * @param userRequestKey - composit key
 * @returns - Generated composite key
 */
const getDataFromLedger = async (ctx, userRequestKey) => {
  let value;
  try {
    value = JSON.parse(await ctx.stub.getState(userRequestKey));
  } catch (err) {
    return value;
  }

  return value;
};

/**
 * Generate all the request that raised for property registration
 * @param ctx - The transaction context
 * @param requestType - attribute to generate the request based on value say approved/request
 * @returns - Generated composite key
 */
const getPropertyRegistrationAllRequest = async (ctx, requestType) => {
  let iter = await ctx.stub.getStateByPartialCompositeKey("property.register", [
    requestType,
    "-",
  ]);

  const finaldata = await getAllResults(iter);
  return finaldata;
};

/**
 * Generate user request/approved composite key
 * @param ctx - The transaction context
 * @param requestType - attribute to generate user composite key
 * @returns - Generated composite key
 */
const getUserRequesDetails = async (ctx, requestType) => {
  let iter = await ctx.stub.getStateByPartialCompositeKey("user.register", [
    requestType,
    "-",
  ]);

  const finaldata = await getAllResults(iter);
  return finaldata;
};

/**
 * Generate all the value available in iterator
 * @param iterator - iterator object
 * @returns - array of value availabe in iterator object
 */

const getAllResults = async (iterator) => {
  const allResults = [];
  while (true) {
    const res = await iterator.next();
    //console.log(`Inside getallresulr:${JSON.stringify(res)}`)

    if (res.value) {
      allResults.push(JSON.parse(res.value.value.toString("utf8")));
    }

    // check to see if we have reached then end
    if (res.done) {
      // explicitly close the iterator
      await iterator.close();
      return allResults;
    }
  }
};

/**
 * Fetch address from client identity
 * @param id - client address taht got generated from ctx.clientIdentity.getID()
 * @returns - client address
 */
const getClientAddress = (id) => {
  let splitdata = id.split("/");
  const address = splitdata[5].replace("::", "").split("=")[1];
  return address;
};

module.exports = {
  generateUserRequestCompositKey,
  updateLedger,
  getUserRequesDetails,
  getClientAddress,
  getDataFromLedger,
  generateUserApprovedCompositKey,
  generateRegistrationRequestCompositKey,
  generateRegistrationApprovedCompositKey,
  getPropertyRegistrationAllRequest,
};
