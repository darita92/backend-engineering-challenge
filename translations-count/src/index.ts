import {Command, flags} from '@oclif/command'
import {appendFileSync, existsSync, readFileSync, truncateSync} from 'fs'
import {groupBy} from 'underscore'

import {formatWithoutMinutes, substractMinutes} from './helpers'
import Transaction from './transaction'

class TranslationsCount extends Command {
  static description = 'describe the command here'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    input_file: flags.string({char: 'i', description: 'JSON file to count'}),
    output_file: flags.string({char: 'o', description: 'JSON file to export results'}),
    window_size : flags.integer({char: 's', description: 'How many minutes to check'}),
  }

  static args = []

  async run() {
    const {flags} = this.parse(TranslationsCount)

    const inputFile = flags.input_file || 'example.json'
    const windowSize = flags.window_size || 10
    const outputFile = flags.output_file || 'output.json'

    try {
      // Parse file
      let rawdata = readFileSync(inputFile, 'utf8')
      let lines = rawdata.split(/\n/)
      let wrapped = '[' + lines.join(',') + ']'
      let transactions: Array<Transaction> = JSON.parse(wrapped)

      // Group by date removing the seconds
      let groupedTransactions = groupBy(transactions, (transaction: Transaction) => {
        const timestamp = new Date(transaction.timestamp)
        let formattedDate = formatWithoutMinutes(timestamp)
        return formattedDate
      })

      if (existsSync(outputFile)) {
        truncateSync(outputFile, 0)
      }

      let currentDate = new Date()
      for (let i = 0; i < windowSize; i++) {
        let newDate = substractMinutes(currentDate, i)
        let formattedDate = formatWithoutMinutes(newDate)

        let transactionCount = 0
        Object.keys(groupedTransactions).forEach(transactionGroup => {
          if (transactionGroup === formattedDate) {
            transactionCount = groupedTransactions[transactionGroup].length
          }
        })
        const value = JSON.stringify({
          date: formattedDate,
          average_delivery_time: transactionCount
        })
        appendFileSync(outputFile, value + '\n')
      }
      console.log(`Processing finished you can check the results on ${outputFile}`)
    } catch (e) {
      console.error(e)
    }
  }
}

export = TranslationsCount
