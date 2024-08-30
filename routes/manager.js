const express = require('express');
const router = express.Router();

// Render manager dashboard
router.get('/', (req, res) => {
    res.render('manager');
});

// Read customer details
router.get('/readcustomer', (req, res) => {
    const customerId = req.query.customerIdRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM customer WHERE CUST_ID = ?';

    db.query(sql, [customerId], (err, result) => {
        if (err) {
            console.error('Error reading customer:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Customer not found');
            return;
        }

        res.render('manager/readcustomer', { customer: result[0] });
    });
});

 router.get('/readapplication', (req, res) => {
     const applicationId = req.query.applicationIdRead;
     const db = req.app.get('mysqlConnection');

     const sql = 'SELECT * FROM application WHERE APPLICATION_ID = ?';

     db.query(sql, [applicationId], (err, result) => {
         if (err) {
             console.error('Error reading Customer');
             res.status(500).send('Internal Server Error');
             return;
         }

         if (result.length === 0) {
             res.status(404).send('Application not found');
             return;
         }

         console.log(result[0])
         res.render('manager/readapplication', { application: result[0] });
     });
 });
// quote
 router.get('/readquote', (req, res) => {
     const quoteId = req.query.quoteIdRead;
     const db = req.app.get('mysqlConnection');

     const sql = 'SELECT * FROM quote WHERE QUOTE_ID = ?';
     db.query(sql, [quoteId], (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
             return;
         }

        if (result.length === 0) {
             res.status(404).send('Quote not found');
             return;
         }
         console.log(result[0])

         res.render('manager/readquote', { quote: result[0] });
     });
 });

 // Read an insurance policy
 router.get('/readpolicy', (req, res) => {
     const agreementId = req.query.AGREEMENT_ID_READ;
     console.log(agreementId);
     const db = req.app.get('mysqlConnection');

     const sql = 'SELECT * FROM insurance_policy WHERE AGGREMENT_ID = ?';

     db.query(sql, [agreementId], (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
             return;
         }

         if (result.length === 0) {
             res.status(404).send('Insurance policy not found');
             return;
         }
         res.render('manager/readpolicy', { policy: result[0] });
     });
 });

 router.get('/readvehicle', (req, res) => {
    const vehicle_id = req.query.vehicle_idRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM vehicle WHERE vehicle_id = ?';

    db.query(sql, [vehicle_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Claim not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readvehicle.ejs', {vehicle: result[0] });
});
});

 router.get('/readclaim', (req, res) => {
     const claim_id = req.query.claim_idRead;
     const db = req.app.get('mysqlConnection');

     const sql = 'SELECT * FROM claim WHERE claim_id = ?';

     db.query(sql, [claim_id], (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
             return;
         }

         if (result.length === 0) {
             res.status(404).send('Claim not found');
             return;
         }
         console.log(result[0]);
         res.render('manager/readclaim.ejs', {claim: result[0] });
 });
 });

 router.get('/createclaim_settlement', (req, res) => {
     res.render('manager/createclaim_settlement');
 });

 router.post('/createclaim_settlement', (req, res) => {
     const db = req.app.get('mysqlConnection');
     console.log(req.body);
     const {claim_settlement_id,claim_id,cust_id,vehicle_id,date_settled,amount_paid,coverage_id } = req.body;

     const sql = `INSERT INTO claim_settlement (claim_settlement_id,claim_id,cust_id,vehicle_id,date_settled,amount_paid,coverage_id  ) 
                  VALUES (?, ?, ?, ?, ?,?,?)`;
     const values = [claim_settlement_id,claim_id,'3011',vehicle_id,date_settled,amount_paid,coverage_id ];

     db.query(sql, values, (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
             return;
         }
         console.log('New Claim Settlement added successfully');
         res.redirect('/manager'); 
     });
 });

 router.get('/readclaim_settlement', (req, res) => {
     const claim_settlement_id = req.query.claim_settlement_idRead;
     const db = req.app.get('mysqlConnection');

     const sql = 'SELECT * FROM claim_settlement WHERE claim_settlement_id = ?';

     db.query(sql, [claim_settlement_id], (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
             return;
         }

         if (result.length === 0) {
             res.status(404).send('Claim Settlement not found');
             return;
         }
         console.log(result[0]);
         res.render('manager/readclaim_settlement.ejs', {claim_settlement: result[0] });
 });
 });



 router.get('/updateclaim_settlement', (req, res) => {
     const claim_settlement_id = req.query.claim_settlement_id;
     const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM claim_settlement WHERE claim_settlement_id = ?';
     db.query(sql, [claim_settlement_id], (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
             return;
         }

         if (result.length === 0) {
             res.status(404).send('claim_settlement not found');
             return;
         }
         console.log(result[0])
         res.render('manager/updateclaim_settlement', { claim_settlement: result[0] });
     });
 });

 router.post('/updateclaim_settlement', (req, res) => {
    const {claim_settlement_id,claim_id,cust_id,vehicle_id,date_settled,amount_paid,coverage_id } = req.body;    const db = req.app.get('mysqlConnection');
     const sql = `UPDATE claim_settlement 
                  SET  claim_id=?,cust_id = ?, vehicle_id = ?, date_settled = ?,amount_paid=?,coverage_id=?
                  WHERE claim_settlement_id = ?`;
     const values = [claim_id,cust_id,vehicle_id,date_settled,amount_paid,coverage_id,claim_settlement_id  ];

     db.query(sql, values, (err, result) => {
         if (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
             return;
         }
         console.log('Claim Settlement updated successfully');
         res.redirect('/manager')    });
 });

 router.post('/deleteclaim_settlement', (req, res) => {
    const claim_settlement_id = req.body.claim_settlement_idDelete;
    const db = req.app.get('mysqlConnection');

    const sql = 'DELETE FROM claim_settlement WHERE claim_settlement_id = ?';
    db.query(sql, [claim_settlement_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('claim_settlement deleted successfully');
        res.redirect('/manager');
    });
});

