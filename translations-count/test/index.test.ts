import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('translations-count', () => {
  test
    .stdout()
    .do(() => cmd.run([]))
    .it('runs translations-count', ctx => {
      expect(ctx.stdout).to.contain('Processing finished')
    })

  test
    .stdout()
    .do(() => cmd.run(['-o', 'test.json']))
    .it('runs translations-count -o test.json', ctx => {
      expect(ctx.stdout).to.contain('test.json')
    })
})
