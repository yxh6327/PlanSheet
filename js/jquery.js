$(function() {

	//先进行一次页面加载
	load();

	//给键盘添加点击事件
	$("#header input").on("keydown", function(event) {
        //判断是不是按下的回车键
        if(event.keyCode == 13) {
        	//如果是按下了回车键，就要拿到本地存储
        	var data = getData();
        	//然后将输入的数据追加到data中
        	var input = $(this).val();
        	data.push({title: input, done: false});

        	//将新数组保存到本地存储中
        	saveData(data);

        	//将本地存储渲染到网页中
        	load();

        	//清空输入框
        	$(this).val("");
        }	
	})

	//删除操作
	$("ul, ol").on("click", "a", function() {
		//先获取本地存储
	    var data = getData();
	    //然后删除数据
	    var index = $(this).attr("id");
	    data.splice(index, 1);
	    //然后存储数据
	    saveData(data);
	    //最后重新渲染页面
	    load();
	})

	//正在进行和已经完成的选项操作
	$("ul, ol").on("click", "input", function() {
		//先获取本地存储
		var data = getData();
		//修改本地存储
		var index = $(this).siblings("a").attr("id");
		data[index].done = $(this).prop("checked");
		//重新存储数据
		saveData(data);
		//重新渲染页面
		load();
	})

    //清空所有的数据
    $("#footer a").on('click', function(event) {
    	var data = [];
        saveData(data);
        load();
    });
	

    //双击修改
    $("ul, ol").on('click', "p", function() {
    	//拿到当前的p
		var td = $(this);
		//拿到文本
		var txt = td.text();
		//放入一个文本框
		var input = $("<input type = 'text' class = 'content-text' value='" + txt + "'/>");
		td.html(input);
		//获取焦点
		input.trigger("focus");
		//文本框失去焦点后提交内容，将新内容提交到本地缓存
		input.blur(function() {
			var newtxt = $(this).val();			
			replaceData(newtxt);
		});
		input.on("keydown", function(event) {
            if(event.keyCode == 13) {
            	var newtxt = $(this).val();			
				replaceData(newtxt);
            }
		});

		//替换新修改的文本
		function replaceData(newtxt) {
			//先获取本地存储
			var data = getData();
			//修改本地存储
			var index = td.siblings("a").attr("id");
			data[index].title = newtxt;
			//重新存储数据
			saveData(data);
			//重新渲染页面
			load();
		}
    });


	//读取本地数据
	function getData() {
		var data = localStorage.getItem("todo");
    	if(data == null) {
    		return [];
    	} else{
    		return JSON.parse(data);
    	}
	}

	//保存到本地数据
	function saveData(data) {
        localStorage.setItem("todo", JSON.stringify(data));
	}

	//渲染网页
	function load() {
		//首先拿到本地存储的数据
		var data = getData();
		//遍历之前先清空ul中的数据
		$("ul, ol").empty();
		//遍历，并创建li
		//统计正在进行的个数和已经完成的个数
		var todocount = 0;
		var downcount = 0;
		$.each(data, function(index, el) {
			if(!el.done){
				$(".todo ul").prepend("<li><input type='checkbox'><p>"+ el.title +"</p><a href='javascript:;' id = "+ index +">-</a></li>");
			    todocount++;
			} else{
				$(".down ol").prepend("<li><input type='checkbox' checked = 'checked'><p>"+ el.title +"</p><a href='javascript:;' id = "+ index +">-</a></li>");
			    downcount++;
			}	
		});

		//显示个数
		$(".todo span").text(todocount);
		$(".down span").text(downcount);
	}
})