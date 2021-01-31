var createJ$ = require('@sanjo/jasmine-expect').createJ$;
var createExpectEnv = require('@sanjo/jasmine-expect').createEnv;
var createSpyEnv = require('@sanjo/jasmine-spy').createEnv;

var j$ = createJ$();
var expectEnv = createExpectEnv(j$);
var spyEnv = createSpyEnv(j$);

global.expect = expectEnv.expect;
global.spyOn = spyEnv.spyOn;
global.jasmine = {
  createSpy: spyEnv.createSpy,
  createSpyObj: spyEnv.createSpyObj,
  any: expectEnv.any,
  anything: expectEnv.anything,
  objectContaining: expectEnv.objectContaining,
  stringMatching: expectEnv.stringMatching,
  arrayContaining: expectEnv.arrayContaining,
  addCustomEqualityTester: expectEnv.addCustomEqualityTester,
  addMatchers: expectEnv.addMatchers,
};

afterEach(function () {
  spyEnv.clearSpies();
});