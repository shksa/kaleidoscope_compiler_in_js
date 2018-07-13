import {assert} from 'chai';
import Foo from "../src/foo";

describe('Foo instance', () => {
  describe('.loggyLog()', () => {
    it('should return correct string', () => {
      const foo = new Foo()
      const expected = `In loggyLog method, where "this" context refers to ${JSON.stringify(foo)} and also CRAP`
      assert.equal(foo.loggyLog('CRAP'), expected);
    });
  });
  describe('.propyProp', () => {
    it('should return `vines are funny` string', () => {
      const foo = new Foo()
      const expected = 'vines are funny'
      assert.equal(foo.propyProp, expected)
    })
  })
});