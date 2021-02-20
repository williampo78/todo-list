let add= document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click",e =>{
    //防止表單送出
    e.preventDefault();

    //得到input的值
    // console.log(e.target.parentElement);
    let form=e.target.parentElement;

    // console.log(form.children);
    let todoText= form.children[0].value;
    let todoMonth= form.children[1].value;
    let todoDate= form.children[2].value;

    if(todoText===""){
        alert("請輸入文字");
        return;
    }
    if(todoMonth===""){
        alert("請輸入月份");
        return;
    }
    if(todoDate===""){
        alert("請輸入日期");
        return;
    }
  
    
    //create a todo item
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText=todoText;
    let time =document.createElement("p");
    time.classList.add("todo-time");
    time.innerText=todoMonth+" / "+ todoDate;
    todo.appendChild(text);
    todo.appendChild(time);     

    //create check and trash can icon
    let completeButton= document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML='<i class="fas fa-check"></i>';
    completeButton.addEventListener("click",e =>{
        let todoItem=e.target.parentElement;
        todoItem.classList.toggle("done");
    })

    let trashButton= document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML='<i class="fas fa-trash"></i>';

    trashButton.addEventListener("click",e =>{
        // e.target.parentElement 是 div.todo
        let todoItem=e.target.parentElement;

        //設定一個縮回去的動畫
        todoItem.style.animation="scaleDown 0.5s forwards";
        
        //在動畫結束後 div.todo會被刪除
        todoItem.addEventListener("animationend", ()=>{

            
    //從 local storage移除
    let text=todoItem.children[0].innerText;
    let myListArray=JSON.parse(localStorage.getItem("list"));
    myListArray.forEach((item,index) => {
        if(item.todoText==text){
            myListArray.splice(index,1);
            localStorage.setItem("list",JSON.stringify(myListArray));
        }
    })
            todoItem.remove();
        })

      
        
    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    //設定todo出來的動畫
    todo.style.animation="scaleUp 0.3s forwards";

    //把輸入的資料建立成object
    let myTodo={
        todoText:todoText,
        todoMonth:todoMonth,
        todoDate:todoDate
    };

    //把資料以array儲存 store data into array of objects
    let myList=localStorage.getItem("list");
    if (myList==null) {
        localStorage.setItem("list",JSON.stringify([myTodo]));
        //如果裡面沒有東西就直接把myTodo儲存起來
    }
    else{
        let myListArray=JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list",JSON.stringify(myListArray));
        //如果裡面有東西就先轉出來變成array，然後把myTodo push進去，最後再儲存起來
    }
    // console.log(JSON.parse(localStorage.getItem("list")))

    form.children[0].value="";
    form.children[1].value="";  
    form.children[2].value="";
    section.appendChild(todo);
})


//讀取 local storage到網頁上
loadData();
function loadData(){
    let myList=localStorage.getItem("list");
if (myList!== null){
    let myListArray= JSON.parse(myList);
    myListArray.forEach(item => {
        let todo=document.createElement("div");
        todo.classList.add("todo");
        let text =document.createElement("p");
        text.classList.add("todo-text");
        text.innerHTML= item.todoText;
        let time= document.createElement("p");
        time.classList.add("todo-time");
        time.innerHTML=item.todoMonth+" / "+ item.todoDate;
        todo.appendChild(text);
        todo.appendChild(time)


        //complete button and trash button
        let completeButton= document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML='<i class="fas fa-check"></i>';
        completeButton.addEventListener("click",e =>{
            let todoItem=e.target.parentElement;
            todoItem.classList.toggle("done");
        })
    
        let trashButton= document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML='<i class="fas fa-trash"></i>';
    
        trashButton.addEventListener("click",e =>{
            // e.target.parentElement 是 div.todo
            let todoItem=e.target.parentElement;
    
            //設定一個縮回去的動畫
            todoItem.style.animation="scaleDown 0.5s forwards";
            
            //在動畫結束後 div.todo會被刪除
            todoItem.addEventListener("animationend", ()=>{

                
                
                //從 local storage移除
                let text=todoItem.children[0].innerText;
                let myListArray=JSON.parse(localStorage.getItem("list"));
                myListArray.forEach((item,index) => {
                    if(item.todoText==text){
                        myListArray.splice(index,1);
                        localStorage.setItem("list",JSON.stringify(myListArray));
                    }
                }); 


                todoItem.remove(); //從HTML中移除 但還在local storage
            }) 
        })
        todo.appendChild(completeButton);
        todo.appendChild(trashButton);

        section.appendChild(todo) ;
    })
}
}

function mergeTime(arr1,arr2){
    let result=[];
    let i=0;
    let j=0;

    while(i<arr1.length && j<arr2.length){
        if (Number(arr1[i].todoMonth)>Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        }else if(Number(arr1[i].todoMonth)<Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
        }else if(Number(arr1[i].todoDate)>Number(arr2[j].todoDate)){
            result.push(arr2[j]);
            j++;
        }else {
            result.push(arr1[i]);
            i++;
        }
    }
    while(i<arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while(j<arr2.length){
        result.push(arr2[j]);
        j++;
    }
    return result;
}

function mergeSort(arr){
    if (arr.length===1){
        return arr;
    }
    else {
        let middle=Math.floor(arr.length/2);
        let left=arr.slice(0,middle);
        let right=arr.slice(middle,arr.length)
        return mergeTime(mergeSort(left),mergeSort(right));
    }
}
// console.log(mergeSort(JSON.parse(localStorage.getItem("list"))))

let sortButton=document.querySelector("div.sort button")
sortButton.addEventListener("click",() =>{
// sort data
let sortedArray=mergeSort(JSON.parse(localStorage.getItem("list")))
localStorage.setItem("list",JSON.stringify(sortedArray));

//重新排列
//先刪除
let len = section.children.length;
for (let i=0; i<len; i++){
    section.children[0].remove();
}

//再載入
loadData();
})