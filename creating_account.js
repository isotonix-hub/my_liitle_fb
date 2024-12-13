document.addEventListener("DOMContentLoaded", () => {

    let submit_button = document.getElementById("submit_button");
    let question_1 = document.getElementById('question_1');
    let question_2 = document.getElementById('question_2');
    let question_3 = document.getElementById('question_3');
    
    function key_press_down(e) {
        if (e.key === "Enter") {
            submit_data_authentication();
        }
    }


    function random_question() {
        const random_button = document.getElementById('random_question');

        random_button.addEventListener('click', () => {

            const random_questions = [
                'What is your favorite food ?',
                'What was the name of your first pet ?',
                'What is your favorite color ?',
                'What is the name of your elementary school ?',
                'What was the make and model of your first car ?',
                'What city were you born in?',
                'What is your mother’s maiden name ?',
                'What is the name of your best friend from childhood ?',
                'What was the name of your first teacher ?',
                'What is your favorite movie ?',
                'What is your favorite book ?',
                'What was the name of your first employer ?',
                'Where did you go on your first vacation ?',
                'What is your favorite hobby ?',
                'What was the name of your first love ?',
                'What is the name of your favorite sports team ?',
                'What is your favorite musical instrument ?',
                'What is your favorite restaurant ?',
                'Who was your childhood hero ?',
                'What was your first phone number ?'
            ]

             
            const selected_three_questions = [];
            selected_questions = new Set();

            while (selected_questions.size < 3) {
                let random_index = Math.floor(Math.random() * random_questions.length);
                selected_questions.add(random_questions[random_index]);
            }

            selected_questions.forEach(question =>

                selected_three_questions.push(question)
            
            );
           


            question_1.innerHTML = selected_three_questions[0];
            question_2.innerHTML = selected_three_questions[1];
            question_3.innerHTML = selected_three_questions[2];
             




        });



    }

       
    
    

    function submit_data_authentication() {
   
        //Get information of the users!
        const name = document.getElementById("name").value.trim();
        const last_name = document.getElementById("last_name").value.trim();
        const birth_day = document.getElementById("birth_day").value;
        const male = document.getElementById("male").checked;
        const female = document.getElementById("female").checked;
        const number_email = document.getElementById("number_email").value.trim();
        const create_password = document.getElementById("create_password").value.trim();
        const confirm_password = document.getElementById("confirm_password").value.trim();

        //Get question then save in the database!
        const get_question_1 = question_1.innerHTML;
        const get_question_2 = question_2.innerHTML;
        const get_question_3 = question_3.innerHTML;

        //Get the answer base on the question
        const get_answer_1 = document.getElementById('question_answer_1').value.trim();
        const get_answer_2 = document.getElementById('question_answer_2').value.trim();
        const get_answer_3 = document.getElementById('question_answer_3').value.trim();



      


           

       

       
        // Regex pattern for name validation (first letter uppercase, followed by lowercase)
        const regex_pattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*(?:-[A-Z][a-z]+)*$/;


        
        //For name validation!!

        if (name === "") {
            window.alert("Your name is empty!");    
            return;
        }
        if (!regex_pattern.test(name)) {
            window.alert("Wrong");
            document.getElementById("name").value = "";
            return;
        }

        // For last name validation
        if (last_name === "") {
            window.alert("Your last name is empty!");
            return;
        }
        if (!regex_pattern.test(last_name)) {
            window.alert("Last name must start with an uppercase letter and contain only letters.");
            document.getElementById("last_name").value = "";
            return;
        }


        //For date


        if (birth_day === "") {
            alert("Wrong date");
            return;
        }
        const get_date = new Date(birth_day);
        const get_date_year = get_date.getFullYear();
        const get_date_month = get_date.getMonth();
        const get_date_day = get_date.getDate();


        const now_year = new Date();
        const get_now_year = now_year.getFullYear();


        const result_year = get_now_year - get_date_year;


        if (result_year < 18) {
            alert("You're a minor");


            const updated_date = new Date(get_now_year, get_date_month, get_date_day);
            const updated_date_string = updated_date.toISOString().split('T')[0];
            document.getElementById("birth_day").value = updated_date_string;
            return;
        }



        if (!male && !female) {

            alert("You didnt select a gender");
            return;
        }

        const regex_number = /^\d{11}$/;
        const regex_email = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

            
        if (!regex_number.test(number_email) && !regex_email.test(number_email)) {
            alert("Wrong");
            document.getElementById("number_email").value = "";
            return;



        }


        const regex_password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,25}$/;


        if (!regex_password.test(create_password)) {
            alert("Wrong");
            document.getElementById("create_password").value = "";
            return;
        }



        if (create_password !== confirm_password) {

            alert("Wrong");
            document.getElementById("confirm_password").value = "";
            return;
        }




        // first question!
        if (get_answer_1 === '') {
            window.alert('First question have no answer');
            return;
        } 

        // If first question is not uppercase
        if (get_answer_1[0] !== get_answer_1[0].toUpperCase()) {
            window.alert('First letter needs to be uppercase');
            document.getElementById('question_answer_1').value = '';
            return;
        }
        //Second question
        if (get_answer_2 === '') {
            window.alert('Second queston have no answer');
            return;
        }    

        if (get_answer_2[0] !== get_answer_2[0].toUpperCase()) {
            window.alert('First letter needs to be uppercase');
            document.getElementById('question_answer_2').value = '';
            return;
        }

        //Third question
        if (get_answer_3 === '') {
            window.alert('Third question have no answer');
            return;
            
        }
        if (get_answer_3[0] !== get_answer_3[0].toUpperCase()) {
            window.alert('First letter needs to be uppercase');
            document.getElementById('question_answer_3').value = '';
            return;
        }
        




        fetch('http://localhost:3000/creating_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                last_name: last_name,
                birth_day: birth_day,
                gender: male ? 'Male' : 'Female',
                number_email: number_email,
                password: create_password,
                get_question_1: get_question_1,
                get_question_2: get_question_2,
                get_question_3: get_question_3,
                get_answer_1: get_answer_1,
                get_answer_2: get_answer_2,
                get_answer_3: get_answer_3


                
                
                
            })
        })  
            .then(response => response.json())
               
            
            .then(data => {

                if (data.message === 'Email is already in use') {
                    alert("Already use this email");
                    document.getElementById("number_email").value = "";
                }
                if (data.message === 'Account created successfully') {

                    document.getElementById("name").value = "";
                    document.getElementById("last_name").value = "";
                    document.getElementById("birth_day").value = "";
                    document.getElementById("male").checked = false;
                    document.getElementById("female").checked = false;
                    document.getElementById("number_email").value = "";
                    document.getElementById("create_password").value = "";
                    document.getElementById("confirm_password").value = "";
                    window.alert('Account created successfully');
                    window.location.href = "index.html";

                    
                   

                  
                    

                   
                  
                   

                   

                }
               
              
            })
            .catch(error => {
               
                console.error('There was a problem with the fetch operation:', error);
               
            });
    



    }

    document.addEventListener("keydown", key_press_down);
    submit_button.addEventListener("click", submit_data_authentication);
    random_question();



});


