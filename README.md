[![Build Status](https://travis-ci.org/Graphiy/actionman.svg?branch=master)](https://travis-ci.org/Graphiy/actionman)

# Graphiy Actionman

Arbitrary implementation of [Command design pattern](https://en.wikipedia.org/wiki/Command_pattern) for cross-modules communication with logging.
This enables undo / redo and actions log functionality.

## [Live demo](http://daviste.com/demo/graphiy-actionman)

## Functionality
+ action panel button click - fire action
+ enable / disable action
+ action panel toggle button
+ multiple components subscribe to action
+ some components subscribe / some not
+ granular update (providing component ids while firing an action)
+ action log
+ undo / redo
- ADD TO DEMO: evaluate if the action can be executed

### TODO
- multiple steps undo / redo
- queue of actions
- Sequences of Command objects can be assembled into composite (or macro) commands.

### Consideration on implementation
- Any action should have "id" differentiation?
  in terms of "check at a dinner" example:
    specifying id for the action is telling the Waiter, that Customer want a specific person to cook for him, while this person may or may not be available today or even be a Cook in this restaurant.
  - first param of action.apply is always ids array
  - How to fire an action for all ids?
    - pass 'all'
    - do not specify any
- Does actionman is required / able to keep track of all actions?
  - YES, Actionman is by it's name a manager of actions
- How to undo / redo?
  - Should Undo / Redo be actions too?
    - No, because it is not specific to particular registrar
  - actionman.undo()
    - the way to trigger undo of the last action
  - concreteAction.undo()
    - actual way to undo
+ Should Actionman be a singleton
  - Pros
    - no need to pass the reference to actionman around to each consumer
  - Cons
    - there will be no ability to create multiple instances of application on the same page for them to track their actions independently
  
+ Should Action be a singleton?
  - Pros
    - same as for actionman
  - Cons
    - same as for actionman
    - if not a singleton, consumer needs to ask actionman for an action
