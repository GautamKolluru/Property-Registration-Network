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
    console.log("....View User")
    requestBuffer = await certnetContract.submitTransaction(
      "viewUser",
      name,
      aadhar
    )

    // process response
    console.log(".....Processing View User Transaction Response \n\n")
    let newStudent = JSON.parse(requestBuffer.toString())
    console.log(newStudent)
    console.log("\n\n.....View User Transaction Complete!")
    return newStudent
  } catch (error) {
    console.log("\n\n.....View User Account Transaction Errored Out!!")

    return {
      errorMSG: requestBuffer.toString(),
    }
  } finally {
    disconnect()
  }
}
module.exports.execute = main
