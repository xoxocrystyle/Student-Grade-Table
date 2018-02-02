$(document).ready(function (){
    add_button();
    cancel_button();
    data_server_button();

    $("#data").on('click', data_server_button);

});
var students = [];

var input = ['studentName', 'studentCourse', 'studentGrade'];

function add_button() {
    console.log("Add button clicked");
    var name = $('#studentName').val();
    var course = $('#course').val();
    var grade = $('#studentGrade').val();
    add_student(name, course, grade);
    calculate_average();
    update_average();
    cancel_form();
}

function cancel_button() {
    console.log("Cancel button clicked")
    cancel_form();
}

function data_server_button(){
    // var data_object = {
    //     api_key: '6XRvvvcgRW'
    // };
    $.ajax({
        dataType: 'json',
        method: 'get',
        url: 'users',
        success: function(response){
           console.log(response);
         for (var i = 0; i < response.data.length; i++) {
                    var student = {};
                    student.name = response.data[i].name;
                    student.course = response.data[i].course;
                    student.grade = response.data[i].grade;
                    student.idnumber = response.data[i].id;
                    add_student(student);
                    update_average(student);
                    students.push(student);
                }
        calculate_average();
        }
    });
}

function add_student(studentObject) {

    students.push(studentObject);
    add_student_data(studentObject);
 

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

function delete_button() {
    var buttonRow = $(this).parent().attr('id');
    var delete_row = $(this).parent();
    students.splice(delete_row.index(), 1); 
    delete_row.remove();
    update_average();

}