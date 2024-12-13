require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path')


const app = express();
app.use(cors());
app.use(express.json());


const connectMySql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '!@MCGi0702',
    database: 'sqlconnection'
});


const queryDatabase = async (query, params) => {
    try {
        const [results] = await connectMySql.promise().execute(query, params);
        return results;
    } catch (err) {
        throw err;
    }
};

//For creating account
app.post('/creating_account', async (req, res) => {
    const { name, last_name, birth_day, gender, number_email, password, get_question_1 , get_question_2 , get_question_3 , get_answer_1 , get_answer_2 , get_answer_3  } = req.body;

 
    try {
      
        const emailResults = await queryDatabase('SELECT * FROM user_create_account WHERE number_email = ?', [number_email]);

        if (emailResults.length > 0) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

      
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

      
        await queryDatabase(
            'INSERT INTO user_create_account (name, last_name, birth_day, gender, number_email, password,question_1 , question_2 , question_3 , answer_1 , answer_2 , answer_3) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)',
            [name, last_name, birth_day, gender, number_email, hashedPassword, get_question_1, get_question_2, get_question_3, get_answer_1, get_answer_2, get_answer_3]
        );

        console.log('Account created successfully');
        return res.status(200).json({ message: 'Account created successfully' });

    } catch (err) {
        console.error('Error during account creation:', err);
        return res.status(500).send('Internal Server Error');
    }
}); 



//For login

