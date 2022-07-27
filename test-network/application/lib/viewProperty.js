"use strict"

/**
 * This is a Node.JS application used by registrar to  approve the user request  on the network.
 */

const { getContractInstance, disconnect } = require("./contractHealper")
async function main(propertyId) {
  let requestBuffer
  try {
    const certnetContract = await getContractInstance(
      "org.property-registration-network.regnet"
    )

    // Registrar getting all the user request
    console.log("....View Property")
    requestBuffer = await certnetContract.submitTransaction(
      "viewProperty",
      propertyId
    )

    // process response
    console.log(".....Processing View Property Transaction Response \n\n")
    let newStudent = JSON.parse(requestBuffer.toString())
    console.log(newStudent)
    console.log("\n\n.....View Property Transaction Complete!")
    return newStudent
  } catch (error) {
    console.log("\n\n.....View Property Account Transaction Errored Out!!")

    return {
      errorMSG: requestBuffer.toString(),
    }
  } finally {
    disconnect()
  }
}
module.exports.execute = main
