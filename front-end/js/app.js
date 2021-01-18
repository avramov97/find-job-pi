let k = window.location.href;

let hiddenFlag = true;

let constants = {
    serviceUrl: "http://127.0.0.1:8000"
};

function login()
{
    let username = $('#username').val();
    let password = $('#password').val();

    $.ajax({
        type: 'POST',
        url: constants.serviceUrl + '/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "username": username,
            "password": password
        })
    }).done((data, status, request) => {
        let authToken = data.split('Bearer ')[1];
        app.authorizationService.saveCredentials(authToken);
        loadNavbar();
    }).fail((err) =>
    {
        if(err.status == 401 || err.status == 403)
        {
            document.getElementById("error_login").hidden = false;
        }
    });
}

function countOrders(input)
{
    $.ajax({
        type: 'GET',
        url: constants.serviceUrl + '/applications/count-' + input,
        headers:
            {
                'Content-Type': 'application/json',
            }
    }).done((data) =>
    {
        return data;
    });
}

function loadNavbar()
{
    let username = app.authorizationService.getUsername();
    if (app.authorizationService.getRole() === 'ROOT-ADMIN')
    {
        app.templateLoader.loadTemplate('.navbar-holder', 'navbar-root-admin');
        //countOrders('delivered');
        //$("#delivered-length").text("DADA");
    }
    else if (app.authorizationService.getRole() === 'ADMIN')
    {
        app.templateLoader.loadTemplate('.navbar-holder', 'navbar-admin');
    }
    else if (app.authorizationService.getRole() === 'MODERATOR')
    {
        app.templateLoader.loadTemplate('.navbar-holder', 'navbar-moderator');
        //$("#delivered-length").text("DADA");
    }
    else if (app.authorizationService.getRole() === 'ROLE_USER')
    {
        app.templateLoader.loadTemplate('.navbar-holder', 'navbar-user');
    }
    else
    {
        app.templateLoader.loadTemplate('.navbar-holder', 'navbar-guest');
    }
}

app.router.on('#/jobs/product', ['id'], function (id)
{
    loadNavbar();
    $.ajax(
        {
            type: 'GET',
            url: constants.serviceUrl + '/jobs/product?id=' + id,
            headers: {
                'Content-Type': 'application/json',
            }
        }).done((data) =>
    {
        app.templateLoader.loadTemplate('.app', 'job', function ()
        {
            let addToCart = data['id'];
            let auth = app.authorizationService.getRole();
            let fullSize = '';
            let options = '<option value="">Избери величина</option>';
            $("#intro-sweatshirt-name").text(data['position']);
            $("#sweatshirt-name").html('<b>' + data['position'] + '</b>');
            $("#modal-img").attr("src", data['img1']);
            $("#rating-system").html
            (           '<p class="mt-2 ml-2" id="avg-rating-modal"></p>'
                +       '<input type="radio" name="rating" value="5" id="five-star"><label for="five-star">☆</label>'
                +       '<input type="radio" name="rating" value="4" id="four-star"><label for="four-star">☆</label>'
                +       '<input type="radio" name="rating" value="3" id="three-star"><label for="three-star">☆</label>'
                +       '<input type="radio" name="rating" value="2" id="two-star"><label for="two-star">☆</label>'
                +       '<input type="radio" name="rating" value="1" id="one-star"><label for="one-star">☆</label>'
            );

            // $("#lead").html('<b>' + data['company.name'] + '</b>');
            $("#add-to-cart").html('<button  id="' + addToCart + '" class="btn btn-dark btn-block"> Добави в любими </button>');
            $("#location-show").html('<span class="fas fa-briefcase text-dark"></span> Дължност: <b>' + data['position'] + '</b>');
            $("#salary-show").html('<span class="fas fa-dollar-sign text-warning"></span> Заплата: <b>' + data['salary'] + '</b>');
            $("#num-of-employees-show").html('<span class="fas fa-sort-numeric-up-alt text-danger"></span> Служители: <b>' + data['numOfEmployees'] + '</b>');
            $("#description-show").html('<span class="fas fa-pen text-gray"></span> Описание: <b>' + data['description'] + '</b>');


            $("#order-col").html
            (
                '<form class="needs-validation" novalidate>'
                +       '<div class="input-group form-group">'
                +           '<div class="input-group-prepend">'
                +               '<span class="input-group-text"><i class="fas fa-user-tie"></i></span>'
                +           '</div>'
                +           '<input id="name" type="text" class="form-control rounded-right" placeholder="Име и презиме" minlength="5" maxlength="100" required>'
                +           '<div class="invalid-feedback">'
                +               'Имената трябва да се поне 5 букви'
                +           '</div>'
                +       '</div>'
                +       '<div class="input-group form-group">'
                +           '<div class="input-group-prepend">'
                +               '<span class="input-group-text"><i class="fas fa-phone-alt"></i></span>'
                +           '</div>'
                +           '<input id="mobile-num" type="tel" class="form-control rounded-right" placeholder="Телефонен номер" minlength="3" maxlength="100" required>'
                +           '<div class="invalid-feedback">'
                +               'Телефона мора да е поне 5 числа'
                +           '</div>'
                +       '</div>'
                +       '<div class="input-group form-group">'
                +           '<div class="input-group-prepend">'
                +               '<span class="input-group-text"><i class="fas fa-city"></i></span>'
                +           '</div>'
                +           '<input id="city" type="text" class="form-control rounded-right" placeholder="Град" minlength="3" maxlength="100" required>'
                +           '<div class="invalid-feedback">'
                +               'Името на града трябва да е минимум 3 букви'
                +           '</div>'
                +       '</div>'
                +       '<div class="input-group form-group">'
                +           '<div class="input-group-prepend">'
                +               '<span class="input-group-text"><i class="fas fa-envelope"></i></span>'
                +           '</div>'
                +           '<input id="mail" type="email" class="form-control rounded-right" placeholder="Е-маил" maxlength="100" required>'
                +           '<div class="invalid-feedback">'
                +               'Въведи твоя маил'
                +           '</div>'
                +       '</div>'
                +       '<div class="input-group form-group">'
                +           '<div class="input-group-prepend">'
                +               '<span class="input-group-text"><i class="fas fa-envelope"></i></span>'
                +           '</div>'
                +           '<textarea id="desc" type="email" class="form-control rounded-right" placeholder="Защо си подходящ?" required></textarea>'
                +           '<div class="invalid-feedback">'
                +               'Опиши го твоя потенциал'
                +           '</div>'
                +       '</div>'
                +       '<button type="click" id="submit-button" class="btn btn-success btn-block">Кандидатствай</button>'
                +       '</form>'
            );

            $("#order-modal").modal();
            $("#add-to-cart").html('<button  id="add-to-cart-button" class="btn btn-dark btn-block"> Добави в любими </button>');

            $('#select-size').html(options);

            (function()
            {
                'use strict';
                var forms = document.getElementsByClassName('needs-validation');
                var validation = Array.prototype.filter.call(forms, function(form) {
                    form.addEventListener('submit', function(event)
                    {
                        if (form.checkValidity() === false)
                        {
                            form.classList.add('was-validated');
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        else
                        {
                            event.preventDefault();
                            event.stopPropagation();

                            var formData = new FormData($('.needs-validation')[0]);

                            let inputSize = $('#size-select').val();
                            let inputName = $('#name').val();
                            let inputCity = $('#city').val();
                            let inputAddress = $('#address').val();
                            let inputMobileNum = $('#mobile-num').val();
                            let inputMail = $('#mail').val();
                            let description = $('#desc').val();

                            $.ajax({
                                type: 'POST',
                                url: constants.serviceUrl + '/applications/add',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': app.authorizationService.getCredentials()
                                },
                                data: JSON.stringify({
                                    "name": inputName,
                                    "number": inputMobileNum,
                                    "city": inputCity,
                                    "email": inputMail,
                                    "description": description,
                                    "done": false,
                                    "job": data
                                })
                            }).done((data, request) =>
                            {
                                $("#success_tic").modal();
                            }).fail((err) =>
                            {
                                console.log(err);
                                alert(err.responseText);
                                document.getElementById("error_register").hidden = false;
                            });

                            form.classList.remove('was-validated');

                        }
                    }, false);
                });
            })();

            $(document).bind('keydown', function(e)
            {
                if (e.which == 27)
                {
                    $("#success_tic").modal('hide');
                }
            });

            $('#one-star').click(function()
            {
                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/jobs/change-rating',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        "id": data['id'],
                        "rating": 1
                    })
                }).done((result) =>
                {
                    data['timesRated']++;
                    $('#avg-rating-modal').html('<b>' + result + '/5</b> (' + data['timesRated'] + ' гласа)');

                }).fail((err) =>
                {
                    console.log(err);
                    if (err.status == 401 || err.status == 403) {
                        document.getElementById("error_login").hidden = false;
                    }
                });
            });

            $('#two-star').click(function()
            {
                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/jobs/change-rating',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        "id": data['id'],
                        "rating": 2
                    })
                }).done((result) =>
                {
                    data['timesRated']++;
                    $('#avg-rating-modal').html('<b>' + result + '/5</b> (' + data['timesRated'] + ' гласа)');
                }).fail((err) =>
                {
                    console.log(err);
                    if (err.status == 401 || err.status == 403) {
                        document.getElementById("error_login").hidden = false;
                    }
                });
            });

            $('#three-star').click(function()
            {
                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/jobs/change-rating',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        "id": data['id'],
                        "rating": 3
                    })
                }).done((result) =>
                {
                    data['timesRated']++;
                    $('#avg-rating-modal').html('<b>' + result + '/5</b> (' + data['timesRated'] + ' гласа)');
                }).fail((err) =>
                {
                    console.log(err);
                    if (err.status == 401 || err.status == 403)
                    {
                        document.getElementById("error_login").hidden = false;
                    }
                });
            });

            $('#four-star').click(function()
            {
                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/jobs/change-rating',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        "id": data['id'],
                        "rating": 4
                    })
                }).done((result) =>
                {
                    data['timesRated']++;
                    $('#avg-rating-modal').html('<b>' + result + '/5</b> (' + data['timesRated'] + ' гласа)');
                }).fail((err) =>
                {
                    console.log(err);
                    if (err.status == 401 || err.status == 403) {
                        document.getElementById("error_login").hidden = false;
                    }
                });
            });

            $('#five-star').click(function()
            {
                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/jobs/change-rating',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        "id": data['id'],
                        "rating": 5
                    })
                }).done((result) =>
                {
                    data['timesRated']++;
                    $('#avg-rating-modal').html('<b>' + result + '/5</b> (' + data['timesRated'] + ' гласа)');
                }).fail((err) =>
                {
                    console.log(err);
                    if (err.status == 401 || err.status == 403) {
                        document.getElementById("error_login").hidden = false;
                    }
                });
            });

            $('#add-to-cart-button').click(function()
            {
                if(auth === "ROLE_USER" || auth === "MODERATOR" || auth === "ADMIN" || auth === "ROOT-ADMIN")
                {
                    let inputSize = $('#size-select').val();

                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/save-application',
                        headers: {
                            'Content-Type': 'application/json',
                            //  'Authorization': app.authorizationService.getCredentials()
                        },
                        data: JSON.stringify({
                            "job": data,
                            "username": app.authorizationService.getUsername(),
                        })
                    }).done((data, request) =>
                    {
                        $("#success_tic").modal();
                    }).fail((err) =>
                    {
                        alert("Failed saving order. PLease try again later");
                        console.log(err);
                        alert(err.responseText);
                        document.getElementById("error_register").hidden = false;
                    });
                }
                else
                {
                    $('#login-modal').modal();

                    $('#sign-up-link').click(function ()
                    {
                        $('#login-modal').modal('hide');
                        $('#order-modal').modal('hide');
                        setTimeout(function(){ app.router.reload('#/users/register'); }, 150);
                    });
                    $('#login-user').click(function ()
                    {
                        login();
                    });
                }
            });

        });

    }).fail((err) =>
    {
        alert('Error');
        console.log(err.responseText);
    });
});

