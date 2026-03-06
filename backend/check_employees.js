const db = require('./src/config/db');
db.query('SELECT id, first_name, last_name, designation, birthdate, contact_number, base_salary FROM Employees')
    .then(([rows]) => {
        rows.forEach(r => {
            const age = r.birthdate ? (new Date().getFullYear() - new Date(r.birthdate).getFullYear()) : 'NULL';
            console.log(`ID: ${r.id} | Name: ${r.first_name} ${r.last_name} | Des: ${r.designation} | BD: ${r.birthdate} | Age: ${age}`);
        });
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
