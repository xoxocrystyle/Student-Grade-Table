$(document).ready(initializeApp);

function initializeApp(){
   getData();
    clickHandlers();
    $("#nameBlock, #courseBlock, #gradeBlock").hide();
}

function clickHandlers(){
    $(".add").click(addButton);
    $(".cancel").click(cancelForm);
    $("#AnameZ").click(sortNameCourse);
    $("#ZnameA").click(sortNameCourse);
    $("#AcourseZ").click(sortNameCourse);
    $("#ZcourseA").click(sortNameCourse);
    $("#lowest").click(sortGrades);
    $("#highest").click(sortGrades);
    $("#inputData").click(checkForm);
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click',dropdown);
}

var students = [];

function addButton() {
    var studentObj = {}
    studentObj.name = $('#studentName').val();
    studentObj.course = $('#studentCourse').val();
    studentObj.grade = $('#studentGrade').val();
    addStudent(studentObj);
    $("tbody").empty();
    getData();
    calculateAverage();
    updateAverage();
    cancelForm();
}


function addStudent(studentObj) {
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

function renderStudent(studentArr) {
    $("tbody").empty();
    for(let i = 0; i < studentArr.length; i++){
        (function() {
            let student = studentArr[i];
            const addRow = $('<tr>', {
                id: student.idnumber 
            });
            const addName = $('<td>').text(student.name);
            const addCourse = $('<td>').text(student.course);
            const addGrade = $('<td>').text(student.grade);
            const deleteStudent= $('<button>')
            .addClass('btn btn-danger btn-sm delete')
            .attr('data-toggle','modal')
            .attr('data-target', '#deleteModal')
            .html('delete')
            .on('click', (function(row){
                return function() {
                    deleteConfirmation(row)
                };
            })(student)
        );
            function deleteConfirmation(student){
                var deleteName = $('<li>').text('Name: ' + student.name);
                var deleteCourse = $('<li>').text('Course: ' + student.course);
                var deleteGrade = $('<li>').text('Grade: ' + student.grade);
                $("#deleteStudentInfo").append(deleteName, deleteCourse, deleteGrade)
                $("#deleteModal").on('click', '.yes', function(){
                deleteButton(student.idnumber);
                $('#deleteStudentInfo > li').remove();
                $('#deleteModal').modal('hide');
                $("tbody > #item").empty();
               getData();
                });
                $("#deleteModal").on('click', '.no', function(e){
                    $('#deleteStudentInfo > li').remove();
                    $('#deleteModal').modal('hide');
                })
        
            }
            addRow.append(addName, addCourse, addGrade, deleteStudent);
            $('.student-list tbody').append(addRow);
            $("tr").attr("id", "item");
        })();
    calculateAverage(studentArr);
    }
}



function checkForm(){
    $(".add").prop('disabled', true);
    $("#studentName").keyup(function(){
        if($(this).val().length < 2){
            $(".nameInput").addClass("has-error");
            $("#nameBlock").show();
            $(".add").prop('disabled', true);
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
            $(".add").prop('disabled', true);
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
            $(".add").prop('disabled', true);
        } else {
            $(".gradeInput").removeClass("has-error");
            $(".gradeInput").addClass("has-success");
            $("#gradeBlock").hide();
            $(".add").prop('disabled', false);
        }
    });
}


function cancelForm() {
    $('#studentName').val('');
    $('#studentCourse').val('');
    $('#studentGrade').val('');

    let value = $("#studentCourse").val().length;
    if (value === 0) {
        $(".add").prop('disabled', true);
    } else {
        $(".add").prop('disabled', true);
    }
}

function getData(event){
    console.log("im getting called!!")
    $.ajax({
        dataType: 'json',
        method: 'get',
        url: 'users',
        success: function(response, data){
            console.log(response)
            students.length = 0;
         for (var i = 0; i < response.data.length; i++) {
                    var student = {};
                    student.name = response.data[i].name;
                    student.course = response.data[i].course;
                    student.grade = response.data[i].grade;
                    student.idnumber = response.data[i].id;
                    updateAverage(student);
                    students.push(student);
                    renderStudent(students);
                    console.log('get data', students.length)
                }
        calculateAverage();
        },
        error: function(){
            alert('There was an issue retrieving your data. Please refresh the page.');
        }
    });
}

function deleteButton(id) {
    var id = {id};
    $.ajax({
        data: id,
        method: 'delete',
        url: 'delete',
        success: function(){
            var deleteRow = $(this).parent().closest('tr');
            students.splice(deleteRow.index(), 1); 
            updateAverage();
        },
        error: function(){
            alert('There was an issue deleting your data. Please try again.');
        }
    });
}

function dropdown(event){
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });
}


function sortNameCourse() {
    var sortData = $(this).attr('id');
    switch (sortData) {
        case "AnameZ":
            students.sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            console.log("IN AZ", students);
            renderStudent(students);
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
            renderStudent(students);
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
            renderStudent(students);
            break;
        case "ZcourseA":
            students.sort(function (a, b) {
                var courseA = a.course.toLowerCase();
                var courseB = b.course.toLowerCase();
                if (courseA > courseB) return -1;
                if (courseA < courseB) return 1;
                return 0;
            });
            renderStudent(students);
            break;
    }
}

function sortGrades() {
    var sortData = $(this).attr('id');
    switch (sortData) {
        case "lowest":
            students.sort(function (a, b) {
                if (parseInt(a.grade) < parseInt(b.grade)) return -1;
                if (parseInt(a.grade) > parseInt(b.grade)) return 1;
                return 0;
            });
            renderStudent(students);
            break;
        case "highest":
            students.sort(function (a, b) {
                if (parseInt(a.grade) > parseInt(b.grade)) return -1;
                if (parseInt(a.grade) < parseInt(b.grade)) return 1;
                return 0;
            });
            renderStudent(students);
            break;
    }
}

function calculateAverage() {
    var total = 0;
    for (var i = 0; i < students.length; i++) {
        total += parseInt(students[i].grade);
    }
    return Math.round(total / students.length);
}

function updateAverage() {
    var average = calculateAverage();
    $('.avgGrade').html(average);
    upgradeStudents();
}

function upgradeStudents() {
    for (var i = 0; i < students.length; i++) {
        students[i];
    }
}