app.router.on('#/', null, function ()
{
    loadNavbar();

    $.ajax({
        type: 'GET',
        url: constants.serviceUrl + '/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': app.authorizationService.getCredentials()
        }
    }).done((data) => {
        app.templateLoader.loadTemplate('.app', 'jobs-all', function ()
        {
            let auth = app.authorizationService.getRole();
            let i = 0;
            let k = 0;
            for (let elem of data)
            {
                let uniqueElementId = elem['id'];
                let actionsId = 'actions-' + uniqueElementId;
                let uniqueElementIdFirst = uniqueElementId + '1';
                let uniqueElementIdSecond = uniqueElementId + '2';
                let uniqueElementIdThird = uniqueElementId + '3';
                let uniqueElementIdFourth = uniqueElementId + '4';
                let uniqueElementIdFifth = uniqueElementId + '5';
                let avg_rating = 'avg_rating_' + uniqueElementId;
                let uniqueElementIdFirstModal = uniqueElementId + 'Modal1';
                let uniqueElementIdSecondModal = uniqueElementId + 'Modal2';
                let uniqueElementIdThirdModal = uniqueElementId + 'Modal3';
                let uniqueElementIdFourthModal = uniqueElementId + 'Modal4';
                let uniqueElementIdFifthModal = uniqueElementId + 'Modal5';
                let describeYourPotential = uniqueElementId + 'desc';
                let name = uniqueElementId + 'Name';
                let selectedSize = uniqueElementId + 'Size';
                let mobileNum = uniqueElementId + 'MobileNum';
                let city = uniqueElementId + 'City';
                let address = uniqueElementId + 'Address';
                let mail = uniqueElementId + 'Mail';
                let submitButtonId = uniqueElementId + 'Submit';
                let avgRatingModal = 'avg_rating_modal' + uniqueElementId;
                let order = 'order' + uniqueElementId;
                let addToCart = 'addToCart' + uniqueElementId;
                let sizeSelect = 'sizeSelect' + uniqueElementId;
                let sizesId = 'sizes' + i;
                let saving = elem['oldPrice'] - elem['newPrice'];
                let fullSize = '';
                let options = '<option value="">Избери величина</option>';
                let selectedRating = 5;
                let avgRating;
                let ratingFlag = false;
                let loginUser = 'login' + uniqueElementId;

                if(i%3 == 0 || i==0)
                {
                    k++;
                    $('.card-container').append('<div id="' + k + '" class="row active-with-click">');
                }

                $('#' + k)
                    .append('<div class="kard col-md-4 col-sm-6 col-xs-12">'
                        +      '<article class="material-card Grey">'
                        +               '<h2>'
                        // + '<h4 class="media-heading"><a href="#/jobs/product?id=' + elem['id'] + '">' + elem['position'] + '</a></h4>'
                        +                     '<span><a href="#/jobs/product?id=' + elem['id'] + '">' + elem['position'] + '</a></span>'
                        +                     '<strong>'
                        +                     '<div class="row pl-3">'
                        +                       '<span class="price promo-price"> <b>'
                        +                              elem['companyName'] + '</b></span>'
                        +                       '<button id="' + order + '" class="btn btn-danger ml-auto mr-1"><b>Бърз преглед</b></button>'
                        +                     '</div>'
                        +                     '</strong>'
                        +                '</h2>'
                        +                '<div class="mc-content product-grid8">'
                        +                   '<div class="img-container product-image8">'
                        // +                       '<img class="img-responsive" src="' + elem['img'] + '">'
                        +                       '<img class="pic-1 img-responsive" src="' + elem['img1'] + '">'
                        +                       '<img class="pic-2 img-responsive" src="' + elem['img2'] + '">'
                        +                   '</div>'
                        +                   '<div class="mc-description">'
                        +                         elem['description']
                        +                   '</div>'
                        +                '</div>'
                        +                '<a class="mc-btn-action">'
                        +                    '<i class="fa fa-bars"></i>'
                        +                '</a>'
                        +                '<div class="mc-footer">'
                        +                    '<div class="wrp">'
                        +                         '<a href="www.linkedin.com" class="icon linkedin mr-2"><i class="fab fa-internet-explorer"></i></a>'
                        +                         '<a href="www.website.com" class="icon linkedin mr-2"><i class="fab fa-linkedin"></i></a>'
                        +                         '<a href="www.facebook.com" class="icon icon-facebook"><i class="fab fa-facebook-f"></i></a>'
                        +                         '<a href="www.instagram.com" class="icon icon-instagram mr-2"><i class="fab fa-instagram"></i></a>'
                        +                    '</div>'
                        +                '</div>'
                        +            '</article>'
                        +            '</div>');


                if((i+1)%3 == 0)
                {
                    $('.card-container').append('</div');
                }

                $('#' + order).click(function()
                {
                    // $("#success_tic").modal();
                    $("#job-position").html('<b>' + elem['position'] + '</b>');
                    $("#modal-img").attr("src", elem['img1']);
                    $("#rating-system").html
                    (           '<p class="mt-2 ml-2" id="' + avgRatingModal + '"></p>'
                        +       '<input type="radio" name="rating" value="5" id="' + uniqueElementIdFifthModal + '"><label for="' + uniqueElementIdFifthModal + '">☆</label>'
                        +       '<input type="radio" name="rating" value="4" id="' + uniqueElementIdFourthModal + '"><label for="' + uniqueElementIdFourthModal + '">☆</label>'
                        +       '<input type="radio" name="rating" value="3" id="' + uniqueElementIdThirdModal + '"><label for="' + uniqueElementIdThirdModal + '">☆</label>'
                        +       '<input type="radio" name="rating" value="2" id="' + uniqueElementIdSecondModal + '"><label for="' + uniqueElementIdSecondModal + '">☆</label>'
                        +       '<input type="radio" name="rating" value="1" id="' + uniqueElementIdFirstModal + '"><label for="' + uniqueElementIdFirstModal + '">☆</label>'
                    );
                    $("#order-col").html
                    (
                        '<form class="needs-validation" novalidate>'
                        +       '<div class="input-group form-group">'
                        +           '<div class="input-group-prepend">'
                        +               '<span class="input-group-text"><i class="fas fa-user-tie"></i></span>'
                        +           '</div>'
                        +           '<input id="' + name + '" type="text" class="form-control rounded-right" placeholder="Име и презиме" minlength="5" maxlength="100" required>'
                        +           '<div class="invalid-feedback">'
                        +                'Имената трябва да са най-малко 5 букви'
                        +           '</div>'
                        +       '</div>'
                        +       '<div class="input-group form-group">'
                        +           '<div class="input-group-prepend">'
                        +               '<span class="input-group-text"><i class="fas fa-phone-alt"></i></span>'
                        +           '</div>'
                        +           '<input id="' + mobileNum + '" type="tel" class="form-control rounded-right" placeholder="Мобилен брой" minlength="5" maxlength="100" required>'
                        +           '<div class="invalid-feedback">'
                        +               'Номера на телефона треба да е на 5 числа'
                        +           '</div>'
                        +       '</div>'
                        +       '<div class="input-group form-group">'
                        +           '<div class="input-group-prepend">'
                        +               '<span class="input-group-text"><i class="fas fa-city"></i></span>'
                        +           '</div>'
                        +           '<input id="' + city + '" type="text" class="form-control rounded-right" placeholder="Град" minlength="3" maxlength="100" required>'
                        +           '<div class="invalid-feedback">'
                        +               'Името на града тряба да е над 3 букви'
                        +           '</div>'
                        +       '</div>'
                        +       '<div class="input-group form-group">'
                        +           '<div class="input-group-prepend">'
                        +               '<span class="input-group-text"><i class="fas fa-envelope"></i></span>'
                        +           '</div>'
                        +           '<input id="' + mail + '" type="email" class="form-control rounded-right" placeholder="Е-маил" maxlength="100" required>'
                        +           '<div class="invalid-feedback">'
                        +               'Въведете валиден меил'
                        +           '</div>'
                        +       '</div>'
                        +       '<div class="input-group form-group">'
                        +           '<div class="input-group-prepend">'
                        +               '<span class="input-group-text"><i class="fas fa-pen"></i></span>'
                        +           '</div>'
                        +           '<textarea rows="2"  id="' + describeYourPotential + '" type="text" class="form-control rounded-right" placeholder="Защо си подходящ?" maxlength="200" required></textarea>'
                        +           '<div class="invalid-feedback">'
                        +               'Въведи описание за себе си'
                        +           '</div>'
                        +       '</div>'
                        +       '<button type="click" id="' + submitButtonId + '" class="btn btn-success btn-block">Кандидатствай</button>'
                        +       '</form>'
                    );

                    $("#order-modal").modal();
                    $("#lead").html('<b>' + elem['companyName'] + '</b>');
                    $("#add-to-cart").html('<button  id="' + addToCart + '" class="btn btn-dark btn-block"> Добави в любими </button>');
                    $("#location-show").html('<span class="fas fa-briefcase text-dark"></span> Дължност: <b>' + elem['position'] + '</b>');
                    $("#salary-show").html('<span class="fas fa-dollar-sign text-warning"></span> Заплата: <b>' + elem['salary'] + '</b>');
                    $("#num-of-employees-show").html('<span class="fas fa-sort-numeric-up-alt text-danger"></span> Служители: <b>' + elem['numOfEmployees'] + '</b>');
                    $("#description-show").html('<span class="fas fa-pen text-gray"></span> Описание: <b>' + elem['description'] + '</b>');

                    (function() {
                        'use strict';
                        var forms = document.getElementsByClassName('needs-validation');
                        var validation = Array.prototype.filter.call(forms, function(form) {
                            form.addEventListener('submit', function(event)
                            {
                                if (form.checkValidity() === false)
                                {
                                    form.classList.add('was-validated');
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                                else
                                {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    var formData = new FormData($('.needs-validation')[0]);

                                    let inputSize = $('#' + sizeSelect).val();
                                    let inputName = $('#' + name).val();
                                    let inputCity = $('#' + city).val();
                                    let inputAddress = $('#' + address).val();
                                    let inputMobileNum = $('#' + mobileNum).val();
                                    let getDescribeYourPotential = $('#' + describeYourPotential).val();
                                    let inputMail = $('#' + mail).val();

                                    $.ajax({
                                        type: 'POST',
                                        url: constants.serviceUrl + '/applications/add',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': app.authorizationService.getCredentials()
                                        },
                                        data: JSON.stringify({
                                            "name": inputName,
                                            "number": inputMobileNum,
                                            "city": inputCity,
                                            "email": inputMail,
                                            "description": getDescribeYourPotential,
                                            "done": false,
                                            "job": elem
                                        })
                                    }).done((data, request) =>
                                    {
                                        $("#success_tic").modal();
                                    }).fail((err) =>
                                    {
                                        console.log(err);
                                        alert(err.responseText);
                                    });

                                    form.classList.remove('was-validated');

                                }
                            }, false);
                        });
                    })();

                    $('#' + uniqueElementIdFirstModal).click(function()
                    {
                        $.ajax({
                            type: 'POST',
                            url: constants.serviceUrl + '/jobs/change-rating',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify({
                                "id": uniqueElementId,
                                "rating": 1
                            })
                        }).done((data) =>
                        {
                            elem['timesRated']++;
                            $('#' + avgRatingModal).html('<b>' + data + '/5</b> (' + elem['timesRated'] + ' гласа)');

                        }).fail((err) =>
                        {
                            console.log(err);
                            if (err.status == 401 || err.status == 403) {
                                document.getElementById("error_login").hidden = false;
                            }
                        });
                    });

                    $('#' + uniqueElementIdSecondModal).click(function()
                    {
                        $.ajax({
                            type: 'POST',
                            url: constants.serviceUrl + '/jobs/change-rating',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify({
                                "id": uniqueElementId,
                                "rating": 2
                            })
                        }).done((data) =>
                        {
                            elem['timesRated']++;
                            $('#' + avgRatingModal).html('<b>' + data + '/5</b> (' + elem['timesRated'] + ' гласа)');
                        }).fail((err) =>
                        {
                            console.log(err);
                            if (err.status == 401 || err.status == 403) {
                                document.getElementById("error_login").hidden = false;
                            }
                        });
                    });

                    $('#' + uniqueElementIdThirdModal).click(function()
                    {
                        $.ajax({
                            type: 'POST',
                            url: constants.serviceUrl + '/jobs/change-rating',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify({
                                "id": uniqueElementId,
                                "rating": 3
                            })
                        }).done((data) =>
                        {
                            elem['timesRated']++;
                            $('#' + avgRatingModal).html('<b>' + data + '/5</b> (' + elem['timesRated'] + ' гласа)');
                        }).fail((err) =>
                        {
                            console.log(err);
                            if (err.status == 401 || err.status == 403)
                            {
                                document.getElementById("error_login").hidden = false;
                            }
                        });
                    });

                    $('#' + uniqueElementIdFourthModal).click(function()
                    {
                        $.ajax({
                            type: 'POST',
                            url: constants.serviceUrl + '/jobs/change-rating',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify({
                                "id": uniqueElementId,
                                "rating": 4
                            })
                        }).done((data) =>
                        {
                            elem['timesRated']++;
                            $('#' + avgRatingModal).html('<b>' + data + '/5</b> (' + elem['timesRated'] + ' гласа)');
                        }).fail((err) =>
                        {
                            console.log(err);
                            if (err.status == 401 || err.status == 403) {
                                document.getElementById("error_login").hidden = false;
                            }
                        });
                    });

                    $('#' + uniqueElementIdFifthModal).click(function()
                    {
                        $.ajax({
                            type: 'POST',
                            url: constants.serviceUrl + '/jobs/change-rating',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify({
                                "id": uniqueElementId,
                                "rating": 5
                            })
                        }).done((data) =>
                        {
                            elem['timesRated']++;
                            $('#' + avgRatingModal).html('<b>' + data + '/5</b> (' + elem['timesRated'] + ' гласа)');
                        }).fail((err) =>
                        {
                            console.log(err);
                            if (err.status == 401 || err.status == 403) {
                                document.getElementById("error_login").hidden = false;
                            }
                        });
                    });

                    $('#' + addToCart).click(function()
                    {
                        document.getElementById("error_login").hidden = true;
                        auth = app.authorizationService.getRole();

                        if(auth === "ROLE_USER" || auth === "MODERATOR" || auth === "ADMIN" || auth === "ROOT-ADMIN")
                        {
                            let inputSize = $('#' + sizeSelect).val();

                            $.ajax({
                                type: 'POST',
                                url: constants.serviceUrl + '/save-application',
                                headers: {
                                    'Content-Type': 'application/json',
                                    //  'Authorization': app.authorizationService.getCredentials()
                                },
                                data: JSON.stringify({
                                    "job": elem,
                                    "username": app.authorizationService.getUsername(),
                                })
                            }).done((data, request) =>
                            {
                                $("#cart-success").modal();
                            }).fail((err) =>
                            {
                                console.log(err);
                                document.getElementById("error_register").hidden = false;
                            });
                        }
                        else
                        {
                            $('#login-modal').modal();
                            $("#button-div").html('<button id="' + loginUser + '"'
                                + ' type="button" class="btn float-right login_btn">Login</button>');
                            $('#sign-up-link').click(function ()
                            {
                                $('#login-modal').modal('hide');
                                $('#order-modal').modal('hide');
                                setTimeout(function(){ app.router.reload('#/users/register'); }, 150);
                            });
                            $('#' + loginUser).click(function ()
                            {
                                let username = $('#username').val();
                                let password = $('#password').val();

                                $.ajax({
                                    type: 'POST',
                                    url: constants.serviceUrl + '/login',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: JSON.stringify({
                                        "username": username,
                                        "password": password
                                    })
                                }).done((data, status, request) => {
                                    let authToken = data.split('Bearer ')[1];
                                    app.authorizationService.saveCredentials(authToken);
                                    loadNavbar();
                                    $("#login-modal").modal('hide');
                                    let inputSize = $('#' + sizeSelect).val();

                                    $.ajax({
                                        type: 'POST',
                                        url: constants.serviceUrl + '/save-application',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            //  'Authorization': app.authorizationService.getCredentials()
                                        },
                                        data: JSON.stringify({
                                            "job": elem,
                                            "username": app.authorizationService.getUsername(),
                                        })
                                    }).done((data, request) =>
                                    {
                                        $("#cart-success").modal();
                                    }).fail((err) =>
                                    {
                                        console.log(err);
                                        document.getElementById("error_register").hidden = false;
                                    });

                                }).fail((err) =>
                                {
                                    alert('Error: ' + err);
                                    if(err.status == 401 || err.status == 403)
                                    {
                                        document.getElementById("error_login").hidden = false;
                                    }
                                });
                            });
                        }
                    });

                });

                $('#' + uniqueElementIdFirst).click(function()
                {
                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/jobs/change-rating',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            "id": uniqueElementId,
                            "rating": 1
                        })
                    }).done((data) =>
                    {
                        elem['timesRated']++;
                        $('#' + avg_rating).text(data);
                    }).fail((err) =>
                    {
                        console.log(err);
                        if (err.status == 401 || err.status == 403) {
                            document.getElementById("error_login").hidden = false;
                        }
                    });
                });


                $('#' + uniqueElementIdSecond).click(function()
                {
                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/jobs/change-rating',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            "id": uniqueElementId,
                            "rating": 2
                        })
                    }).done((data) => {
                        elem['timesRated']++;
                        $('#' + avg_rating).text(data);
                    }).fail((err) => {
                        console.log(err);
                        if (err.status == 401 || err.status == 403) {
                            document.getElementById("error_login").hidden = false;
                        }
                    });
                });

                $('#' + uniqueElementIdThird).click(function()
                {
                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/jobs/change-rating',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            "id": uniqueElementId,
                            "rating": 3
                        })
                    }).done((data) => {
                        elem['timesRated']++;
                        $('#' + avg_rating).text(data);
                    }).fail((err) => {
                        console.log(err);
                        if (err.status == 401 || err.status == 403) {
                            document.getElementById("error_login").hidden = false;
                        }
                    });
                });

                $('#' + uniqueElementIdFourth).click(function()
                {
                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/jobs/change-rating',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            "id": uniqueElementId,
                            "rating": 4
                        })
                    }).done((data) => {
                        elem['timesRated']++;
                        $('#' + avg_rating).text(data);
                    }).fail((err) => {
                        console.log(err);
                        if (err.status == 401 || err.status == 403) {
                            document.getElementById("error_login").hidden = false;
                        }
                    });
                });

                $('#' + uniqueElementIdFifth).click(function()
                {
                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/jobs/change-rating',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            "id": uniqueElementId,
                            "rating": 5
                        })
                    }).done((data) => {
                        elem['timesRated']++;
                        $('#' + avg_rating).text(data);
                    }).fail((err) => {
                        console.log(err);
                        if (err.status == 401 || err.status == 403) {
                            document.getElementById("error_login").hidden = false;
                        }
                    });
                });

                i++;
            }

            $(document).bind('keydown', function(e)
            {
                if (e.which == 27)
                {
                    // TODO: How to close modal for add cart with esc
                    // alert($('#cart-success').hasClass('in'));
                    $("#success_tic").modal('hide');
                    // $("#add_success").modal('hide');
                }
            });

            $('.card-container').append('</div');

            if(auth === "MODERATOR" || auth === "ADMIN" || auth === "ROOT-ADMIN")
            {
                (function () {
                    'use strict';
                    var forms = document.getElementsByClassName('needs-validation2');
                    var validation = Array.prototype.filter.call(forms, function (form) {
                        form.addEventListener('submit', function (event) {
                            if (form.checkValidity() === false) {
                                form.classList.add('was-validated');
                                event.preventDefault();
                                event.stopPropagation();
                            } else {
                                event.preventDefault();
                                event.stopPropagation();

                                var formData = new FormData($('.needs-validation2')[0]);

                                let position = $('#position').val();
                                let companyName = $('#company-name').val();
                                let img1 = $('#img').val();
                                let numOfEmployees = $('#num-of-employees').val();
                                let salary = $('#salary').val();
                                let location = $('#location').val();
                                let description = $('#description').val();

                                $.ajax({
                                    type: 'POST',
                                    url: constants.serviceUrl + '/jobs/add',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    data: JSON.stringify({
                                        "position": position,
                                        "companyName": companyName,
                                        "img1": img1,
                                        "numOfEmployees": numOfEmployees,
                                        "salary": salary,
                                        "location": location,
                                        "description": description
                                    })
                                }).done((data) => {
                                    app.router.reload('#/');
                                    setTimeout(function () {
                                        $('#add_success').modal();
                                    }, 1000);

                                }).fail((err) => {
                                    alert('err');
                                });

                                form.classList.remove('was-validated');

                            }
                        }, false);
                    });
                })();
            }
            else
            {
                $("#add-sweatshirt").hide();
            }
        });
    }).fail((err) => {
        console.log(err);
    });


});

