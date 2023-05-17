const vm = {}
vm.builtins = {}
vm.defines = {}

const ns = () => {}
const def = (name, value) => vm.defines[name] = value
const plus = (lhs, rhs) => lhs + rhs
const print = str => console.log(str)
const str = str => str

const fn = (args, statements) => {
    // return () => vm.execute(statements)
    return statements
}

const defn = (name, args, ...statements) => {
    console.log(`defn ${name}(${fmt(args)}) =>\n\t${statements.map(fmt).join('\n\t')}`)
    def(name, fn(args, statements))
}

function getType(val) {
    if (typeof val === 'object') {
        if (val instanceof Array) return 'array'
        if (val instanceof RegExp) return 'regexp'
        if (val === null) return 'null'
        return 'object'
    }
    if (typeof val === 'function') return 'fn'
    return typeof val
}

function matchType(val, matchers) {
    const t = getType(val)
    if (matchers.hasOwnProperty(t)) {
        return matchers[t](val)
    } else if (matchers.hasOwnProperty('default')) {
        return matchers.default(val)
    }
}

function fmt(stmt) {
    return matchType(stmt, {
        array: () => stmt.reduce((str, e, i) => `${str}${i>0?', ':''}${fmt(e)}`, '[') + ']',
        fn: () => stmt.name,
        string: () => `'${stmt}'`,
        default: () => stmt
    })
}

vm.execute = (prog) => {
    console.log('execute', getType(prog))
    const head = prog[0]
    console.log('head', getType(head))

    if (typeof head === 'function') {
        console.log(`Running native function ${head.name}`)
        return head.apply(null, prog.slice(1))
    }

    else if (head instanceof Array) {
        console.log('body')
        const results = prog.map(vm.execute)
        const last = results[results.length - 1]
        console.log('last', last)
        return last
    }

    else if (typeof head === 'string' && vm.defines.hasOwnProperty(head)) {
        console.log(`Running vm defined function '${head}'`)
        console.log(vm.defines[head])
        return vm.execute(vm.defines[head])
    }

    else if (typeof head === 'string') {
        console.log('function not found', vm.defines)
        return null
    }

    else {
        return null
    }
}

const test_prog = [

// Hello World
[defn, 'hello', [],
    [print, 'Hello World']
],

[defn, 'inc', ['val'],
    [plus, 1, 'val']
],

[defn, 'three', [],
    [plus, 1, 2]
],

['hello'],
// ['inc', 0]
// [plus, 1, 2]
['three']
]

console.log(vm.execute(test_prog))
