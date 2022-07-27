"use strict"

/**
 * This is a Node.JS application used by registrar to get all the user request.
 */

const { getContractInstance, disconnect } = require("./contractHealper")
async function main(name, email, phone, aadhar) {
  try {
    const certnetContract = await getContractInstance(
      "org.property-registration-network.registrar.regnet"
    )

    // Registrar getting all the user request
    console.log(".....Getting all the user request")

    const requestBuffer = await certnetContract.evaluateTransaction(
      "getNewUserRequest"
    )

    // process response
    console.log(
      ".....Processing Getting User Request Transaction Response \n\n"
    )
    let newStudent = JSON.parse(requestBuffer.toString())
    console.log("\n\n.....Getting User Request Transaction Complete!")
    return newStudent
  } catch (error) {
    console.log(`\n\n ${error} \n\n`)
    //throw new Error(error)
    return error
  } finally {
    disconnect()
  }
}

//main("aarav3", "aarav@ag.com", "766777", "ghghguyu67")
module.exports.execute = main
