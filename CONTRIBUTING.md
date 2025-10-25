# Contributing to s402-sei

Thank you for your interest in contributing to s402! This project is a fork of the x402 protocol optimized for the Sei Network.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct.

## How to Contribute

### Reporting Issues

- Check if the issue already exists
- Provide clear description and steps to reproduce
- Include relevant logs and error messages
- Specify your environment (Node version, OS, etc.)

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YourUsername/s402-sei.git
cd s402-sei

# Install dependencies
cd typescript
pnpm install
pnpm build

# Run tests
pnpm test
```

### Coding Standards

- Use TypeScript for new code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Testing

```bash
# Run all tests
pnpm test

# Run specific package tests
cd packages/s402
pnpm test

# Run with coverage
pnpm test:coverage
```

### Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update SETUP.md for deployment changes
- Include examples for new features

## Areas for Contribution

### Priority Areas

1. **Performance Optimizations**: Leverage Sei's parallel processing
2. **Gas Optimizations**: Reduce transaction costs
3. **Client Libraries**: Add support for more languages
4. **Documentation**: Improve guides and examples
5. **Testing**: Increase test coverage

### Feature Ideas

- Batch payment processing
- Subscription model support
- Multi-token support beyond USDC
- Analytics dashboard
- Payment streaming

## Release Process

1. Update version numbers in package.json files
2. Update CHANGELOG.md
3. Create git tag
4. Push to main branch
5. GitHub Actions will handle npm publishing

## Questions?

Feel free to open an issue for any questions about contributing.

## License

By contributing to s402-sei, you agree that your contributions will be licensed under the MIT License.


