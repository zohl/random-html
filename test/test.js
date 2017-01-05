import assert from 'assert';
import {randomHTML} from '../src/index.js';


describe('randomHTML', () => {

  it('generates something', () => {
    assert.ok(randomHTML({maxHeight: 3}).length > 0, 'generated text should not be empty');
  });

  // This test has negligible (but still non-zero) probability of failure.
  it('non-deterministic without seed', () => {
    var n = 20; 
    assert.ok(!([...Array(n).keys()]
                .map(_ => randomHTML({maxHeight: 3}))
                .reduce((acc, x) => (acc !== x) ? null : x))
              // ^ short-circuiting on null value
              , n + ' invocations should not yield the same result');
  });

  it('deterministic with fixed seed', () => {
    var seed = Math.random();
    console.log('Seed: ' + seed);

    assert.equal(
      randomHTML({maxHeight: 3, seed: seed})
    , randomHTML({maxHeight: 3, seed: seed}));
  });
});
