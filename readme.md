# Secureum X Diligence bootcamp: Writing Scribble Specifications and Using Diligence Fuzzing (November 3–9, 2022)

This bootcamp is a collaboration between [Secureum](https://www.secureum.xyz) and [ConsenSys Diligence](https://consensys.net/diligence). We will teach participants how to specify custom correctness properties for their smart contracts using our [Scribble language](https://consensys.net/diligence/scribble). We will also introduce them to our [Diligence Fuzzing service](https://consensys.net/diligence/fuzzing) and show them how to use fuzzing to find property violations automatically.


## Schedule (preliminary)

### Day 1

- **intro lecture to Scribble (30-45 min)**
  1) provides an overview of Scribble and key language features
  2) introduce course website with exercises, resources, etc.
  3) introduces initial Scribble exercises


### Day 2

- **advanced Scribble lecture (30-45 min)**
  1) introduces more advanced Scribble features (e.g., if_updated, quantifiers, and assert/let)
  2) introduces additional Scribble exercises

- **office hour (60 min, get help with Scribble exercises and discuss solutions)**


### Day 3

- **intro lecture to Diligence Fuzzing (30-45 min)**
  1) provides an overview of DF and shows how to fuzz a simple contract
  2) introduces initial DF exercises

- **office hour (60 min, get help with Scribble exercises and discuss solutions)**


### Day 4

- **advanced DF lecture (e.g., differential fuzzing and other advanced topics) (30-45 min)**
  1) introduces more advanced DF features (e.g., fuzzing lessons)
  2) provides an overview of what's going on under the hood in Harvey
  3) introduces additional fuzzing exercises

- **office hour (60 min, get help with Scribble/DF exercises and discuss solutions)**


### Day 5

- **office hour (60 min, get help with Scribble/DF exercises and discuss solutions)**


**TODOs:**
- [ ] Add a more detailed schedule (incl. times, Zoom links, etc.).


## Instructors

- [Dimitar Bounov](https://github.com/cd1m0) (Dimo#9871)
- [Joran Honig](https://joranhonig.nl) (walker#3905)
- [Valentin Wüstholz](http://www.wuestholz.com) (wuestholz#3558)


## Resources/Links

**TODOs:**
- [ ] Add link to the discord channel.


### Lectures

**TODOs:**
- [ ] Add links to lecture recordings.


### Exercises

#### Scribble

##### Warmup exercise (https://github.com/ConsenSys/scribble-exercise-1)

  1) add the specification
  2) write a test case that triggers the assertion violation

**TODOs:**
- [ ] Add more exercises. Possibly from these repos:
  + https://github.com/ConsenSys/scribble-exercise-2
  + https://github.com/ConsenSys/scribble-exercise-3
  + https://github.com/ConsenSys/scribble-exercise-4
  + https://github.com/ConsenSys/scribble-exercise-5
  + https://github.com/ConsenSys/scribble-exercise-6


#### Diligence Fuzzing

##### Warmup exercise (https://github.com/ConsenSys/scribble-exercise-1)

  1) add the specification (see Scribble exercise)
  2) set up a fuzzing campaign
  3) run a fuzzing campaign and check that it finds the assertion violation

**TODOs:**
- [ ] Add more exercises.


### Scribble

- [Scribble documentation](https://docs.scribble.codes)
- [Scribble open-source tool](https://github.com/ConsenSys/Scribble)
- [Scribbling Smart Contracts for fun - and profit!](https://www.youtube.com/watch?v=gGOK8CXdrGs) (presentation at UnChained 2022)
- [Scribble workshop at Unchained 2021](https://www.youtube.com/watch?v=zWgb5OqBQxY)

**TODOs:**
- [ ] Add more talks and resources.


### Diligence Fuzzing (DF)

- [DF docs](https://fuzzing-docs.diligence.tools)
- [DF command-line tool](https://github.com/ConsenSys/diligence-fuzzing)

**TODOs:**
- [ ] Add more talks and resources.


#### Harvey Fuzzer (optional)

- [Harvey: A Greybox Fuzzer for Smart Contracts](https://mariachris.github.io/Pubs/FSE-2020-Harvey.pdf) (paper published at ESEC/FSE 2020)
- [Short summary video on Harvey](https://www.youtube.com/watch?v=Wv-uIknuhgs)
- [Conference presentation on Harvey](https://www.youtube.com/watch?v=Wv-uIknuhgs)
- [Finding Vulnerabilities in Smart Contracts](https://medium.com/consensys-diligence/finding-vulnerabilities-in-smart-contracts-175c56affe2) (blog post)
- [Fuzzing Smart Contracts Using Input Prediction](https://medium.com/consensys-diligence/fuzzing-smart-contracts-using-input-prediction-29b30ba8055c) (blog post)
- [Fuzzing Smart Contracts Using Multiple Transactions](https://medium.com/consensys-diligence/fuzzing-smart-contracts-using-multiple-transactions-51471e4b3c69) (blog post)
- [Detecting Reentrancy Issues in Smart Contracts Using Fuzzing](https://medium.com/consensys-diligence/detecting-reentrancy-issues-in-smart-contracts-using-fuzzing-e81474ba3a2e) (blog post)
- [Checking Custom Correctness Properties of Smart Contracts Using MythX](https://medium.com/consensys-diligence/checking-custom-correctness-properties-of-smart-contracts-using-mythx-25cbac5d7852) (blog post)
