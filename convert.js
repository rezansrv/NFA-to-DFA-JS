class NFAtoDFAConverter {
    constructor(nfa) {
      this.nfa = nfa;
      this.alphabet = nfa.alphabet;
      this.dfaStates = [];
      this.dfaTransitions = {};
      this.dfaAcceptingStates = [];
  
      // Initialize the conversion process
      this.convert();
    }
  
    // Convert the NFA to DFA
    convert() {
      const initialState = this.epsilonClosure([this.nfa.initialState]);
      this.dfaStates.push(initialState);
  
      let unprocessedStates = [initialState];
  
      // Process states to generate DFA states and transitions
      while (unprocessedStates.length > 0) {
        const currentState = unprocessedStates.pop();
        this.dfaTransitions[currentState] = {};
  
        for (let symbol of this.alphabet) {
          const nextState = this.epsilonClosure(this.move(currentState, symbol));
          if (nextState.length > 0 && !this.dfaStates.some(state => this.areSetsEqual(state, nextState))) {
            this.dfaStates.push(nextState);
            unprocessedStates.push(nextState);
          }
          this.dfaTransitions[currentState][symbol] = nextState;
        }
  
        // Check if the state contains any accepting state of the NFA
        const isAcceptingState = currentState.some(state => this.nfa.acceptingStates.includes(state));
        if (isAcceptingState) {
          this.dfaAcceptingStates.push(currentState);
        }
      }
    }
  
    // Get the epsilon closure of a set of states
    epsilonClosure(states) {
      let closure = [...states];
      let stack = [...states];
    
      while (stack.length > 0) {
        const currentState = stack.pop();
        const currentStateTransitions = this.nfa.transitions[currentState];
        const epsilonTransitions = (currentStateTransitions && currentStateTransitions['ε']) || [];
    
        for (let nextState of epsilonTransitions) {
          if (!closure.includes(nextState)) {
            closure.push(nextState);
            stack.push(nextState);
          }
        }
      }
    
      return closure;
    }
    
  
    // Get the set of states reachable from a set of states with a given symbol
    move(states, symbol) {
      let moveResult = [];
      for (let state of states) {
        const stateTransitions = this.nfa.transitions[state];
        if (stateTransitions && stateTransitions[symbol]) {
          moveResult = moveResult.concat(stateTransitions[symbol]);
        }
      }
      return moveResult;
    }
    
  
    // Check if two sets of states are equal
    areSetsEqual(set1, set2) {
      return set1.length === set2.length && set1.every(state => set2.includes(state));
    }
  
    // Display the resulting DFA
    displayDFA() {
      console.log('DFA States:', this.dfaStates.map(state => state.join(', ')));
      console.log('DFA Transitions:', this.dfaTransitions);
      console.log('DFA Accepting States:', this.dfaAcceptingStates.map(state => state.join(', ')));
    }    
  }
  
  // Example NFA
  const nfa = {
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    transitions: {
      'q0': {'ε': ['q1']},
      'q1': {'0': ['q1'], 'ε': ['q2']},
      'q2': {'1': ['q2']}
    },
    initialState: 'q0',
    acceptingStates: ['q2']
  };
  

  // Convert NFA to DFA
  const converter = new NFAtoDFAConverter(nfa);
  
  // Display the resulting DFA
  converter.displayDFA();
  