app.router.on("#/users/all", null, function () {
    loadNavbar();
    //document.getElementById("users-all-active").className = "txt-danger";
    $.ajax({
        type: 'GET',
        url: constants.serviceUrl + '/users/all',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': app.authorizationService.getCredentials()
        }
    }).done((data) =>
    {
        app.templateLoader.loadTemplate('.app', 'users-all', function () {
            let loggedUsername = app.authorizationService.getUsername();
            $('#all-users').text('Welcome, ' + loggedUsername);

            let i = 1;
            for (let elem of data) {

                var formatDateBirth = new Date(elem['birthDate']).toLocaleDateString();

                if(elem['role'] === 'ROOT-ADMIN') {
                    $('.all-users')
                        .append('<tr>'
                            // + '<td class="id" style="display:none;">' + elem['id'] + '</td>'
                            + '<td class="first-name">' + elem['firstName'] + '</td>'
                            + '<td class="last-name">' + elem['lastName'] + '</td>'
                            + '<td class="username">' + elem['username'] + '</td>'
                            + '<td class="email">' + elem['email'] + '</td>'
                            + '<td class="date-birth">' + formatDateBirth + '</td>'
                            + '<td class="text-center">'
                            + '<div class="d-flex justify-content-center">'
                            + '<button type="button" class="edit-btn btn" disabled>'
                            + '<i class="fa fa-edit"></i>'
                            + '</button>'
                            + '<button type="button" class="delete-btn btn" disabled>'
                            + '<i class="fas fa-trash-alt"></i>'
                            + '</button>'
                            + '</div>'
                            + '</td>'
                            + '</tr>');
                }
                else {
                    $('.all-users')
                        .append('<tr>'
                            // + '<td class="id" style="display:none;">' + elem['id'] + '</td>'
                            + '<td class="first-name">' + elem['firstName'] + '</td>'
                            + '<td class="last-name">' + elem['lastName'] + '</td>'
                            + '<td class="username">' + elem['username'] + '</td>'
                            + '<td class="email">' + elem['email'] + '</td>'
                            + '<td class="date-birth">' + formatDateBirth + '</td>'
                            + '<td class="text-center">'
                            + '<div class="d-flex justify-content-center">'
                            + '<button type="button" class="edit-btn btn">'
                            + '<i class="fa fa-edit"></i>'
                            + '</button>'
                            + '<button type="button" class="delete-btn btn">'
                            + '<i class="fas fa-trash-alt"></i>'
                            + '</button>'
                            + '</div>'
                            + '</td>'
                            + '</tr>');
                }

                i++;
            }

            if(app.authorizationService.getRole() === 'ROLE_USER') {
                $( ".edit-btn" ).prop( "disabled", true );
                $( ".delete-btn" ).prop( "disabled", true );
            }
            else if(app.authorizationService.getRole() === 'MODERATOR') {
                $( ".delete-btn" ).prop( "disabled", true );
            }

            $('#refresh-users-button').click(function() {
                app.router.reload('#/users/all');
            });

            $('#create_account').click( function ()
            {
                $("#create_modal").modal();
            });

            $('.edit-btn').click( function ()
            {
                var $row = $(this).closest("tr");
                var $firstName = $row.find(".first-name").text();
                var $lastName = $row.find(".last-name").text();
                var $username = $row.find(".username").text();
                var $email = $row.find(".email").text();
                var $dateBirth = $row.find(".date-birth").text();

                $modal = $('#edit_modal');
                $editor = $('#editor');

                $editor.find('#firstName').val($firstName);
                $editor.find('#lastName').val($lastName);
                $editor.find('#username_edit').val($username);
                $editor.find('#' + '').val($email);
                $editor.find('#datetimepicker_modal').val($dateBirth);
                $modal.data('row', $row);
                $modal.modal('show');
            });

            $('.delete-btn').click( function ()
            {
                var result = confirm("Do you really want to remove the user?");
                if (result) {

                    var $row = $(this).closest("tr");
                    let username = $row.find(".username").text();

                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/users/delete?username=' + username,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': app.authorizationService.getCredentials()
                        }
                    }).done(() => {
                        app.router.reload('#/users/all');
                    }).fail((err) => {
                        console.log(err);
                        // alert(err.responseText);
                    }).always(function () {
                        //    app.router.reload('#/users/all');
                    });
                }
            });


            (function() {
                'use strict';
                var forms = document.getElementsByClassName('needs-validation');
                var validation = Array.prototype.filter.call(forms, function(form) {
                    form.addEventListener('submit', function(event) {
                        if (form.checkValidity() === false) {
                            form.classList.add('was-validated');
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        else
                        {
                            event.preventDefault();
                            event.stopPropagation();

                            var formData = new FormData($('.needs-validation')[0]);

                            let firstName = $('#firstName').val();
                            let lastName = $('#lastName').val();
                            let username = $('#username_edit').val();
                            let email = $('#email').val();
                            let birthDate = $('#datetimepicker_modal').val();
                            let getBirthDate = new Date(birthDate);

                            $.ajax({
                                type: 'POST',
                                url: constants.serviceUrl + '/users/edit',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': app.authorizationService.getCredentials()
                                },
                                data: JSON.stringify({
                                    "firstName": firstName,
                                    "lastName": lastName,
                                    "username": username,
                                    "email": email,
                                    "birthDate": getBirthDate,
                                })
                            }).done(() => {
                                $('#edit_modal').modal('hide');
                                setTimeout(function(){ app.router.reload('#/users/all'); }, 150);
                            }).fail((err) => {
                                console.log(err);
                                alert(err.responseText);
                            }).always(function () {
                                //    app.router.reload('#/users/all');
                            });
                            form.classList.remove('was-validated');
                        }
                    }, false);
                });
            })();
            // Create Modal
            (function() {
                'use strict';
                var forms = document.getElementsByClassName('needs-validation-create');
                var validation = Array.prototype.filter.call(forms, function(form) {
                    form.addEventListener('submit', function(event) {
                        if (form.checkValidity() === false) {
                            form.classList.add('was-validated');
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        else
                        {
                            event.preventDefault();
                            event.stopPropagation();

                            var formData = new FormData($('.needs-validation')[0]);

                            let firstName = $('#first-name-create').val();
                            let lastName = $('#last-name-create').val();
                            let username = $('#username-create').val();
                            let email = $('#email-create').val();
                            let birthDate = $('#datetimepicker_modal_create').val();
                            let password = $('#password-create').val();
                            let confirmPassword = $('#confirm-password-create').val();

                            let formatBirthDate = new Date(birthDate);

                            $.ajax({
                                type: 'POST',
                                url: constants.serviceUrl + '/users/register',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': app.authorizationService.getCredentials()
                                },
                                data: JSON.stringify({
                                    "firstName": firstName,
                                    "lastName": lastName,
                                    "username": username,
                                    "email": email,
                                    "birthDate": formatBirthDate,
                                    "password": password,
                                    "confirmPassword": confirmPassword,
                                })
                            }).done(() => {
                                $('#create_modal').modal('hide');
                                setTimeout(function(){ app.router.reload('#/users/all'); }, 150);
                            }).fail((err) => {
                                console.log(err);
                                alert(err.responseText);
                            }).always(function () {
                                //    app.router.reload('#/users/all');
                            });
                            form.classList.remove('was-validated');
                        }
                    }, false);
                });
            })();

        });
    }).fail((err) => {
        console.log(err);
    });
});

