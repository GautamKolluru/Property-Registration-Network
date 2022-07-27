"use strict"

/**
 * This is a Node.JS application used by registrar to  approve the user request  on the network.
 */

const { getContractInstance, disconnect } = require("./contractHealper")
async function main(name, aadhar, propertyId, price, propertystatus) {
  let requestBuffer
  try {
    const certnetContract = await getContractInstance(
      "org.property-registration-network.regnet"
    )

    // Registrar getting all the user request
    console.log(".....Property Registration Request")
    requestBuffer = await certnetContract.submitTransaction(
      "propertyRegistrationRequest",
      name,
      aadhar,
      propertyId,
      price,
      propertystatus
    )

    // process response
    console.log(".....Property Registration Request Transaction Response \n\n")
    console.log("request" + requestBuffer)
    let newStudent = JSON.parse(requestBuffer.toString())
    console.log(newStudent)
    console.log("\n\n.....Property Registration Request Transaction Complete!")
    return newStudent
  } catch (error) {
    console.log(
      "\n\n.....Property Registration Request Transaction Errored Out!!"
    )

    return {
      errorMSG: requestBuffer.toString(),
    }
  } finally {
    disconnect()
  }
}
module.exports.execute = main
