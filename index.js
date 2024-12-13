document.addEventListener("DOMContentLoaded", () => {
    const login_button = document.getElementById("login_button");
   



    function key_press_down(e) {
        if (e.key === "Enter") {
            login_authentication();
        }
    }

    function login_authentication() {
        const get_username = document.getElementById("username").value.trim();
        const get_password = document.getElementById("password").value.trim();


        const username_reset = document.getElementById("username").value = "";
        const password_reset = document.getElementById("password").value = "";

        // Check if the username and password are empty
        if (get_username === "") {
            window.alert("Your email or number is empty!");
            return;
        }

        if (get_password === "") {
            window.alert("Your password is empty");
            return;
        }

        // Make a POST request to the backend for login
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                get_username: get_username,
                get_password: get_password
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => { throw errorData });
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);

                // Handle different login messages
                if (data.message === 'The email or mobile number you entered isn’t connected to an account.') {
                 
                    console.log('Resetting fields for invalid username');
                    username_reset;
                    password_reset;
                    window.alert(data.message);
                    return;
                }
                if (data.message === 'Invalid password. Please try again.') {
       
                    password_reset;
                    window.alert(data.message);
                    return;
                }
                if (data.message === 'Login successful' && data.get_user_token && data.get_id) {
                    window.alert('Login successful');

                    sessionStorage.setItem('token', data.get_user_token);
                    localStorage.setItem('token', data.get_user_token);

                    sessionStorage.setItem('id', data.get_id);
                    localStorage.setItem('id', data.get_id);

                      
                    
                    username_reset;
                    password_reset;

                    window.location.href = 'user_page.html';
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                if (error.message) {
                    window.alert(error.message);
                } else {
                    window.alert('Unexpected error occurred');
                }
            });
    }


    function create_account_button() {
        const button_create_account = document.getElementById("create_account_button");

        button_create_account.addEventListener("click", () => {
            window.location.href = "creating_account.html";
        });
    }


    function forgot_pass_button() {
        const forgot_password_button = document.getElementById('forgot_password_button');


        


        forgot_password_button.addEventListener('click', () => {
            document.getElementById('my_modal').style.display = 'block';
            

        })

        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById('my_modal').style.display = 'none';
                document.getElementById('my_second_modal').style.display = 'none';
                document.getElementById('my_third_modal').style.display = 'none';
            });
        });



    }

    function forgot_pass_input() {
        const enter_input_pass = document.getElementById('find_button');

        enter_input_pass.addEventListener('click', () => {
            const find_account_input = document.getElementById('find_account_input').value.trim();
            document.getElementById('find_account_input').value = ''; // Clear input

            if (find_account_input === '') {
                window.alert('You have no any input');
                return;
            }

            fetch('http://localhost:3000/forgot_password_input', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ find_account_input })
            })
                .then(response => {
                    if (!response.ok) return response.json().then(errorData => { throw errorData });
                    return response.json();
                })
                .then(data => {
                    if (data.message === 'We find your account!') {
                        document.getElementById('my_modal').style.display = 'none';
                        document.getElementById('my_second_modal').style.display = 'block';
                  
                        fetch_forgot_password(find_account_input);
                    }





                 

                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    window.alert(error.message || 'Unexpected error occurred');
                });
        });
    }

    function fetch_forgot_password(find_account_input) {

        fetch(`http://localhost:3000/get_number_or_gmail?number_gmail=${find_account_input}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => { throw errorData });
                }
                return response.json();
            })
            .then(data => {
                data.forEach(question => {

                    document.getElementById('question_1').innerHTML = question.question_1;
                    document.getElementById('question_2').innerHTML = question.question_2;
                    document.getElementById('question_3').innerHTML = question.question_3;


                })
                authentication(data, find_account_input);
             
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                if (error.message) {    
                    window.alert(error.message);
                } else {
                    window.alert('Unexpected error occurred');
                }
            });
    }
    function authentication(data , find_account_input) {


        const enter_answer_button = document.getElementById('enter_answer_button');

        enter_answer_button.addEventListener('click', () => {

            const get_answer_1 = document.getElementById('get_answer_1').value.trim();
            const get_answer_2 = document.getElementById('get_answer_2').value.trim();
            const get_answer_3 = document.getElementById('get_answer_3').value.trim();



            data.forEach(answer => {
                if (get_answer_1 === '') {
                    window.alert('Question 1 no answer');
                    return;
                }

                if (get_answer_2 === '') {
                    window.alert('Question 2 no answer');
                    return;
                }


                if (get_answer_3 === '') {
                    window.alert('Question 3 no answer');
                    return;
                }


                if (get_answer_1 !== answer.answer_1 || get_answer_2 !== answer.answer_2 || get_answer_3 !== answer.answer_3) {
                    document.getElementById('answers').innerHTML = 'Wrong answer'
                    document.getElementById('get_answer_1').value = '';
                    document.getElementById('get_answer_2').value = '';
                    document.getElementById('get_answer_3').value = '';
                    return;
                } 
                document.getElementById('my_second_modal').style.display = 'none';
                document.getElementById('my_third_modal').style.display = 'block';


                reset_forgot_password(find_account_input)





            })

        })
      



    }


    function reset_forgot_password(find_account_input) {
        const new_password_button = document.getElementById('new_password_button');

        new_password_button.addEventListener('click', () => {
            const regex_password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,25}$/;
            const new_password = document.getElementById('new_password').value.trim();
            const confirmation_password = document.getElementById('confirmation_password').value.trim();


            

            if (!regex_password.test(new_password)) {
                document.getElementById('warning_1').innerHTML = "Password must be 6-25 characters long and include at least one letter and one number!";
                document.getElementById("new_password").value = "";
                document.getElementById("confirmation_password").value = "";
                return;
            }



            if (new_password !== confirmation_password) {
                document.getElementById('warning_1').innerHTML = "Password not match!"
                document.getElementById("new_password").value = "";
                document.getElementById("confirmation_password").value = "";
                return;
            }

            fetch('http://localhost:3000/forgot_password_reset', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_password: new_password, find_account_input: find_account_input })
            })
                .then(response => {
                    if (!response.ok) return response.json().then(errorData => { throw errorData });
                    return response.json();
                })
                .then(data => {
                    document.getElementById('my_third_modal').style.display = 'none';
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    window.alert(error.message || 'Unexpected error occurred');
                });
        });

            
     





    }



    // Attach event listeners
    login_button.addEventListener("click", login_authentication);
    document.addEventListener("keydown", key_press_down);
    create_account_button();
    forgot_pass_button();
    forgot_pass_input();

});