app.router.on("#/organization", null, function () {
    $.ajax({
        type: 'GET',
        url: constants.serviceUrl + '/organization',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': app.authorizationService.getCredentials()
        }
    }).done((data) => {
        app.templateLoader.loadTemplate('.app', 'organization', function () {
            let i = 1;

            for (let elem of data)
            {
                let uniqueElementId = elem['id'];
                let actionsId = 'actions-' + uniqueElementId;

                $('.all-users-organization')
                    .append('<tr>'
                        + '<td class="id">' + i + '</td>'
                        + '<td class="first-name">' + elem['firstName'] + '</td>'
                        + '<td class="last-name">' + elem['lastName'] + '</td>'
                        + '<td class="username">' + elem['username'] + '</td>'
                        + '<td class="role">' + elem['role'] + '</td>'
                        + '<td id="' + actionsId + '" class="col-md-7 d-flex justify-content-between" scope="col">'
                        + '</td>'
                        + '</tr>');
                if(elem['username'] === app.authorizationService.getUsername()) {
                    $('#' + actionsId)
                        .append('<h5><button class="btn btn-secondary btn-sm px-4" disabled>Own Unchangeable</button></h5>');
                    uniqueElementId = null;
                }
                else {
                    if (elem['role'] === 'ROLE_USER') {
                        $('#' + actionsId)
                            .append('<h5><button class="btn btn-primary btn-sm promote-button">Promote</button></h5>')
                    } else if (elem['role'] === 'ROOT-ADMIN') {
                        $('#' + actionsId)
                            .append('<h5><button class="btn btn-secondary btn-sm px-4" disabled>Owner Unchangeable</button></h5>');
                        uniqueElementId = null;
                    } else if (elem['role'] === 'ADMIN') {
                        $('#' + actionsId)
                            .append('<h5><button class="btn btn-danger btn-sm demote-button">Demote</button></h5>');
                    }else {
                        $('#' + actionsId)
                            .append('<h5><button class="btn btn-primary btn-sm promote-button mr-2">Promote</button></h5>')
                            .append('<h5><button class="btn btn-danger btn-sm demote-button">Demote</button></h5>');
                    }
                }

                $('#' + actionsId + '>h5>.promote-button').click(function (e) {
                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/organization/promote?id=' + uniqueElementId,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': app.authorizationService.getCredentials()
                        }
                    }).done(function (data) {
                        console.log(data);
                    }).fail(function (err) {
                        console.log(err);
                    }).always(function () {
                        app.router.reload('#/organization');
                    })
                });

                $('#' + actionsId + '>h5>.demote-button').click(function (e) {
                    $.ajax({
                        type: 'POST',
                        url: constants.serviceUrl + '/organization/demote?id=' + uniqueElementId,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': app.authorizationService.getCredentials()
                        }
                    }).done(function (data) {
                        console.log(data);
                    }).fail(function (err) {
                        console.log(err);
                    }).always(function () {
                        app.router.reload('#/organization');
                    });
                });

                $('#refresh-users-button').click(function() {
                    app.router.reload('#/organization');
                });

                i++;
            }
        });
    }).fail((err) => {
        console.log(err);
    });
});

