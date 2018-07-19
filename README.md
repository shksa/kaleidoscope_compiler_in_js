# A language implemented with help of llvm tools.
This project is a compiler which uses **llvm** tools to generate an **llvm intermediate representation(llvm-IR)** and then llvm-IR is translated to machine code also using an **llvm** tool.

- **The goal is to learn and build a small compiler which will be easy to extend with new features later on.**
- **This compiler is built in small steps over time.**

## Language
**Kaleido** is the language we are gonna make the compiler for. This language will have support for:

- defining functions
- conditionals
- math
- loops
- user defined operators
- JIT compilation

**Kaleido** also has support for calling **standard library functions** from llvm.

## Datatypes in Kaleido
64-bit floating point number is the only datatype in **kaleido**. So this language does'nt require type declarations. In JS this is just the **number** type, so we can implement numbers in kaleido by storing them in JS number types.

## Sample code in Kaleido
```
# Compute the x'th fibonacci number.
def fib(x)
  if x < 3 then
    1
  else
    fib(x-1)+fib(x-2)

# This expression will compute the 40th number.
fib(40)
```