app.post('/login', async (req, res) => {
    const { get_username, get_password } = req.body;

    try {
        const emailResults = await queryDatabase('SELECT * FROM user_create_account WHERE number_email = ?', [get_username]);

        if (emailResults.length === 0) {
            return res.status(400).json({ message: 'The email or mobile number you entered isn’t connected to an account.' });
        }

        const get_user_id = emailResults[0].user_id;
        const stores_hashed_password = emailResults[0].password;

        console.log("The id:" , get_user_id);
        

        

        const secretKey = process.env.JWT_SECRET_KEY;

        

        const payload = { user_id: get_user_id };  

   
        
        const isPasswordValid = await bcrypt.compare(get_password, stores_hashed_password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password. Please try again.' });
        }

        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    

        return res.status(200).json({ message: 'Login successful', get_user_token: token, get_id: get_user_id });

    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/comment', async (req, res) => {
    const { get_value , get_user_id } = req.body;

    try {
        
                if (!get_value) {
            return res.status(400).json({ message: 'Comment value is missing' });
        }

        // Insert the comment into the database
        await queryDatabase('INSERT INTO user_comments (user_id ,user_comments) VALUES (?,?)', [get_user_id , get_value]);

        console.log('Comment successful');
        return res.status(200).json({ message: 'Comment successful' });

    } catch (err) {
        console.error('Error during comment creation:', err);
        // Respond with an error in JSON format
        return res.status(500).json({ message: 'Internal Server Error' });
        }
    });


    //Get the comment to self       

    app.get('/get_comment', async (req, res) => { 
        const user_id = req.query.user_id;


        try {

            const results = await queryDatabase('SELECT user_comments ,comment_id FROM user_comments  WHERE  user_id = ?', [user_id])
            res.json(results);

        } catch (error) {
            console.error('Error fetching comments ', error);
            res.status(500).json({message:'Internal Server Error'})
        }
        

    })     


// Delete the comment to self

app.post('/delete_comment', async (req, res) => {
    const { get_comment_id, get_user_id } = req.body;

    try {
       
        const result = await queryDatabase('DELETE user_comments FROM user_comments WHERE user_id = ? AND comment_id = ?', [get_user_id, get_comment_id]);

        
        if (result.affectedRows > 0) {
        
            res.json({ message: 'Comment successfully    deleted' });
        } else {
           
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.log('Error deleting comment', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/edit_comment', async (req, res) => {
    const { new_value_text_area, get_comment_id, get_user_id } = req.body;

    console.log(new_value_text_area);
    console.log(get_comment_id);
    console.log(get_user_id);


   

    try {
      
        const result = await queryDatabase(
            'UPDATE user_comments SET user_comments = ? WHERE user_id = ?  AND comment_id = ? ', [new_value_text_area, get_user_id, get_comment_id]);

      
        console.log('Query result:', result);

        res.status(200).send({ message: 'Successfully updated!' });
    } catch (error) {
      
        console.log('Error updating comment:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');



    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})


const upload = multer({ storage: storage });

//Upload profile picture
app.post('/upload_image', upload.single('image'), async (req, res) => {

    const image_buffer = req.file.buffer;
    const get_user_id = req.body.get_user_id;



    try {
        
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        
     
        

              const result = await queryDatabase(
            'INSERT INTO user_profile_picture (user_id, user_profile_picture) VALUES (?, ?)',
                  [get_user_id, image_buffer] 
        );

        
        res.json({ message: 'Image uploaded and saved successfully' });

    } catch (error) {
        console.log('Error updating comment:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

//Get profile picture
app.get('/get_profile_picture', async (req, res) => {
    const user_id = req.query.user_id;


    try {
   
        const result = await queryDatabase(
            'SELECT user_profile_picture FROM user_profile_picture WHERE user_id = ?', [user_id]
        );


        if (result && result.length > 0) {
            const imageBuffer = result[0].user_profile_picture;
            const base64Image = imageBuffer.toString('base64');  
            res.json({ message: 'Successfully retrieved picture', image: base64Image });
        } else {
            res.json({ message: 'No profile picture found', image: null }); 
        }

    } catch (error) {
        console.log('Error retrieving profile picture:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
//P
app.post('/delete_profile_picture', async (req, res) => {
    const { get_user_id } = req.body;


    try {

        const result = await queryDatabase(
            'DELETE user_profile_picture FROM user_profile_picture WHERE user_id = ?', [get_user_id]
        );

        if (result.affectedRows > 0) {
            res.status(200).send({ message: 'Successfully deleted' });
        }
       

    } catch (error) {
        console.log('Error retrieving profile picture:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }



})



app.get('/get_name', async (req, res) => {
    const user_id = req.query.user_id;


    try {
        const result = await queryDatabase(
            'SELECT name, last_name FROM user_create_account WHERE user_id = ?',
            [user_id]
        );

        if (result.length > 0) {
            res.json(result[0]); // Assuming you only want to return the first match
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log('Error retrieving Name and Last Name:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

        
//Check if the user have an account to forgot the password
    app.post('/forgot_password_input', async (req,res) => {
        const { find_account_input } = req.body;

 


        try {
            const result = await queryDatabase(
                'SELECT number_email FROM user_create_account WHERE number_email =  ?',
                [find_account_input]
            );

            if (result.length > 0) {
                res.status(200).json({ message: 'We find your account!' }); // Use 200 for success
            } else {
                res.status(404).json({ message: 'User not found!' });
            }

        } catch (error) {
            console.log('Error retrieving Name and Last Name:', error.message);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }


    })

    //If users have an account fetch the question and answer to forgot the password
app.get('/get_number_or_gmail', async (req, res) => {
    const number_email = req.query.number_gmail;
    console.log(number_email);

    try {
        const result = await queryDatabase(
            'SELECT question_1,question_2,question_3 , answer_1 , answer_2 , answer_3 FROM user_create_account WHERE number_email = ?',
            [number_email]
        );

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Security questions not found!' });
        }
    } catch (error) {
        console.error('Error fetching security questions:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

//Forgot password reset

app.put('/forgot_password_reset', async (req,res) => {
    const { new_password, find_account_input } = req.body;



    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(new_password, salt);
   

    try {

        const result = await queryDatabase(
            'UPDATE user_create_account SET password = ? WHERE number_email = ?  ', [hashedPassword, find_account_input]);


   

        res.status(200).send({ message: 'Successfully reset password!' });
    } catch (error) {

        console.log('Error resseting password:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }



})

app.get('/personal_datails', async (req, res) => {
    const get_user_id = req.query.user_id;
    console.log(get_user_id);





    try {

        const result = await queryDatabase(
            'SELECT name , last_name , birth_day , gender , number_email   FROM user_create_account WHERE user_id = ?  ', [get_user_id]);


        if (result.length > 0) {
            res.json(result);
            return;
        }



        res.status(200).send({ message: 'Successfully get personal detaiils' });
    } catch (error) {

        console.log('Error  get personal detaiils:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
        


})

//Check_password_personal_details check if the password is correct before the user change his information
app.post('/Check_password_personal_details', async (req, res) => {
    const { get_user_id, current_password } = req.body;


    console.log(get_user_id, current_password);
        

   

    try {       
        const result = await queryDatabase(
            'SELECT password FROM user_create_account WHERE user_id = ? ',
            [ get_user_id]
        );



        const stored_hashed_password = result[0].password;
        console.log(stored_hashed_password);

        const compare_password = await bcrypt.compare(current_password, stored_hashed_password);
        console.log(compare_password);

        if (compare_password) {
            return res.status(200).json({ message: "Correct password!" })

        } else {
            return res.status(400).json({message:"Incorrect password!"})
        }


        

    } catch (error) {
        console.log('Error', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }


})


app.put('/change_personal_details_now', async (req, res) => {
    const { change_name, change_last_name, change_birth_day, change_gender , change_email_or_phone_number, change_new_password, get_user_id  } = req.body;

    //Salt first before inserted to the database for security purposes
    const salt = await bcrypt.genSalt(12);
    const change_new_password_hashed_password = await bcrypt.hash(change_new_password, salt);

    console.log(change_new_password_hashed_password);




    try {
        const result = await queryDatabase(
            'UPDATE user_create_account SET name = ? ,last_name  = ? , birth_day = ? ,  gender = ? , number_email = ?  , password = ?  WHERE user_id = ?   ',
            [change_name, change_last_name, change_birth_day, change_gender, change_email_or_phone_number, change_new_password_hashed_password, get_user_id] 


        );

        return res.status(200).json({ message: "Update succesfully" })

       



    } catch (error) {
        console.log('Error', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }


})


//For deleting
app.post('/deleting_account', async (req, res) => {
    const { get_user_id, enter_password } = req.body;

    try {
  
        const result = await queryDatabase(
            'SELECT password FROM user_create_account WHERE user_id = ?',
            [get_user_id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        const stored_hashed_password = result[0].password;

   
        const compare_password = await bcrypt.compare(enter_password, stored_hashed_password);

        if (compare_password) {
           
            await queryDatabase(
                'DELETE FROM user_profile_picture WHERE user_id = ?',
                [get_user_id]
            );

            await queryDatabase(
                'DELETE FROM user_comments WHERE user_id = ?',
                [get_user_id]
            );

       
            await queryDatabase(
                'DELETE FROM user_create_account WHERE user_id = ?',
                [get_user_id]
            );

            return res.status(200).json({ message: "Account deleted successfully!" });
        } else {
            return res.status(400).json({ message: "Incorrect password!" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



app.post('/search_friend', async (req, res) => {
    const { search_friend } = req.body;
                                                                                                                                                                                            




    try {

        const [name, last_name] = search_friend.trim().split(' ', 2);
        const result = await queryDatabase( 
            'SELECT user_id FROM user_create_account WHERE LOWER(name) = ?  AND LOWER(last_name) = ? ',
            [name, last_name]


        );

        if (result.length >  0) {

            const get_id = result[0].user_id;

            return res.status(200).json({ message: "There's a user!", get_id : get_id })

        } else {
            return res.status(404).json({message: "No user!"})
        }



    } catch (error) {
        console.log('Error', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }


})


 app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
        