app.router.on("#/logs/all", null, function () {

    $.ajax({
        type: 'GET',
        url: constants.serviceUrl + '/logs/all',
        headers: {
            'Authorization': app.authorizationService.getCredentials()
        }
    }).done((data) => {
        app.templateLoader.loadTemplate('.app', 'logs-all', function () {
            let i = 1;
            for (let elem of data)
            {
                $('.all-logs')
                    .append('<tr>'

                        + '<td class="first-name" style="display:none;">' + elem['id'] + '</td>'
                        + '<td class="user">' + elem['user'] + '</td>'
                        + '<td class="operation">' + elem['operation'] + '</td>'
                        + '<td class="table-name">' + elem['tableName'] + '</td>'
                        + '<td class="date">' + elem['date'] + '</td>'
                        + '</tr>');

                i++;
            }

            if(app.authorizationService.getRole() === 'MODERATOR') {
                $( "#clear_selected" ).prop( "disabled", true );
                $( "#clear_all" ).prop( "disabled", true )
            }

            var table = $('#example').DataTable();
            var selectedRows = new Array();

            $('#example tbody').on( 'click', 'tr', function ()
            {
                $(this).toggleClass('selected');
            } );

            $('#clear_selected').click( function ()
            {
                var rows = table.rows('.selected').data();

                for(var i=0;i<rows.length;i++)
                {
                    selectedRows[i] = rows[i][0];
                }

                alert(selectedRows);

                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/logs/delete?logs=' + selectedRows,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': app.authorizationService.getCredentials()
                    }
                }).done(() => {
                    app.router.reload('#/logs/all');
                }).fail((err) => {
                    console.log(err);
                }).always(function () {
                });
            });

            $('#clear_all').click( function ()
            {
                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/logs/delete/all',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': app.authorizationService.getCredentials()
                    }
                }).done(() => {
                    app.router.reload('#/`logs/all`');
                }).fail((err) => {
                    console.log(err);
                    alert(err);
                }).always(function () {
                });
            });
        });
    }).fail((err) => {
        console.log(err);
    });

    $('#refresh-logs-button').click(function() {
        app.router.reload('#/logs/all');
    });

});

