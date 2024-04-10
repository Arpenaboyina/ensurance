let mysql = require("mysql2");
let express = require("express");
let methodOverride = require("method-override");
let app = express();
const { v4: uuidv4 } = require('uuid');

app.set("view engine", "ejs");

// Create MySQL connection
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project',
    password: '22bcs007'
});

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

let port = 8080;

app.listen(port, () => {
    console.log("Server started");
});

app.get("/customer", (req, res) => {
    let q = `SELECT * FROM customer`;
    connection.query(q, (err, customers) => {
       //array of object in result  
        console.log(customers);
        res.render("all.ejs", { customers });
    });
});

app.get("/customer/add",(req,res)=>{
    res.render("add.ejs");
})

app.post("/customer/new", (req, res) => {
    const {  
        cust_fname, 
        cust_lname, 
        cust_dob, 
        cust_gender, 
        cust_address, 
        cust_mob_number, 
        cust_email, 
        cust_passport_number, 
        cust_marital_status, 
        cust_pps_number 
    } = req.body;
    
    const q = 'INSERT INTO customer (cust_id, cust_fname, cust_lname, cust_dob, cust_gender, cust_address, cust_mob_number, cust_email, cust_passport_number, cust_marital_status, cust_pps_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const cust_id = uuidv4().replace(/-/g, '').substring(0, 20);
    connection.query(
        q, 
        [cust_id, cust_fname, cust_lname, cust_dob, cust_gender, cust_address, cust_mob_number, cust_email, cust_passport_number, cust_marital_status, cust_pps_number],
        (err, results) => {
            
            console.log("Customer inserted successfully:", results);
            res.redirect("/customer"); 
        }
    );
});



app.get("/customer/new_application/:id", (req, res) => {
    let { id: CUST_ID } = req.params;
    res.render("new_application.ejs", { CUST_ID });
});


