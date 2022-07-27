# Property-Registration-Network

Welcome to the course project on ‘Hyperledger Fabric’. As part of this project, you will build a solution for a ‘Property Registration System’ using Hyperledger Fabric.

**Origin of Property Registration:**

Property registration is the process through which you register the documents related to a property of yours with legal entities. For instance, when you purchase a flat directly from a builder, property registration gives you the right to legally own, use or dispose of that property. When you have a legal ownership title over a property, there is a low likelihood of fraud or misappropriation.

**Need for Property Registration**

Property registration is required for maintaining ownership of land/property deeds. There are many reasons why you should get your property registered:

To avoid conflicts: Proper property registration helps you avoid conflicts arising from land disputes.
To maintain ownership: Property registration also helps with identifying the rightful owner of a property.
To comply with legal processes: Many legal processes require individuals to furnish proper land deeds and documentation.

These requirements make the property registration process an essential part of the legal and financial worlds. A traditional property registration process already exists, but it has major challenges. Through this case study, you will assess and tackle the challenges of the traditional property registration process. But first, we will look at what the challenges are.

**Problems/Challenges of Property Registration**

Property registration is a mere record of a sales transaction.
There could be multiple parties claiming ownership of the same property.
Although property ownership can be challenged in court, the verification process is cumbersome and time consuming.
Ownership documents could be tampered with.
Tampering of land deeds can lead to the wrong individuals acquiring ownership of properties for personal gain. This is a major issue in developing countries and also creates a huge backlog of civil cases in courts.
Benami registrations: This is a transaction in which a property is transferred to one person for the consideration paid by another. This also leads to corruption and tax evasion.

**Solution Using Blockchain**

Blockchain is an immutable distributed ledger that is shared with everyone present on a network. Each participant interacts with the blockchain using a public–private cryptographic key combination. Moreover, the records stored on the blockchain are immutable, making them very hard to tamper with. This provides better security. A solution such as Hyperledger Fabric also offers the features to maintain users and roles, which additionally help secure and identify owners.

The government can utilise the feature set of a blockchain to reduce the difficulties faced in the traditional property registration process. A distributed ledger can be set up among the buyer, seller, bank, registration authority and notary. Property details can be stored in the blockchain and accessed from it, and these details are immutable, meaning they cannot be altered by anybody.


**Steps Need To Follow To Start Network**

> ####cd /test-network/

> -To create the network and setup peers and orderers. Run this command
    ./network.sh up
 
> -create the channel
    ./network.sh createChannel
> -deploy the chaincode
  ./network.sh deployCC -ccn regnet -ccl javascript -ccp chaincode -ccv 1 -ccs 1 -cci instantiate -ccep "OR('Org1MSP.peer','Org2MSP.peer')"

> -Check now your chaincode containers are up and running by typing
     docker ps -a



