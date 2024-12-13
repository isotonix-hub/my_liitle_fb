document.addEventListener('DOMContentLoaded', () => {

    const container_comment = document.getElementById('container_comment');
    const get_user_id = sessionStorage.getItem('id');



    function get_comments() {
        const comment_enter = document.getElementById('comment_enter');
        comment_enter.addEventListener('click', () => {
            // Get the value from the input field

            const get_value = document.getElementById('comment_value').value.trim();

            // Check if get_value is not empty
            if (get_value === "") {
                window.alert("Please enter a comment.");
                return;
            }

            console.log(get_value);


            fetch('http://localhost:3000/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    get_value: get_value,
                    get_user_id: get_user_id
                })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => { throw errorData });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Comment successfully saved:', data);
                    window.alert('Comment successfully saved!');
                    document.getElementById('comment_value').value = "";
                    fetching_comments();





                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    if (error.message) {
                        window.alert(error.message);
                    } else {
                        window.alert('Unexpected error occurred');
                    }
                });
        });

    }

    //Fetching commets


    function fetching_comments() {

        container_comment.innerHTML = '';
        fetch(`http://localhost:3000/get_comment?user_id=${get_user_id}`, {
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
                console.log(data);

                data.forEach((comment) => {
                    const create_text_area = document.createElement('textarea');
                    create_text_area.readOnly = true;

                    create_text_area.value = comment.user_comments + "\n";
                    container_comment.append(create_text_area);

                    // Get from the database the comment_id
                    const get_comment_id = comment.comment_id;




                    //Create button for delete
                    const create_delete_button = document.createElement('button')
                    create_delete_button.innerHTML = 'Delete'
                    container_comment.append(create_delete_button)



                    const create_edit_button = document.createElement('button');
                    create_edit_button.innerHTML = 'Edit'
                    container_comment.append(create_edit_button);


                    //If the mouse is entering the button
                    const highlight_button = (event) => {
                        event.target.style.color = 'black';
                        event.target.style.backgroundColor = 'lightblue';
                    };

                    create_delete_button.addEventListener('mouseenter', highlight_button);
                    create_edit_button.addEventListener('mouseenter', highlight_button);

                    // If the mouse is leaving the button
                    const white_button = (event) => {
                        event.target.style.color = 'black';
                        event.target.style.backgroundColor = 'white';
                    };


                    create_delete_button.addEventListener('mouseleave', white_button);
                    create_edit_button.addEventListener('mouseleave', white_button);

                    //Functionality for delete_button 
                    function_delete_comment_button(create_delete_button, get_comment_id, create_text_area, create_delete_button, create_edit_button);

                    function_edit_comment_button(create_edit_button, get_comment_id, create_text_area, create_text_area);






                })

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

    //Logout
    function logout() {
        const logout_button = document.getElementById('logout_button');
        logout_button.addEventListener('click', () => {

            localStorage.removeItem('token')
            sessionStorage.removeItem('token')

            localStorage.removeItem('id')
            sessionStorage.removeItem('id')

            localStorage.clear();
            sessionStorage.clear();

            window.location.replace('index.html');

        })
    }

    //Delete Comment
    function function_delete_comment_button(create_delete_button, get_comment_id, create_text_area, create_delete_button, create_edit_button) {
        if (create_delete_button) {
            create_delete_button.addEventListener('click', () => {

                fetch('http://localhost:3000/delete_comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        get_comment_id: get_comment_id,
                        get_user_id: get_user_id
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(errorData => { throw errorData });
                        }
                        return response.json();
                    })
                    .then(data => {
                        window.alert(`Delete${data}`);

                        container_comment.removeChild(create_text_area);
                        container_comment.removeChild(create_delete_button);

                        container_comment.removeChild(create_edit_button);





                    })

                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                        if (error.message) {
                            window.alert(error.message);
                        } else {
                            window.alert('Unexpected error occurred');
                        }
                    });
            });

        }
    }

    //For edit  button
    function function_edit_comment_button(create_edit_button, get_comment_id, create_text_area) {
        if (create_edit_button) {
            create_edit_button.addEventListener('click', () => {
                if (create_edit_button.innerHTML === 'Edit') {
                    create_text_area.readOnly = false;
                    create_edit_button.innerHTML = 'Save';


                } else if (create_edit_button.innerHTML === 'Save') {

                    const new_value_text_area = create_text_area.value;
                    console.log(new_value_text_area);
                    fetch('http://localhost:3000/edit_comment', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            new_value_text_area: new_value_text_area,
                            get_comment_id: get_comment_id,
                            get_user_id: get_user_id
                        })
                    })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(errorData => { throw errorData });
                            }
                            return response.json();
                        })
                        .then(data => {
                            window.alert('Successfully edited')
                            create_edit_button.innerHTML = 'Edit';
                            create_text_area.readOnly = true;
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


            })




        }


    }


    function get_user_profile() {
        const profile_picture_file = document.getElementById('profile_picture_file');
        const enter_profile_picture = document.getElementById('enter_profile_picture');
        const image_preview = document.getElementById('image_preview');

        profile_picture_file.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    image_preview.src = e.target.result;
                    image_preview.style.display = 'block';

                }
                reader.readAsDataURL(file);
            } else {
                image_preview.style.display = 'none';
            }
        })

        enter_profile_picture.addEventListener('click', () => {



            if (profile_picture_file.files.length === 0) {
                window.alert('No image is selected');
                return;
            }


            const form_data = new FormData();
            form_data.append('image', profile_picture_file.files[0]);
            form_data.append('get_user_id', get_user_id);




            console.log(profile_picture_file.files);

            fetch('http://localhost:3000/upload_image', {
                method: 'POST',
                body: form_data

            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => { throw errorData });
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Image uploaded successfully: ' + data.message);
                })
                .catch(error => {
                    console.error('There was a problem with the image upload:', error);
                    alert('Error uploading image: ' + (error.message || 'Unexpected error'));
                });
        });





    }
    function get_profile_picture() {
        const image_preview = document.getElementById('image_preview');
        fetch(`http://localhost:3000/get_profile_picture?user_id=${get_user_id}`, {
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

                if (data.message === 'Successfully retrieved picture') {
                    const base64Image = data.image;
                    image_preview.src = `data:image/png;base64,${base64Image}`;
                    image_preview.style.display = 'block';

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


    function delete_profile_picture() {
        const delete_button_profile_picture = document.getElementById('delete_profile_picture');

        delete_button_profile_picture.addEventListener('click', () => {

            fetch('http://localhost:3000/delete_profile_picture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    get_user_id: get_user_id
                })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => { throw errorData });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.message === 'Successfully deleted') {
                        document.getElementById('image_preview').style.display = 'none';
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
        });



    }

    function fetch_name() {
        fetch(`http://localhost:3000/get_name?user_id=${get_user_id}`, {
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
                console.log(data)
                document.getElementById('name').innerHTML = data.name + " " + data.last_name;








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

    function personal_information_button() {

        const personal_information_button = document.getElementById('personal_information_button');
        const close = document.querySelector('.close')

        personal_information_button.addEventListener('click', () => {


            //Pop the modal
            const my_modal = document.getElementById('my_modal_personal_information').style.display = 'block';


            fetch(`http://localhost:3000/personal_datails?user_id=${get_user_id}`, {
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

                    console.log(data);

                    data.forEach(details => {

                        document.getElementById('label_1').innerHTML = details.name;
                        document.getElementById('label_2').innerHTML = details.last_name;
                        document.getElementById('label_3').innerHTML = details.birth_day;
                        document.getElementById('label_4').innerHTML = details.gender;
                        document.getElementById('label_5').innerHTML = details.number_email;







                    })








                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    if (error.message) {
                        window.alert(error.message);
                    } else {
                        window.alert('Unexpected error occurred');
                    }
                });



        })

        close.addEventListener('click', () => {
            document.getElementById('my_modal_personal_information').style.display = 'none';

        })


    }

    //Check first if the password is correct from database 
    function Check_password_personal_details() {
        const change_personal_details_button = document.getElementById("change_personal_details_button");

        change_personal_details_button.addEventListener("click", () => {
            const current_password = document.getElementById("current_password").value.trim();

            fetch('http://localhost:3000/Check_password_personal_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    get_user_id: get_user_id,
                    current_password: current_password
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Correct password!") {


                        change_personal_details_now();
                    } else if (data.message === "Incorrect password!") {
                        alert("Wrong password");
                        resetting_input()
                        return;
                    }
                })
                .catch(error => {



                    console.error('There was a problem with the fetch operation:', error);
                    window.alert('Unexpected error occurred');
                });
        });
    }


    function change_personal_details_now() {
        const change_name = document.getElementById("change_name").value.trim();
        const change_last_name = document.getElementById("change_last_name").value.trim();
        const change_birth_day = document.getElementById("change_birth_day").value;
        const change_male = document.getElementById("change_male").checked;
        const change_female = document.getElementById("change_female").checked;
        const change_email_or_phone_number = document.getElementById("change_email_or_phone_number").value.trim();
        const change_new_password = document.getElementById("change_new_password").value.trim();
        const change_confirm_password = document.getElementById("change_confirm_password").value.trim();



        // Regex pattern for name validation (first letter uppercase, followed by lowercase)
        const regex_pattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*(?:-[A-Z][a-z]+)*$/;



        //For name validation!!

        if (change_name === "") {
            window.alert("Your name is empty!");
            return;
        }
        if (!regex_pattern.test(change_name)) {
            window.alert("Wrong");
            document.getElementById("change_name").value = "";
            return;
        }

        // For last name validation
        if (change_last_name === "") {
            window.alert("Your last name is empty!");
            return;
        }
        if (!regex_pattern.test(change_last_name)) {
            window.alert("Last name must start with an uppercase letter and contain only letters.");
            document.getElementById("change_last_name").value = "";
            return;
        }


        //For date


        if (change_birth_day === "") {
            alert("Wrong date");
            return;
        }
        const get_date = new Date(change_birth_day);
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
            document.getElementById("change_birth_day").value = updated_date_string;
            return;
        }



        if (!change_male && !change_female) {

            alert("You didnt select a gender");
            return;
        }

        const regex_number = /^\d{11}$/;
        const regex_email = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


        if (!regex_number.test(change_email_or_phone_number) && !regex_email.test(change_email_or_phone_number)) {
            alert("Wrong");
            document.getElementById("change_email_or_phone_number").value = "";
            return;



        }


        const regex_password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,25}$/;


        if (!regex_password.test(change_new_password)) {
            alert("Wrong");
            document.getElementById("change_new_password").value = "";
            return;
        }



        if (change_new_password !== change_confirm_password) {

            alert("Wrong");
            document.getElementById("change_confirm_password").value = "";
            return;
        }



        fetch('http://localhost:3000/change_personal_details_now', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                get_user_id: get_user_id,
                change_name: change_name,
                change_last_name: change_last_name,
                change_birth_day: change_birth_day,
                change_gender: change_male ? 'Male' : 'Female',
                change_email_or_phone_number: change_email_or_phone_number,
                change_new_password: change_new_password,





            })
        })
            .then(response => response.json())
            .then(data => {

                if (data.message === "Update succesfully") {
                    window.alert("Update sucessfully");
                    resetting_input();
                    personal_information_button();
                    fetch_name();
                    document.getElementById("my_modal_personal_information").style.display = "none"

                }




            })
            .catch(error => {



                console.error('There was a problem with the fetch operation:', error);
                window.alert('Unexpected error occurred');
            });


    }

    function going_to_delete_account() {


        const delete_account = document.getElementById("delete_account");
        const my_modal_delete_account = document.getElementById("my_modal_delete_account");
        const close_delete = document.getElementById("close_delete");
        let confirmation_label = document.getElementById("confirmation_label");



        if (delete_account) {
            delete_account.addEventListener("click", () => {
                my_modal_delete_account.style.display = "block";

            })
        }

        if (close_delete) {
            close_delete.addEventListener("click", () => {

                my_modal_delete_account.style.display = "none";
                confirmation_label.textContent = "";

            })

        }



    }

    function deleting_account() {
        const deleting_account_button = document.getElementById("deleting_account_button");

        let confirmation_label = document.getElementById("confirmation_label");

        deleting_account_button.addEventListener("click", () => {
            const enter_password = document.getElementById("enter_password").value.trim();

            if (enter_password === "") {
                confirmation_label.textContent = "You didn't enter your password.";
                confirmation_label.style.color = "lightblue";
                document.getElementById("enter_password").value = "";
                return;


            }



            fetch('http://localhost:3000/deleting_account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    get_user_id: get_user_id,
                    enter_password: enter_password








                })
            })
                .then(response => response.json())
                .then(data => {

                    if (data.message === "Account deleted successfully!") {

                        window.alert("Account deleted successfully")
                        window.location.replace("index.html");


                    }



                    if (data.message === "Incorrect password!") {
                        document.getElementById("enter_password").value = "";
                        confirmation_label.textContent = "Incorrect password!"
                        confirmation_label.style.color = "lightblue";


                    }




                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    window.alert('Unexpected error occurred');
                });







        })


    }


    function search_friend() {
        const search_friend_button = document.getElementById("search_friend_button");


        search_friend_button.addEventListener("click", () => {
            const search_friend = document.getElementById("search_friend").value.trim();

           

            fetch('http://localhost:3000/search_friend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
               
                    search_friend: search_friend







                })
            })
                .then(response => response.json())
                .then(data => {


                    if (data.message === "There's a user!"  && data.get_id) {
                            

                        sessionStorage.setItem('viewing_only', data.get_id);

                        const viewingOnlyId = sessionStorage.getItem('viewing_only');
                        if (viewingOnlyId) {
                          

                        } else {
                            console.log("No user is being viewed.");
                        }

      
                        

                    }
                    if (data.message === "No user!") {
                        document.getElementById("search_friend").value = "";
                        window.alert("No user!")
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    window.alert('Unexpected error occurred');
                });










            
        })

         

    }





    // For reset the value of information
    function resetting_input(){
         document.getElementById("change_name").value = "";
         document.getElementById("change_last_name").value = "";
         document.getElementById("change_birth_day").value = "";
         document.getElementById("change_male").checked = false;
         document.getElementById("change_female").checked = false;
         document.getElementById("change_email_or_phone_number").value = "";
         document.getElementById("current_password").value = "";
         document.getElementById("change_new_password").value = "";
         document.getElementById("change_confirm_password").value = "";   


    }





    resetting_input(); //Reset all
    fetch_name(); // For name !
    delete_profile_picture(); // Delete profile!
    get_profile_picture() // Get profile picture and save to the database!
    get_user_profile(); // Get the profile to return to the user! 
    logout(); // Logout account!
    get_comments(); // Insert the user comments to the database !4
    fetching_comments(); // Get the comments of the user!
    personal_information_button(); // Goto personal details!
    Check_password_personal_details(); // Check password before user change his/her details for security!
    going_to_delete_account(); //Going to modal of deleting account!
    deleting_account(); //Deleting account!
    search_friend()  //For searching friend!
    go_back_profile(); // For go back to profile



   

});
