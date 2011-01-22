function Game() {}

Game.prototype = {
  total: 0,
  frame: 0,
  rolls: 0,
  previousRoll: 0,
  spare: false,
  strike: false,
  strikeCount: 0,
  bonus: false,
  
  /**
   * Main roll function
   */
  roll: function(value){
    // is this a valid game still?
    if(!this.validateGame(value)) {
      return false;
    }
    // is this a valid roll?
    if(!this.validateRoll(value)) {
      return false;
    }
    
    // if this is a bonus frame we process it differently
    if(this.bonus) {
      return this.rollBonus(value);
    }
    
    // if knocked down all pins its a strike, trigger it, and move on
    if(value == 10){
      this.rollStrike();
      
    // otherwise we need to do some sums
    } else {
      
      // first make sure our roll has been counted
      this.rolls++;
      
      // was the last go a spare?
      if(this.spare) {
        // add the current value to the total again and toggle off spare
        this.total += value;
        this.spare = false;
      }
      
      // if this was the last throw of the frame calculate our spares/strikes.
      // if we are on the last frame we dont do this as its caught by the bonus
      // above or its not a spare/strike.
      if(this.rolls%2 == 0 && this.frame != 9) {
        // was this frame a spare?
        if(this.previousRoll + value == 10){
          this.spare = true;
        }

        // add the total of all our strikes
        this.total += this.calculateStrike(value);
                
        // move onto the next frame and reset our strikecount to zero
        this.frame++;
        this.strikeCount = 0;
        this.strike = false;
        this.previousRoll = 0;
        
      }
      // not the last roll of the frame, or we are on frame 10 so just record
      // our score for the roll.
      else {
        this.previousRoll = value;
      }
      
      // finally add the current roll for all non-strike values
      this.total += value;
    }
    
    return value;
  },
  
  /**
   * function to calculate the bonus frame score
   */
  rollBonus: function(value) {
    // we're always going to add the current roll score
    this.total += value;  
    this.rolls++;    
     
    // if the last go was a spare then add the current roll score again and turn
    // off the spare.
    if(this.spare) {
      this.total += value;
      this.spare = false;
    }

    // if this go is a spare then set the spare
    if(value + this.previousRoll == 10 && value != 10) {
      this.spare = true;
    }

    // if we are on the second roll of the bonus frame we can calculate any
    // strikes we may have had in frame 9
    if(this.rolls == 20) {
      this.total += this.calculateStrike(value);
    }
    
    this.previousRoll = value;
    return value;
  },
  
  /**
   * function to correctly record a strike
   * 
   * we need to keep track of how many strikes there have been in a row,
   * increase the rolls count by 2 (as there are no more rolls in this frame),
   * and move onto the next frame
   */
  rollStrike: function() {
    this.strike = true;
    this.strikeCount++;
    this.rolls += 2;
    this.frame++;
  },
  
  /**
   * function to validate that this game is within the rules
   */
  validateGame: function(value){
    // 
    if((this.frame == 9 && value == 10) || (this.frame == 9 && value + this.previousRoll == 10)) {
      this.bonus = true;
    }
    
    // if this is not a bonus frame and the number of rolls is over or equal 20
    // the game is invalid so dont allow the roll.
    if(this.rolls >= 20 && !this.bonus) {
      return false;
    }
    
    // if the number of rolls is over or equal 21 we definately have an 
    // invalid game.
    if(this.rolls >= 21) {
      return false;
    }
    
    return true;
  },
  
  /**
   * function to validate an acceptable number of pins were knocked down
   */
  validateRoll: function(value) {
    // knocked down more pins than exist
    if(value > 10 || value < 0) {
      return false;
    }
    // knocked down more pins than are left in this frame
    if(this.previousRoll + value > 10 && this.previousRoll != 10) {
      return false;
    } 
    
    return true;
  },
  
  /**
   * function to calculate scoring of strikes and runs of strikes
   */
  calculateStrike: function(value) {
    if(this.strikeCount > 1) {
      // strikes formula: x = (((s-1)*3)*10) + (r1*2) + r2
      // x = total, s = number of strikes, r = rolls after end of strike run
      return value + (this.previousRoll*2) + (((this.strikeCount-1) * 3) * 10);
    } else if (this.strikeCount == 1) {
      return value + this.previousRoll + 10;
    }
    
    return 0;
  },
  
  
  /**
   * Getters
   */
  getTotal: function() {
    return this.total;
  },  
  getFrame: function() {
    return this.frame;
  },
  getRolls: function() {
    return this.rolls;
  }
};