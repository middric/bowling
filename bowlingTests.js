YAHOO.namespace("bowling");
      
/**
 * Basic game tests
 */
YAHOO.bowling.BasicTestCase = new YAHOO.tool.TestCase({
  name: "Basic Tests",

  setUp: function() {
    this.assert = YAHOO.util.Assert;
    this.game = new Game();
  },

  tearDown: function() {
    delete this.game;
  },

  /**
   * Does the class exist?
   */
  testClass: function () {         
    this.assert.isObject(this.game);
  },

  /**
   * Can we roll a ball?
   */
  testRoll: function() {          
    this.assert.isFunction(this.game.roll);
    var value = this.game.roll(5);
    this.assert.areEqual(5, value);
  },

  /**
   * Is the score for a frame recorded?
   */
  testTotal: function() {
    this.assert.isFunction(this.game.getTotal);
    this.game.roll(5);
    var value = this.game.getTotal();
    this.assert.areEqual(5, value);
  },

  /**
   * Is the score incremented with each frame?
   */
  testRollingTotal: function() {
    this.game.roll(5);
    this.game.roll(3);
    var value = this.game.getTotal();
    this.assert.areEqual(8, value);
  },

  /**
   * Can we roll an illegal score?
   */
  testIllegalRoll: function() {
    this.assert.isFunction(this.game.getRolls);
    var value = this.game.roll(11);
    var rolls = this.game.getRolls();
    this.assert.isFalse(value);
    this.assert.areEqual(0, rolls);

    value = this.game.roll(-1);
    rolls = this.game.getRolls();
    this.assert.isFalse(value);
    this.assert.areEqual(0, rolls);
  },

  /**
   * Can we track which frame we are on?
   */
  testFrames: function() {
    this.assert.isFunction(this.game.getFrame);
    var currentFrame = this.game.getFrame();
    this.assert.areEqual(0, currentFrame);

    for(var i = 1; i < 3; i++) {
      this.game.roll(5);
      this.game.roll(3);
      currentFrame = this.game.getFrame();
      this.assert.areEqual(i, currentFrame);
    }
  },

  /**
   * Can we roll an illegal frame?
   */
  testIllegalFrame: function() {
    this.game.roll(8);
    this.game.roll(9);
    var rolls = this.game.getRolls();
    this.assert.areEqual(1, rolls);          
  }
});

/**
 * Strikes and spares tests
 */
YAHOO.bowling.StrikeSpareTestCase = new YAHOO.tool.TestCase({
  name: "Strikes and Spares Tests",

  setUp: function() {
    this.assert = YAHOO.util.Assert;
    this.game = new Game();
  },

  tearDown: function() {
    delete this.game;
  },        

  /**
   * Is a spare correctly calculated?
   */
  testSpare: function() {
    this.game.roll(7);
    this.game.roll(3);

    this.game.roll(4);
    this.game.roll(2);

    var total = this.game.getTotal();
    this.assert.areEqual(20, total);
  },

  /**
   * Are 2 spares in a row correctly calculated?
   */
  testDoubleSpare: function() {
    this.game.roll(8);
    this.game.roll(2);

    this.game.roll(3);
    this.game.roll(7);

    this.game.roll(5);
    this.game.roll(0);

    var total = this.game.getTotal();
    this.assert.areEqual(33, total);
  },

  /**
   * Is a strike correctly calculated and is the frame incremented?
   */
  testStrike: function() {
    this.game.roll(10);

    var currentFrame = this.game.getFrame();
    this.assert.areEqual(1, currentFrame);

    this.game.roll(3);
    this.game.roll(6);

    var total = this.game.getTotal();
    this.assert.areEqual(28, total);
  },

  /**
   * Are doubles correctly calculated?
   */
  testDoubleStrike: function() {
    this.game.roll(10);
    this.game.roll(10);

    this.game.roll(4);
    this.game.roll(2);

    var total = this.game.getTotal();
    this.assert.areEqual(46, total);          
  },

  /**
   * Are turkeys correctly calculated?
   */
  testTripleStrike: function() {
    this.game.roll(10);
    this.game.roll(10);
    this.game.roll(10);

    this.game.roll(0);
    this.game.roll(9);

    var total = this.game.getTotal();
    this.assert.areEqual(78, total);          
  }
});

/**
 * Bonus frame (last frame) tests
 */
