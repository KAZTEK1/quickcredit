import express from 'express';
import loanController from '../controllers/loan';
import Auth from '../../middleware/is-Auth';
import rows from '../rowHelper';


const router = express.Router();

// Create a loan application
router.post('/loans', Auth.verifyToken, rows.checkLoan, loanController.postLoan);

// View loan repayment history
router.get('/loans/:id/repayment', Auth.verifyToken, loanController.repaymentHistory);

module.exports = router;
