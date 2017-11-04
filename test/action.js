import Action from '../src/action'

let defaultAction
beforeEach(() => {
  defaultAction = new Action()
})

// Defaults
test('should not change id', () => {
  expect(() => { defaultAction.id = 'asdf' }).toThrowError('Cannot set property id')
})
test('should be enabled by default', () => {
  expect(defaultAction.isEnabled)
})
test('should not be undoable by default', () => {
  expect(!defaultAction.canUndo)
})
test('should have class name as id by default', () => {
  expect(defaultAction.id === 'TestAction')
})

// Enabled state
test('should be disabled by disable function', () => {
  defaultAction.disable()
  expect(!defaultAction.isEnabled)
})
test('should enable by evaluating to true', () => {
  defaultAction.disable()
  defaultAction.evaluate(true)
  expect(defaultAction.isEnabled)
})
test('should trigger event on being disabled', (done) => {
  defaultAction.on('state:change', () => { done() })
  defaultAction.disable()
})

// Execution
test('should not execute if no one is subscribed', () => {
  expect(defaultAction.apply()).toBe(undefined)
})
