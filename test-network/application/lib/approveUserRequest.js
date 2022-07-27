"use strict"

/**
 * This is a Node.JS application used by registrar to  approve the user request  on the network.
 */

const { getContractInstance, disconnect } = require("./contractHealper")
async function main(name, aadhar) {
  let requestBuffer
  try {
    const certnetContract = await getContractInstance(
      "org.property-registration-network.registrar.regnet"
    )

    // Registrar getting all the user request
    console.log(".....Apporving the user request")
    requestBuffer = await certnetContract.submitTransaction(
      "approveNewUser",
      name,
      aadhar
    )

    // process response
    console.log(
      ".....Processing Approve User Request Transaction Response \n\n"
    )
    console.log("request" + requestBuffer)
    let newStudent = JSON.parse(requestBuffer.toString())
    console.log(newStudent)
    console.log("\n\n.....Apporving User Request Transaction Complete!")
    return newStudent
  } catch (error) {
    console.log("\n\n.....Apporving User Request Transaction Errored Out!!")

    return {
      errorMSG: requestBuffer.toString(),
    }
  } finally {
    disconnect()
  }
}
module.exports.execute = main