app.router.on("#/applications/waiting", null, function ()
{
    loadNavbar();
    $.ajax({
        type: 'GET',
        url: constants.serviceUrl + '/applications/waiting',
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': app.authorizationService.getCredentials()
            }
    }).done((data) =>
    {
        app.templateLoader.loadTemplate('.app', 'orders-waiting', function ()
        {
            //   let loggedUsername = app.authorizationService.getUsername();
            //   $('#logged-user').text('Welcome, ' + loggedUsername);

            let i = 1;

            for (let elem of data)
            {
                let uniqueElementId = elem['id'];

                $('.all-waiting-orders')
                    .append('<tr>'
                        + '<td class="order-id" style="display:none;">' + elem['id'] + '</td>'
                        + '<td class="sweatshirt-id">' + elem['jobId'] + '</td>'
                        + '<td class="company-name">' + elem['jobCompanyName'] + '</td>'
                        + '<td class="sweatshirt-name">' + elem['jobPosition'] + '</td>'
                        + '<td class="name">' + elem['name'] + '</td>'
                        + '<td class="email">' + elem['email'] + '</td>'
                        + '<td class="city">' + elem['city'] + '</td>'
                        + '<td class="number">' + elem['number'] + '</td>'
                        + '<td class="text-center">'
                        + '<div class="d-flex justify-content-center">'
                        + '<input id="' + uniqueElementId + '"type="checkbox" name="deliver" value="deliver">'
                        + '</div>'
                        + '</td>'
                        + '</tr>');

                $('#' + uniqueElementId).click(function (e)
                {
                    $('#approve-deliver-modal').modal();

                    $('#approve-deliver-button').click(function (e)
                    {
                        $.ajax({
                            type: 'POST',
                            url: constants.serviceUrl + '/applications/deliver?id=' + uniqueElementId,
                            headers: {
                                'Content-Type': 'application/json'
                                //      'Authorization': app.authorizationService.getCredentials()
                            }
                        }).done(function (data)
                        {
                            setTimeout(function()
                            {
                                app.router.reload('#/applications/waiting');
                            }, 150);

                        }).fail(function (err)
                        {
                            alert("FAIL");
                            console.log(err);
                        }).always(function ()
                        {
                            $('#approve-deliver-modal').modal('hide');
                        });
                    });

                    $('#approve-deliver-modal').on('hidden.bs.modal', function ()
                    {
                        $('#' + uniqueElementId).prop('checked', false);
                    })
                });

                i++;
            }

            var table = $('#orders-table').DataTable();
            var selectedRows = new Array();

            $('#orders-table tbody').on( 'click', 'tr', function ()
            {
                $(this).toggleClass('selected');
            } );

            $('#pdf-selected').click( function ()
            {
                let rows = table.rows('.selected').data();

                for(let i=0;i<rows.length;i++)
                {
                    $('.temp-table-data')
                        .append('<tr>'
                            + '<td>' + rows[i][1] + '</td>'
                            + '<td>' + rows[i][2]  + '</td>'
                            + '<td>' + rows[i][3]  + '</td>'
                            + '<td>' + rows[i][4]  + '</td>'
                            + '<td>' + rows[i][5]  + '</td>'
                            + '<td>' + rows[i][6]  + '</td>'
                            + '<td>' + rows[i][7]  + '</td>'
                            + '</tr>');
                }

                var doc =new jsPDF();
                // doc.text("Title", 10, 10)
                doc.autoTable({ html: '#temp-table' });
                doc.save('Selected-Waiting-Orders.pdf');
                doc.languages
                $('#temp-table tbody').empty();
            });

            $('#pdf-all').click( function ()
            {
                var doc =new jsPDF();
                doc.autoTable({ html: '#orders-table' });
                doc.save('All-Waiting-Orders.pdf');
            });

            $('#delete-selected').click( function ()
            {
                let rows = table.rows('.selected').data();
                alert(rows[0][0]);
                var selectedRows = new Array();

                for(let i=0;i<rows.length;i++)
                {
                    selectedRows[i] = rows[i][0];
                }

                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/applications/remove-selected?selectedOrders=' + selectedRows,
                    headers:
                        {
                            'Content-Type': 'application/json',
                            'Authorization': app.authorizationService.getCredentials()
                        }
                }).done(() =>
                {
                    app.router.reload('#/applications/waiting');
                }).fail((err) =>
                {
                    console.log(err);
                    alert("Error: " + err);
                })
            });
        });
    }).fail((err) => {
        console.log(err);
    });
});

