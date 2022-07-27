"use strict"

/**
 * This is a Node.JS application used by registrar to  approve the user request  on the network.
 */

const { getContractInstance, disconnect } = require("./contractHealper")
async function main(name, aadhar, txID) {
  let requestBuffer
  try {
    const certnetContract = await getContractInstance(
      "org.property-registration-network.regnet"
    )

    // Registrar getting all the user request
    console.log("....Recharging User Account")
    requestBuffer = await certnetContract.submitTransaction(
      "rechargeAccount",
      name,
      aadhar,
      txID
    )

    // process response
    console.log(
      ".....Processing Recharging User Account Transaction Response \n\n"
    )
    let newStudent = JSON.parse(requestBuffer.toString())
    console.log(newStudent)
    console.log("\n\n.....Recharging User Account Transaction Complete!")
    return newStudent
  } catch (error) {
    console.log("\n\n.....Recharging User Account Transaction Errored Out!!")

    return {
      errorMSG: requestBuffer.toString(),
    }
  } finally {
    disconnect()
  }
}
module.exports.execute = main