router.get('/createstaff', (req, res) => {
    res.render('manager/createstaff'); 
});


router.post('/createstaff', (req, res) => {
    const db = req.app.get('mysqlConnection');
    console.log(req.body);
    const { staff_id, company_name, staff_fname, staff_lname, staff_address, staff_contact, staff_gender, staff_marital_status, staff_nationality, staff_qualification, staff_allowance, staff_pps_number } = req.body;

    const sql = `INSERT INTO staff (staff_id, company_name, staff_fname, staff_lname, staff_address, staff_contact, staff_gender, staff_marital_status, staff_nationality, staff_qualification, staff_allowance, staff_pps_number) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [staff_id, company_name, staff_fname, staff_lname, staff_address, staff_contact, staff_gender, staff_marital_status, staff_nationality, staff_qualification, staff_allowance, staff_pps_number];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('New Staff added successfully');
        res.redirect('/manager'); 
    });
});


router.get('/readstaff', (req, res) => {
    const staff_id = req.query.staff_idRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM staff WHERE staff_id = ?';

    db.query(sql, [staff_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('staff not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readstaff.ejs', {staff: result[0] });
});
});

  router.get('/readdepartment', (req, res) => {
      const department_name = req.query.department_nameRead;
      const db = req.app.get('mysqlConnection');

      const sql = 'SELECT * FROM department WHERE department_name = ?';

      db.query(sql, [department_name], (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
              return;
          }

          if (result.length === 0) {
              res.status(404).send('Department not found');
              return;
          }
          console.log(result[0]);
          res.render('manager/readdepartment.ejs', {department: result[0] });
  });
  });

  router.get('/readoffice', (req, res) => {
    const office_name = req.query.office_nameRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM office WHERE office_name = ?';

    db.query(sql, [office_name], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Office not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readoffice.ejs', {office: result[0] });
});
});
router.get('/readmembership', (req, res) => {
    const membership_id = req.query.membership_id_Read;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM membership WHERE membership_id = ?';

    db.query(sql, [membership_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Membership not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readmembership.ejs', {membership: result[0] });
});
});

router.get('/createvehicle_service', (req, res) => {
    res.render('manager/createvehicle_service'); 
});

router.post('/createvehicle_service', (req, res) => {
    const db = req.app.get('mysqlConnection');
    console.log(req.body);
   // const { vehicle_service, vehicle_id, cust_id, department_name, vehicle_service_address, vehicle_service_contact, vehicle_service_incharge, vehicle_service_type } = req.body;
    vehicle_service=req.body.vehicle_service;
    vehicle_id=req.body.vehicle_id;
     cust_id=req.body.cust_id;
     department_name=req.body.department_name;
     vehicle_service_address=req.body.vehicle_service_address;
     vehicle_service_contact=req.body.vehicle_service_contact;
     vehicle_service_incharge=req.body.vehicle_service_incharge;
     vehicle_service_type=req.body.vehicle_service_type;
    const sql = `INSERT INTO vehicle_service (vehicle_service, vehicle_id, cust_id, department_name, vehicle_service_address, vehicle_service_contact, vehicle_service_incharge, vehicle_service_type) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [vehicle_service, vehicle_id, cust_id, department_name, vehicle_service_address, vehicle_service_contact, vehicle_service_incharge, vehicle_service_type];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('New Vehicle Service added successfully');
        res.redirect('/manager'); // Redirect to manager dashboard or any other appropriate page
    });
});



