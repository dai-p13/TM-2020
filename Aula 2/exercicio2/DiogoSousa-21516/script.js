var arrayNumbers=[];
function adicionarNumero(){
    var number = document.getElementById("newNumbers").value;
    arrayNumbers.push(parseInt(number));
    console.log(arrayNumbers);
}

function calcular(){
    if(arrayNumbers.length > 5){
        var maiorNumero = Math.max.apply(Math, arrayNumbers);
        alert(maiorNumero);
    }

}