app.post('/customer/new_application/:CUST_ID', (req, res) => {
    let { CUST_ID } = req.params;
    const {
        vehicle_id,
        dependent_nok_id,
        vehicle_registration_number,
        vehicle_value,
        vehicle_type,
        vehicle_size,
        vehicle_number_of_seat,
        vehicle_manufacturer,
        vehicle_engine_number,
        vehicle_chassis_number,
        vehicle_number,
        vehicle_model_number,
        coverage,
        issue_date
    } = req.body;

    // Assuming 'coverage' is the coverage type entered by the user
    let q = `SELECT * FROM coverage WHERE COVERAGE_ID = ?`;
    connection.query(q, [coverage], (err, cov) => {
        if (err) {
            console.error('Error selecting coverage:', err);
            return res.status(500).send('An error occurred. Please try again later.');
        }
        if (cov && cov.length > 0) { // Check if cov is defined and not empty
            let application_status = 'approved';

            connection.beginTransaction(err => {
                if (err) {
                    console.error('Error starting transaction:', err);
                    return res.status(500).send('An error occurred. Please try again later.');
                }

                let APPLICATION_ID = uuidv4().replace(/-/g, '').substring(0, 20);
                let VEHICLE_ID = uuidv4().replace(/-/g, '').substring(0, 20);
                let q2 = `INSERT INTO application (APPLICATION_ID, CUST_ID, VEHICLE_ID, APPLICATION_STATUS, COVERAGE) VALUES (?, ?, ?, ?, ?)`;
                connection.query(q2, [APPLICATION_ID, CUST_ID, VEHICLE_ID, application_status, coverage], (err, result) => {
                    if (err) {
                        connection.rollback(() => {
                            console.error('Error inserting into application:', err);
                            return res.status(500).send('An error occurred. Please try again later.');
                        });
                    }

                    let q3 = `INSERT INTO vehicle (VEHICLE_ID, CUST_ID, POLICY_ID, DEPENDENT_NOK_ID, VEHICLE_REGISTRATION_NUMBER, VEHICLE_VALUE, VEHICLE_TYPE, VEHICLE_SIZE, VEHICLE_NUMBER_OF_SEAT, VEHICLE_MANUFACTURER, VEHICLE_ENGINE_NUMBER, VEHICLE_CHASIS_NUMBER, VEHICLE_NUMBER, VEHICLE_MODEL_NUMBER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    connection.query(q3, [vehicle_id, CUST_ID, coverage, dependent_nok_id, vehicle_registration_number, vehicle_value, vehicle_type, vehicle_size, vehicle_number_of_seat, vehicle_manufacturer, vehicle_engine_number, vehicle_chassis_number, vehicle_number, vehicle_model_number], (err, veh) => {
                        if (err) {
                            connection.rollback(() => {
                                console.error('Error inserting into vehicle:', err);
                                return res.status(500).send('An error occurred. Please try again later.');
                            });
                        }

                        let validTillDate = new Date(issue_date);
                        validTillDate.setFullYear(validTillDate.getFullYear() + 1);
                        let QUOTE_ID = uuidv4().replace(/-/g, '').substring(0, 20);
                        let q4 = `INSERT INTO quote (QUOTE_ID, APPLICATION_ID, CUST_ID, ISSUE_DATE, VALID_FROM_DATE, VALID_TILL_DATE, DESCRIPTION, PRODUCT_ID, COVERAGE_LEVEL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                        connection.query(q4, [QUOTE_ID, APPLICATION_ID, CUST_ID, issue_date, issue_date, validTillDate, cov[0].COVERAGE_DESCRIPTION, cov[0].PRODUCT_ID, cov[0].COVERAGE_LEVEL], (err, result) => {
                            if (err) {
                                connection.rollback(() => {
                                    console.error('Error inserting into quote:', err);
                                    return res.status(500).send('An error occurred. Please try again later.');
                                });
                            }

                            let AGREEMENT_ID = uuidv4().replace(/-/g, '').substring(0, 20);
                            let q5 = `INSERT INTO insurance_policy (AGREEMENT_ID, APPLICATION_ID, CUST_ID, DEPARTMENT_NAME, POLICY_NUMBER, START_DATE, EXPIRY_DATE, TERM_CONDITION_DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                            connection.query(q5, [AGREEMENT_ID, APPLICATION_ID, CUST_ID, cov[0].DEPARTMENT_NAME, coverage, issue_date, validTillDate, cov[0].COVERAGE_DESCRIPTION], (err, result) => {
                                if (err) {
                                    connection.rollback(() => {
                                        console.error('Error inserting into insurance_policy:', err);
                                        return res.status(500).send('An error occurred. Please try again later.');
                                    });
                                }

                                let product_id = cov[0].PRODUCT_ID;
                                let qGetProductNumber = `SELECT PRODUCT_PRICE FROM product WHERE PRODUCT_NUMBER = ?`;
                                connection.query(qGetProductNumber, [product_id], (err, productResult) => {
                                    if (err) {
                                        connection.rollback(() => {
                                            console.error('Error selecting product price:', err);
                                            return res.status(500).send('An error occurred. Please try again later.');
                                        });
                                    }

                                    if (productResult && productResult.length > 0) { // Check if productResult is defined and not empty
                                        let PREMIUM_PAYMENT_ID = uuidv4().replace(/-/g, '').substring(0, 20);
                                        let RECEIPT_ID = uuidv4().replace(/-/g, '').substring(0, 20);
                                        let PRODUCT_PRICE = productResult[0].PRODUCT_PRICE;
                                        let q6 = `INSERT INTO premium_payment (PREMIUM_PAYMENT_ID, CUST_ID, POLICY_NUMBER, PREMIUM_PAYMENT_SCHEDULE, PREMIUM_PAYMENT_AMOUNT, RECEIPT_ID) VALUES (?, ?, ?, ?, ?, ?)`;
                                        connection.query(q6, [PREMIUM_PAYMENT_ID, CUST_ID, coverage, issue_date, cov[0].COVERAGE_AMOUNT, RECEIPT_ID], (err, result) => {
                                            if (err) {
                                                connection.rollback(() => {
                                                    console.error('Error inserting into premium_payment:', err);
                                                    return res.status(500).send('An error occurred. Please try again later.');
                                                });
                                            }

                                            let q7 = `INSERT INTO receipt (RECEIPT_ID, PREMIUM_PAYMENT_ID, CUST_ID, COST, TIME) VALUES (?, ?, ?, ?, ?)`;
                                            connection.query(q7, [RECEIPT_ID, PREMIUM_PAYMENT_ID, CUST_ID, cov[0].COVERAGE_AMOUNT, issue_date], (err, result) => {
                                                if (err) {
                                                    connection.rollback(() => {
                                                        console.error('Error inserting into receipt:', err);
                                                        return res.status(500).send('An error occurred. Please try again later.');
                                                    });
                                                }

                                                let q8 = `INSERT INTO insurance_policy_coverage (AGREEMENT_ID, COVERAGE_ID) VALUES (?, ?)`;
                                                connection.query(q8, [AGREEMENT_ID, cov[0].COVERAGE_ID], (err, result) => {
                                                    if (err) {
                                                        connection.rollback(() => {
                                                            console.error('Error inserting into insurance_policy_coverage:', err);
                                                            return res.status(500).send('An error occurred. Please try again later.');
                                                        });
                                                    }

                                                    connection.commit(err => {
                                                        if (err) {
                                                            connection.rollback(() => {
                                                                console.error('Error committing transaction:', err);
                                                                return res.status(500).send('An error occurred. Please try again later.');
                                                            });
                                                        }
                                                        console.log('Transaction Complete.');
                                                        res.send(`Amount ${cov[0].COVERAGE_AMOUNT} Debited from your account`);
                                                    });
                                                });
                                            });
                                        });
                                    } else {
                                        console.error('Error: Product result is empty or undefined.');
                                        return res.status(500).send('An error occurred. Please try again later.');
                                    }
                                });
                            });
                        });
                    });
                });
            });
        } else {
            console.error('Error: Coverage result is empty or undefined.');
            return res.status(500).send('An error occurred. Please try again later.');
        }
    });
});






app.get("/customer/view_applications/:id", (req, res) => {
    const { id: CUST_ID } = req.params;

    let q = `
        SELECT DISTINCT
            application.APPLICATION_ID, 
            quote.CUST_ID, 
            application.VEHICLE_ID, 
            application.APPLICATION_STATUS, 
            quote.DESCRIPTION,
            insurance_policy.POLICY_NUMBER
        FROM 
            application
        INNER JOIN 
            quote ON application.APPLICATION_ID = quote.APPLICATION_ID
        INNER JOIN 
            insurance_policy ON application.APPLICATION_ID = insurance_policy.APPLICATION_ID
        WHERE 
            application.CUST_ID = ?
    `;
    connection.query(q, [CUST_ID], (err, applications) => {
        res.render("view_applications.ejs", { applications });
    });
});


app.get("/policy", (req, res) => {
    let q = `SELECT *
    from coverage AS c
    INNER JOIN product AS pr ON c.PRODUCT_ID = pr.PRODUCT_NUMBER;
    `;
    connection.query(q, (err, policies) => {
        if (err) {
            console.error('Error fetching policies: ' + err.message);
            res.status(500).send('Error fetching policies');
            return;
        }
        console.log(policies);
        res.render("all_policy.ejs", { policies });
    });
});


app.get("/customer/policy_renew/:POLICY_NUMBER/:CUST_ID/:id", (req, res) => {
    const { POLICY_NUMBER,CUST_ID,id: APPLICATION_ID } = req.params;
    res.render("premium_form.ejs", { APPLICATION_ID,CUST_ID,POLICY_NUMBER });
       
});

app.post("/policy_renew/:POLICY_NUMBER/:CUST_ID/:id", (req, res) => {
    const { POLICY_NUMBER,CUST_ID,id: APPLICATION_ID } = req.params;
    const { issue_date } = req.body;

    let qu = `SELECT MAX(VALID_TILL_DATE) AS max_valid_till_date FROM QUOTE WHERE APPLICATION_ID = '${APPLICATION_ID}'`;

    connection.query(qu, (err, result) => {
        if (err) {
            console.error('Error selecting max valid till date:', err);
            return res.status(500).send('An error occurred. Please try again later.');
        }

        const maxValidTillDate = result[0].max_valid_till_date;

        let validFrom, validTill;

        if (new Date(issue_date) > new Date(maxValidTillDate)) {
            
            validFrom = issue_date;
            const issueDate = new Date(issue_date);
            validTill = new Date(issueDate.setFullYear(issueDate.getFullYear() + 1));
            console.log("1")
        } else {
            validFrom = maxValidTillDate;
            const maxValidDate = new Date(maxValidTillDate);
            validTill = new Date(maxValidDate.setFullYear(maxValidDate.getFullYear() + 1));
            console.log("2")
        }

let q1 = "SELECT * FROM quote WHERE application_id = ?";
connection.query(q1, [APPLICATION_ID], (err, quotes) => {
    console.log("q1");

    if (err) {
        console.error('Error selecting quotes:', err);
        return res.status(500).send('An error occurred. Please try again later.');
    }

    // Assuming you have other necessary variables like CUST_ID, issue_date, validFrom, and validTill defined

    let QUOTE_ID = uuidv4().replace(/-/g, '').substring(0, 20);
    let q2 = `INSERT INTO quote (QUOTE_ID, APPLICATION_ID, CUST_ID, ISSUE_DATE, VALID_FROM_DATE, VALID_TILL_DATE, DESCRIPTION, PRODUCT_ID, COVERAGE_LEVEL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(q2, [QUOTE_ID, APPLICATION_ID, CUST_ID, issue_date, validFrom, validTill, quotes[0].DESCRIPTION, quotes[0].PRODUCT_ID, quotes[0].COVERAGE_LEVEL], (err, result) => {
        if (err) {
            console.error('Error inserting new quote:', err);
            return res.status(500).send('An error occurred. Please try again later.');
        }

        console.log('New quote inserted successfully.');

        // After quote insertion, proceed to insurance_policy insertion
        let q3 = `SELECT * FROM insurance_policy WHERE APPLICATION_ID = ?`;
        connection.query(q3, [APPLICATION_ID], (err, policies) => {
            console.log("q3");

            if (err) {
                console.error('Error selecting insurance policies:', err);
                return res.status(500).send('An error occurred. Please try again later.');
            }

            // Assuming you have the necessary variables for insurance_policy insertion

            //Insert into insurance_policy table
            let q4 = `INSERT INTO INSURANCE_POLICY (AGREEMENT_ID, APPLICATION_ID, CUST_ID, DEPARTMENT_NAME, POLICY_NUMBER, START_DATE, EXPIRY_DATE, TERM_CONDITION_DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            let AGREEMENT_ID = uuidv4().replace(/-/g, '').substring(0, 20);
            connection.query(q4, [AGREEMENT_ID,APPLICATION_ID,CUST_ID,policies[0].DEPARTMENT_NAME,policies[0].POLICY_NUMBER,validFrom,validTill,policies[0].TERM_CONDITION_DESCRIPTION], (err, result) => {
                if (err) {
                    console.error('Error inserting new insurance policy:', err);
                    return res.status(500).send('An error occurred. Please try again later.');
                }

                console.log('New insurance policy inserted successfully.');

                // After insurance_policy insertion, proceed to premium_payment insertion
                let q5 = `SELECT * FROM COVERAGE WHERE COVERAGE_ID = ?`;
                connection.query(q5, [POLICY_NUMBER], (err, payments) => {
                    console.log("q5");

                    if (err) {
                        console.error('Error selecting premium payments:', err);
                        return res.status(500).send('An error occurred. Please try again later.');
                    }

                    // Assuming you have the necessary variables for premium_payment insertion

                    // Insert into premium_payment table
                    let q6 = `INSERT INTO PREMIUM_PAYMENT (PREMIUM_PAYMENT_ID, CUST_ID, POLICY_NUMBER, PREMIUM_PAYMENT_SCHEDULE, PREMIUM_PAYMENT_AMOUNT, RECEIPT_ID) VALUES (?, ?, ?, ?, ?, ?)`;
                    let PREMIUM_PAYMENT_ID = uuidv4().replace(/-/g, '').substring(0, 20);
                    let RECEIPT_ID = uuidv4().replace(/-/g, '').substring(0, 20);
                    connection.query(q6, [PREMIUM_PAYMENT_ID,CUST_ID,POLICY_NUMBER,issue_date,payments[0].COVERAGE_AMOUNT,RECEIPT_ID], (err, result) => {
                        if (err) {
                            console.error('Error inserting new premium payment:', err);
                            return res.status(500).send('An error occurred. Please try again later.');
                        }

                        console.log('New premium payment inserted successfully.');

                        // After premium_payment insertion, proceed to receipt insertion
                        
                            let q8 = `INSERT INTO RECEIPT (RECEIPT_ID, PREMIUM_PAYMENT_ID, CUST_ID, COST, TIME) VALUES (?, ?, ?, ?, ?)`;

                            connection.query(q8, [RECEIPT_ID,PREMIUM_PAYMENT_ID,CUST_ID,payments[0].COVERAGE_AMOUNT,issue_date], (err, result) => {
                                

                                console.log('New receipt inserted successfully.');
                                let POLICY_RENEWABLE_ID= uuidv4().replace(/-/g, '').substring(0, 20);
                                // All insertions completed
                                let q9 = `INSERT INTO POLICY_RENEWABLE (POLICY_RENEWABLE_ID, AGREEMENT_ID, APPLICATION_ID, CUST_ID, DATE_OF_RENEWAL, TYPE_OF_RENEWAL) VALUES (?, ?, ?, ?, ?, ?)`;
                                connection.query(q9,[POLICY_RENEWABLE_ID,AGREEMENT_ID,APPLICATION_ID,CUST_ID,validFrom,'Explicit'],(err,res)=>{
                                    console.log("q9");
                                    console.log('All insertions completed.');
                                    
                                })
                                
                            });
                        
                    });
                });
             });
        });
    });
 });
    });
    res.send("Done")
});

app.get("/customer/report_incident/:CUST_ID", (req, res) => {
    let {CUST_ID} = req.params;
    console.log("Hello");
    res.render("report_incident.ejs",{CUST_ID});
});

app.post("/customer/report_incident/:CUST_ID", (req, res) => {
    let { CUST_ID } = req.params;
    let { application_id,incident_inspector, incident_cost, incident_type,incident_date, incident_report_description } = req.body;

    // Generate unique IDs for INCIDENT and INCIDENT_REPORT
    let INCIDENT_ID = uuidv4().replace(/-/g, '').substring(0, 20);
    let INCIDENT_REPORT_ID = uuidv4().replace(/-/g, '').substring(0, 20);

    // Insert into INCIDENT table
    let q1 = `INSERT INTO INCIDENT (INCIDENT_ID, INCIDENT_TYPE,INCIDENT_DATE, DESCRIPTION) VALUES (?, ?,?, ?)`;
    connection.query(q1, [INCIDENT_ID, incident_type, incident_date,incident_report_description], (err, incident) => {
        if (err) {
            console.error('Error inserting into INCIDENT:', err);
            return res.status(500).send('An error occurred while reporting the incident.');
        }

        // Insert into INCIDENT_REPORT table
        let q2 = `INSERT INTO INCIDENT_REPORT (INCIDENT_REPORT_ID, INCIDENT_ID, CUST_ID,APPLICATION_ID, INCIDENT_INSPECTOR, INCIDENT_COST, INCIDENT_TYPE, INCIDENT_REPORT_DESCRIPTION) VALUES (?, ?, ?,?, ?, ?, ?, ?)`;
        connection.query(q2, [INCIDENT_REPORT_ID, INCIDENT_ID, CUST_ID,application_id, incident_inspector, incident_cost, incident_type, incident_report_description], (err, incidentReport) => {
            if (err) {
                console.error('Error inserting into INCIDENT_REPORT:', err);
                return res.status(500).send('An error occurred while reporting the incident.');
            }

            console.log('Incident reported successfully.');
            res.send('Incident reported successfully.');
        });
    });
});




app.get("/company", (req, res) => {
    let q = `SELECT * FROM INSURANCE_COMPANY`;
    connection.query(q, (err, result) => {
        if (err) {
            console.error("Error fetching insurance companies:", err);
            res.status(500).send("Error fetching insurance companies");
            return;
        }
        res.render("company.ejs", { companies: result });
    });
});
app.get("/company/add_staff/:COMPANY_NAME",(req,res)=>{
    let{COMPANY_NAME} = req.params;
    res.render("add_staff.ejs",{COMPANY_NAME});
})

app.post("/company/add_staff/:COMPANY_NAME", (req, res) => {
    let { COMPANY_NAME } = req.params;
    let {
        firstName, lastName, address, contact, gender,
        maritalStatus, nationality, qualification, allowance,
        ppsNumber
    } = req.body;

    let STAFF_ID = uuidv4().replace(/-/g, '').substring(0, 20);

    let q = `INSERT INTO STAFF (STAFF_ID, COMPANY_NAME, STAFF_FNAME, STAFF_LNAME, STAFF_ADDRESS, STAFF_CONTACT, STAFF_GENDER, STAFF_MARITAL_STATUS, STAFF_NATIONALITY, STAFF_QUALIFICATION, STAFF_ALLOWANCE, STAFF_PPS_NUMBER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(q, [STAFF_ID, COMPANY_NAME, firstName, lastName, address, contact, gender, maritalStatus, nationality, qualification, allowance, ppsNumber], (err, result) => {
        if (err) {
            console.error("Error adding staff:", err);
            res.status(500).send("Error adding staff");
            return;
        }
        console.log("Staff added successfully:", result);
        res.redirect("/company"); // Redirect to company page after adding staff
    });
});



app.get("/company/add",(req,res)=>{
    res.render("company_add.ejs");
})
app.post("/company/add", (req, res) => {
    let {
        company_name,
        company_address,
        company_contact_number,
        company_fax,
        company_email,
        company_website,
        company_location,
        company_department_name,
        company_office_name
    } = req.body;


    let q = `INSERT INTO INSURANCE_COMPANY ( COMPANY_NAME, COMPANY_ADDRESS, COMPANY_CONTACT_NUMBER,
             COMPANY_FAX, COMPANY_EMAIL, COMPANY_WEBSITE, COMPANY_LOCATION, COMPANY_DEPARTMENT_NAME,
             COMPANY_OFFICE_NAME) 
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Assuming you have a database connection pool named 'pool' established
    connection.query(q, [company_name, company_address, company_contact_number, company_fax,
                   company_email, company_website, company_location, company_department_name,
                   company_office_name], (err, result) => {
                        if (err) {
                            console.error("Error inserting company:", err);
                            res.status(500).json({ error: "Internal Server Error" });
                        } else {
                            console.log("Company inserted successfully");
                            res.redirect("/customer");
                        }
    });
});

app.get("/company/add_department/:COMPANY_NAME",(req,res)=>{
    let {COMPANY_NAME}= req.params;
    res.render("add_department.ejs",{COMPANY_NAME});
});

app.post("/company/add_department/:COMPANY_NAME",(req,res)=>{
    let {COMPANY_NAME}= req.params;
    let {departmentName,office_name,office_address,
        contact_information,admin_cost,staff_fname,
        staff_lname,staff_address,staff_contact,
        staff_gender,staff_marital_status,staff_nationality,
        staff_qualification,staff_allowance,staff_pps_number}=req.body;
    
        let staff_id = uuidv4().replace(/-/g, '').substring(0, 20);

        let staffQuery = 'INSERT INTO staff (STAFF_ID, COMPANY_NAME,DEPARTMENT_NAME,OFFICE_NAME, STAFF_FNAME, STAFF_LNAME, STAFF_ADDRESS, STAFF_CONTACT, STAFF_GENDER, STAFF_MARITAL_STATUS, STAFF_NATIONALITY, STAFF_QUALIFICATION, STAFF_ALLOWANCE, STAFF_PPS_NUMBER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)';
        connection.query(staffQuery, [staff_id, COMPANY_NAME,departmentName,office_name, staff_fname, staff_lname, staff_address, staff_contact, staff_gender, staff_marital_status, staff_nationality, staff_qualification, staff_allowance, staff_pps_number], (err, staffResult) => {
            if (err) {
                console.error('Error inserting into staff:', err);
                res.status(500).send('Internal Server Error 1');
                return;
            }

        // Insert into department table
            let departmentQuery = 'INSERT INTO department (DEPARTMENT_NAME,COMPANY_NAME,OFFICE,CONTACT_INFORMATION,DEPARTMENT_STAFF,DEPARTMENT_LEADER) VALUES (?,?,?,?,?,?)';
            connection.query(departmentQuery, [departmentName,COMPANY_NAME,office_name,contact_information,null,staff_id], (err, departmentResult) => {
                if (err) {
                    console.error('Error inserting into department:', err);
                    res.status(500).send('Internal Server Error 2');
                    return;
                }

                // Insert into office table
                let officeQuery = 'INSERT INTO office (OFFICE_NAME, DEPARTMENT_NAME, COMPANY_NAME, OFFICE_LEADER, CONTACT_INFORMATION, ADDRESS, ADMIN_COST, STAFF) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                connection.query(officeQuery, [office_name, departmentName, COMPANY_NAME, staff_id, contact_information, office_address, admin_cost, null], (err, officeResult) => {
                    if (err) {
                        console.error('Error inserting into office:', err);
                        res.status(500).send('Internal Server Error 3');
                        return;
                    }

                    // All operations succeeded
                    res.redirect(`/company/${COMPANY_NAME}`);

                });
        });
    });
});

app.get("/company/see_department/:COMPANY_NAME", (req, res) => {
    const companyName = req.params.COMPANY_NAME;
    let q = `SELECT DEPARTMENT_NAME, OFFICE, CONTACT_INFORMATION, DEPARTMENT_LEADER FROM DEPARTMENT WHERE COMPANY_NAME = ?`;
    connection.query(q, [companyName], (err, departments) => {
        if (err) {
            console.error("Error fetching departments:", err);
            // Handle error response
            return res.status(500).send("Internal Server Error");
        }
        res.render("see_department.ejs", { departments, companyName });
    });
});


app.get("/company/add_office/:companyName/:DEPARTMENT_NAME",(req,res)=>{
    let{companyName ,DEPARTMENT_NAME }=req.params;
    res.render("add_office.ejs",{companyName ,DEPARTMENT_NAME});
});

app.post("/company/add_office/:companyName/:DEPARTMENT_NAME",(req,res)=>{
    let{companyName ,DEPARTMENT_NAME }=req.params;
    let{officeName,contactInfo,address,adminCost,staff_fname,
        staff_lname,staff_address,staff_contact,
        staff_gender,staff_marital_status,staff_nationality,
        staff_qualification,staff_allowance,staff_pps_number}=req.body;
    let staff_id= uuidv4().replace(/-/g, '').substring(0, 20);

        let staffQuery = 'INSERT INTO staff (STAFF_ID, COMPANY_NAME,DEPARTMENT_NAME,OFFICE_NAME, STAFF_FNAME, STAFF_LNAME, STAFF_ADDRESS, STAFF_CONTACT, STAFF_GENDER, STAFF_MARITAL_STATUS, STAFF_NATIONALITY, STAFF_QUALIFICATION, STAFF_ALLOWANCE, STAFF_PPS_NUMBER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)';
        connection.query(staffQuery, [staff_id, companyName,DEPARTMENT_NAME,officeName, staff_fname, staff_lname, staff_address, staff_contact, staff_gender, staff_marital_status, staff_nationality, staff_qualification, staff_allowance, staff_pps_number], (err, staffResult) => {
            if (err) {
                console.error('Error inserting into staff:', err);
                res.status(500).send('Internal Server Error 1');
                return;
            }

            let officeQuery = 'INSERT INTO office (OFFICE_NAME, DEPARTMENT_NAME, COMPANY_NAME, OFFICE_LEADER, CONTACT_INFORMATION, ADDRESS, ADMIN_COST, STAFF) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                connection.query(officeQuery, [officeName, DEPARTMENT_NAME, companyName, staff_id, contactInfo, address, adminCost, null], (err, officeResult) => {
                    if (err) {
                        console.error('Error inserting into office:', err);
                        res.status(500).send('Internal Server Error 3');
                        return;
                    }

                    // All operations succeeded
                    res.redirect(`/company/`);
                });
        })
});

app.get("/company/see_office/:companyName/:DEPARTMENT_NAME", (req, res) => {
    const { companyName, DEPARTMENT_NAME } = req.params;
    let q = `SELECT * FROM office WHERE DEPARTMENT_NAME = ? AND COMPANY_NAME = ?`;
    connection.query(q, [DEPARTMENT_NAME, companyName], (err, offices) => {
        if (err) {
            console.error("Error fetching offices:", err);
            // Handle error response
            return res.status(500).send("Internal Server Error");
        }
        res.render("see_office.ejs", { offices ,companyName,DEPARTMENT_NAME});
    });
});


app.get("/company/add_staff/:companyName/:DEPARTMENT_NAME/:officeName", (req, res) => {
    let { companyName, DEPARTMENT_NAME, officeName } = req.params;
    res.render("add_staff.ejs", { companyName, DEPARTMENT_NAME, officeName });
});
app.post("/company/add_staff/:companyName/:DEPARTMENT_NAME/:officeName", (req, res) => {
    const { companyName, DEPARTMENT_NAME, officeName } = req.params;
    const { firstName, lastName, address, contact, gender, maritalStatus, nationality, qualification, allowance, ppsNumber } = req.body;
    let staff_id= uuidv4().replace(/-/g, '').substring(0, 20);
    const sql = "INSERT INTO staff (STAFF_ID,COMPANY_NAME, DEPARTMENT_NAME, OFFICE_NAME,FIRST_NAME, LAST_NAME, ADDRESS, CONTACT, GENDER, MARITAL_STATUS, NATIONALITY, QUALIFICATION, ALLOWANCE, PPS_NUMBER ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(sql, [staff_id,companyName, DEPARTMENT_NAME, officeName,firstName, lastName, address, contact, gender, maritalStatus, nationality, qualification, allowance, ppsNumber], (err, result) => {
        if (err) {
            console.error("Error inserting into staff table:", err);
            // Handle error response
            return res.status(500).send("Internal Server Error");
        }
        
        res.redirect(`/company/`);
    });
});

app.get("/company/see_staff/:companyName/:DEPARTMENT_NAME/:officeName", (req, res) => {
    const { companyName, DEPARTMENT_NAME, officeName } = req.params;
    
    // Construct your SQL query to retrieve staff information based on the provided parameters
    const sql = "SELECT * FROM staff WHERE COMPANY_NAME = ? AND DEPARTMENT_NAME = ? AND OFFICE_NAME = ?";
    
    // Execute the SQL query
    connection.query(sql, [companyName, DEPARTMENT_NAME, officeName], (err, staff) => {
        if (err) {
            console.error("Error fetching staff:", err);
            // Handle error response
            return res.status(500).send("Internal Server Error");
        }
        
        // Render the see_staff.ejs template with the retrieved staff data
        console.log(staff);
        res.render("see_staff.ejs", { staff });
    });
});

app.get("/company/add_coverage/:companyName/:DEPARTMENT_NAME",(req,res)=>{
    let{companyName ,DEPARTMENT_NAME }=req.params;
    res.render("add_coverage.ejs",{companyName ,DEPARTMENT_NAME});
});

app.post("/company/add_coverage/:companyName/:DEPARTMENT_NAME", (req, res) => {
    let { companyName, DEPARTMENT_NAME } = req.params;
    let { COVERAGE_ID, COVERAGE_AMOUNT, COVERAGE_TYPE, COVERAGE_LEVEL, COVERAGE_DESCRIPTION, COVERAGE_TERMS,PRODUCT_PRICE } = req.body;
    let PRODUCT_ID = uuidv4().replace(/-/g, '').substring(0, 20); // Generate unique PRODUCT_ID

    // SQL query to insert data into COVERAGE table
    let coverageQuery = `INSERT INTO COVERAGE (COVERAGE_ID, COMPANY_NAME, DEPARTMENT_NAME, COVERAGE_AMOUNT, COVERAGE_TYPE, COVERAGE_LEVEL, PRODUCT_ID, COVERAGE_DESCRIPTION, COVERAGE_TERMS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let coverageValues = [COVERAGE_ID, companyName, DEPARTMENT_NAME, COVERAGE_AMOUNT, COVERAGE_TYPE, COVERAGE_LEVEL, PRODUCT_ID, COVERAGE_DESCRIPTION, COVERAGE_TERMS];

    // Execute the SQL query for inserting data into COVERAGE table
    connection.query(coverageQuery, coverageValues, (err, result) => {
        if (err) {
            console.error('Error inserting data into COVERAGE table: ' + err.message);
            res.status(500).send('Error inserting data into COVERAGE table');
            return;
        }
        console.log('Data inserted into COVERAGE table successfully');

        // SQL query to insert data into PRODUCT table
        let productQuery = `INSERT INTO PRODUCT (PRODUCT_NUMBER, COMPANY_NAME, PRODUCT_PRICE, PRODUCT_TYPE) VALUES (?, ?, ?, ?)`;
        let productValues = [PRODUCT_ID, companyName, PRODUCT_PRICE, COVERAGE_TYPE];
        connection.query(productQuery, productValues, (err, result) => {
            if (err) {
                console.error('Error inserting data into PRODUCT table: ' + err.message);
                res.status(500).send('Error inserting data into PRODUCT table');
                return;
            }
            console.log('Data inserted into PRODUCT table successfully');
            res.status(200).send('Data inserted into COVERAGE and PRODUCT tables successfully');
        });
    });
});


app.get("/finance", (req, res) => {
    let q = `
        SELECT *
        FROM INCIDENT_REPORT
        WHERE NOT EXISTS (
            SELECT 1
            FROM claim
            WHERE claim.INCIDENT_ID = INCIDENT_REPORT.INCIDENT_ID
        )`;
    
    connection.query(q, (err, report) => {
        res.render("finance.ejs", { report });
    });
});


app.get("/manger/:CUST_id",(req,res)=>{
    let {CUST_id} = req.params;
    res.render("manger.ejs",{CUST_id});
})

app.post("/manger/:CUST_id",(req,res)=>{
    let{name}=req.body;

    let q = `insert into manger(name,id) valuses (?,?)`;
    connection.query(q,[name,id],(err,man)=>{

    })
})