# Fuzzing Exercise

In this exercise, we'll start working with the diligence fuzzing platform,
you'll set up some fuzzing campaigns and start finding vulnerabilities.t the code can be
instrumented, and the tests run without failures.

## Setup

To complete this exercise, you will need `git`, `node` (version 16.0 or later) and `npm` and `scribble`.
You can install scribble globally by running the following:

```
npm install -g eth-scribble
```

You will also need the answers for yesterday's exercises and the diligence-fuzzing cli.

```
pip3 install diligence-fuzzing
```

## Warmup: Fuzz the vulnerable token contract

We showed you how to start a simple fuzzing campaign during the lecture.

Re-trace through the lecture steps and run the same campaign, then fix the vulnerability and re-run it!

## Fuzz a contract from yesterday's exercise 1

Yesterday you wrote various properties for the TimedSafe contract and checked them with a test suite.

Today, write a fuzzing configuration and seed deployment script and run a fuzzing campaign to check if the properties hold up.

## Fuzz a set of contracts (at least 2)

Fuzzing a single contract is quite straightforward; things get a bit more complex once you add more.

For this exercise, take a set of contracts that integrate with each other and fuzz them together.

The Crowdsale and Escrow smart contracts from OZ might be interesting for you. 
Alternatively, you could try and fuzz a Uniswap v2 pair!

> Try to have one of the contracts be your annotated contracts from yesterday's exercise 2