router.get('/readvehicle_service', (req, res) => {
    const vehicle_id = req.query.vehicle_idRead;
    console.log('Vehicle ID:', vehicle_id); // Log the vehicle_id value

    const db = req.app.get('mysqlConnection');
    const sql = 'SELECT * FROM vehicle_service WHERE vehicle_id = ?';

    db.query(sql, [vehicle_id], (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).send('Error retrieving vehicle service');
        }

        if (result.length === 0) {
            console.log('No matching vehicle service found');
            return res.status(404).send('Vehicle Service not found');
        }

        console.log('Vehicle Service:', result[0]); // Log the fetched vehicle service
        res.render('manager/readvehicle_service.ejs', { vehicle_service: result[0] });
    });
});

router.post('/deletevehicle_service', (req, res) => {
    const vehicle_service_id = req.body.vehicle_service_idDelete;
    const db = req.app.get('mysqlConnection');

    const sql = 'DELETE FROM vehicle_service WHERE vehicle_service= ?';
    db.query(sql, [vehicle_service_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Vehicle service deleted successfully');
        res.redirect('/manager');
    });
});


router.get('/readnok', (req, res) => {
    const nok_id = req.query.nok_idRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM nok WHERE nok_id = ?';

    db.query(sql, [nok_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('NOK not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readnok.ejs', {nok: result[0] });
});
});


router.get('/readinsurance_companies', (req, res) => {
    const company_name = req.query.company_nameRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM insurance_companies WHERE company_name = ?';

    db.query(sql, [company_name], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Insurance Company not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readinsurance_companies.ejs', {insurance_companies: result[0] });
});
});

// Render form to create a new policy renewal
router.get('/createpolicy_renewable', (req, res) => {
    res.render('manager/createpolicy_renewable');
});

