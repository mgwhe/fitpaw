/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Login with');
    });       
     $('.error').removeClass('alert alert-danger').html(''); 
}

function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}
function openRegisterModal(){
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}

function  loginAjax(){
    /*
    $.post( "/api/login?", data => {
        console.log("here is data response");
        console.log(data);

            if(data == 1){
                window.location.replace("/master");            
            } else {
                 shakeModal(); 
            }
        });
        */
       alert("called");

        $.ajax( 
           {
            type: "POST",
            url:   "/api/login",
            data: {
                email:"a.a@a.com",
                password:"a"
                }
            ,
            async:false, 
            success: function(results){
                
                console.log("back in ajax and seems to have worked");
                console.log(results);
            } //function

   //    data => {
     //   console.log("here is data response");
       // console.log(data);
/*
            if(data == 1){
                window.location.replace("../master");            
            } else {
                 shakeModal(); 
            }
            */
       /*    const url = '/private';
            window.opener.open(url, '_self');
            window.opener.focus();
            window.close();*/
       
        });





   ///////////////

/*   Simulate error message from the server   */
     shakeModal();
}

function shakeModal(){
    $('#loginModal .modal-dialog').addClass('shake');
             $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
             $('input[type="password"]').val('');
             setTimeout( function(){ 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 1000 ); 
}

   