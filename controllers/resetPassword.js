const Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.postEmail = async (req, res) => {
    try{
        const sender = {
            email: 'pranavpradeep095@gmail.com'
        }
        
        const receiver = [
            {
                email: req.body.email
            }
        ]

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Reset Password',
            textContent: `Reset Password Email`
        })

        res.status(200).json({success: true, message: 'Email has been sent!!'});
    } catch(err){
        console.log(err);
    }
}