// Create a new policy renewal
router.post('/createpolicy_renewable', (req, res) => {
    const db = req.app.get('mysqlConnection');
    //const { policyRenewalId, agreementId, applicationId, customerId, dateOfRenewal, typeOfRenewal } = req.body;
    policy_renewable_id=req.body.policy_renewable_id;
    agreement_id=req.body.agreement_id;
    cust_id=req.body.cust_id;
    application_id=req.body.application_id;
    date_of_renewal=req.body.date_of_renewal;
    type_of_renewal=req.body.type_of_renewal;

    const sql = `INSERT INTO policy_renewable (policy_renewable_id, agreement_id, cust_id, application_id, date_of_renewal, type_of_renewal) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [policy_renewable_id, agreement_id,  cust_id,application_id, date_of_renewal, type_of_renewal];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('New Policy Renewal added successfully');
        res.redirect('/manager');
    });
});

// Read a policy renewal by ID
router.get('/readpolicy_renewable', (req, res) => {
    const policy_renewable_id = req.query.Policy_RenewableRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM policy_renewable WHERE policy_renewable_id = ?';

    db.query(sql, [policy_renewable_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Policy Renewal not found');
            return;
        }
        //res.render('manager/readpolicy_renewable', { policyRenewable: result[0] });
        res.render('manager/readpolicy_renewable.ejs', { policy_renewable: result[0] });

    });
});

// Update a policy renewal
router.get('/updatepolicy_renewable', (req, res) => {
    const policyRenewalId = req.query.policy_renewableupdate;
    //const policyRenewalId = req.params.policyRenewalId;

    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM policy_renewable WHERE policy_renewable_id = ?';

    db.query(sql, [policyRenewalId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Policy Renewal not found');
            return;
        }
        //res.render('manager/updatepolicy_renewable', { policyRenewable: result[0] });
        res.render('manager/updatepolicy_renewable.ejs', { policyRenewal: result[0] });

    });
});

router.post('/updatepolicy_renewable', (req, res) => {
    const { agreementId, applicationId, customerId, dateOfRenewal, typeOfRenewal } = req.body;
    const policyRenewalId = req.body.policy_renewableupdate;
    const db = req.app.get('mysqlConnection');

    const sql = `UPDATE policy_renewable 
                 SET agreement_id = ?, application_id = ?, cust_id = ?, date_of_renewal = ?, type_of_renewal = ?
                 WHERE policy_renewable_id = ?`;
    const values = [agreementId, applicationId, customerId, dateOfRenewal, typeOfRenewal, policyRenewalId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Policy Renewal updated successfully');
        res.redirect('/manager');
    });
});

// Delete a policy renewal
router.post('/deletepolicy_renewable', (req, res) => {
    const policy_renewable_id = req.body.Policy_RenewableDelete;
    const db = req.app.get('mysqlConnection');

    const sql = 'DELETE FROM policy_renewable WHERE policy_renewable_id = ?';
    db.query(sql, [policy_renewable_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Policy Renewal deleted successfully');
        res.redirect('/manager');
    });
});


// Render form to create a new incident
router.get('/createincident', (req, res) => {
    res.render('manager/createincident');
});

// Create a new incident
router.post('/createincident', (req, res) => {
    const db = req.app.get('mysqlConnection');
    const { incidentId, incidentType, incidentDate, description } = req.body;

    const sql = `INSERT INTO incident (incident_id, incident_type, incident_date, description) 
                 VALUES (?, ?, ?, ?)`;
    const values = [incidentId, incidentType, incidentDate, description];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('New Incident added successfully');
        res.redirect('/manager');
    });
});


router.get('/readincident', (req, res) => {
    const INCIDENT_ID = req.query.INCIDENT_IDRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM incident WHERE INCIDENT_ID = ?';

    db.query(sql, [INCIDENT_ID], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Insurance Company not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readincident.ejs', {incident: result[0] });
});
});

router.post('/deleteincident', (req, res) => {
    const incident_id = req.body.incidentDelete;
    const db = req.app.get('mysqlConnection');

    const sql = 'DELETE FROM incident WHERE incident_id = ?';
    db.query(sql, [incident_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('incident deleted successfully');
        res.redirect('/manager');
    });
});


// Render form to create a new incident report
router.get('/createincident_report', (req, res) => {
    res.render('manager/createincident_report');
});

// Create a new incident report
router.post('/createincident_report', (req, res) => {
    const db = req.app.get('mysqlConnection');
    const { incident_report_id, incident_id, cust_id, incident_inspector,incident_cost, incident_type, incident_report_description } = req.body;

    const sql = `INSERT INTO INCIDENT_REPORT (INCIDENT_REPORT_ID, INCIDENT_ID, CUST_ID, INCIDENT_INSPECTOR, INCIDENT_COST, INCIDENT_TYPE, INCIDENT_REPORT_DESCRIPTION) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [incident_report_id, incident_id, cust_id, incident_inspector,incident_cost, incident_type, incident_report_description];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('New Incident Report added successfully');
        res.redirect('/manager');
    });
});




router.get('/readincident_report', (req, res) => {
    const incident_report_ID = req.query.incident_report_IDRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM incident_report WHERE incident_report_ID = ?';

    db.query(sql, [incident_report_ID], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Insurance Company not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readincident_report.ejs', {incident_report: result[0] });
});
});

router.post('/deleteincident_report', (req, res) => {
    const incident_report_id = req.body.incident_reportDelete;
    const db = req.app.get('mysqlConnection');

    const sql = 'DELETE FROM incident_report WHERE incident_report_id = ?';
    db.query(sql, [incident_report_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('incident_report deleted successfully');
        res.redirect('/manager');
    });
});


router.get('/readcoverage', (req, res) => {
    const coverage_id = req.query.coverage_idRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM coverage WHERE coverage_id = ?';

    db.query(sql, [coverage_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Coverage not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readcoverage.ejs', {coverage: result[0] });
});
});

router.get('/createproduct', (req, res) => {
    res.render('manager/createproduct.ejs');
});

router.post('/createproduct', (req, res) => {
    const db = req.app.get('mysqlConnection');
    console.log(req.body);
    const {product_number,company_name,product_price,product_type } = req.body;

    const sql = `INSERT INTO product (product_number,company_name,product_price,product_type) 
                 VALUES (?, ?, ?, ?)`;
    const values = [product_number,company_name,product_price,product_type];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('New product added successfully');
        res.redirect('/manager'); 
    });
});



router.get('/readproduct', (req, res) => {
    const product_number = req.query.product_numberRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM product WHERE product_number = ?';

    db.query(sql, [product_number], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Product not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readproduct.ejs', {product: result[0] });
});
});

router.get('/updateproduct', (req, res) => {
    const product_number = req.query.productupdate;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM product WHERE product_number = ?';
    db.query(sql, [product_number], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('product not found');
            return;
        }
        console.log(result[0])
        res.render('manager/updateproduct', { product: result[0] });
    });
});

