$(document).ready(initializeApp);

function initializeApp(){
    get_data();
    click_handlers();
    $("#nameBlock, #courseBlock, #gradeBlock").hide();
}

function click_handlers(){
    $("#AnameZ").click(sort_name_course);
    $("#ZnameA").click(sort_name_course);
    $("#AcourseZ").click(sort_name_course);
    $("#ZcourseA").click(sort_name_course);
    $("#lowest").click(sort_grades);
    $("#highest").click(sort_grades);
    $("#inputData").click(check_form);
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click',dropdown);
}

var students = [];

function add_button() {
    var studentObj = {}
    studentObj.name = $('#studentName').val();
    studentObj.course = $('#studentCourse').val();
    studentObj.grade = $('#studentGrade').val();
    add_student(studentObj);
    $("tbody").empty();
    get_data();
    calculate_average();
    update_average();
}


function add_student(studentObj) {
    $.ajax({
        data: studentObj,
        dataType: 'json',
        method: 'post',
        url: 'create',
        success: function(response) {
            if (response.success) {
                students.push(studentObj);
            } 
            if(response.error){
                alert("There was an issue adding your input. Please check forms and try again.")
            }
        }
    });
}

function student_array_to_object(student){
    $("tbody").empty();
    let studentObj = {}
        for(let i = 0; i < student.length; i++){
            studentObj.name = student[i].name;
            studentObj.course = student[i].course;
            studentObj.grade = student[i].grade;
            studentObj.idnumber = student[i].id;
            add_student_data(studentObj);
        } 
        
}

function add_student_data(student) {
    const add_row = $('<tr>', {
        id: student.idnumber 
    });
    const add_name = $('<td>').text(student.name);
    const add_course = $('<td>').text(student.course);
    const add_grade = $('<td>').text(student.grade);
    const delete_student= $('<button>')
                        .addClass('btn btn-danger btn-sm delete')
                        .attr('data-toggle','modal')
                        .attr('data-target', '#deleteModal')
                        .html('delete')
                        .on('click', function(){
                            delete_confirmation(student);
                        });
    add_row.append(add_name, add_course, add_grade, delete_student);
    $('.student-list tbody').append(add_row);
    $("tr").attr("id", "item");
}

function check_form(){
    $("#studentName").keyup(function(){
        if($(this).val().length < 2){
            $(".nameInput").addClass("has-error");
		    $("#nameBlock").show();
        } else {
            $(".nameInput").removeClass("has-error");
            $(".nameInput").addClass("has-success");
            $("#nameBlock").hide();
        }
    });
    $("#studentCourse").keyup(function(){
        if($(this).val().length < 2){
            $(".courseInput").addClass("has-error");
		    $("#courseBlock").show();
        } else {
            $(".courseInput").removeClass("has-error");
            $(".courseInput").addClass("has-success");
            $("#courseBlock").hide();
        }
    });
    $("#studentGrade").keyup(function(){
        if($(this).val() === "" || $(this).val()> 100 || isNaN($(this).val())){
            $(".gradeInput").addClass("has-error");
		    $("#gradeBlock").show();
        } else {
            $(".gradeInput").removeClass("has-error");
            $(".gradeInput").addClass("has-success");
            $("#gradeBlock").hide();
        }
    });
}


function cancel_form() {
    $('#studentName').val('');
    $('#studentCourse').val('');
    $('#studentGrade').val('');
}

function get_data(event){
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
        },
        error: function(){
            alert('There was an issue retrieving your data. Please refresh the page.');
        }
    });
}

function delete_button(id) {
    var id = {id};
    $.ajax({
        data: id,
        method: 'delete',
        url: 'delete',
        success: function(){
            var delete_row = $(this).parent().closest('tr');
            students.splice(delete_row.index(), 1); 
            update_average();
        },
        error: function(){
            alert('There was an issue deleting your data. Please try again.');
        }
    });
}

function delete_confirmation(student){
    var delete_name = $('<li>').text('Name: ' + student.name);
    var delete_course = $('<li>').text('Course: ' + student.course);
    var delete_grade = $('<li>').text('Grade: ' + student.grade);
    $("#delete_student_info").append(delete_name, delete_course, delete_grade)
    $("#deleteModal").on('click', '.yes', function(e){
      delete_button(student.idnumber);
      $('#delete_student_info > li').remove();
      $('#deleteModal').modal('hide');
      $("tbody > #item").empty();
      get_data();
    });
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


function sort_name_course() {
    var sort_data = $(this).attr('id');
    switch (sort_data) {
        case "AnameZ":
            students.sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            console.log("IN AZ", students);
            debugger; 
            student_array_to_object(students);
            break;
        case "ZnameA":
        console.log("it works but it doesnt lel ")
            students.sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA > nameB) return -1;
                if (nameA < nameB) return 1;
                return 0;
            });
            console.log('IN ZA', students);
            student_array_to_object(students);
            break;
        case "AcourseZ":
            students.sort(function (a, b) {
                var courseA = a.course.toLowerCase();
                var courseB = b.course.toLowerCase();
                if (courseA < courseB) return -1;
                if (courseA > courseB) return 1;
                return 0;
            });
            console.log('ZA', students);
            student_array_to_object(students);
            break;
        case "ZcourseA":
            students.sort(function (a, b) {
                var courseA = a.course.toLowerCase();
                var courseB = b.course.toLowerCase();
                if (courseA > courseB) return -1;
                if (courseA < courseB) return 1;
                return 0;
            });
            student_array_to_object(students);
            break;
    }
}

function sort_grades() {
    var sort_data = $(this).attr('id');
    switch (sort_data) {
        case "lowest":
            students.sort(function (a, b) {
                if (parseInt(a.grade) < parseInt(b.grade)) return -1;
                if (parseInt(a.grade) > parseInt(b.grade)) return 1;
                return 0;
            });
            student_array_to_object(students);
            break;
        case "highest":
            students.sort(function (a, b) {
                if (parseInt(a.grade) > parseInt(b.grade)) return -1;
                if (parseInt(a.grade) < parseInt(b.grade)) return 1;
                return 0;
            });
            student_array_to_object(students);
            break;
    }
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







