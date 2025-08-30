// emicalc-api.js
(function(global) {
    'use strict';
    
    const EMICalculator = {
        // Calculate EMI only - returns number
        calculateEMI: function(loanAmount, interestRate, tenureMonths) {
            // Input validation
            if (!loanAmount || !interestRate || !tenureMonths) {
                throw new Error('All parameters are required');
            }
            if (loanAmount <= 0 || interestRate < 0 || tenureMonths <= 0) {
                throw new Error('Invalid parameter values');
            }
            
            const principal = parseFloat(loanAmount);
            const monthlyRate = parseFloat(interestRate) / 12 / 100;
            const months = parseInt(tenureMonths);
            
            if (monthlyRate === 0) {
                return principal / months;
            }
            
            const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
            
            return Math.round(emi);
        },
        
        // Generate schedule only - returns array
        generateSchedule: function(loanAmount, interestRate, tenureMonths) {
            const emi = this.calculateEMI(loanAmount, interestRate, tenureMonths);
            const principal = parseFloat(loanAmount);
            const monthlyRate = parseFloat(interestRate) / 12 / 100;
            const months = parseInt(tenureMonths);
            
            const schedule = [];
            let remainingBalance = principal;
            
            for (let month = 1; month <= months; month++) {
                const interestPayment = remainingBalance * monthlyRate;
                const principalPayment = emi - interestPayment;
                remainingBalance = Math.max(0, remainingBalance - principalPayment);
                
                schedule.push({
                    month: month,
                    emi: Math.round(emi),
                    principal: Math.round(principalPayment),
                    interest: Math.round(interestPayment),
                    balance: Math.round(remainingBalance)
                });
            }
            
            return schedule;
        }
    };
    
    // Export for different environments
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EMICalculator; // Node.js
    } else {
        global.EMICalculator = EMICalculator; // Browser
    }
    
})(this);
