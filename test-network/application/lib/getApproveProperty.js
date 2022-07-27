"use strict"

/**
 * This is a Node.JS application used by registrar to  approve the user request  on the network.
 */

const { getContractInstance, disconnect } = require("./contractHealper")
async function main() {
  let requestBuffer
  try {
    const certnetContract = await getContractInstance(
      "org.property-registration-network.registrar.regnet"
    )

    // Registrar getting all the user request
    console.log(".....Get All Approve Property Request")
    requestBuffer = await certnetContract.evaluateTransaction(
      "viewAllPropertyRegistrationRequest"
    )

    // process response
    console.log(
      ".....Processing Get All Approve Property Request Transaction Response \n\n"
    )
    let newStudent = JSON.parse(requestBuffer.toString())
    console.log(newStudent)
    console.log(
      "\n\n.....Get All Approve Property Request Transaction Complete!"
    )
    return newStudent
  } catch (error) {
    console.log(
      "\n\n.....Get All Approve Property Request Transaction Errored Out!!"
    )

    return {
      errorMSG: requestBuffer.toString(),
    }
  } finally {
    disconnect()
  }
}
module.exports.execute = main
