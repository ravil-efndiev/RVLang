# RVLang
##### RVLang is a little dynamically typed language with static typization functionality.
#
#
#

## installation
##### RVLang requires no istallation just follow link to github pages site since interprieter is in web 
https://ravil-efndiev.github.io/RVLang/


### Basics
To start here is a "print" function to print text.
To call it or any other function type function name and parameters in parentheases.
Every single line must end with semicolon

```
print("Hello world!");
```

###### type specifiers
- int,
- string,
- bool

##### mathematical expressions 
theese ones can be used as value of variable or function parameter.
Mathematical expressions are written in normal way using operators and parentheases

```
10 + 39 / (5 + 3 - 2 * (3-1))
```

also in any expressions we can use variables

### Variables

Rvlang supports dynamic types and static types to create varibles.
To declare a vairable use "var" keyword for dynamically-typed variable or type specifier

```
var dynamicVar = 10;
int staticVar = 10;
```

difference between this  statements is that in the first variant we can redeclare it with diffenrent type like this

```
dynamicVar = "text";
```

but we cannot do the same with second variable

### Functions

to declare a function type "func" keyword, function name and then code.
For now functions cannot return value or take parameteres

```
//declaration
func myFunc() {
    print("some text");
}

//function call
myFunc();
```

### If statements

if statement will execute block of code if condition is true.
Logical expression doesn't require any parentheases around it

```
if 10 > 5 {
    print("succes");    
}
```

### While loop

while loop works almost the same as if, but it repeats your code all the time untill its 
condition will be false

```
var i = 0;
while i < 5 {
    print(i);
    i = i + 1;
}
```

this will print 0 1 2 3 4 - as i increased

##### logical operator types
- ==
- !=
- \>
- \<
- \>=
- \<=
```
var a = 5;
var b = 10;
if b >= a {
    print(succes);
}
```

### String operations
we can use "+" operator also to concat strings 
```
string concattedString = "string1 " + "string2";
print(concattedString);
```

output:
```
string1 string2
```

if we try to do some crazy operation with + like this
```
10 + "text"
```
we will get an error


but to effectivly concat string with number we can use print function ability to 
print mere than one string at the same function call like this

```
print("str1", "str2");
```
output:
```
str1str2
```

it is not actually concatonation, but it allows us to print string with number at the same time
```
print("string", " ", 10);
```