app.router.on("#/applications/delivered", null, function ()
{
    loadNavbar();

    $.ajax({
        type: 'GET',
        url: constants.serviceUrl + '/applications/delivered',
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': app.authorizationService.getCredentials()
            }
    }).done((data) =>
    {
        app.templateLoader.loadTemplate('.app', 'orders-waiting', function ()
        {
            let i = 1;

            $('#header-deliver').text("");
            $('#footer-deliver').text("");

            for (let elem of data)
            {
                let uniqueElementId = elem['id'];

                $('.all-waiting-orders')
                    .append('<tr>'
                        + '<td class="order-id" style="display:none;">' + elem['id'] + '</td>'
                        + '<td class="sweatshirt-id">' + elem['jobId'] + '</td>'
                        + '<td class="company-name">' + elem['jobCompanyName'] + '</td>'
                        + '<td class="sweatshirt-name">' + elem['jobPosition'] + '</td>'
                        + '<td class="name">' + elem['name'] + '</td>'
                        + '<td class="email">' + elem['email'] + '</td>'
                        + '<td class="city">' + elem['city'] + '</td>'
                        + '<td class="number">' + elem['number'] + '</td>'
                        + '<td class="text-center">'
                        + '</td>'
                        + '</tr>');

                i++;
            }

            var table = $('#orders-table').DataTable();

            $('#orders-table tbody').on( 'click', 'tr', function ()
            {
                $(this).toggleClass('selected');
            });

            $('#pdf-selected').click( function ()
            {
                let rows = table.rows('.selected').data();

                for(let i=0;i<rows.length;i++)
                {
                    $('.temp-table-data')
                        .append('<tr>'
                            + '<td>' + rows[i][1] + '</td>'
                            + '<td>' + rows[i][2]  + '</td>'
                            + '<td>' + rows[i][3]  + '</td>'
                            + '<td>' + rows[i][4]  + '</td>'
                            + '<td>' + rows[i][5]  + '</td>'
                            + '<td>' + rows[i][6]  + '</td>'
                            + '<td>' + rows[i][7]  + '</td>'
                            + '</tr>');
                }

                var doc =new jsPDF();
                doc.autoTable({ html: '#temp-table' });
                doc.save('Selected-Delivered-Orders.pdf');
                doc.languages
                $('#temp-table tbody').empty();
            });

            $('#pdf-all').click( function ()
            {
                var doc =new jsPDF();
                doc.autoTable({ html: '#orders-table' });
                doc.save('All-Delivered-Orders.pdf');
            });

            $('#delete-selected').click( function ()
            {
                let rows = table.rows('.selected').data();
                var selectedRows = new Array();

                for(let i=0;i<rows.length;i++)
                {
                    selectedRows[i] = rows[i][0];
                }

                alert(selectedRows);

                $.ajax({
                    type: 'POST',
                    url: constants.serviceUrl + '/applications/remove-selected?selectedOrders=' + selectedRows,
                    headers:
                        {
                            'Content-Type': 'application/json',
                            'Authorization': app.authorizationService.getCredentials()
                        }
                }).done(() =>
                {
                    alert('Success');
                    app.router.reload('#/applications/delivered');
                }).fail((err) =>
                {
                    console.log(err);
                    alert("Error: " + err);
                })
            });
        });
    }).fail((err) => {
        console.log(err);
    });
});

