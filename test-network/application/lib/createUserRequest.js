"use strict"

/**
 * This is a Node.JS application to add a new student on the network.
 */
const { getContractInstance, disconnect } = require("./contractHealper")
async function main(name, email, phone, aadhar) {
  let requestBuffer
  try {
    const certnetContract = await getContractInstance(
      "org.property-registration-network.regnet"
    )

    // Registrar getting all the user request
    console.log(".....Creating user request")
    requestBuffer = await certnetContract.submitTransaction(
      "requestNewUser",
      name,
      email,
      phone,
      aadhar
    )
    // process response
    console.log(
      ".....Processing Creating User Request Transaction Response \n\n"
    )
    let newStudent = JSON.parse(requestBuffer.toString())
    console.log(newStudent)
    console.log("\n\n.....Creating User Request Transaction Complete!")
    return newStudent
  } catch (error) {
    console.log("\n\n.....Creating User Request Errored Out!")

    return {
      errorMSG: requestBuffer.toString(),
    }
  } finally {
    disconnect()
  }
}

module.exports.execute = main
