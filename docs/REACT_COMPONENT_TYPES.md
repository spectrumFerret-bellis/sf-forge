Great question! The component types I mentioned are **conceptual patterns** rather than formally defined React types, but they do have references in the React ecosystem and community. Let me clarify:

## **Formal React Documentation References:**

### 1. **Smart vs. Presentational Components**
- **React Official Docs**: While not explicitly named "smart components," this pattern is referenced in the [React docs about component composition](https://react.dev/learn/passing-props-to-a-component)
- **Dan Abramov's Blog**: The creator of Redux wrote about this pattern in his [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) article

### 2. **Container Components**
- **React Patterns**: Referenced in the [React Patterns documentation](https://reactpatterns.com/#container-component)
- **Kent C. Dodds**: Modern React educator who discusses this in his [blog about separation of concerns](https://kentcdodds.com/blog/separation-of-concerns)

## **Community-Defined Patterns:**

### 3. **Connected Components**
- **Redux Documentation**: While Redux-specific, the concept of "connected components" is well documented
- **Zustand Community**: Similar patterns are discussed in Zustand's documentation and examples

### 4. **Feature Components**
- **Feature-Sliced Design**: A methodology that defines this pattern, documented at [feature-sliced.design](https://feature-sliced.design/)
- **Domain-Driven Design**: Borrows concepts from DDD methodology

## **What This Means:**

The component types I listed are **architectural patterns** that have emerged from the React community rather than being formally defined in React's type system. They're:

- **Best practices** that experienced React developers follow
- **Patterns** that solve common architectural problems
- **Conventions** that make code more maintainable
- **Approaches** that balance different concerns (performance, maintainability, testability)

## **In Your Codebase:**

You're following these patterns naturally:
- **Smart components**: Your Channels components manage their own data and state
- **Feature components**: Each component handles a complete feature area
- **Connected components**: They connect to your Zustand store and TanStack Query

## **Bottom Line:**

While these aren't "official React types," they're **well-established patterns** in the React ecosystem that have been proven to work well in production applications. Your components are following these patterns correctly, which is why they're maintainable and performant.

The fact that you're asking about these patterns shows you're thinking about architecture, which is exactly the right mindset for building scalable React applications!