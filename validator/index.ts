import fs from 'fs'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv()
addFormats(ajv)

const schema = JSON.parse(fs.readFileSync('./N3GOV-v1.json', 'utf8'))

fs.readdirSync('../proposals').forEach((file) => {
  const proposal = JSON.parse(fs.readFileSync(`../proposals/${file}`, 'utf8'))

  const validate = ajv.compile(schema)
  const valid = validate(proposal)
  if (!valid) {
    console.log(file)
    console.log(validate.errors)
  }
})
