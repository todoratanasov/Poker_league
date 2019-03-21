const nodemailer = require("nodemailer");
module.exports={
  //sending a mail to all users
    sendMail: async (objParams,currentUser)=>{        
        let transporter = nodemailer.createTransport({
            host: "leo.superhosting.bg",
            port: 26,
            secure: false, 
            auth: {
              user: "noreply@casinolounge.eu", 
              pass: "Q}FbX3c3}bc;" 
            },
            tls:{
                rejectUnauthorized:false
            }
          });  
          let text = `<p>Hello player,
          <br><br>
          The next game will take place at ${objParams.place} on ${objParams.eventdate} with our generous host ${currentUser}. If you think you can compete with the other dudes you can log on to <strong>http://casinolounge.eu</strong> and click "Participate" in the "Upcomming events" section otherwise you are a scaredy cat!
          <br><br>
          BR<br>
          Casinolounge event team</p>`      
          let mailOptions = {
            from: '"Casinolounge" <noreply@casinolounge.eu>',
            to: "tosso1@abv.bg, rusiqt_84@abv.bg, casidoo@yahoo.co.uk, i.mantchev@gmail.com, rosen.dobrev@virgin.bg, iv.maslarov@gmail.com, stivi2610@abv.bg, javor.davidkov@gmail.com", 
            subject: `The registration for the next stage on ${objParams.eventdate} is available.`, 
            text: ``,
            html: text,
          };
          let info = await transporter.sendMail(mailOptions);
    }
}