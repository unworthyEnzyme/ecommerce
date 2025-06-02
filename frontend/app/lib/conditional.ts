/**
 * Interface for the if-else chain object.
 * @template T The type of the values returned by the chain.
 */
interface IfChain<T> {
  /**
   * Specifies the value to return if the current condition is true.
   * @param valueIfTrue The value to return if the condition is true.
   * @returns The chain object for further method calls.
   */
  then(valueIfTrue: T): IfChain<T>;

  /**
   * Adds an else-if condition to the chain.
   * @param nextCondition The condition for the else-if clause.
   * @returns The chain object for further method calls.
   */
  elseif(nextCondition: boolean): IfChain<T>;

  /**
   * Specifies the default value to return if no conditions are true.
   * @param valueIfFalse The default value to return.
   * @returns The final value based on the conditions.
   */
  else(valueIfFalse: T): T;
}

/**
 * Creates an if-else chain that can be used as an expression in React components.
 * @param condition The initial condition to evaluate.
 * @returns An object with methods to build the if-else chain.
 */
export function If(condition: boolean): IfChain<any> {
  let value: any = undefined;
  let hasValue = false;
  let currentCondition = condition;

  const chain: IfChain<any> = {
    then(valueIfTrue) {
      if (currentCondition && !hasValue) {
        value = valueIfTrue;
        hasValue = true;
      }
      return chain;
    },
    elseif(nextCondition) {
      if (!hasValue) {
        currentCondition = nextCondition;
      }
      return chain;
    },
    else(valueIfFalse) {
      if (!hasValue) {
        value = valueIfFalse;
      }
      return value;
    },
  };

  return chain;
}
