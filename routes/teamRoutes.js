// teamRoute.js
const express = require('express');
const router = express.Router();

// Sample data for the team members
const teamMembers = {
    president: { name: 'John Doe', role: 'President', image: '/images/president.jpg', bio: 'Experienced leader with 20 years in the shipbuilding industry.' },
    headOfficers: [
        { name: 'Alice Smith', role: 'Head Officer', image: '/images/head1.jpg', bio: 'Specialist in ship design and engineering.' },
        { name: 'Bob Johnson', role: 'Head Officer', image: '/images/head2.jpg', bio: 'Expert in naval architecture and propulsion systems.' },
        { name: 'Charlie Brown', role: 'Head Officer', image: '/images/head3.jpg', bio: 'Logistics and supply chain management.' }
    ],
    managers: [
        { name: 'Emily Davis', role: 'Manager', image: '/images/manager1.jpg', bio: 'Quality control and assurance.' },
        { name: 'Frank Wilson', role: 'Manager', image: '/images/manager2.jpg', bio: 'Shipyard safety and compliance.' },
        { name: 'Grace Lee', role: 'Manager', image: '/images/manager3.jpg', bio: 'Production and scheduling.' }
    ],
    supervisors: [
        { name: 'Henry Scott', role: 'Supervisor', image: '/images/supervisor1.jpg', bio: 'Hull assembly specialist.' },
        { name: 'Ivy Turner', role: 'Supervisor', image: '/images/supervisor2.jpg', bio: 'Paint and coating expert.' },
        { name: 'Jack Murphy', role: 'Supervisor', image: '/images/supervisor3.jpg', bio: 'Electrical systems supervisor.' },
        { name: 'Karen White', role: 'Supervisor', image: '/images/supervisor4.jpg', bio: 'Mechanical systems lead.' },
        { name: 'Leo Adams', role: 'Supervisor', image: '/images/supervisor5.jpg', bio: 'Fabrication process supervisor.' },
        { name: 'Mia Carter', role: 'Supervisor', image: '/images/supervisor6.jpg', bio: 'Ship interior specialist.' }
    ],
    leadEngineers: [
        { name: 'Nathan Parker', role: 'Lead Engineer', image: '/images/engineer1.jpg', bio: 'Marine propulsion expert.' },
        { name: 'Olivia Hall', role: 'Lead Engineer', image: '/images/engineer2.jpg', bio: 'Structural integrity specialist.' },
        { name: 'Paul Baker', role: 'Lead Engineer', image: '/images/engineer3.jpg', bio: 'Automation and control systems.' },
        { name: 'Quinn Rogers', role: 'Lead Engineer', image: '/images/engineer4.jpg', bio: 'Electrical and communication systems.' },
        { name: 'Rachel Fisher', role: 'Lead Engineer', image: '/images/engineer5.jpg', bio: 'Hydrodynamics and resistance optimization.' },
        { name: 'Samuel Evans', role: 'Lead Engineer', image: '/images/engineer6.jpg', bio: 'Structural design and materials specialist.' },
        { name: 'Tina Gomez', role: 'Lead Engineer', image: '/images/engineer7.jpg', bio: 'Piping and HVAC design.' },
        { name: 'Umar Khan', role: 'Lead Engineer', image: '/images/engineer8.jpg', bio: 'Energy efficiency and sustainability.' }
    ]
};

router.get('/teams', (req, res) => {
    res.render('teams', { team: teamMembers });
});

module.exports = router;