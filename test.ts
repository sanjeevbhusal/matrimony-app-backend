import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'bhusalsanjeev23@gmail.com',
    pass: 'kmtstojblrfkbhjg',
  },
});

const response = transporter
  .sendMail({
    from: 'Sanjeev Bhusal <bhusalsanjeev23@gmail.com>',
    to: 'sanjeev2111071@iimscollege.edu.np',
    subject: 'Hello world',
    text: 'hello world from node application using nodemailer',
  })
  .then((res) => console.log(res));

console.log(response);
