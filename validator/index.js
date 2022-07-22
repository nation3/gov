import fs from 'fs'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { v1 } from '@nation3/gov-specs'

const ajv = new Ajv()
addFormats(ajv)

fs.readdirSync('../proposals').forEach((file) => {
  const proposal = JSON.parse(fs.readFileSync(`../proposals/${file}`, 'utf8'))

  const validate = ajv.compile(v1)
  const valid = validate(proposal)
  if (!valid) {
    console.log(file)
    console.error(validate.errors)
  }
})
