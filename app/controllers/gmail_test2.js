var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tabletopgenieproj@gmail.com',
        pass: 'projpassword1'
    }
});


var mailOptions = {
    from: 'TableTopGenieProj@gmail.com', // sender address
    to: 'RichBu001@gmail.com', // list of receivers
    subject: 'Test of email', // Subject line
    html: '<p>Second emails</p>'// plain text body
};

transporter.sendMail(mailOptions, function (err, info) {
    if (err)
        console.log(err)
    else
        console.log(info);
});