YAHOO.bowling.BonusTestCase = new YAHOO.tool.TestCase({
  name: "Bonus Frame Tests",

  setUp: function() {
    this.assert = YAHOO.util.Assert;
    this.game = new Game();
  },

  tearDown: function() {
    delete this.game;
  },

  /**
   * Is a strike out game correctly calculated?
   */
  testStrikeOut: function() {
    for(var i = 0; i < 9; i++){
      this.game.roll(5);
      this.game.roll(4);
    }
    this.game.roll(10);
    this.game.roll(10);
    this.game.roll(5);

    var total = this.game.getTotal();
    this.assert.areEqual(106, total);
  },

  /**
   * Is a spare out game correctly calculated
   */
  testSpareOut: function() {
    for(var i = 0; i < 9; i++){
      this.game.roll(5);
      this.game.roll(4);
    }
    this.game.roll(8);
    this.game.roll(2);
    this.game.roll(5);

    var total = this.game.getTotal();
    this.assert.areEqual(101, total)
  },

  /**
   * Is an extra roll after bonus round allowed?
   */
  testStrikeOutOver: function() {
    for(var i = 0; i < 9; i++){
      this.game.roll(5);
      this.game.roll(4);
    }
    this.game.roll(10);
    this.game.roll(10);
    this.game.roll(5);

    this.game.roll(5);

    var total = this.game.getTotal();
    this.assert.areEqual(106, total);
  }
});

/**
 * Full game tests
 */
YAHOO.bowling.GameTestCase = new YAHOO.tool.TestCase({
  name: "Game Tests",

  setUp: function() {
    this.assert = YAHOO.util.Assert;
    this.game = new Game();
  },

  tearDown: function() {
    delete this.game;
  },

  /**
   * Can we roll an illegal game (too many frames)?
   */
  testIllegalGame: function() {
    for(var i = 0; i < 10; i++){
      this.game.roll(5);
      this.game.roll(4);
    }

    var frame = this.game.getFrame();
    var roll = this.game.getRolls();
    var total = this.game.getTotal();
    this.assert.areEqual(9, frame);
    this.assert.areEqual(20, roll);
    this.assert.areEqual(90, total);

    this.game.roll(5);
    this.game.roll(4);
    frame = this.game.getFrame();
    roll = this.game.getRolls();
    total = this.game.getTotal();
    this.assert.areEqual(9, frame);
    this.assert.areEqual(20, roll);
    this.assert.areEqual(90, total);
  },

  /**
   * Can we roll a perfect game?
   */
  testPerfectGame: function() {
    for(var i = 0; i < 12; i++) {
      this.game.roll(10);
    }

    var total = this.game.getTotal();
    this.assert.areEqual(300, total);
  },

  /**
   * Can we roll a gutter game (no score)?
   */
  testGutterGame: function() {
    for(var i = 0; i < 12; i++) {
      this.game.roll(0);
      this.game.roll(0);
    }

    var total = this.game.getTotal();
    this.assert.areEqual(0, total);
  },

  /**
   * Can we roll a realistically scored game?
   */
  testRealisticGame: function() {
    // Frame 1
    this.game.roll(10);

    // Frame 2
    this.game.roll(3);
    this.game.roll(7);

    // Frame 3
    this.game.roll(6);
    this.game.roll(1);

    // Frame 4
    this.game.roll(10);

    // Frame 5
    this.game.roll(10);

    // Frame 6
    this.game.roll(10);

    // Frame 7
    this.game.roll(2);
    this.game.roll(8);

    // Frame 8
    this.game.roll(9);
    this.game.roll(0);

    // Frame 9
    this.game.roll(7);          
    this.game.roll(3);

    // Frame 10
    this.game.roll(10);
    this.game.roll(10);
    this.game.roll(10);

    var total = this.game.getTotal();
    this.assert.areEqual(193, total);
  }
});      

YAHOO.bowling.DataSuite = new YAHOO.tool.TestSuite('Bowling Test Suite');
YAHOO.bowling.DataSuite.add(YAHOO.bowling.BasicTestCase);
YAHOO.bowling.DataSuite.add(YAHOO.bowling.StrikeSpareTestCase);
YAHOO.bowling.DataSuite.add(YAHOO.bowling.BonusTestCase);
YAHOO.bowling.DataSuite.add(YAHOO.bowling.GameTestCase);

YAHOO.util.Event.onDOMReady(function() {
  var logger = new YAHOO.tool.TestLogger("testLogger");

  YAHOO.tool.TestRunner.add(YAHOO.bowling.DataSuite);

  YAHOO.tool.TestRunner.run();
});