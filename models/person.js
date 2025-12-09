const mongoose = require('mongoose')

const password = process.argv[2]
const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

function isNumeric(str) { // https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const numberValidator = (number) => {
  if (number.length < 8) return false

  const parts = number.split("-")
  if (parts.length !== 2) return false

  if (parts[0].length < 2 || parts[0].length > 3) return false
  if (!isNumeric(parts[0])) return false
  if (!isNumeric(parts[1])) return false

  return true

}

const custom = [numberValidator, 'number invalid: . A phone number must: have length of 8 or more and be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers']
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  }, 
  number: {
    type: String,
    validate: custom
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
