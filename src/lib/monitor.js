/* DO NOT EDIT THIS FILE */
/* Put all javascript code in app.js */
function toggleButtons() {
	$('#run-button').toggleClass('hidden');
	$('#stop-button').toggleClass('hidden');
}

var TransactionStatusMonitor = function() {
	
	var STATUS = {
		PENDING: 'PENDING',
		IN_PROGRESS: 'IN_PROGRESS',
		SUCCESS: 'SUCCESS',
		DECLINED: 'DECLINED'
	}
	
	var createMockTransaction = function(transactionId, ccNetwork, ccNumber, amount, creationDelay, startDelay, progressChangePerTick, endStatus) {
		return {
			_progressChangePerTick: progressChangePerTick,
			_endStatus: endStatus,
			_remainingStartDelay: startDelay,
			_remainingCreationDelay: creationDelay,
			_created: false,
			totalTicks: creationDelay + startDelay + Math.ceil(100 / progressChangePerTick) + 2,
			transactionId: transactionId,
			receivedTime: null,
			ccNetwork: ccNetwork,
			ccNumber: ccNumber,
			amount: amount,
			status: STATUS.PENDING,
			progress: 0,
			//Returns true if the transaction status changed, false otherwise
			tick: function() {
				if (!this._created) {
					if (this._remainingCreationDelay > 0) {
						this._remainingCreationDelay--;
						return false;
					} else {
						this._created = true;
						this.receivedTime = new Date().getTime();
						return true;
					}
				} else if (this.status == STATUS.PENDING) {
					if (this._remainingStartDelay > 0) {
						this._remainingStartDelay--;
						return false;
					} else {
						this.status = STATUS.IN_PROGRESS;
						return true;
					}
				} else if (this.status == STATUS.IN_PROGRESS) {
					var newProgress = this.progress + this._progressChangePerTick;
					if (newProgress > 100) {
						this.status = this._endStatus;
						this.progress = 100;
					} else {
						this.progress = newProgress;
					}
					return true;
				} else {
					return false;
				}
			}
		}
	}
	
	var createTransactionStatusUpdate = function(transaction) {
		return {
			transactionId: transaction.transactionId,
			receivedTime: transaction.receivedTime,
			ccNetwork: transaction.ccNetwork,
			ccNumber: transaction.ccNumber,
			amount: transaction.amount,
			status: transaction.status,
			progress: transaction.progress
		}
	}
	
	var listeners = [];
	
	var IN_PROGRESS = false;
	var mockTransactions = [];
	var tickCount = 0;
	var timeoutId = null;
	
	var resetListeners = [];
	
	var monitor = {
	
		registerStatusUpdateListener: function(callback) {
			listeners.push(callback);
		},
		
		registerResetListener: function(callback) {
			resetListeners.push(callback);
		},
		
		run: function() {
			if (IN_PROGRESS) {
				return;
			}
			
			toggleButtons();
			
			for(var idx in resetListeners) {
				resetListeners[idx]();
			}
			
			var myChance = new Chance(12345);
			//Generate transactions:
			var numTransactions = myChance.integer({min: 10, max: 20});
			var maxTicks = 0;
			
			IN_PROGRESS = true;
			mockTransactions = [];
			tickCount = 0;
			timeoutId = null;
			
			for (var i = 0; i < numTransactions; i++) {
				var ccType = myChance.cc_type();
				var ccNumber = myChance.cc({type: ccType});
				var mockTransaction = createMockTransaction(
					myChance.guid(),
					ccType,
					ccNumber,
					chance.floating({min: 50, max: 500, fixed: 2}),
					myChance.integer({min: 0, max: 5}),
					myChance.integer({min: 1, max: 4}),
					myChance.integer({min: 15, max: 40}),
					myChance.bool({likelihood: 70}) ? STATUS.SUCCESS : STATUS.DECLINED
				);
				
				if (mockTransaction.totalTicks > maxTicks) {
					maxTicks = mockTransaction.totalTicks;
				}
				
				mockTransactions.push(mockTransaction);
			}
			
			var tick = function() {
				var statusUpdates = [];
				for(var idx in mockTransactions) {
					var mockTransaction = mockTransactions[idx];
					if(mockTransaction.tick()) {
						statusUpdates.push(createTransactionStatusUpdate(mockTransaction));
					}
				}
				if (statusUpdates.length > 0) {
					for(var idx in listeners) {
						listeners[idx](statusUpdates);
					}
				}
				tickCount++;
				if (tickCount < maxTicks) {
					timeoutId = setTimeout(tick, 1000);
				} else {
					IN_PROGRESS = false;
					toggleButtons();
				}
			}
			
			tick();
		},
		
		stop: function() {
			if (timeoutId != null) {
				clearTimeout(timeoutId)
			}
			IN_PROGRESS = false;
			toggleButtons();
		}
	
	}
	
	return monitor;

}();