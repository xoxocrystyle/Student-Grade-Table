$(document).ready(initializeApp);

function initializeApp(){
    data_server_button();
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click',dropdown)
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
            console.log(response)
         for (var i = 0; i < response.data.length; i++) {
                    var student = {};
                    student.name = response.data[i].name;
                    student.course = response.data[i].course;
                    student.grade = response.data[i].grade;
                    student.idnumber = response.data[i].id;
                    add_student_data(student);
                    update_average(student);
                    students.push(student);
                }
        calculate_average();
        }
    });
}

function add_student(studentObj) {
    add_student_data(studentObj);
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

function add_student_data(student) {
    var add_row = $('<tr>', {
        id: student.idnumber
    });
    var add_name = $('<td>').text(student.name);
    var add_course = $('<td>').text(student.course);
    var add_grade = $('<td>').text(student.grade);
    var delete_student= $('<button>').addClass('btn btn-danger btn-sm').attr('data-toggle','modal').attr('data-target', '#deleteModal').html('delete').on('click', function(){delete_confirmation(student)});
    add_row.append(add_name, add_course, add_grade, delete_student);
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

function delete_button(id) {
    var id = {id};
    $.ajax({
        data: id,
        method: 'delete',
        url: 'delete',
        success: function(){
            // var buttonRow = $(this).closest('tr').attr('id'); 
            var delete_row = $(this).parent().closest('tr');
            students.splice(delete_row.index(), 1); 
            delete_row.remove();
            update_average();
        }
    });
}

function delete_confirmation(student){
    console.log(student);
    var delete_name = $('<li>').text('Name: ' + student.name);
    var delete_course = $('<li>').text('Course: ' + student.course);
    var delete_grade = $('<li>').text('Grade: ' + student.grade);
    $("#delete_student_info").append(delete_name, delete_course, delete_grade)
    $("#deleteModal").on('click', '.yes', function(e){
      delete_button(student.idnumber);
      $('#delete_student_info > li').remove();
      $('#deleteModal').modal('hide');
    })
    $("#deleteModal").on('click', '.no', function(e){
        $('#delete_student_info > li').remove();
        $('#deleteModal').modal('hide');
    })
}

function dropdown(event){
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });
}



