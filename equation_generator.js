function equation_to_repr(x_num, x_denum, y_num, y_denum, left_denum, a_num, a_denum, b_num, b_denum, right_denum) {
    return `(${x_num}/${x_denum}x + ${y_num}/${y_denum})/${left_denum} = (${a_num}/${a_denum} + ${b_num}/${b_denum})/${right_denum}`
}

function verify_solution(solution, x_num, x_denum, y_num, y_denum, left_denum, a_num, a_denum, b_num, b_denum, right_denum) {
    return Math.abs((1. * x_num / x_denum * solution + 1. * y_num / y_denum) / left_denum - (1. * a_num / a_denum + 1. * b_num / b_denum) / right_denum) < 0.001;
}


function getReprEquationTypeA(a, b) { //  x + a = b
    left_repr = `x + ${a}`
    right_repr = b
    if (getRandomInt(2) === 0) {
        equation_repr = `${left_repr} = ${right_repr}`
    } else {
        equation_repr = `${right_repr} = ${left_repr}`
    }
    return equation_repr
}

function getReprEquationTypeB(a, b) { //  a*x = b
    left_repr = `${a}x`
    right_repr = b
    if (getRandomInt(2) === 0) {
        equation_repr = `${left_repr} = ${right_repr}`
    } else {
        equation_repr = `${right_repr} = ${left_repr}`
    }
    return equation_repr
}

function getReprEquationTypeC(a, b) { //  a*x = b
    left_repr = `x / ${a}`
    right_repr = b
    if (getRandomInt(2) === 0) {
        equation_repr = `${left_repr} = ${right_repr}`
    } else {
        equation_repr = `${right_repr} = ${left_repr}`
    }
    return equation_repr
}

function getReprEquationTypeD(a, b, c, d) { //  a*x = b
    left_repr = `${a}x + ${b}`
    right_repr = `${c}x + ${d}`
    if (getRandomInt(2) === 0) {
        equation_repr = `${left_repr} = ${right_repr}`
    } else {
        equation_repr = `${right_repr} = ${left_repr}`
    }
    return equation_repr
}

function verifyEquationTypeA(solution, a, b) {
    return solution === getSolutionEquationTypeA(a, b)
}

function verifyEquationTypeB(solution, a, b) {
    return Math.abs(solution - getSolutionEquationTypeB(a, b)) < 0.001
}

function verifyEquationTypeC(solution, a, b) {
    return Math.abs(solution - getSolutionEquationTypeC(a, b)) < 0.001
}

function verifyEquationTypeD(solution, a, b, c, d) {
    return Math.abs(solution - getSolutionEquationTypeD(a, b, c, d)) < 0.001
}

function getSolutionEquationTypeA(a, b) {
    return b - a
}

function getSolutionEquationTypeB(a, b) {
    return b / a
}

function getSolutionEquationTypeC(a, b) {
    return b * a
}

function getSolutionEquationTypeD(a, b, c, d) {
    return (d - b) / (a - c)
}

function getRandomInt(min, max) {
    let randomNumber = Math.random();
    if (max) {
        return min + Math.floor(randomNumber * (max - min))
    } else {
        max = min
        return Math.floor(randomNumber * max)
    }
}

function generateTable(size) {

    let exercices_verifications = []
    let exercice_verification_types = {
        "equationFormeA": (equation_repr) => {
            let a = getRandomInt(1, global_max)
            let b = getRandomInt(a, global_max)
            equation_repr.innerText = getReprEquationTypeA(a, b)
            exercices_verifications.push((solution) => {
                return verifyEquationTypeA(solution, a, b)
            })
        },
        "equationFormeB": (equation_repr) => {
            let a = getRandomInt(1, factor_max)
            let b = a * getRandomInt(2, factor_max)
            equation_repr.innerText = getReprEquationTypeB(a, b)
            exercices_verifications.push((solution) => {
                return verifyEquationTypeB(solution, a, b)
            })
        },
        "equationFormeC": (equation_repr) => {
            let a = getRandomInt(2, factor_max)
            let b = getRandomInt(1, factor_max)
            equation_repr.innerText = getReprEquationTypeC(a, b)
            exercices_verifications.push((solution) => {
                return verifyEquationTypeC(solution, a, b)
            })
        },
        "equationFormeD": (equation_repr) => {
            let ca = getRandomInt(1, factor_max)
            let a = getRandomInt(ca + 1, factor_max)
            let c = a - ca
            let db = ca * getRandomInt(1, factor_max)  // multiple de ca
            let d = getRandomInt(db + 1, db + global_max)
            let b = d - db
            equation_repr.innerText = getReprEquationTypeD(a, b, c, d)
            exercices_verifications.push((solution) => {
                return verifyEquationTypeD(solution, a, b, c, d)
            })
        }
    }
    let exercice_verification_selected_types = document.querySelectorAll('input[type=checkbox]:checked')

    var table = document.createElement('table')
    table.id = "equations_table"
    // table.style.width  = '100px';
    table.style.border = '1px solid black';


    var selected_nbr = exercice_verification_selected_types.length
    var th = table.createTHead()
    row = th.insertRow(0)
    var problem = row.insertCell()
    problem.innerHTML = "Question"
    var response = row.insertCell()
    response.innerHTML = "Réponse"
    var body = table.createTBody()
    if (selected_nbr > 0) {
        for (var i = 0; i < size; i++) {
            var tr = body.insertRow()
            var equation_repr = tr.insertCell()
            var solution_input = tr.insertCell()
            let input_solution = document.createElement("input", type = "number");
            input_solution.id = "input_solution_" + i
            solution_input.appendChild(
                input_solution
            )

            exercice_verification_types[exercice_verification_selected_types[i % selected_nbr].name](equation_repr)

            let oldTable = document.getElementById("equations_table");
            if (oldTable) {
                document.body.replaceChild(table, oldTable)
            } else {
                document.body.appendChild(table)
            }

            let btn_verify_old = document.getElementById("btn_verify")
            var btn_verify = document.createElement("button")
            btn_verify.innerText = "Verifie tes solutions !"
            btn_verify.id = "btn_verify"
            btn_verify.onclick = () => {
                btn_verify.innerText = "Verification ..."
                score = 0
                let exercice_nbr = exercices_verifications.length;
                for (var i = 0; i < exercice_nbr; i++) {
                    let input_solution = document.getElementById("input_solution_" + i)
                    let isValidSolution = exercices_verifications[i](
                        parseInt(input_solution.value)
                    );
                    if (isValidSolution) {
                        score += 1
                        input_solution.style.backgroundColor = '#04AA6D';
                    } else {
                        input_solution.style.backgroundColor = '#aa0404';
                    }
                    input_solution.style.color = '#FFFFFF';
                    input_solution.style.fontWeight = 'bold';
                }
                btn_verify.innerText = `Tu as obtenu la note de ${score}/${exercice_nbr} !` + (score == exercice_nbr ? " Félicitations !" : "")
            }
            if (btn_verify_old) {
                document.body.replaceChild(btn_verify, btn_verify_old)
            } else {
                document.body.appendChild(btn_verify)
            }
        }
    }
}

let global_max = 101
let multiplication_max = 101
let factor_max = 11