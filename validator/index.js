import Ajv from 'ajv'
import addFormats from 'ajv-formats'
//import { v1 } from '@nation3/gov-specs'
import fs from 'fs'
const v1 = JSON.parse(fs.readFileSync('../../gov/specs/N3GOV-v1.json'))

const ajv = new Ajv({
  strict: 'log',
  strictTuples: false,
  allErrors: true,
  verbose: true,
})
addFormats(ajv)

const validate = ajv.compile(v1)
const val = (proposal) => {
  const valid = validate(JSON.parse(proposal))
  if (!valid) {
    console.log('Proposal is invalid')
    console.error(validate.errors)
  }
}

function getInput() {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin
    let data = ''
    stdin.setEncoding('utf8')
    stdin.on('data', (chunk) => (data += chunk))
    stdin.on('end', () => resolve(data))
    stdin.on('error', reject)
  })
}

getInput().then(val).catch(console.error)
