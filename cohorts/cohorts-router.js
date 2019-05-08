const knex = require('knex');
const router = require('express').Router();

// configure knex.
const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: './data/lambda.sqlite3'
    },
    useNullAsDefault: true,
};
// use knex.
const db = knex(knexConfig);

// Endpoints. CRUD.
// Get. **Postman Tested: Working**
router.get('/', (req, res) => {
    db('cohorts')
    .then(cohorts => {
        res.status(200).json(cohorts)
    })
    .catch(err => {
        res.status(500).json({ message: "Error retrieving the cohorts data."})
    })
});

// Get by ID. **Postman Tested: Working**
router.get('/:id', (req, res) => {
    db('cohorts')
    .where({ id: req.params.id })
    .first()
    .then(cohort => {
        if(cohort) {
            res.status(200).json(cohort)
        } else {
            res.status(404).json({ message: "The specified cohort does not exist."})
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Error retrieving the specified cohort data."})
    })
});

// Get all students for the specified cohort ID. **Postman Tested: Working**
router.get('/:id/students', (req, res) => {
    db('cohorts')
    .where({ 'cohorts.id': req.params.id })
    .join('students', { 'cohorts.id': 'students.cohort_id'})
    .then(students => {
        res.status(200).json(students)
    })
    .catch(err => {
        res.status(500).json({ message: "Error retrieving the specified cohort's students."})
    })
});

// Post.
router.post('/', (req, res) => {
    if(!req.body.name) {
        res.status(400).json({ message: "Please Provide a name for the new cohort."})
    } else {
        db('cohorts')
        .insert(req.body, 'id')
        .then(ids => {
            db('cohorts')
                .where({ id: ids[0] })
                .first()
                .then(cohort => {
                    res.status(201).json(cohort)
                })
                .catch(err => {
                    res.status(500).json({ message: "Error adding the new cohort."})
                })
        })
        .catch(err => {
            res.status(500).json({ message: "Error adding the new cohort."})
        })
    }
});

// Update. **Postman Tested: **
router.put('/:id', (req, res) => {
    db('cohorts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(updates => {
        if(updates > 0) {
            res.status(200).json({ message: `${updates} cohort successfully updated.`})
        } else {
            res.status(404).json({ message: "The specified cohort does not exist."})
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Error updating this cohort."})
    })
});

// Delete. **Postman Tested: Working**
router.delete('/:id', (req, res) => {
    db('cohorts')
    .where({ id: req.params.id })
    .delete()
    .then(count => {
        if(count > 0) {
            res.status(200).json({ message: `${count} cohort successfully deleted.`})
        } else {
            res.status(404).json({ message: "The specified cohort does not exist."})
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Error deleting this cohort."})
    })
})


module.exports = router;