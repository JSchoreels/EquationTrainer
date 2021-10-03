function equation_to_repr(x_num, x_denum, y_num, y_denum, left_denum, a_num, a_denum, b_num, b_denum, right_denum){
    return `(${x_num}/${x_denum}x + ${y_num}/${y_denum})/${left_denum} = (${a_num}/${a_denum} + ${b_num}/${b_denum})/${right_denum}`
}

function verify_solution(solution, x_num, x_denum, y_num, y_denum, left_denum, a_num, a_denum, b_num, b_denum, right_denum) {
    return Math.abs((1. * x_num / x_denum * solution + 1. * y_num / y_denum) / left_denum - (1. * a_num / a_denum + 1. * b_num / b_denum) / right_denum) < 0.001;
}


function equation_forme_a_repr(a, b) { //  x + a = b
    left_repr = `x + ${a}`
    right_repr = b
    if (getRandomInt(2) == 0) {
        equation_repr = `${left_repr} = ${right_repr}`
    } else {
        equation_repr = `${right_repr} = ${left_repr}`
    }
    return equation_repr
}

function equation_forme_a_verify(solution, a, b) {
    return solution == equation_forme_a_solution(a, b)
}

function equation_forme_a_solution(a, b){
    return b - a
}

function getRandomInt(min, max) {
    if (max){
        return min + Math.floor(Math.random() * (max - min) )
    } else {
        max = min
        return Math.floor(Math.random() * max)
    }
}

function generateTable(size) {

    let forme_a_exercices_verifications = [
    ]

    var table = document.createElement('table')
    table.id = "equations_table"
    // table.style.width  = '100px';
    table.style.border = '1px solid black';

    for (var i = 0; i < size; i++){
        let a = getRandomInt(global_max)
        let b = getRandomInt(a, global_max)
        var tr = table.insertRow()
        var equation_repr = tr.insertCell()
        equation_repr.innerText = equation_forme_a_repr(a, b)
        var solution_input = tr.insertCell()
        let input_solution = document.createElement("input", type="number");
        input_solution.id = "input_solution_" + i
        solution_input.appendChild(
            input_solution
        )
        forme_a_exercices_verifications.push((solution) => {
            return equation_forme_a_verify(solution, a, b)
        })
    }

    let oldTable = document.getElementById("equations_table");
    if (oldTable){
        document.body.replaceChild(table, oldTable)
    } else {
        document.body.appendChild(table)
    }
    if (!document.getElementById("btn_verify")) {
        var btn_verify = document.createElement("button")
        btn_verify.innerText = "Verifie tes solutions !"
        btn_verify.id = "btn_verify"
        btn_verify.onclick = (size) => {
            btn_verify.innerText = "Verification ..."
            score = 0
            let exercice_nbr = forme_a_exercices_verifications.length;
            for (var i = 0; i < exercice_nbr; i++) {
                score += forme_a_exercices_verifications[i](
                    parseInt(document.getElementById("input_solution_" + i).value)
                ) ? 1 : 0
            }
            btn_verify.innerText = `Tu as obtenu la note de ${score}/${exercice_nbr}`
        }
        document.body.appendChild(btn_verify)
    }
}
let global_max = 30