app.router.on("#/cart", null, function ()
{
    loadNavbar();
    $.ajax(
        {
            type: 'GET',
            // url: constants.serviceUrl + '/cart?username=dimitaravramov', // TODO: Add here the logged username
            url: constants.serviceUrl + '/cart?username=' + app.authorizationService.getUsername(),
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': app.authorizationService.getCredentials()
            }
        }).done((data) => {
        app.templateLoader.loadTemplate('.app', 'cart', function ()
        {
            var sum = 0;
            for (let elem of data)
            {
                // alert(elem['jobName']);
                let sizeSelect = elem['id'];
                let fullSize = '';
                let total = 'total' + elem['id'];
                let quantity = 'quantity' + elem['id'];
                let removeSavedOrder = 'remove' + elem['id'];
                let selectedSize = elem['size'];
                let options = '';
                if(selectedSize === null)
                {
                    options = '<option value=""> Величина </option>';
                }
                else
                {
                    options = '<option value="' + elem['size'] + '">' + elem['size'] + '</option>';
                }

                // sum += $('#' + total).text;

                $('#list-orders')
                    .append('<tr>'
                        + '<td class="col-sm-8 col-md-6">'
                        + '<div class="media">'
                        + '<a class="thumbnail pull-left" href="#"> '
                        + '<img class="media-object" src=' + elem['jobImg1'] + ' style="width: 72px; height: 72px;"> </a>'
                        + '<div class="media-body ml-3">'
                        + '<h4 class="media-heading"><a href="#/jobs/product?id=' + elem['jobId'] + '">' + elem['jobPosition'] + '</a></h4>'
                        + '</div>'
                        + '</div>'
                        + '</td>'
                        + '<td>'
                        + '<h4 class="media-heading">' + elem['jobCompanyName'] + '</h4>'
                        + '</td>'
                        + '</tr>');


                $('#' + removeSavedOrder).click(function()
                {
                    $('#approve-remove').modal();

                    $('#approve-button').click(function (e)
                    {
                        $.ajax({
                            type: 'POST',
                            url: constants.serviceUrl + '/delete-saved-order?id=' + elem['id'],
                            headers: {
                                'Content-Type': 'application/json',
                                //   'Authorization': app.authorizationService.getCredentials()
                            }
                        }).done((data, request) => {
                            $('#approve-remove').modal('hide')
                            setTimeout(function(){ app.router.reload('#/cart'); }, 150);
                        }).fail((err) =>
                        {
                            alert('err' + err.responseText);
                            console.log(err);
                        });
                    });
                });

                $('#' + sizeSelect).html(options);
                sum += +$('#' + total).text();
            }

            $('#order_summary').text(sum);
        });
    }).fail((err) => {
        alert('E R R');
        console.log(err.responseText);
    });
});

app.router.on("#/users/login", null, function ()
{
    loadNavbar();
    app.templateLoader.loadTemplate('.app', 'login', function () {
        document.getElementById("registered_successfully").hidden = hiddenFlag;
        hiddenFlag = true;
        $('#login-user').click(function (e)
        {
            login();
            window.location.href = '#/';
        });
    });
});

app.router.on("#/users/register", null, function ()
{
    app.templateLoader.loadTemplate('.app', 'register', function () {
        (function() {
            'use strict';
            var forms = document.getElementsByClassName('needs-validation');
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                        form.classList.add('was-validated');
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    else {
                        event.preventDefault();
                        event.stopPropagation();

                        var formData = new FormData($('.needs-validation')[0]);

                        let firstName = $('#firstName').val();
                        let lastName = $('#lastName').val();
                        let username = $('#username').val();
                        let email = $('#email').val();
                        let birthDate = $('#datetimepicker').val();
                        let password = $('#password').val();
                        let confirmPassword = $('#confirmPassword').val();
                        var birthDateFormat = new Date(birthDate);

                        $.ajax({
                            type: 'POST',
                            url: constants.serviceUrl + '/users/register',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': app.authorizationService.getCredentials()
                            },
                            data: JSON.stringify({
                                "firstName": firstName,
                                "lastName": lastName,
                                "username": username,
                                "email": email,
                                "birthDate": birthDateFormat,
                                "password": password,
                                "confirmPassword": confirmPassword
                            })
                        }).done((data, request) => {
                            hiddenFlag = false;
                            window.location.href = '#/users/login';
                        }).fail((err) => {
                            if(err.responseText === 'Error: Username already exists. Please try with another one.') {
                                $("#username").val('');
                                document.getElementById("error_register").textContent = "Username already exists.";
                            }
                            else if(err.responseText === 'Error: Passwords do not match!') {
                                document.getElementById("error_register").textContent = "Passwords did not match.";
                            }
                            console.log(err);
                            alert(err.responseText);
                            document.getElementById("error_register").hidden = false;
                            $("#password").val('');
                            $("#confirmPassword").val('');
                        });

                        form.classList.remove('was-validated');

                    }
                }, false);
            });
        })();
    });
});

app.router.on("#/users/logout", null, function () {
    app.authorizationService.evictCredentials();
    window.location.href = '#/users/login';
});

window.location.href = '#/';