var arrayNumbers=[];
function adicionarNumero(){
    var number = document.getElementById("newNumbers").value;
    arrayNumbers.push(parseInt(number));
    console.log(arrayNumbers);
}

function calcular(){
    alert(Math.max.apply(Math, arrayNumbers))
}