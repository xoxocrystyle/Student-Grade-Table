$(document).ready(initializeApp);

function initializeApp(){
    $("#data").on('click', data_server_button);
    data_server_button();
}

var students = [];

var input = ['studentName', 'studentCourse', 'studentGrade'];

function add_button() {
    console.log("Add button clicked");
    var studentObj = {}
    studentObj.name = $('#studentName').val();
    studentObj.course = $('#course').val();
    studentObj.grade = $('#studentGrade').val();
    console.log(studentObj)
    add_student(studentObj);
    calculate_average();
    update_average();
    cancel_form();
}

function cancel_button() {
    console.log("Cancel button clicked")
    cancel_form();
}

function data_server_button(){
    $.ajax({
        dataType: 'json',
        method: 'get',
        url: 'users',
        success: function(response, data){
         for (var i = 0; i < response.data.length; i++) {
                    var student = {};
                    student.name = response.data[i].name;
                    student.course = response.data[i].course;
                    student.grade = response.data[i].grade;
                    student.idnumber = response.data[i].id;
                    // add_student(student);
                    add_student_data(student);
                    update_average(student);
                    students.push(student);
                }
        calculate_average();
        }
    });
}

// function add_student(studentObject) {

//     students.push(studentObject);
//     console.log('AFTER PUSH', students)
//     add_student_data(studentObject);
 

// }

function add_student(studentObj) {
    console.log(studentObj);
    var data_object = {
        name: studentObj.name, 
        course: studentObj.course, 
        grade: parseInt(studentObj.grade)
    };
    $.ajax({
        data: data_object,
        dataType: 'json',
        method: 'post',
        url: 'create',
        success: function(response) {
            if (response.success) {
                students.push(studentObj);
            }
        }
    });
}

// function add_student(name, course, grade) {
//     var studentObj = {
//         name: name,
//         course: course,
//         grade: grade
//     };
//     students.push(studentObj);
//     add_student_data(studentObj);
//     var data_object = {
//         name: studentObj.name, course: studentObj.course, grade: studentObj.grade
//     };
//     $.ajax({
//         data: data_object,
//         dataType: 'json',
//         method: 'post',
//         url: 'https://s-apis.learningfuze.com/sgt/create',
//         success: function(response) {
//             if (response.success) {
//                 students.push(studentObj);
//             }
//         }
//     });
// }

function add_student_data(student) {
    var add_row = $('<tr>', {
        id: student.idnumber
    });
    var add_name = $('<td>').text(student.name);
    var add_course = $('<td>').text(student.course);
    var add_grade = $('<td>').text(student.grade);
    var add_all = $('<button>').addClass('btn btn-danger btn-sm').html('delete').on('click', delete_button);
    add_row.append(add_name, add_course, add_grade, add_all);
    $('.student-list tbody').append(add_row);

}


function cancel_form() {
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');

}

function calculate_average() {
    var total = 0;
    for (var i = 0; i < students.length; i++) {
        total += parseInt(students[i].grade);
    }
    return Math.round(total / students.length);
}

function update_average() {
    var average = calculate_average();
    $('.avgGrade').html(average);
    update_students();
}

function update_students() {
    for (var i = 0; i < students.length; i++) {
        students[i];
    }
}

function delete_button() {
    debugger;
    var buttonRow = $(this).parent().attr('id');
    var delete_row = $(this).parent();
    students.splice(delete_row.index(), 1); 
    delete_row.remove();
    update_average();

}


(function ($) {
    $(document).ready(function () {
        $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).parent().siblings().removeClass('open');
            $(this).parent().toggleClass('open');
        });
    });
})(jQuery);