router.post('/updateproduct', (req, res) => {
    const {product_number,company_name,product_price,product_type} = req.body;
    const db = req.app.get('mysqlConnection');
    const sql = `UPDATE product 
                 SET  company_name = ?, product_price = ?, product_type = ?
                 WHERE product_number = ?`;
    const values = [company_name,product_price,product_type,product_number];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('product updated successfully');
        res.redirect('/manager');
});
});
router.post('/deleteproduct', (req, res) => {
    const product_number = req.body.productDelete;
    const db = req.app.get('mysqlConnection');

    const sql = 'DELETE FROM product WHERE product_number = ?';
    db.query(sql, [product_number], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('product deleted successfully');
        res.redirect('/manager');
    });
});



router.get('/createreceipt', (req, res) => {
    res.render('manager/createreceipt.ejs');
});

router.post('/createreceipt', (req, res) => {
    const db = req.app.get('mysqlConnection');
    console.log(req.body);
    const {receipt_id,premium_payment_id,cust_id,cost,time } = req.body;

    const sql = `INSERT INTO receipt (receipt_id,premium_payment_id,cust_id,cost,time) 
                 VALUES (?, ?, ?, ?, ?)`;
    const values = [receipt_id,premium_payment_id,cust_id,cost,time];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('New Receipt added successfully');
        res.redirect('/manager'); 
    });
});

router.get('/readreceipt', (req, res) => {
    const receipt_id = req.query.receipt_idRead;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM receipt WHERE receipt_id = ?';

    db.query(sql, [receipt_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Receipt not found');
            return;
        }
        console.log(result[0]);
        res.render('manager/readreceipt.ejs', {receipt: result[0] });
});
});



router.get('/updatereceipt', (req, res) => {
    const receipt_id = req.query.receipt_id;
    const db = req.app.get('mysqlConnection');

    const sql = 'SELECT * FROM receipt WHERE receipt_id = ?';
    db.query(sql, [receipt_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('receipt not found');
            return;
        }
        console.log(result[0])
        res.render('manager/updatereceipt', { receipt: result[0] });
    });
});

router.post('/updatereceipt', (req, res) => {
    const {receipt_id,premium_payment_id,cust_id,cost,time} = req.body;
    const db = req.app.get('mysqlConnection');
    const sql = `UPDATE receipt 
                 SET  premium_payment_id = ?, cust_id = ?, cost = ?,time=?
                 WHERE receipt_id = ?`;
    const values = [premium_payment_id,cust_id,cost,time,receipt_id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Receipt updated successfully');
        res.redirect('/manager');
    });
});



router.post('/deletereceipt', (req, res) => {
    const receipt_id = req.body.receipt_idDelete;
    const db = req.app.get('mysqlConnection');

    const sql = 'DELETE FROM receipt WHERE receipt_id = ?';
    db.query(sql, [receipt_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('receipt deleted successfully');
        res.redirect('/manager');
});
})

router.get('/customer', (req, res) => {
    res.render('manager/customer');
});

router.get('/application', (req, res) => {
    res.render('manager/application');
});

router.get('/quote', (req, res) => {
    res.render('manager/quote');
});

router.get('/insurance_policy', (req, res) => {
    res.render('manager/insurance_policy');
});

router.get('/vehicle', (req, res) => {
    res.render('manager/vehicle');
});

router.get('/claim', (req, res) => {
    res.render('manager/claim');
});

router.get('/claim_settlement', (req, res) => {
    res.render('manager/claim_settlement');
});

router.get('/staff', (req, res) => {
    res.render('manager/staff');
});

router.get('/department', (req, res) => {
    res.render('manager/department');
});

router.get('/office', (req, res) => {
    res.render('manager/office');
});

router.get('/membership', (req, res) => {
    res.render('manager/membership');
});

router.get('/vehicle_service', (req, res) => {
    res.render('manager/vehicle_service');
});

router.get('/nok', (req, res) => {
    res.render('manager/nok');
});

router.get('/insurance_company', (req, res) => {
    res.render('manager/insurance_company');
});

router.get('/policy_renewable', (req, res) => {
    res.render('manager/policy_renewable');
});

router.get('/incident', (req, res) => {
    res.render('manager/incident');
});

router.get('/incident_report', (req, res) => {
    res.render('manager/incident_report');
});

router.get('/coverage', (req, res) => {
    res.render('manager/coverage');
});

router.get('/product', (req, res) => {
    res.render('manager/product');
});

router.get('/receipt', (req, res) => {
    res.render('manager/receipt');
});



 // Define other routes for reading application, quote, and insurance policy...

module.exports = router;
