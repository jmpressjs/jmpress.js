## jmpress code style guide

The following code styles rules are being used in this project. Don't worry to follow them strictly
when submitting a pull request, we can adapt it whenever necessary.

### Spacing

* Identation with tabs.
* No whitespace at the end of line or on blank lines.
* No spacing between parens.

**Example**
```javascript
var i = 0;
if(a > 1 && b) {
    callMethod(a, b);
}
for(; i < 100; i++) {
    // Expressions
}
while(!condition) {
    iterating++;
}
try {
    // Expressions
} catch(e) {
    // Expressions
}
```

### Other

* Use multi var statements when there is an assignment instead of single var.
* No square brackets for the body of an "if" statement with a single return.
* Always use trailing comma for the properties of an Object Literal.
* Always use trailing comma for the last property of an Object Literal (We don't care about IE8)

**Example**
```javascript
var a, b, c;
var d = 1;
var e = {
    x: 1,
    y: 2,
};
if(true) return;
```