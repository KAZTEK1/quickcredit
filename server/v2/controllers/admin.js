import uuidv4 from 'uuid/v4';
import moment from 'moment';
import db from '../db/index';
import validate from '../../helper/validation';


class adminController {
  /**
     *
     * @param {req} object
     * @param {res} object
     */
  static async verifyUser(req, res) {
    // check for admin user
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          status: 403,
          error: 'Unauthorized!, Admin only route',
        });
    }
    const { error } = validate.validateVerify(req.body);
    if (error) {
      return res.status(422).json({
        status: 422,
        error: error.details[0].message,
      });
    }
    const updateQuery = `UPDATE users
      SET status = $1
      WHERE email = $2 returning *`;

    const values = [
      req.body.status,
      req.params.email,
    ];

    try {
      const { rows } = await db.query(updateQuery, values);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Not Found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: [{
          message: `users with id:${rows[0].id} has been verified`,
          rows,
        }],
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong, try again',
      });
    }
  }


  /**
 *@param {req} object
 *@param {res} object
 */
  static async allLoan(req, res) {
    // check for admin user
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          status: 403,
          error: 'Unauthorized!, Admin only route',
        });
    }
    const findAllQuery = 'SELECT * FROM loan';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).json({
        status: 200,
        data: [{
          message: 'loans retrieve successfully',
          rows,
          rowCount,
        }],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong, try again',
      });
    }
  }


  /**
 *@param {req} object
 *@param {res} object
 */
  static async oneLoan(req, res) {
    // check for admin user
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          status: 403,
          error: 'Unauthorized!, Admin only route',
        });
    }
    const text = 'SELECT * FROM loan WHERE id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Not Found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: [{
          message: `loan with id:${rows[0].id} retrieve successfully`,
          rows,
        }],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong, try again',
      });
    }
  }


  /**
 *@param {req} object
 *@param {res} object
 */
  static async loanPayment(req, res, next) {
    // check for admin user
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          status: 403,
          error: 'Unauthorized!, Admin only route',
        });
    }
    const { status, repaid } = req.query;
    if (status && repaid) {
      try {
        const boolRepaid = JSON.parse(repaid);
        const text = `SELECT * FROM loan WHERE status = '${status}' AND repaid = ${boolRepaid}`;
        const { rows, rowCount } = await db.query(text);
        if (!rows) {
          return res.status(404).json({
            status: 404,
            error: 'Not Found',
          });
        }
        return res.status(200).json({
          status: 200,
          rows,
          rowCount,
        });
      } catch (error) {
        return res.status(400).json({
          status: 400,
          error: 'Something went wrong, try again',
        });
      }
    }
    return next();
  }

  /**
   *@param {req} object
   *@param {res} object c
   */
  static async approveReject(req, res) {
    // check for admin user
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({
          status: 403,
          error: 'Unauthorized!, Admin only route',
        });
    }
    const { error } = validate.loanApproveValidate(req.body);
    if (error) {
      return res.status(422).json({
        status: 422,
        error: error.details[0].message,
      });
    }
    const updateQuery = `UPDATE loan
      SET status=$1
      WHERE id=$2 returning *`;

    const values = [
      req.body.status,
      req.params.id,
    ];

    try {
      const { rows } = await db.query(updateQuery, values);
      return res.status(200).json({
        status: 200,
        data: [{
          message: `loan with id:${rows[0].id} has been ${rows[0].status}`,
          rows,
        }],
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong, try again',
      });
    }
  }


  /**
 *@param {req} object
 *@param {res} object
 */
  static async loanRepayforClient(req, res) {
    const { error } = validate.validateLoanRepayment(req.body);
    if (error) {
      return res.status(422).json({
        status: 422,
        error: error.details[0].message,
      });
    }
    try {
      const paidAmount = parseFloat(req.body.paidAmount);
      // find a loan in Loans data
      const queryString = 'SELECT * FROM loan WHERE id = $1';

      const output = `INSERT INTO 
    loanRepayment(id, loanId, createdOn, amount, monthlyInstallment, paidAmount, balance) 
    VALUES($1, $2, $3, $4, $5, $6, $7) 
    returning *`;

      const { rows } = await db.query(queryString, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No such loan found',
        });
      }
      if (paidAmount > rows[0].balance) {
        return res.status(400).json({
          status: 400,
          error: 'You can not pay more than your debt!',
        });
      }
      const balance = rows[0].balance - paidAmount;
      const paid = [
        uuidv4(),
        req.params.id,
        moment(new Date()),
        rows[0].amount, // loan amount
        rows[0].paymentinstallment, // what the user is expected to pay
        paidAmount,
        balance,
      ];
      const text = `UPDATE loan
      SET balance = ${balance}
      WHERE id = '${req.params.id}' returning *`;
      const result = await db.query(text);
      if (!result.rows[0]) {
        return res.status(400).json({
          status: 400,
          error: 'something went wrong',
        });
      }
      // update loan if user has fully paid loan
      if (balance === 0) {
        const textQuery = `UPDATE loan
      SET repaid = true
      WHERE id = '${req.params.id}' returning *`;
        const resRes = await db.query(textQuery);
        if (!resRes.rows[0]) {
          return res.status(400).json({
            status: 400,
            error: 'something went wrong',
          });
        }
      }

      const myRes = await db.query(output, paid);
      return res.status(201).send({
        status: 201,
        data: myRes.rows[0],
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'Something went wrong, try again',
      });
    }
  }
}

export default adminController;
