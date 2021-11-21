/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Gali Mary Sanjana,
 # Adithi Narayan, Aishwarya B, Adithi Giridharan
 # This file is part of Flowgramming <https://github.com/flowgrammers-org/flowgramming>.
 #
 # Flowgramming is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # Flowgramming is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with Flowgramming.  If not, see <http://www.gnu.org/licenses/>.
 # *************************************************************************************
 */

let p =
    'startFn\n' +
    'int fib(int n)\n' +
    '\tint ans\n' +
    '\tif (n==0)\n' +
    '\t\tans = 0\n' +
    '\n' +
    '\telse\n' +
    '\t\tif ((n==1)||(n==2))\n' +
    '\t\t\tans = 1\n' +
    '\n' +
    '\t\telse\n' +
    '\t\t\tint x,y\n' +
    '\t\t\tx = call fib (n-1)\n' +
    '\t\t\ty = call fib (n-2)\n' +
    '\t\t\tans = x+y\n' +
    '\t\tendIf\n' +
    '\tendIf\n' +
    '\treturn ans\n' +
    'endFn\n' +
    'startFn\n' +
    'void main()\n' +
    '\tint ip,op\n' +
    '\tinput (ip)\n' +
    '\top = call fib (ip)\n' +
    '\tprint (op)\n' +
    'endFn'

function addBrackets(s) {
    if (s[0] === 'startFn') {
        return [s.slice(1, s.indexOf('endFn'))].concat(
            addBrackets(s.slice(s.indexOf('endFn') + 1))
        )
    }
    return []
}

function convertToFgmin(ps = p) {
    ps = ps.replaceAll('\t', '')
    let psList = addBrackets(ps.split('\n'))
    psList.map((fn) => {
        console.log(fn)
        if (fn[0] === 'void main()') {
        }
    })
}
